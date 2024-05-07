<script lang="ts">
	// * Import
	import { olympus, socket } from "$lib/client/const.svelte"
	import { duration } from "$lib/types"
	import { onMount, untrack } from "svelte"

	// * Let
	let time_element: HTMLSpanElement
	let time_animation: Animation

	// * State
	let question = $state("")
	let solution = $state("")

	// * Effect
	onMount(() =>
		untrack(() => {
			time_animation = new Animation(
				new KeyframeEffect(
					time_element,
					{
						"--value": Array.from({ length: 4 }).map((_, i) => 3 - i),
						visibility: ["visible", "hidden"]
					},
					{ duration: duration.kd }
				)
			)
		})
	)

	// * Socket
	socket.on("kd question", (kd) => {
		question = kd.question
		solution = kd.solution ?? ""
		if (!kd.audio) return
		new Audio(kd.audio).play()
	})

	socket.on("kd current", (username) => {
		olympus.current = olympus.contestants.findIndex(
			(contestant) => contestant.username === username
		)
	})

	socket.on("kd start", () => {
		time_animation.cancel()
		time_animation.play()
	})
	socket.on("kd solution", (sol) => {
		solution = sol
	})
</script>

<div class="absolute bottom-[5vh] left-[4vw] aspect-[1482/282] w-[70vw]">
	<img class="absolute h-full w-full" src="/olympus/kd/questionbar.webp" alt="" />
	<div class="absolute h-full w-full py-[1vh] pl-[1vw] pr-[2vw] text-2xl font-bold">{question}</div>
	<div class="time absolute bottom-[5%] right-[0%] text-7xl font-bold">
		<span class="invisible" bind:this={time_element}></span>
	</div>
	{#if solution}
		<div class="absolute bottom-[10%] left-[2%] aspect-[326/74] w-[20%]">
			<img class="absolute h-full w-full" src="/olympus/kd/english.webp" alt="" />
			<div
				class="absolute flex h-full w-full items-center justify-center text-2xl font-bold text-black"
			>
				{solution}
			</div>
		</div>
	{/if}
</div>
<div class="absolute bottom-[5vh] right-[4vw] flex w-[20vw] flex-col gap-[0.2vh]">
	{#each [0, 1, 2, 3] as id}
		<div class="relative aspect-[1280/207] w-full">
			<img
				class="absolute h-full w-full"
				src="/olympus/kd/contestantbar{olympus.bells.includes(id) || olympus.current === id
					? '_buzzer'
					: ''}.svg"
				alt=""
			/>
			<div class="absolute flex h-full w-full items-center px-[1vw] text-2xl font-bold">
				{id + 1}.{olympus.contestants[id].name}
			</div>
			<div class="absolute flex h-full w-full items-center justify-end px-[2vw] text-2xl font-bold">
				{olympus.contestants[id].score}
			</div>
		</div>
	{/each}
</div>
