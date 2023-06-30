import { readable, writable } from 'svelte/store';
import { verifySignature, type Event } from 'nostr-tools';
import { binarySearchInsert, parseContent } from './utils.js';
import { RelayPool } from 'nostr-relaypool';

interface User {
	pubkey?: string;
	picture?: string;
	name?: string;
}

let relays = ['wss://relay.damus.io', 'wss://nostr.fmt.wiz.biz', 'wss://nostr.bongbong.com'];

let relayPool = new RelayPool(relays);

function eventStore(relays: string[], filter = {}) {
	const nostrEvents = writable<Event[]>([]);

	let unsub = relayPool.subscribe(
		[filter],
		relays,
		(event: Event, isAfterEose: boolean, relayURL: string) => {
			nostrEvents.update((currentEvents: Event[]) => {
				// Insert the new event in the correct position to keep the array sorted
				binarySearchInsert(currentEvents, event, (a, b) => a.created_at - b.created_at);

				// Return the updated messages
				return currentEvents;
			});
		},
		undefined,
		(events: Event[], relayURL: string) => {}
	);

	return { ...nostrEvents };
}

function nostrSession(event: Event, relays: string[]) {
	const NostrProfile = writable<User>({});

	//include some kind of challenge to verify the user

	const valid = verifySignature(event);

	if (valid) {
		let unsub = relayPool.subscribe(
			[{ authors: [event.pubkey], kinds: [0] }],
			relays,
			(event: Event, isAfterEose: boolean, relayURL: string) => {
				NostrProfile.set(parseContent(event));
			},
			undefined,
			(events: Event[], relayURL: string) => {}
		);
	}

	return { ...NostrProfile };
}

function messageStore(pubkey: string, relays = ['wss://relay.snort.social']) {
	const nostrMessages = writable<Event[]>([]);

	const fromFilter = { authors: [pubkey], kinds: [4], limit: 10 };
	const toFilter = { kinds: [4], '#p': [pubkey], limit: 10 };

	let unsub = relayPool.subscribe(
		[fromFilter, toFilter],
		relays,
		(event: Event, isAfterEose: boolean, relayURL: string) => {
			nostrMessages.update((currentMessages: Event[]) => {
				// Insert the new event in the correct position to keep the array sorted
				binarySearchInsert(currentMessages, event, (a, b) => a.created_at - b.created_at);

				// Return the updated messages
				return currentMessages;
			});
		},
		undefined,
		(events: Event[], relayURL: string) => {}
	);

	return { ...nostrMessages };
}

function nostrProfile(pubkey: string, relays: string[]) {
	const NostrProfile = writable<User>({ pubkey });

	let unsub = relayPool.subscribe(
		[{ authors: [pubkey], kinds: [0] }],
		relays,
		(event: Event, isAfterEose: boolean, relayURL: string) => {
			NostrProfile.set(parseContent(event));
		},
		undefined,
		(events: Event[], relayURL: string) => {}
	);

	return { ...NostrProfile };
}

export { eventStore, nostrSession, messageStore, nostrProfile, type User };
