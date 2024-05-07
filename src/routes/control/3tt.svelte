<script lang="ts">
	// * Import
	import { olympus, socket } from "$lib/client/const.svelte"
	import Control_Input from "$lib/client/control/input.svelte"
	import { warn } from "$lib/client/functions"
	import Name from "$lib/client/name.svelte"
	import { duration, type tt } from "$lib/types"
	import { untrack } from "svelte"

	const disabled = {
		show_question: false,
		start: true,
		show_answers: true,
		show_rights: true,
		opening: false
	}

	// * Let
	let questions: tt[] = []
	let time_element: HTMLSpanElement
	let time_animation: Animation

	// * State
	let id = $state(0)
	let question = $state<tt | undefined>(undefined)
	let answers = $state(["", "", "", ""])
	let timestamps = $state([
		Number.POSITIVE_INFINITY,
		Number.POSITIVE_INFINITY,
		Number.POSITIVE_INFINITY,
		Number.POSITIVE_INFINITY
	])
	let rights = $state({
		[olympus.contestants[0].username]: false,
		[olympus.contestants[1].username]: false,
		[olympus.contestants[2].username]: false,
		[olympus.contestants[3].username]: false
	})

	// * Effect
	$effect(() =>
		untrack(() => {
			time_animation = new Animation(
				new KeyframeEffect(
					time_element,
					{ "--value": Array.from({ length: 41 }).map((_, i) => 40 - i) },
					{ duration: duration.tt4 }
				)
			)
		})
	)

	// * Socket
	socket.on("questions", ({ tt }) => {
		questions = tt
		page()
	})

	socket.on("tt answer", (username, answer, timestamp) => {
		const index = olympus.contestants.findIndex((contestant) => contestant.username === username)
		rights[username] = false
		answers[index] = answer
		timestamps[index] = timestamp
	})

	socket.on("tt question", () => {
		time_animation.cancel()
		time_animation.currentTime = 40000 - (question?.time ?? 0) * 1000
	})

	socket.on("tt start", () => {
		time_animation.cancel()
		time_animation.currentTime = 40000 - (question?.time ?? 0) * 1000
		time_animation.play()
	})

	// * Function
	function page() {
		question = questions.find((question) => question.id === id)
	}
	function show_question(ev?: KeyboardEvent) {
		if (ev && ev.key !== "Enter") return
		if (!question) return alert("Question not found")
		if (disabled.show_question && !warn(disabled)) return
		disabled.show_question = true
		disabled.start = false
		socket.emit("tt question", id)
	}
</script>

<div class="peer">
	<Name />
</div>

<div class="invisible hover:visible peer-hover:visible">
	<Control_Input />
</div>

<div class="relative top-[12vh] -z-10 h-[8vh] w-full">
	{#each answers as answer, i}
		<button
			onclick={() => {
				rights[olympus.contestants[i].username] = !rights[olympus.contestants[i].username]
			}}
			class="btn absolute h-full w-[22.5%] {rights[olympus.contestants[i].username]
				? 'btn-success'
				: 'btn-error'} {i === 0
				? 'left-[1.25%]'
				: i === 1
					? 'left-[26.25%]'
					: i === 2
						? 'left-[51.25%]'
						: i === 3
							? 'left-[76.25%]'
							: 'hidden'}"
		>
			{#if timestamps[i] !== -1 && answers[i]}
				{((timestamps[i] ?? 0) / 1000).toFixed(2)}: {answer}
			{/if}
		</button>
	{/each}
</div>

<div class="absolute top-[20vh] flex h-[60vh] w-full flex-col items-center justify-center p-4">
	<div class="text-3xl {question?.question ? '' : 'text-error'}">{question?.question}</div>

	{#if question?.image}
		<img src={question.image} class="max-h-full min-h-0 min-w-0 max-w-full object-contain" alt="" />
	{/if}
	{#if question?.video}
		<video
			src={question.video}
			controls
			class="max-h-full min-h-0 min-w-0 max-w-full object-contain"><track kind="captions" /></video
		>
	{/if}
</div>

<div class="absolute top-[80vh] flex h-[10vh] w-full items-center justify-center gap-3">
	<button
		class="btn btn-outline"
		onclick={() => {
			if (disabled.opening && !warn(disabled)) return
			disabled.opening = true
			socket.emit("tt opening")
		}}>Opening</button
	>
	<div class="text-3xl">Câu hỏi</div>
	<input
		type="number"
		class="input w-20 {question?.question ? 'input-success' : 'input-error'}"
		bind:value={id}
		onchange={page}
		onkeydown={show_question}
	/>
	<button
		class="btn btn-primary"
		onclick={() => {
			if (disabled.start && !warn(disabled)) return
			disabled.start = true
			answers = ["", "", "", ""]
			timestamps = [
				Number.POSITIVE_INFINITY,
				Number.POSITIVE_INFINITY,
				Number.POSITIVE_INFINITY,
				Number.POSITIVE_INFINITY
			]
			rights = {
				[olympus.contestants[0].username]: false,
				[olympus.contestants[1].username]: false,
				[olympus.contestants[2].username]: false,
				[olympus.contestants[3].username]: false
			}
			socket.emit("tt start", question?.time ?? 0)
			socket.emit(
				"contestants",
				olympus.contestants.map((contestant) => ({ username: contestant.username, input: false }))
			)
			setTimeout(
				() => {
					socket.emit(
						"contestants",
						olympus.contestants.map((contestant) => ({
							username: contestant.username,
							input: true
						}))
					)
					disabled.show_answers = false
				},
				(question?.time ?? 0) * 1000
			)
		}}>Tính giờ</button
	>
	<div class="time text-3xl font-bold text-[#ff0000]">
		<span bind:this={time_element}></span>
	</div>
	<button
		class="btn btn-primary"
		onclick={() => {
			if (disabled.show_answers && !warn(disabled)) return
			disabled.show_answers = true
			disabled.show_rights = false
			socket.emit("tt answers")
		}}>Hiện trả lời</button
	>
	<button
		class="btn btn-primary"
		onclick={() => {
			if (disabled.show_rights && !warn(disabled)) return
			disabled.show_rights = true
			disabled.show_question = false
			socket.emit("tt rights", rights)

			let arr = []

			for (let i = 0; i < timestamps.length; i += 1) {
				if (
					timestamps[i] === Number.POSITIVE_INFINITY ||
					answers[i] === "" ||
					!rights[olympus.contestants[i].username]
				)
					continue
				arr.push({
					username: olympus.contestants[i].username,
					timestamp: Math.round(timestamps[i] / 10),
					score: olympus.contestants[i].score
				})
			}

			arr = arr.sort((a, b) => a.timestamp - b.timestamp)

			let previous = -1
			let score = 50

			for (let i = 0; i < arr.length; i += 1) {
				if (arr[i].timestamp > previous) {
					score -= 10
					previous = arr[i].timestamp
				}
				arr[i].score += score
			}

			socket.emit(
				"contestants",
				arr.map((contestant) => ({
					username: contestant.username,
					score: contestant.score
				}))
			)
		}}>Show right/wrong</button
	>
</div>
