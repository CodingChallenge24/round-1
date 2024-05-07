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
	let current = 0

	// * State
	let question = $state("")

	// * Effect
	$effect(() =>
		untrack(() => {
			time_animation = new Animation(
				new KeyframeEffect(
					time_element,
					{ "--value": Array.from({ length: 61 }).map((_, i) => 60 - i) },
					{ duration: duration.vd_30_thuc_hanh }
				)
			)
		})
	)

	// * Socket
	socket.on("vd question", (vd) => {
		question = vd.question
	})

	socket.on("vd start", (time) => {
		time_animation.cancel()
		time_animation.currentTime = duration.vd_30_thuc_hanh - time * 1000
		time_animation.play()
	})

	socket.on("vd wrong", (bell) => {
		if (!bell) return
		time_animation.cancel()
		time_animation.currentTime = duration.vd_30_thuc_hanh - duration.vd_5s
		time_animation.play()
	})
</script>

<div class="fixed inset-0 m-4 flex h-full flex-col gap-4">
	<div class="flex flex-row items-center justify-center text-5xl font-bold text-[#ff99cc]">
		<div>VỀ ĐÍCH</div>

		<div class="time absolute right-[1%] text-6xl font-bold text-[#ff0000]">
			🕐<span bind:this={time_element}></span>
		</div>
	</div>

	<div class="flex flex-row items-center justify-center gap-4">
		<div class="absolute left-0 self-end font-bold italic">Câu hỏi số {current}</div>
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
				socket.emit("vd bell")
			}}>GIÀNH QUYỀN TRẢ LỜI</button
		>
	</div>
</div>
