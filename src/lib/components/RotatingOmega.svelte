<script lang="ts">
	import { onMount, type Component } from "svelte";

	let OmegaCanvas = $state<Component | null>(null);

	onMount(() => {
		void import("./RotatingOmegaCanvas.svelte")
			.then(({ default: canvas }) => {
				OmegaCanvas = canvas;
			})
			.catch((error: unknown) => {
				console.error("Failed to load scene.", error);
			});
	});
</script>

<div class="h-full w-full" role="img" aria-label="Rotating capital omega symbol">
	{#if OmegaCanvas}
		<OmegaCanvas />
	{:else}
		<div
			class="grid h-full w-full place-items-center font-serif text-8xl text-blue-200 md:text-[18rem]"
			aria-hidden="true"
		>
			Ω
		</div>
	{/if}
</div>
