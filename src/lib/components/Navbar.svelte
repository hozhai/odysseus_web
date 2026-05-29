<script lang="ts">
	import Icon from "@iconify/svelte";
	import { resolve } from "$app/paths";
	import * as NavigationMenu from "$lib/components/ui/navigation-menu/index.js";
	import { cn } from "$lib/utils.js";
	import { navigationMenuTriggerStyle } from "$lib/components/ui/navigation-menu/navigation-menu-trigger.svelte";
	import type { HTMLAttributes } from "svelte/elements";

	const tools: { title: string; href: string; description: string }[] = [
		{
			title: "Data to YAML",
			href: "/tools/data-to-yaml",
			description:
				"Input data and get back YAML to help contribute to Odysseus. If you're coming to contribute item, weapon, magic, modifier, enchant, or gem data, here is the place!"
		},
		{
			title: "More to come soon!",
			href: "/",
			description: "More tools coming soon!"
		}
	];

	type ListItemProps = HTMLAttributes<HTMLAnchorElement> & {
		title: string;
		href: string;
		content: string;
	};
</script>

{#snippet ListItem({ title, content, href, class: className, ...restProps }: ListItemProps)}
	<li>
		<NavigationMenu.Link>
			{#snippet child()}
				<!-- svelte-eslint-disable-next-line svelte/no-navigation-without-resolve -->
				<a
					href={resolve(href)}
					class={cn(
						"block space-y-1 rounded-md p-3 leading-none no-underline transition-colors outline-none select-none hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
						className
					)}
					{...restProps}
				>
					<div class="text-sm leading-none font-medium">{title}</div>
					<p class="line-clamp-2 text-sm leading-snug text-muted-foreground">
						{content}
					</p>
				</a>
			{/snippet}
		</NavigationMenu.Link>
	</li>
{/snippet}

<NavigationMenu.Root>
	<NavigationMenu.List class="flex-wrap">
		<NavigationMenu.Item>
			<NavigationMenu.Link href={resolve("/")}><Icon icon="mdi:home" /> Home</NavigationMenu.Link>
		</NavigationMenu.Item>
		<NavigationMenu.Item>
			<NavigationMenu.Trigger><Icon icon="mdi:tools" /> Tools</NavigationMenu.Trigger>
			<NavigationMenu.Content>
				<ul class="grid w-75 gap-2 p-2 sm:w-100 md:w-125 md:grid-cols-2 lg:w-150">
					{#each tools as tool, i (i)}
						{@render ListItem({
							href: tool.href,
							title: tool.title,
							content: tool.description
						})}
					{/each}
				</ul>
			</NavigationMenu.Content>
		</NavigationMenu.Item>

		<NavigationMenu.Item>
			<NavigationMenu.Link
				href="https://github.com/hozhai/odysseus"
				class={navigationMenuTriggerStyle()}
			>
				<Icon icon="mdi:github" /> Source Code
			</NavigationMenu.Link>
		</NavigationMenu.Item>
	</NavigationMenu.List>
</NavigationMenu.Root>
