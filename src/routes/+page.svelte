<script lang="ts">
	import { Backlight } from '@/components/magic/backlight';
	import BlurFade from '@/components/magic/blur-fade/blur-fade.svelte';
	import { InteractiveHoverButton } from '@/components/magic/interactive-hover-button';
	import { LightRays } from '@/components/magic/light-rays';
	import BlurReveal from '@/components/spell/blur-reveal/blur-reveal.svelte';
	import Icon from '@iconify/svelte';
</script>

<section class="relative grid h-screen place-items-center">
	<div class="text-center">
		<h2 class="text-2xl italic">
			<BlurReveal as="span" class="text-muted-foreground">Introducing</BlurReveal>
			<Backlight class="inline-block"
				><BlurReveal
					delay={0.4}
					as="span"
					class="bg-linear-to-tr from-blue-400 to-cyan-200 bg-clip-text font-serif
			text-transparent">Odysseus</BlurReveal
				></Backlight
			><BlurReveal delay={0.7} as="span">...</BlurReveal>
		</h2>
		<BlurFade delay={0.7} duration={0.7} offset={30} direction="up">
			<h2 class="font-serif text-6xl">
				The <i>only</i> <span class="text-blue-300">Arcane Odyssey</span><br /> bot you'll
				<b>ever</b> need.
			</h2>
		</BlurFade>
		<BlurFade class="mt-4" delay={1.2} duration={1} offset={30} direction="up">
			<InteractiveHoverButton
				><Icon icon="ic:baseline-discord" class="inline-block size-5" /> Add to Server</InteractiveHoverButton
			>
			<InteractiveHoverButton
				><Icon icon="material-symbols:info-outline-rounded" class="inline-block size-5" /> Learn More</InteractiveHoverButton
			>
		</BlurFade>
	</div>
	<LightRays />
</section>
