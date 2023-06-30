import type { Event } from 'nostr-tools';
import type { User } from './index.js';

function binarySearchInsert(
	arr: Event[],
	value: Event,
	compareFn: (a: Event, b: Event) => number
): void {
	let left = 0;
	let right = arr.length - 1;

	while (left <= right) {
		const mid = Math.floor((left + right) / 2);
		const compare = compareFn(value, arr[mid]);

		if (compare === 0) {
			left = mid;
			break;
		}

		if (compare < 0) {
			right = mid - 1;
		} else {
			left = mid + 1;
		}
	}

	arr.splice(left, 0, value);
}

// Parse the content to extract username, picture, and pubkey
function parseContent(event: Event): User {
	// Assuming content is a JSON string with fields: username, picture, pubkey
	// Adapt this part if the structure is different
	const parsed = JSON.parse(event.content);

	console.log(parsed);

	// Extract the required fields
	const name: string = parsed.name;
	const picture: string = parsed.picture;

	// Return as a JSON object
	return {
		name,
		picture,
		pubkey: event.pubkey
	};
}

export { binarySearchInsert, parseContent };
