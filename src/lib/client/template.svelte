<script lang="ts">
	import { untrack } from "svelte"
	import { themeChange as theme_change } from "theme-change"
	import Back from "./back.svelte"
	import IsNight from "./is_night.svelte"

	let {
		name = "",
		version = "",
		href = "",
		shallow = false
	}: { name?: string; version?: string; href?: string; shallow?: boolean } = $props()

	let is_night = $state(true)
	let index = $state(-1)
	let lts = $state(
		shuffle([
			"Long Term Support",
			"Link Tulin Sidon",
			"Lê Tuấn Savior",
			"Lời Tòa Soạn",
			"Lời Tâm Sự",
			"Lập Trình Svelte",
			"Long Term Speedrunner"
		])
	)

	$effect(() => untrack(() => theme_change(false)))

	setInterval(change_lts, 60000)

	function change_lts() {
		index += 1

		if (index < lts.length) return

		index = -1
		lts = shuffle(lts)
	}

	function shuffle<T>(array: T[]): T[] {
		let currentIndex = array.length

		// While there remain elements to shuffle...
		while (currentIndex != 0) {
			// Pick a remaining element...
			let randomIndex = Math.floor(Math.random() * currentIndex)
			currentIndex--

			// And swap it with the current element.
			;[array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]]
		}
		return array
	}
</script>

<div class="m-1 flex flex-col items-center justify-center gap-1">
	<div class="flex w-full items-center justify-between">
		<Back {shallow} {href}></Back>
		<button class="flex flex-col items-center justify-center hover:opacity-80" onclick={change_lts}>
			{#if index === -1}
				<div class="text-2xl">
					<span class="text-primary">LTS</span><span class="text-secondary">20050703</span>
				</div>
			{:else}
				<div class="text-primary">{lts[index % lts.length]}</div>
				<div class="text-secondary">20050703</div>
			{/if}
		</button>

		<img class="h-12 w-12" src="{is_night ? '/' : '/day/'}apple-touch-icon.png" alt="" />
	</div>

	<div class="flex flex-row items-center justify-center gap-2">
		<label for="theme">Theme</label>
		<select id="theme" class="select select-primary select-sm" data-choose-theme>
			<option value="">System</option>
			<option value="light">Light</option>
			<option value="dark">Dark</option>
			<option value="black">Black</option>
		</select>
	</div>

	{#if name}<div class="text-2xl font-bold">{name}</div>{/if}
	{#if version}<div>{version}</div>{/if}
</div>

<IsNight bind:is_night></IsNight>
