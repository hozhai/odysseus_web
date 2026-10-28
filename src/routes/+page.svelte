<script lang="ts">
	import { Backlight } from "@/components/magic/backlight";
	import BlurFade from "@/components/magic/blur-fade/blur-fade.svelte";
	import { LightRays } from "@/components/magic/light-rays";
	import BlurReveal from "@/components/spell/blur-reveal/blur-reveal.svelte";

	import Showcase1 from "#lib/assets/images/showcase_1.png?enhanced";
	import NoiseTexture from "#lib/components/magic/noise-texture/noise-texture.svelte";
</script>

<svelte:head>
	<title>Odysseus</title>
</svelte:head>

<section class="relative grid h-screen place-items-center">
	<NoiseTexture
		class="absolute inset-0 mask-[radial-gradient(420px_circle_at_center,white,transparent)]"
		noiseOpacity={1}
	/>
	<LightRays />
	<div class="text-center">
		<h2 class="flex justify-center gap-2 font-serif text-2xl">
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
			<h2 class="font-serif text-6xl">
				The <i>only</i>
				<Backlight class="inline-block text-blue-300">Arcane Odyssey</Backlight><br /> bot you'll
				<b><i>ever</i></b> need.
			</h2>
		</BlurFade>
	</div>
</section>
<BlurFade
	class="absolute bottom-[calc(50%-100px)] left-1/2 -translate-x-1/2"
	inViewMargin="1080px"
	delay={0.8}
>
	<div class="h-0.5 w-lg bg-white"></div>
</BlurFade>
<BlurFade
	class="absolute bottom-[calc(50%-110px)] left-1/2 -translate-x-1/2"
	inViewMargin="1080px"
	delay={0.9}
>
	<div class=" h-0.5 w-96 bg-white"></div>
</BlurFade>
<BlurFade class="absolute bottom-[calc(50%-120px)] left-1/2 ">
	<div class="h-0.5 w-72 -translate-x-1/2 bg-white"></div>
</BlurFade>
<div class="h-lg absolute bottom-20 left-1/2 w-0.5 -translate-x-1/2 bg-white"></div>
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
