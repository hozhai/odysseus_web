<script lang="ts">
	import "./layout.css";
	import favicon from "$lib/assets/favicon.ico";
	import { ModeWatcher } from "mode-watcher";
	import Navbar from "@/components/Navbar.svelte";

	let { children } = $props();
</script>

<ModeWatcher />

<svelte:head><link rel="icon" href={favicon} /></svelte:head>

<div class="fixed top-0 left-0 z-50 flex w-screen justify-center bg-black/50 backdrop-blur-lg">
	<Navbar />
</div>

<main>
	{@render children()}
</main>

<footer class="bg-primary-foreground p-4 text-center font-serif">
	<p>Odysseus - AGPL v3 - {new Date().getFullYear()}</p>
</footer>
