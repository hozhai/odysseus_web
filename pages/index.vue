<script setup lang="ts">
import { BlurReveal } from '~/components/ui/blur-reveal';

useSeoMeta({
  title: "Odysseus"
})
</script>

<template>
  <div>
    <section class="flex relative justify-center items-center h-screen p-20 shadow-background overflow-hidden">
      <ClientOnly class="w-2/3">
        <BlurReveal :delay="0.2" :duration="0.75" class="p-8">
          <h2 class="text-2xl tracking-tighter">Introducing Odysseus...</h2>
          <h1 class="text-pretty font-bold text-6xl">
            The only <span class="text-sky-300">AO</span> bot you'll <span class="underline">need</span>.
          </h1>
          <p class="mt-2 w-2/3">
            Odysseus is an utility multi-purpose bot centered around Arcane Odyssey, bringing you commands such as
            /item and /build, with even more coming on the way as the bot is actively developed on!
          </p>
          <NuxtLink href="https://discord.com/oauth2/authorize?client_id=1366255185722347520" target="_blank">
            <UiInteractiveHoverButton text="Add to your server" class="mt-5" />
          </NuxtLink>
        </BlurReveal>
      </ClientOnly>
      <ClientOnly>
        <BlurReveal :delay="0.4" :duration="0.75" class="relative">
          <div class="absolute hover:z-10">
            <NuxtImg src="showcase_1.png" class="rounded-4xl border-1 border-black" />
          </div>
          <div class="mt-20 ml-10">
            <NuxtImg src="showcase_2.png" class="rounded-4xl border-1 border-black" />
          </div>
        </BlurReveal>
      </ClientOnly>
      <UiParticlesBg class="absolute inset-0 pointer-events-none" :quantity="100" :ease="100" color="#FFF"
        :staticity="10" refresh />
      <ClientOnly class="absolute bottom-20 left-1/2 -translate-x-1/2">
        <BlurReveal>
          <Icon name="lucide:arrow-down-to-dot" class="text-white" />
        </BlurReveal>
      </ClientOnly>
    </section>
    <section class="mt-10">
      <h1 class="text-center text-5xl font-bold">Used by many</h1>
      <div class="flex justify-center items-center mt-10 space-x-10">
        <div class="flex justify-center items-center flex-col">
          <NuxtImg
            src="https://cdn.discordapp.com/icons/1223639499121098893/67a456f10261370ff6ac2b5dbd6d4619.png?size=80&quality=lossless"
            class="rounded-full" />
          <h3 class="mt-2">Colosseum Arcana</h3>
          <p>1.3k+ members</p>
        </div>
        <div class="flex justify-center items-center flex-col">
          <NuxtImg
            src="https://cdn.discordapp.com/icons/1094248843215913011/d3095861f1fa7902ff95468fc46af36c.png?size=80&quality=lossless"
            class="rounded-full" />
          <h3 class="mt-2">The Grand Government</h3>
          <p>150+ members</p>
        </div>
      </div>
    </section>
    <footer class="bg-accent mt-20 p-5 text-center">
      <p>Odysseus - AGPL v3 License - {{ new Date().getFullYear() }}</p>
    </footer>
  </div>
</template>
