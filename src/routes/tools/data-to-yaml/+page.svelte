<script lang="ts">
	import Itemgenerator from "./../../../lib/components/tools/itemgenerator.svelte";
	import * as Select from "$lib/components/ui/select/index.js";
	const data = [
		{ value: "item", label: "Item" },
		{ value: "weapon", label: "Weapon" },
		{ value: "magic", label: "Magic" },
		{ value: "enchant", label: "Enchant" },
		{ value: "modifier", label: "Modifier" },
		{ value: "gem", label: "Gem" }
	];

	let value = $state("");

	const triggerContent = $derived(data.find((d) => d.value === value)?.label ?? "Select a type");
</script>

<div class="flex justify-center">
	<div class="m-20 w-[45ch] space-y-4">
		<h1 class="font-serif text-4xl">Data to YAML</h1>

		<p>
			Select below the type of data you'd like to generate from an item. This tool is a
			work-in-progress and will most likely have breaking changes in the future.
		</p>

		<Select.Root type="single" name="type" bind:value>
			<Select.Trigger class="w-45">
				{triggerContent}
			</Select.Trigger>
			<Select.Content>
				<Select.Group>
					<Select.Label>Types</Select.Label>
					{#each data as d (d.value)}
						<Select.Item value={d.value} label={d.label}>
							{d.label}
						</Select.Item>
					{/each}
				</Select.Group>
			</Select.Content>
		</Select.Root>
	</div>
</div>

<div class="flex justify-center">
	<Itemgenerator />
</div>
