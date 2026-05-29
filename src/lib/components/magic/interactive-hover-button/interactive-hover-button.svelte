<script lang="ts">
	import { ArrowRight } from "@lucide/svelte";
	import { cn } from "$lib/utils";
	import type { Snippet } from "svelte";
	import type { HTMLButtonAttributes } from "svelte/elements";

	interface InteractiveHoverButtonProps extends HTMLButtonAttributes {
		children: Snippet;
		class?: string;
	}

	let { children, class: className, ...props }: InteractiveHoverButtonProps = $props();
</script>

<button
	class={cn(
		"group relative w-auto cursor-pointer overflow-hidden rounded-full border bg-background p-2 px-6 text-center font-semibold",
		className
	)}
	{...props}
>
	<div class="flex items-center gap-2">
		<div
			class="h-2 w-2 rounded-full bg-primary transition-all duration-300 group-hover:scale-[100.8]"
		></div>
		<span
			class="inline-block transition-all duration-300 group-hover:translate-x-12 group-hover:opacity-0"
		>
			{@render children()}
		</span>
	</div>
	<div
		class="absolute top-0 z-10 flex h-full w-full translate-x-12 items-center justify-center gap-2 text-primary-foreground opacity-0 transition-all duration-300 group-hover:-translate-x-5 group-hover:opacity-100"
	>
		<span>{@render children()}</span>
		<ArrowRight />
	</div>
</button>
