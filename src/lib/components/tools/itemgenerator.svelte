<script lang="ts">
	import { onMount } from "svelte";
	import * as Select from "@/components/ui/select/index";
	import Input from "@/components/ui/input/input.svelte";
	import Label from "@/components/ui/label/label.svelte";
	import { Textarea } from "@/components/ui/textarea";
	import { SvelteSet } from "svelte/reactivity";

	const mainTypes = [
		{ value: "Accessory", label: "Accessory" },
		{ value: "Chestplate", label: "Chestplate" },
		{ value: "Pants", label: "Pants" }
	];

	const rarities = [
		{ value: "Common", label: "Common" },
		{ value: "Uncommon", label: "Uncommon" },
		{ value: "Rare", label: "Rare" },
		{ value: "Exotic", label: "Exotic" }
	];

	const subTypes = [
		{ value: "Helmet", label: "Helmet" },
		{ value: "Hat", label: "Hat" },
		{ value: "Head", label: "Head" },
		{ value: "Face", label: "Face" },
		{ value: "Amulet", label: "Amulet" },
		{ value: "Shoulder", label: "Shoulder" },
		{ value: "Arms", label: "Arms" }
	];

	const modifiers = [
		{ value: "Atlantean Essence", label: "Atlantean Essence" },
		{ value: "Drowned", label: "Drowned" },
		{ value: "Blasted", label: "Blasted" },
		{ value: "Archaic", label: "Archaic" },
		{ value: "Superheated", label: "Superheated" },
		{ value: "Crystalline", label: "Crystalline" },
		{ value: "Frozen", label: "Frozen" },
		{ value: "Sandy", label: "Sandy" },
		{ value: "Abyssal", label: "Abyssal" }
	];

	const statTypes = [
		{ value: "None", label: "None" },
		{ value: "Magic", label: "Magic" },
		{ value: "Strength", label: "Strength" },
		{ value: "Vitality", label: "Vitality" }
	];

	const itemsYamlUrl =
		"https://raw.githubusercontent.com/hozhai/odysseus/refs/heads/main/data/items.yaml";
	const idAlphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

	// Metadata states
	let itemId = $state("");
	let itemName = $state("");
	let itemLegend = $state("");
	let mainTypeValue = $state("");
	let rarityValue = $state("");
	let itemImageUrl = $state("");
	let subTypeValue = $state("");
	let itemGemno = $state(0);
	let itemMinlvl = $state("");
	let itemMaxlvl = $state("");
	let modifierValue = $state([]);
	let statTypeValue = $state("None");
	let yamlPreview = $state("");

	// stats states
	let itemCurrentlvl = $state("");
	let itemPower = $state(0);
	let itemDefense = $state(0);
	let itemAgility = $state(0);
	let itemAttackspeed = $state(0);
	let itemAttacksize = $state(0);
	let itemIntensity = $state(0);
	let itemRegeneration = $state(0);
	let itemPiercing = $state(0);
	let itemResistance = $state(0);
	let itemWarding = $state(0);
	let itemDrawback = $state(0);

	const mainTypeTriggerContent = $derived(
		mainTypes.find((d) => d.value === mainTypeValue)?.label ?? "Select a type"
	);

	const rarityTriggerContent = $derived(
		rarities.find((d) => d.value === rarityValue)?.label ?? "Select a rarity"
	);

	const subTypeTriggerContent = $derived(
		subTypes.find((d) => d.value === subTypeValue)?.label ?? "Select a subType"
	);

	const modifierTriggerContent = $derived(
		modifierValue.length !== 0 ? modifierValue.join(" ") : "Select modifier(s)"
	);

	const statTypeTriggerContent = $derived(
		statTypes.find((d) => d.value === statTypeValue)?.label ?? "Select a stat type"
	);

	const parseIdsFromYaml = (yamlText: string) => {
		const ids = new SvelteSet<string>();
		const idRegex = /\bid:\s*"?([A-Za-z0-9]{3})"?/g;
		let match: RegExpExecArray | null;
		while ((match = idRegex.exec(yamlText)) !== null) {
			ids.add(match[1]);
		}
		return ids;
	};

	const generateUniqueId = (existingIds: Set<string>) => {
		const maxAttempts = 10000;
		for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
			let candidate = "";
			for (let i = 0; i < 3; i += 1) {
				candidate += idAlphabet[Math.floor(Math.random() * idAlphabet.length)];
			}
			if (!existingIds.has(candidate)) {
				return candidate;
			}
		}
		throw new Error("Unable to generate a unique id.");
	};
	const getScalingMultiplier = (statType: "defense" | "power" | "other") => {
		switch (statType) {
			case "defense":
				return 2.7;
			case "power":
				return 0.35;
			default:
				return 0.5;
		}
	};

	const normalizeNumber = (value: string | number, fallback = 0) => {
		const parsed = typeof value === "number" ? value : Number(value);
		return Number.isFinite(parsed) ? parsed : fallback;
	};

	const currentLevelNumber = $derived(Number(itemCurrentlvl));

	const roundScalingValue = (value: number, statType: "defense" | "power" | "other") => {
		if (!Number.isFinite(currentLevelNumber) || currentLevelNumber <= 0) {
			return 0;
		}
		const denominator = getScalingMultiplier(statType) * currentLevelNumber;
		if (!denominator) {
			return 0;
		}
		const result = value / denominator;
		if (!Number.isFinite(result)) {
			return 0;
		}
		return Math.round(result * 1e6) / 1e6;
	};

	const createScaling = () => {
		const scalingEntries = {
			power: roundScalingValue(itemPower, "power"),
			defense: roundScalingValue(itemDefense, "defense"),
			agility: roundScalingValue(itemAgility, "other"),
			attackspeed: roundScalingValue(itemAttackspeed, "other"),
			attacksize: roundScalingValue(itemAttacksize, "other"),
			intensity: roundScalingValue(itemIntensity, "other"),
			regeneration: roundScalingValue(itemRegeneration, "other"),
			piercing: roundScalingValue(itemPiercing, "other"),
			resistance: roundScalingValue(itemResistance, "other"),
			warding: roundScalingValue(itemWarding, "other"),
			drawback: roundScalingValue(itemDrawback, "other")
		};
		return Object.fromEntries(Object.entries(scalingEntries).filter(([, value]) => value !== 0));
	};

	const isPlainString = (value: string) => /^[A-Za-z0-9 _.-]+$/.test(value);

	const escapeYamlString = (value: string) => value.replace(/\\/g, "\\\\").replace(/"/g, '\\"');

	const formatYamlScalar = (value: unknown) => {
		if (typeof value === "string") {
			if (value === "") {
				return '""';
			}
			return isPlainString(value) ? value : `"${escapeYamlString(value)}"`;
		}
		if (typeof value === "number") {
			return Number.isFinite(value) ? String(value) : "0";
		}
		if (typeof value === "boolean") {
			return value ? "true" : "false";
		}
		return "null";
	};

	const formatYamlKey = (key: string, indentLevel: number) => {
		if (indentLevel === 0) {
			return `"${escapeYamlString(key)}"`;
		}
		return /^[A-Za-z_][A-Za-z0-9_-]*$/.test(key) ? key : `"${escapeYamlString(key)}"`;
	};

	const toYaml = (value: unknown, indentLevel = 0): string => {
		const padding = "  ".repeat(indentLevel);
		if (Array.isArray(value)) {
			if (value.length === 0) {
				return "[]";
			}
			return value
				.map((item) => {
					if (item && typeof item === "object") {
						return `${padding}-\n${toYaml(item, indentLevel + 1)}`;
					}
					return `${padding}- ${formatYamlScalar(item)}`;
				})
				.join("\n");
		}

		if (value && typeof value === "object") {
			const entries = Object.entries(value as Record<string, unknown>);
			if (entries.length === 0) {
				return "{}";
			}
			return entries
				.map(([key, entryValue]) => {
					const formattedKey = formatYamlKey(key, indentLevel);
					if (typeof entryValue === "string" && entryValue.includes("\n")) {
						const lines = entryValue.split(/\r?\n/);
						const block = lines.map((line) => `${padding}  ${line}`).join("\n");
						return `${padding}${formattedKey}:\n${block}`;
					}
					if (Array.isArray(entryValue)) {
						return entryValue.length === 0
							? `${padding}${formattedKey}: []`
							: `${padding}${formattedKey}:\n${toYaml(entryValue, indentLevel + 1)}`;
					}
					if (entryValue && typeof entryValue === "object") {
						const nested = toYaml(entryValue, indentLevel + 1);
						return nested === "{}"
							? `${padding}${formattedKey}: {}`
							: `${padding}${formattedKey}:\n${nested}`;
					}
					return `${padding}${formattedKey}: ${formatYamlScalar(entryValue)}`;
				})
				.join("\n");
		}

		return `${padding}${formatYamlScalar(value)}`;
	};

	onMount(() => {
		let isActive = true;

		const loadIds = async () => {
			try {
				const response = await fetch(itemsYamlUrl);
				if (!response.ok) {
					throw new Error(`Request failed (${response.status})`);
				}
				const yamlText = await response.text();
				const existingIds = parseIdsFromYaml(yamlText);
				if (!isActive) {
					return;
				}
				itemId = generateUniqueId(existingIds);
			} catch (error) {
				if (!isActive) {
					return;
				}
				console.error(error instanceof Error ? error.message : "Failed to load item ids.");
			}
		};

		loadIds();

		return () => {
			isActive = false;
		};
	});

	// derived state that collects all form data
	const formData = $derived(
		(() => {
			const resolvedItemId = itemId || "___";
			const resolvedSubType = mainTypeValue === "Accessory" ? subTypeValue || "None" : "None";
			return {
				[resolvedItemId]: {
					id: resolvedItemId,
					name: itemName,
					legend: itemLegend,
					mainType: mainTypeValue || "None",
					rarity: rarityValue || "None",
					imageId: itemImageUrl || "",
					deleted: false,
					subType: resolvedSubType,
					statType: statTypeValue || "None",
					gemNo: normalizeNumber(itemGemno),
					minLevel: normalizeNumber(itemMinlvl),
					maxLevel: normalizeNumber(itemMaxlvl),
					statsPerLevel: [],
					validModifiers: Array.isArray(modifierValue) ? modifierValue : [],
					scaling: createScaling()
				}
			};
		})()
	);

	let yamlPreviewTimeout: ReturnType<typeof setTimeout> | null = null;

	$effect(() => {
		const snapshot = formData;
		if (yamlPreviewTimeout) {
			clearTimeout(yamlPreviewTimeout);
		}
		yamlPreviewTimeout = setTimeout(() => {
			yamlPreview = toYaml(snapshot);
		}, 500);
		return () => {
			if (yamlPreviewTimeout) {
				clearTimeout(yamlPreviewTimeout);
				yamlPreviewTimeout = null;
			}
		};
	});
</script>

<div class="w-[45ch] space-y-10">
	<h2 class="font-serif text-2xl">~ Metadata ~</h2>
	<div>
		<Label for="item_name">The name of the item.</Label>
		<Input id="item_name" type="text" placeholder="Item name..." bind:value={itemName} />
	</div>
	<div>
		<Label for="item_legend"
			>The description/legend of the item, this is the long lore that appears when you hover over
			the item in-game. You may copy-paste this from the wiki if applicable.</Label
		>
		<Textarea id="item_legend" placeholder="Item legend..." bind:value={itemLegend} />
	</div>
	<div class="space-y-2">
		<Label for="item_maintype">The mainType of the item. This is the slot your item belongs.</Label>
		<Select.Root type="single" name="mainType" bind:value={mainTypeValue}>
			<Select.Trigger id="item_maintype" class="w-45">
				{mainTypeTriggerContent}
			</Select.Trigger>
			<Select.Content>
				<Select.Group>
					<Select.Label>Types</Select.Label>
					{#each mainTypes as d (d.value)}
						<Select.Item value={d.value} label={d.label}>
							{d.label}
						</Select.Item>
					{/each}
				</Select.Group>
			</Select.Content>
		</Select.Root>
	</div>
	<div class="space-y-2">
		<Label for="item_rarity"
			>The rarity of your item.<br />White = Common<br />Dark beige-ish = Uncommon<br />Blue = Rare<br
			/>Red = Exotic</Label
		>
		<Select.Root type="single" name="rarity" bind:value={rarityValue}>
			<Select.Trigger id="item_rarity" class="w-45">
				{rarityTriggerContent}
			</Select.Trigger>
			<Select.Content>
				<Select.Group>
					<Select.Label>Rarities</Select.Label>
					{#each rarities as r (r.value)}
						<Select.Item value={r.value} label={r.label}>
							{r.label}
						</Select.Item>
					{/each}
				</Select.Group>
			</Select.Content>
		</Select.Root>
	</div>
	<div>
		<Label for="item_image_url"
			>A URL to the image of the item. You can use any image hosting platform widely available.</Label
		>
		<Input id="item_image_url" type="url" placeholder="https://..." bind:value={itemImageUrl} />
	</div>
	{#if mainTypeValue === "Accessory"}
		<div class="space-y-2">
			<Label for="item_subtype">The subtype of the accessory.</Label>
			<Select.Root type="single" name="subType" bind:value={subTypeValue}>
				<Select.Trigger id="item_subtype" class="w-45">
					{subTypeTriggerContent}
				</Select.Trigger>
				<Select.Content>
					<Select.Group>
						<Select.Label>Sub-types</Select.Label>
						{#each subTypes as s (s.value)}
							<Select.Item value={s.value} label={s.label}>
								{s.label}
							</Select.Item>
						{/each}
					</Select.Group>
				</Select.Content>
			</Select.Root>
		</div>
	{/if}
	<div>
		<Label for="item_gemno">The maximum amount of gems socketable in the item.</Label>
		<Input id="item_gemno" type="number" placeholder="0" min={0} max={3} bind:value={itemGemno} />
	</div>
	<div class="flex space-x-4">
		<div>
			<Label for="item_minlvl"
				>The minimum level the item can be gotten with. If unknown put 170.</Label
			>
			<Input id="item_minlvl" type="number" placeholder="0" bind:value={itemMinlvl} />
		</div>
		<div>
			<Label for="item_maxlvl"
				>The maximum level the item can be upgraded to. If unknown put 170.</Label
			>
			<Input id="item_maxlvl" type="number" placeholder="0" bind:value={itemMaxlvl} />
		</div>
	</div>
	<div class="space-y-2">
		<Label for="item_validmodifier"
			>The modifiers applicable to this item. If unsure, only put Atlantean Essence.</Label
		>
		<Select.Root type="multiple" name="validModifier" bind:value={modifierValue}>
			<Select.Trigger id="item_validmodifier" class="w-45">
				{modifierTriggerContent}
			</Select.Trigger>
			<Select.Content>
				<Select.Group>
					<Select.Label>Modifiers</Select.Label>
					{#each modifiers as m (m.value)}
						<Select.Item value={m.value} label={m.label}>
							{m.label}
						</Select.Item>
					{/each}
				</Select.Group>
			</Select.Content>
		</Select.Root>
	</div>
	<div class="space-y-2">
		<Label for="item_stattype"
			>The primary stat type of the item. For example, Arcspheres are Magic type, fighting style
			armors are Strength types, and Oracle gear are Vitality type.
		</Label>
		<Select.Root type="single" name="statType" bind:value={statTypeValue}>
			<Select.Trigger id="item_stattype" class="w-45">
				{statTypeTriggerContent}
			</Select.Trigger>
			<Select.Content>
				<Select.Group>
					<Select.Label>Stat Types</Select.Label>
					{#each statTypes as s (s.value)}
						<Select.Item value={s.value} label={s.label}>
							{s.label}
						</Select.Item>
					{/each}
				</Select.Group>
			</Select.Content>
		</Select.Root>
	</div>
	<h2 class="font-serif text-2xl">~ Stats ~</h2>
	<div>
		<Label for="item_currentlvl"
			>The level of the item you're currently using as a reference to submit this data. If you're
			looking at the wiki, put 170. This is used to calculate the scaling of the stats. The units
			place should be zero.</Label
		>
		<Input id="item_currentlvl" type="number" placeholder="0" bind:value={itemCurrentlvl} />
	</div>
	<div class="flex space-x-4">
		<div>
			<Label for="item_power">Power (input 0 if none)</Label>
			<Input id="item_power" type="number" placeholder="0" bind:value={itemPower} />
		</div>
		<div>
			<Label for="item_defense">Defense (input 0 if none).</Label>
			<Input id="item_defense" type="number" placeholder="0" bind:value={itemDefense} />
		</div>
	</div>
	<div class="flex space-x-4">
		<div>
			<Label for="item_agility">Range (agility) (input 0 if none)</Label>
			<Input id="item_agility" type="number" placeholder="0" bind:value={itemAgility} />
		</div>
		<div>
			<Label for="item_attackspeed">Attack Speed (input 0 if none).</Label>
			<Input id="item_attackspeed" type="number" placeholder="0" bind:value={itemAttackspeed} />
		</div>
	</div>
	<div class="flex space-x-4">
		<div>
			<Label for="item_attacksize">Attack Size (input 0 if none)</Label>
			<Input id="item_attacksize" type="number" placeholder="0" bind:value={itemAttacksize} />
		</div>
		<div>
			<Label for="item_intensity">Intensity (haste) (input 0 if none).</Label>
			<Input id="item_intensity" type="number" placeholder="0" bind:value={itemIntensity} />
		</div>
	</div>
	<div class="flex space-x-4">
		<div>
			<Label for="item_regeneration">Regeneration (input 0 if none)</Label>
			<Input id="item_regeneration" type="number" placeholder="0" bind:value={itemRegeneration} />
		</div>
		<div>
			<Label for="item_piercing">Armor Piercing (input 0 if none).</Label>
			<Input id="item_piercing" type="number" placeholder="0" bind:value={itemPiercing} />
		</div>
	</div>
	<div class="flex space-x-4">
		<div>
			<Label for="item_resistance">Resistance (input 0 if none)</Label>
			<Input id="item_resistance" type="number" placeholder="0" bind:value={itemResistance} />
		</div>
		<div>
			<Label for="item_warding">Warding (input 0 if none).</Label>
			<Input id="item_warding" type="number" placeholder="0" bind:value={itemWarding} />
		</div>
	</div>
	<div>
		<Label for="item_drawback">Drawback (input 0 if none)</Label>
		<Input id="item_drawback" type="number" placeholder="0" bind:value={itemDrawback} />
	</div>
	<h2 class="font-serif text-2xl">~ YAML Preview ~</h2>
	<pre
		class="mb-20 rounded-xl border border-white/10 bg-black/30 p-4 text-xs leading-relaxed whitespace-pre-wrap text-white/90">{yamlPreview}</pre>
</div>
