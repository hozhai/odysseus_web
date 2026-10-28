<script lang="ts">
	import Icon from "@iconify/svelte";
	import { resolve } from "$app/paths";
	import * as NavigationMenu from "#lib/components/ui/navigation-menu/index.js";
	import { cn } from "#lib/utils.js";
	import { navigationMenuTriggerStyle } from "#lib/components/ui/navigation-menu/navigation-menu-trigger.svelte";
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
			<NavigationMenu.Link
				href="https://github.com/hozhai/odysseus"
				class={navigationMenuTriggerStyle()}
			>
				<Icon icon="mdi:github" /> Source Code
			</NavigationMenu.Link>
		</NavigationMenu.Item>
	</NavigationMenu.List>
</NavigationMenu.Root>
