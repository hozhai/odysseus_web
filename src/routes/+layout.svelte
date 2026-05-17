<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.ico';
	import { ModeWatcher } from 'mode-watcher';

	let { children } = $props();
</script>

<ModeWatcher />

<svelte:head><link rel="icon" href={favicon} /></svelte:head>

<main>
	{@render children()}
</main>

<footer class="bg-primary-foreground p-4 text-center font-serif">
	<p>Odysseus - AGPL v3 - {new Date().getFullYear()}</p>
</footer>
