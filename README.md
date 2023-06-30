# Nostr Svelte

This is a Svelte library that leverages Nostr Tools to manage Nostr events via reactive Svelte stores. It provides several functions for interacting with events, namely `eventStore`, `user`, and `login`.

## Usage

```javascript
import { eventStore, user, login } from 'nostr-svelte';

// eventStore usage
let store = eventStore(['wss://relay.example.com']);
store.subscribe((events) => {
	console.log(events); // Logs all received events
});

// user usage
let userStore = user('user_pubkey');
userStore.subscribe((user) => {
	console.log(user); // Logs user information when an event is received
});

// login usage
login(event, ['wss://relay.example.com'])
	.then((user) => console.log(user)) // Logs user information if the event signature is valid
	.catch((error) => console.error(error)); // Logs an error if the event signature is invalid or if it times out
```

## API

### `eventStore(relays: string[], filter?: object): SvelteStore`

The `eventStore` function creates a Svelte store of Nostr events. The store will update every time a new event is received from the specified relays that matches the given filter.

- `relays`: An array of URLs of the relays to subscribe to.
- `filter`: An optional filter object to apply to the events.

Returns a [Svelte writable store](https://svelte.dev/tutorial/writable-stores) that contains an array of the received events. The array is reactive, meaning any changes in the array will trigger an update in the Svelte store.

### `user(pubkey: string, relays?: string[]): SvelteStore`

The `user` function creates a Svelte store that contains information about a specific user. The store will update every time a new event from the user is received.

- `pubkey`: The public key of the user.
- `relays`: An optional array of URLs of the relays to subscribe to. If not specified, it defaults to `['wss://relay.snort.social']`.

Returns a [Svelte writable store](https://svelte.dev/tutorial/writable-stores) that contains the user's information. This is a reactive store, which updates with every new event from the user.

### `login(event: Event, relays: string[]): Promise<User>`

The `login` function verifies the signature of an event and resolves a promise with the user's public key if the signature is valid.

- `event`: The event to verify.
- `relays`: An array of URLs of the relays to subscribe to.

Returns a promise that resolves with an object `{ pubkey: string }` if the event signature is valid, and rejects with an error message if the signature is invalid or if it doesn't receive an event within 2 seconds.

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

```
You can directly copy the above text into your `readme.md` file. Please note that when you paste this into your readme, you need to remove one set of backticks from the "Usage" section's JavaScript code block, as they're currently doubled up to render correctly in this response.
```
