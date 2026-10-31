<script lang="ts">
	import { Backlight } from "@/components/magic/backlight";
	import BlurFade from "@/components/magic/blur-fade/blur-fade.svelte";
	import { LightRays } from "@/components/magic/light-rays";
	import RotatingOmega from "@/components/RotatingOmega.svelte";
	import BlurReveal from "@/components/spell/blur-reveal/blur-reveal.svelte";

	import Showcase1 from "#lib/assets/images/showcase_1.png?enhanced";
	import NoiseTexture from "#lib/components/magic/noise-texture/noise-texture.svelte";
	import RippleButton from "#lib/components/magic/ripple-button/ripple-button.svelte";
	import { Icon, Info } from "@lucide/svelte";
</script>

<svelte:head>
	<title>Odysseus</title>
</svelte:head>

<section
	class="col relative flex min-h-screen w-full items-center justify-center overflow-hidden px-10 pt-24 pb-12 md:px-30 md:py-0"
>
	<NoiseTexture
		class="absolute inset-0 mask-[radial-gradient(420px_circle_at_center,white,transparent)]"
		noiseOpacity={0.7}
	/>
	<LightRays />
	<div
		class="absolute top-1/2 left-1/2 z-20 flex w-full -translate-x-1/2 -translate-y-1/2 flex-col justify-center rounded-xl py-10 text-center md:w-[62%]"
	>
		<h2 class="flex justify-center gap-2 font-serif text-base sm:text-lg md:text-2xl">
			<BlurFade class="inline-block text-muted-foreground" delay={1}>~</BlurFade>
			<BlurReveal as="span" class="text-muted-foreground">Introducing</BlurReveal>
			<Backlight class="inline-block"
				><BlurReveal
					delay={0.4}
					as="span"
					class="bg-linear-to-tr from-blue-400 to-cyan-200 bg-clip-text
			text-transparent">Odysseus</BlurReveal
				></Backlight
			>
			<BlurFade class="inline-block text-muted-foreground" delay={1.3}>~</BlurFade>
		</h2>
		<BlurFade delay={0.7} duration={0.7} offset={30} direction="up" class="mt-2">
			<h2 class="font-serif text-4xl sm:text-5xl xl:text-6xl">
				The <i>only</i>
				<Backlight class="inline-block text-blue-300">Arcane Odyssey</Backlight><br /> bot you'll
				<b><i>ever</i></b> need.
			</h2>
		</BlurFade>
		<BlurFade
			delay={0.9}
			duration={0.7}
			offset={30}
			direction="up"
			class="mt-4 flex justify-center"
		>
			<RippleButton
				rippleColor="#93b1e3"
				class="font-serif"
				onclick={() => document.querySelector("#about")?.scrollIntoView()}
			>
				<Info class="mr-2 inline-block" /><b>LEARN MORE</b></RippleButton
			></BlurFade
		>
	</div>
	<div
		class="absolute top-1/2 left-1/2 z-10 h-56 w-full shrink-0 -translate-x-1/2 -translate-y-1/2 sm:h-64 md:h-[min(70vh,32rem)] md:w-[38%]"
	>
		<RotatingOmega />
	</div>
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
			What makes this time different? Nothing, really, except the fact that I'm not going to vibecode
			half the project. I also just want to give this concept another chance. Oh, and optimization update
			means I can finally enjoy the game!!!!!
		</p>
		<enhanced:img src={Showcase1} class="rounded-xl" alt="Showcase of the /item command" />
	</div>
</section>
