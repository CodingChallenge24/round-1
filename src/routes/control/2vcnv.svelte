<script lang="ts">
	// * Import
	import { olympus, socket } from "$lib/client/const.svelte"
	import Control_Button from "$lib/client/control/button.svelte"
	import Control_Input from "$lib/client/control/input.svelte"
	import { warn } from "$lib/client/functions"
	import Name from "$lib/client/name.svelte"
	import { duration, type vcnv } from "$lib/types"
	import { untrack } from "svelte"

	// * Const
	const disabled = {
		opening: false,
		show_cnv: false,
		pick: true,
		show_question: true,
		start: true,
		show_answers: true,
		show_rights: true
	}

	// * Let
	let clues: [boolean, boolean, boolean, boolean, boolean] = $state([
		false,
		false,
		false,
		false,
		false
	])
	let questions: vcnv[] = []
	let time_element: HTMLSpanElement
	let time_animation: Animation
	let already: number[] = []

	// * State
	let id = $state(0)
	let sub_id = $state(0)
	let question = $state<vcnv | undefined>(undefined)
	let answers = $state(["", "", "", ""])
	let rights = $state({
		[olympus.contestants[0].username]: false,
		[olympus.contestants[1].username]: false,
		[olympus.contestants[2].username]: false,
		[olympus.contestants[3].username]: false
	})
	let score = $state(60)

	// * Effect
	$effect(() =>
		untrack(() => {
			time_animation = new Animation(
				new KeyframeEffect(
					time_element,
					{ "--value": Array.from({ length: 16 }).map((_, i) => 15 - i) },
					{ duration: duration.vcnv }
				)
			)
		})
	)

	// * Socket
	socket.on("questions", ({ vcnv }) => {
		questions = vcnv
		page()
	})
	socket.on("vcnv bell", (contestant) => {
		socket.emit("contestants", [{ username: contestant, button: true }])
	})
	function page() {
		question = questions.find((question) => question.id === id)
	}
	function show_question(ev?: KeyboardEvent) {
		if (ev && ev.key !== "Enter") return
		if (!question) return alert("Question not found")
		if (disabled.show_cnv && !warn(disabled)) return
		disabled.show_cnv = true
		disabled.pick = false
		socket.emit("vcnv question", id, sub_id)

		socket.emit(
			"contestants",
			olympus.contestants.map((contestant) => ({ username: contestant.username, button: false }))
		)
	}

	socket.on("vcnv question", () => {
		time_animation.cancel()
		time_animation.currentTime = 0
	})

	socket.on("vcnv start", () => {
		time_animation.cancel()
		time_animation.play()
	})

	socket.on("vcnv answer", (username, answer) => {
		const index = olympus.contestants.findIndex((contestant) => contestant.username === username)
		rights[username] = false
		answers[index] = answer
	})
</script>

<div class="peer">
	<Name />
</div>

<div class="invisible hover:visible peer-hover:visible">
	<Control_Button />
	<Control_Input />
</div>

<div class="relative top-[12vh] -z-10 h-[8vh] w-full">
	{#each answers as answer, i}
		<button
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
			onclick={() => {
				rights[olympus.contestants[i].username] = !rights[olympus.contestants[i].username]
			}}
		>
			{answer}
		</button>
	{/each}
</div>

<div
	class="absolute top-[20vh] flex h-[70vh] w-full flex-col items-center justify-center gap-4 p-4"
>
	<div class="flex w-full flex-1 flex-row pb-1 text-3xl">
		<div>
			CNV: {question?.solution}
			<br />
			Gợi ý:
			{#each question?.clues ?? [] as c, i}
				| {i + 1}: {c} |
			{/each}
			<br />
			Câu hỏi:
			{#each question?.questions ?? [] as q, i}
				| {i + 1}: {q} |
			{/each}
			Audio: {#each question?.audios ?? [] as audio, i}
				{#if audio}
					| {i + 1}: <audio src={audio} controls></audio> |
				{/if}
			{/each}
		</div>
		<div class="relative aspect-[1822/1125] h-full">
			<div class="absolute h-1/2 w-1/2 bg-base-100">
				{#if question?.images[0]}
					<img class="h-full w-full" src={question?.images[0]} alt="" />
				{:else}
					<div
						class="flex h-full w-full items-center border border-primary pl-[25%] text-7xl font-bold"
					>
						1
					</div>
				{/if}
			</div>
			<div class="absolute left-1/2 h-1/2 w-1/2 bg-base-100">
				{#if question?.images[1]}
					<img class="h-full w-full" src={question?.images[1]} alt="" />
				{:else}
					<div
						class="flex h-full w-full items-center border border-primary pl-[65%] text-7xl font-bold"
					>
						2
					</div>
				{/if}
			</div>
			<div class="absolute left-1/2 top-1/2 h-1/2 w-1/2 bg-base-100">
				{#if question?.images[2]}
					<img class="h-full w-full" src={question?.images[2]} alt="" />
				{:else}
					<div
						class="flex h-full w-full items-center border border-primary pl-[65%] text-7xl font-bold"
					>
						3
					</div>
				{/if}
			</div>
			<div class="absolute top-1/2 h-1/2 w-1/2 bg-base-100">
				{#if question?.images[3]}
					<img class="h-full w-full" src={question?.images[3]} alt="" />
				{:else}
					<div
						class="flex h-full w-full items-center border border-primary pl-[25%] text-7xl font-bold"
					>
						4
					</div>
				{/if}
			</div>
			<div class="absolute left-[27%] top-[28%] h-[44%] w-[46%] bg-base-100">
				{#if question?.images[4]}
					<img class="h-full w-full" src={question?.images[4]} alt="" />
				{:else}
					<div
						class="flex h-full w-full items-center justify-center border border-primary text-7xl font-bold"
					>
						5
					</div>
				{/if}
			</div>
		</div>
	</div>

	<div class="flex items-center justify-center gap-3">
		<button
			class="btn btn-outline"
			onclick={() => {
				if (disabled.opening && !warn(disabled)) return
				disabled.opening = true
				socket.emit("vcnv opening")
			}}>Opening</button
		>
		<button
			class="btn btn-outline"
			onclick={() => {
				if (disabled.show_rights && !warn(disabled)) return
				disabled.show_rights = true
				disabled.pick = false
				socket.emit(
					"contestants",
					olympus.contestants.map((contestant) => ({
						username: contestant.username,
						score: contestant.score + (rights[contestant.username] ? 10 : 0)
					}))
				)
				socket.emit("vcnv rights", rights)
			}}>Show right/wrong</button
		>
		<button
			disabled={!olympus.bells.length}
			class="btn btn-error"
			onclick={() => {
				socket.emit("vcnv wrong")
			}}>Wrong</button
		>
		<div>Điểm:</div>
		<input type="number" step="5" min="0" max="60" class="input input-primary" bind:value={score} />
		<button
			disabled={!olympus.bells.length}
			class="btn btn-success"
			onclick={() => {
				socket.emit("vcnv right")
				const contestant = olympus.contestants[olympus.bells[0]]
				if (!contestant) return
				socket.emit("contestants", [
					{ username: contestant.username, score: contestant.score + score }
				])
			}}>Right</button
		>
	</div>

	<div class="flex items-center justify-center gap-3">
		<div class="text-3xl">CNV:</div>
		<input
			type="number"
			class="input input-primary w-20"
			bind:value={id}
			onchange={page}
			onkeydown={show_question}
		/>
		<div class="text-3xl">Gợi ý:</div>
		<select
			class="select select-primary"
			bind:value={sub_id}
			onpointerdown={() => {
				if (disabled.pick && warn(disabled)) disabled.pick = false
			}}
			onchange={() => {
				if (sub_id === olympus.bells[0]) return
				socket.emit("vcnv pick", sub_id)
				disabled.pick = true
				disabled.show_question = false
			}}
		>
			<option disabled value={0}></option>
			<option value={1}>1</option>
			<option value={2}>2</option>
			<option value={3}>3</option>
			<option value={4}>4</option>
			<option value={5}>5</option>
		</select>
		<button
			class="btn btn-primary"
			onclick={() => {
				if (disabled.show_question && !warn(disabled)) return
				disabled.show_question = true
				disabled.start = false
				socket.emit("vcnv question", id, sub_id)
				if (already.includes(sub_id)) return
				already.push(sub_id)
				if (already.length > 1) score -= 10 // Before second question still 60
			}}>Mở câu hỏi</button
		>
		<button
			class="btn btn-primary"
			onclick={() => {
				socket.emit("vcnv play")
			}}>▶️</button
		>
		<button
			class="btn btn-primary"
			onclick={() => {
				if (disabled.start && !warn(disabled)) return
				disabled.start = true

				socket.emit("vcnv start")
				answers = ["", "", "", ""]
				rights = {
					[olympus.contestants[0].username]: false,
					[olympus.contestants[1].username]: false,
					[olympus.contestants[2].username]: false,
					[olympus.contestants[3].username]: false
				}

				setTimeout(() => {
					socket.emit(
						"contestants",
						olympus.contestants.map((contestant) => ({
							username: contestant.username,
							input: true
						}))
					)
					disabled.show_answers = false
				}, duration.vcnv)
				socket.emit(
					"contestants",
					olympus.contestants.map((contestant) => ({
						username: contestant.username,
						input: contestant.button
					}))
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
				socket.emit("vcnv answers")
			}}>Hiện trả lời</button
		>
		<div class="text-3xl">Mở gợi ý:</div>
		{#each [0, 1, 2, 3, 4] as clue_id}
			<div>{clue_id + 1}</div>
			<input
				type="checkbox"
				class="checkbox-primary checkbox checkbox-lg"
				bind:checked={clues[clue_id]}
				onchange={async () => {
					if (clues[clue_id] && !warn(disabled)) return (clues[clue_id] = false)
					socket.emit("vcnv clues", clues)
				}}
			/>
		{/each}
	</div>
</div>
