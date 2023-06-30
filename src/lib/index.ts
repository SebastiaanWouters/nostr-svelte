import { readable, writable } from 'svelte/store';
import { SimplePool } from 'nostr-tools';
import { verifySignature, type Event } from 'nostr-tools';

interface User {
	pubkey?: string;
}

function eventStore(relays: string[], filter = {}) {
	const events = writable<Event[]>([]);

	const pool = new SimplePool();

	let sub = pool.sub([...relays], [filter]);

	sub.on('event', (event) => {
		// this will only be called once the first time the event is received
		// ...
		events.update((currentEvents) => [...currentEvents, event]);
		console.log(event);
	});

	return { ...events };
}

function user(pubkey: string, relays = ['wss://relay.snort.social']) {
	const user = writable<User>({});

	const pool = new SimplePool();

	let sub = pool.sub([...relays], [{ authors: [pubkey], limit: 10 }]);

	sub.on('event', (event) => {
		// this will only be called once the first time the event is received
		// ...
		console.log('user');
		user.set({ pubkey: event.pubkey });
	});

	return { ...user };
}

function login(event: Event, relays: string[]): Promise<User> {
	return new Promise((resolve, reject) => {
		const valid = verifySignature(event);

		if (valid) {
			const pool = new SimplePool();

			let sub = pool.sub([...relays], [{ authors: [event.pubkey], kinds: [0] }]);

			sub.on('event', (event) => {
				console.log('login');
				// this will only be called once the first time the event is received
				resolve({ pubkey: event.pubkey }); // Resolve the promise with the received event
			});

			// Set a timeout to reject the promise after 2 seconds
			setTimeout(() => {
				reject('Timeout');
			}, 2000);
		} else {
			reject('Invalid signature'); // Reject the promise if the signature is invalid
		}
	});
}
export { eventStore, user, login };
