<template>
  <BentoGrid class="grid w-full auto-rows-[22rem] grid-cols-3 gap-4 lg:grid-rows-3">
    <BentoGridCard v-for="(feature, index) in features" :key="index" v-bind="feature" :class="feature.class">
      <template v-if="feature.image" #background>
        <div
          class="absolute right-0 top-0 size-full bg-center opacity-40 transition duration-150 ease-in-out group-hover:opacity-20"
          :style="`background-image: url('${feature.image}')`"></div>
      </template>
    </BentoGridCard>
  </BentoGrid>
</template>

<script lang="ts" setup>
import BentoGridCard from "./ui/bento-grid/BentoGridCard.vue";

const features = [
  {
    name: "Find ANY item",
    description: "Get the data of any item near instantly with Odysseus' /item command.",
    href: "",
    image:
      "showcase_1.png",
    cta: "Learn more",
    class: "lg:row-start-1 lg:row-end-4 lg:col-start-2 lg:col-end-3",
  },
  {
    name: "Search ALL the weapons",
    description: "Curious about the stats of a weapon? No more curiosity, but a lot more /weapon.",
    href: "/",
    image:
      "showcase_3.png",
    cta: "Learn more",
    class: "lg:col-start-1 lg:col-end-2 lg:row-start-1 lg:row-end-3",
  },
  {
    name: "Sort by ANYTHING",
    description: "Sort all 513 items in the game, by any stat, instantly.",
    href: "/",
    image: "showcase_4.png",
    cta: "Learn more",
    class: "lg:col-start-1 lg:col-end-2 lg:row-start-3 lg:row-end-4",
  },
  {
    name: "Flex YOUR build",
    description: "Use the /build command to effortlessly share your build with others.",
    href: "/",
    image: "showcase_2.png",
    cta: "Learn more",
    class: "lg:col-start-3 lg:col-end-3 lg:row-start-1 lg:row-end-2",
  },
  {
    name: "Calculate your DAMAGE",
    description: "With our in-built damage calculator, you no longer need to exit Discord to see your theoretical damage!",
    href: "/",
    image:
      "showcase_5.png",
    cta: "Learn more",
    class: "lg:col-start-3 lg:col-end-3 lg:row-start-2 lg:row-end-4",
  },
];
</script>