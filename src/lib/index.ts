import { readable, writable } from 'svelte/store';
import { SimplePool } from 'nostr-tools';
import { verifySignature, type Event } from 'nostr-tools';
import { binarySearchInsert, parseContent } from './utils.js';

interface User {
	pubkey?: string;
	picture?: string;
	name?: string;
}

const pool = new SimplePool();

function eventStore(relays: string[], filter = {}) {
	const events = writable<Event[]>([]);

	let sub = pool.sub([...relays], [filter]);

	sub.on('event', (event) => {
		// this will only be called once the first time the event is received
		// ...
		events.update((currentEvents) => [...currentEvents, event]);
		console.log(event);
	});

	return { ...events };
}

function nostrSession(event: Event, relays: string[]) {
	const NostrProfile = writable<User>({});

	//include some kind of challenge to verify the user

	const valid = verifySignature(event);

	if (valid) {
		console.log('valid');

		let sub = pool.sub(relays, [{ authors: [event.pubkey], kinds: [1] }]);

		sub.on('event', (event) => {
			console.log('event');
			// this will only be called once the first time the event is received
			const parsed = parseContent(event);
			NostrProfile.set(parsed);
		});
	}

	return { ...NostrProfile };
}

function messageStore(pubkey: string, relays = ['wss://relay.snort.social']) {
	const messages = writable<Event[]>([]);

	const fromFilter = { authors: [pubkey], kinds: [4], limit: 10 };
	const toFilter = { kinds: [4], '#p': [pubkey], limit: 10 };

	let sub = pool.sub([...relays], [fromFilter, toFilter]);

	sub.on('event', (event) => {
		// this will only be called once the first time the event is received
		// ...
		messages.update((currentMessages: Event[]) => {
			// Insert the new event in the correct position to keep the array sorted
			binarySearchInsert(currentMessages, event, (a, b) => a.created_at - b.created_at);

			// Return the updated messages
			return currentMessages;
		});
	});

	return { ...messages };
}

function nostrProfile(pubkey: string, relays: string[]) {
	const NostrProfile = writable<User>({ pubkey });

	let sub = pool.sub([...relays], [{ authors: [pubkey], kinds: [0] }]);

	sub.on('event', (event) => {
		// this will only be called once the first time the event is received
		const parsed = parseContent(event);
		NostrProfile.set(parsed);
	});

	return { ...NostrProfile };
}

export { eventStore, nostrSession, messageStore, nostrProfile, type User };
