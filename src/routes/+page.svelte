<script async>
	import { eventStore, user, login } from '$lib';
	import { onDestroy } from 'svelte';

	const publicKey = '82341f882b6eabcd2ba7f1ef90aad961cf074af15b9ef44a09f9d2a8fbfbe6a2';
	const customFilter = { authors: [publicKey], limit: 2 };

	const relays = ['wss://relay.snort.social', 'wss://relay.damus.io'];

	const events = eventStore(relays, customFilter);
	const NostrUser = user(publicKey, relays);

	const loggedIn = login(
		{
			id: '8e16c7df36a9e9e648d4b245bd69967a2c5e32debd474b7ccd546be0cd67afb9',
			pubkey: '82341f882b6eabcd2ba7f1ef90aad961cf074af15b9ef44a09f9d2a8fbfbe6a2',
			created_at: 1687595733,
			kind: 0,
			tags: [],
			content:
				'{"banner":"https://upload.wikimedia.org/wikipedia/commons/b/b4/The_Sun_by_the_Atmospheric_Imaging_Assembly_of_NASA%27s_Solar_Dynamics_Observatory_-_20100819.jpg","picture":"https://nostr.build/i/p/nostr.build_6b9909bccf0f4fdaf7aacd9bc01e4ce70dab86f7d90395f2ce925e6ea06ed7cd.jpeg","reactions":false,"lud16":"jackjack@getalby.com","damus_donation_v2":100,"name":"jack","website":"","lud06":"LNURL1DP68GURN8GHJ7AMPD3KX2AR0VEEKZAR0WD5XJTNRDAKJ7TNHV4KXCTTTDEHHWM30D3H82UNVWQHHW6TWDE5KUEMZD3HHWEM4DCURVNYWCP4","damus_donation":100,"display_name":"","about":"bitcoin & chill"}',
			sig: '679745c5d0aca4b256eb935cd97df9ded7aeb16bf5fadff8f576036a18bdea53deb62c290910371ddac169168058ccdba1f22f0dc83b1bc4cce88946a98e81ad'
		},
		relays
	);
</script>

<div class="">
	{$NostrUser.pubkey}{#await loggedIn}
		<p>...waiting</p>
	{:then loggedIn}
		<p>The number is {loggedIn.pubkey}</p>
	{:catch error}
		<p style="color: red">{error}</p>
	{/await}
	{#each $events as event}
		{event.id}
	{/each}
</div>
