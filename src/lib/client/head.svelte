<script lang="ts">
	import IsNight from "./is_night.svelte"

	let { title = "LTS20050703" }: { title?: string } = $props()

	let is_night = $state(true)
</script>

<svelte:head>
	<title>{title}</title>
	<link
		rel="apple-touch-icon"
		sizes="180x180"
		href="{is_night ? '/' : '/day/'}apple-touch-icon.png?v=2024.04.21.0"
	/>
	<link
		rel="icon"
		type="image/png"
		sizes="32x32"
		href="{is_night ? '/' : '/day/'}favicon-32x32.png?v=2024.04.21.0"
	/>
	<link
		rel="icon"
		type="image/png"
		sizes="16x16"
		href="{is_night ? '/' : '/day/'}favicon-16x16.png?v=2024.04.21.0"
	/>
	<link rel="manifest" href="{is_night ? '/' : '/day/'}site.webmanifest?v=2024.04.21.0" />
	<link
		rel="mask-icon"
		href="{is_night ? '/' : '/day/'}safari-pinned-tab.svg?v=2024.04.21.0"
		color="#41a8da"
	/>
	<link rel="shortcut icon" href="{is_night ? '/' : '/day/'}favicon.ico?v=2024.04.21.0" />
	<meta name="apple-mobile-web-app-title" content="LTS20050703" />
	<meta name="application-name" content="LTS20050703" />
	<meta name="msapplication-TileColor" content="#41a8da" />
	<meta name="theme-color" content="#41a8da" />
</svelte:head>

<IsNight bind:is_night></IsNight>
