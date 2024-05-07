<script lang="ts">
	// * Import
	import { olympus, socket } from "$lib/client/const.svelte"
	import { duration } from "$lib/types"
	import { untrack } from "svelte"

	// * Props
	let { username }: { username: string } = $props()

	// * Let
	let time_element: HTMLSpanElement
	let time_animation: Animation

	// * State
	let current = $state(0)
	let question = $state("")

	// * Effect
	$effect(() =>
		untrack(() => {
			time_animation = new Animation(
				new KeyframeEffect(
					time_element,
					{ "--value": Array.from({ length: 4 }).map((_, i) => 3 - i) },
					{ duration: duration.kd }
				)
			)
		})
	)

	// * Socket
	socket.on("kd question", (kd) => {
		question = kd.question
		time_animation.cancel()
		time_animation.currentTime = 0
	})

	socket.on("kd id", (id) => {
		current = id
	})

	socket.on("kd start", () => {
		time_animation.cancel()
		time_animation.play()
	})
</script>

<div class="fixed inset-0 m-4 flex h-full flex-col gap-4">
	<div class="flex flex-row items-center justify-center text-5xl font-bold text-[#ff99cc]">
		KHỞI ĐỘNG
	</div>
	<div class="flex flex-row items-center justify-center gap-4">
		<div class="absolute left-0 self-end font-bold italic">Câu hỏi số {current}</div>
		<div class="text-4xl font-bold italic">SỐ CÂU ĐÚNG:</div>
		<div class="text-5xl font-bold text-[#ff0000]">
			{olympus.contestants.find((contestant) => contestant.username === username)?.right ??
				0}/{current}
		</div>
	</div>

	<div class="flex-1 bg-black px-1 text-3xl font-bold italic text-white">
		{question}
	</div>
	<div class="flex h-24 flex-row items-start justify-center">
		<button
			class="px-40 py-4 font-bold {olympus.contestants.find(
				(contestant) => contestant.username === username
			)?.button
				? 'bg-[#7f7f7f]'
				: 'bg-[#ff0000]'}"
			onclick={() => {
				socket.emit("kd bell")
			}}>GIÀNH QUYỀN TRẢ LỜI</button
		>
		<div class="time absolute left-[72%] text-6xl font-bold text-[#ff0000]">
			<span bind:this={time_element}></span>
		</div>
	</div>
</div>
