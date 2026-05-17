<script lang="ts">
	import { Backlight } from '@/components/magic/backlight';
	import BlurFade from '@/components/magic/blur-fade/blur-fade.svelte';
	import { InteractiveHoverButton } from '@/components/magic/interactive-hover-button';
	import { LightRays } from '@/components/magic/light-rays';
	import BlurReveal from '@/components/spell/blur-reveal/blur-reveal.svelte';
	import Icon from '@iconify/svelte';

	import Showcase1 from '$lib/assets/images/showcase_1.png';
</script>

<svelte:head>
	<title>Odysseus</title>
</svelte:head>

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
				The <i>only</i>
				<Backlight class="inline-block text-blue-300">Arcane Odyssey</Backlight><br /> bot you'll
				<b>ever</b> need.
			</h2>
		</BlurFade>
		<BlurFade class="mt-4 space-x-4" delay={1.2} duration={1} offset={30} direction="up">
			<!-- <InteractiveHoverButton
				><Icon icon="ic:baseline-discord" class="inline-block size-5" /> Add to Server</InteractiveHoverButton
			> -->
			<a href="#about">
				<InteractiveHoverButton
					><Icon icon="material-symbols:info-outline-rounded" class="inline-block size-5" /> Learn More</InteractiveHoverButton
				>
			</a>
		</BlurFade>
	</div>
	<LightRays />
</section>

<section class="m-20 flex flex-col items-start justify-center" id="about">
	<h2 class="font-serif text-4xl">
		What is
		<Backlight class="inline-block"
			><span
				class="bg-linear-to-tr from-blue-400 to-cyan-200 bg-clip-text font-serif
			text-transparent">Odysseus</span
			></Backlight
		>?
	</h2>

	<div class="mt-4 flex items-start justify-between space-x-20">
		<p class="text-lg">
			Odysseus is an utility multi-purpose bot centered around Arcane Odyssey, bringing you commands
			such as /item and /build, with even more coming on the way as the bot is actively developed
			on!
			<br /><br />
			The bot is currently <span class="underline">not functional</span> as the entire bot is being
			rewritten due to the last iteration being about 65% AI slop rather than 100% human-made which
			I (the developer) wanted. This made me quite unhappy as I had less and less knowledge about
			how the bot functioned, leading me to rely on AI more and more.
			<br /><br />
			Other than that, another big reason the first iteration was &OpenCurlyDoubleQuote;abandoned&CloseCurlyDoubleQuote;
			was simply a lack of motivation and a lack of resources to gather data with in order to use for
			the bot (commands such as /item, /magic, /build, and /weapon require maintenance each time the balance
			team makes a change), which made it nearly impossible to keep the bot running smoothly.
			<br /><br />
			What makes this time different? Nothing, really. I just want to give this concept another chance.
			Oh, and optimization update means I can finally enjoy the game!!!!!
		</p>
		<enhanced:img src={Showcase1} class="rounded-xl" alt="Showcase of the /item command" />
	</div>
</section>
