<script lang="ts">
	// * Import
	import { untrack } from "svelte"
	import { olympus } from "./const.svelte"
	import { sleep } from "./functions"

	// * Props
	let { show }: { show: boolean } = $props()

	// * Const
	const elements: HTMLDivElement[] = []

	// * Let
	let animations: Animation[] = []

	// * Effect
	$effect(() =>
		untrack(() => {
			animations = elements.map(
				(element) =>
					new Animation(
						new KeyframeEffect(
							element,
							{ top: ["2.78%", "11.11%"] },
							{ duration: 500, fill: "both", easing: "ease-in-out" }
						)
					)
			)
		})
	)

	$effect(() => {
		olympus.deltas.forEach(async (delta, i) => {
			if (!delta) return

			const animation = animations[i]

			if (!animation) return

			animation.playbackRate = 1
			animation.play()

			await sleep(1000)

			animation.playbackRate = -1
			animation.play()
		})
	})
</script>

<div class={show ? "" : "invisible"}>
	<div
		class="absolute -top-[11.11%] left-[17.5%] flex h-[8.33%] w-[6.25%] items-center justify-center text-3xl text-black {olympus
			.deltas[0] > 0
			? 'bg-green-500'
			: 'bg-red-500'}"
		bind:this={elements[0]}
	>
		{olympus.deltas[0] > 0 ? "+" : ""}{olympus.deltas[0]}
	</div>
	<div
		class="absolute -top-[11.11%] left-[42.5%] flex h-[8.33%] w-[6.25%] items-center justify-center text-3xl text-black {olympus
			.deltas[1] > 0
			? 'bg-green-500'
			: 'bg-red-500'}"
		bind:this={elements[1]}
	>
		{olympus.deltas[1] > 0 ? "+" : ""}{olympus.deltas[1]}
	</div>
	<div
		class="absolute -top-[11.11%] left-[67.5%] flex h-[8.33%] w-[6.25%] items-center justify-center text-3xl text-black {olympus
			.deltas[2] > 0
			? 'bg-green-500'
			: 'bg-red-500'}"
		bind:this={elements[2]}
	>
		{olympus.deltas[2] > 0 ? "+" : ""}{olympus.deltas[2]}
	</div>
	<div
		class="absolute -top-[11.11%] left-[92.5%] flex h-[8.33%] w-[6.25%] items-center justify-center text-3xl text-black {olympus
			.deltas[3] > 0
			? 'bg-green-500'
			: 'bg-red-500'}"
		bind:this={elements[3]}
	>
		{olympus.deltas[3] > 0 ? "+" : ""}{olympus.deltas[3]}
	</div>
</div>
