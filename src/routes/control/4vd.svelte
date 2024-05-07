<script lang="ts">
	// * Import
	import { olympus, socket } from "$lib/client/const.svelte"
	import Control_Button from "$lib/client/control/button.svelte"
	import Control_Star from "$lib/client/control/star.svelte"
	import { warn } from "$lib/client/functions"
	import Name from "$lib/client/name.svelte"
	import { duration, type vd } from "$lib/types"
	import { untrack } from "svelte"

	const disabled = {
		opening: false,
		begin: false,
		end: false,
		show_pack: false,
		pick: true,
		star: true,
		show_question: true,
		time: true,
		thuc_hanh: true,
		start: true,
		bell: true,
		right: true,
		wrong: true
	}

	// * Let
	let questions: vd[] = []
	let time_element: HTMLSpanElement
	let time_animation: Animation

	// * State
	let id = $state(0)
	let question = $state<vd | undefined>(undefined)
	let time = $state<15 | 20 | 30 | 40 | 60 | 0>(0)
	let picks = $state<number[]>([])
	let thuc_hanh = $state<undefined | boolean>(undefined)
	let star = $state<undefined | boolean>(undefined)

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

	$effect(() => {
		olympus.current
		untrack(() => {
			update_current()
		})
	})

	$effect(() => {
		socket.emit("vd picks", [
			[picks[0] === 20, picks[1] === 20, picks[2] === 20],
			[picks[0] === 30, picks[1] === 30, picks[2] === 30]
		])
	})

	// * Socket
	socket.on("questions", ({ vd }) => {
		questions = vd
		page()
	})
	socket.on("vd bell", () => {
		socket.emit(
			"contestants",
			olympus.contestants.map((contestant) => ({ username: contestant.username, button: true }))
		)
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

	// * Function
	function page() {
		question = questions.find((question) => question.id === id)
	}
	function show_question(ev?: KeyboardEvent) {
		if (ev && ev.key !== "Enter") return
		if (!question) return alert("Question not found")
		if (star === undefined) return alert("Please select star")
		if (disabled.show_question && !warn(disabled)) return
		disabled.show_question = true
		disabled.time = false
		socket.emit("vd question", id, star)
		time = 0
		thuc_hanh = undefined
	}

	function update_current() {
		socket.emit("vd current", olympus.contestants[olympus.current]?.username ?? "")
	}
</script>

<div class="peer">
	<Name />
</div>

<div class="invisible hover:visible peer-hover:visible">
	<Control_Button />
	<Control_Star />

	<div
		class="absolute left-[9.5%] top-[2.78%] z-10 flex h-[8.33%] w-[8%] items-center gap-2 bg-base-100 px-3"
	>
		<input
			type="radio"
			name="radio"
			class="radio {olympus.current === 0 ? 'radio-success' : 'radio-primary'}"
			bind:group={olympus.current}
			onclick={() => {}}
			value={0}
		/>
	</div>

	<div
		class="absolute left-[34.5%] top-[2.78%] z-10 flex h-[8.33%] w-[8%] items-center gap-2 bg-base-100 px-3"
	>
		<input
			type="radio"
			name="radio"
			class="radio {olympus.current === 1 ? 'radio-success' : 'radio-primary'}"
			bind:group={olympus.current}
			onclick={() => {}}
			value={1}
		/>
	</div>
	<div
		class="absolute left-[59.5%] top-[2.78%] z-10 flex h-[8.33%] w-[8%] items-center gap-2 bg-base-100 px-3"
	>
		<input
			type="radio"
			name="radio"
			class="radio {olympus.current === 2 ? 'radio-success' : 'radio-primary'}"
			bind:group={olympus.current}
			onclick={() => {}}
			value={2}
		/>
	</div>
	<div
		class="absolute left-[84.5%] top-[2.78%] z-10 flex h-[8.33%] w-[8%] items-center gap-2 bg-base-100 px-3"
	>
		<input
			type="radio"
			name="radio"
			class="radio {olympus.current === 3 ? 'radio-success' : 'radio-primary'}"
			bind:group={olympus.current}
			onclick={() => {}}
			value={3}
		/>
	</div>
</div>

<div class="absolute top-[20vh] flex h-[50vh] w-full flex-col items-center justify-center p-4">
	<div class="text-3xl {question?.question ? '' : 'text-error'}">
		Điểm: {question?.score} - Thực hành: {!!question?.thuc_hanh}
		<br />
		{question?.question}
	</div>

	{#if question?.video}
		<video
			src={question.video}
			controls
			class="max-h-full min-h-0 min-w-0 max-w-full object-contain"><track kind="captions" /></video
		>
	{/if}
</div>

<div
	class="absolute top-[70vh] flex h-[10vh] w-full flex-row items-center justify-center gap-8 p-4"
>
	<div class="flex flex-row gap-3">
		<button
			class="btn btn-outline"
			onclick={() => {
				if (disabled.opening && !warn(disabled)) return
				disabled.opening = true
				socket.emit("vd opening")
			}}>Opening</button
		>
		<button
			class="btn btn-outline"
			onclick={() => {
				if (disabled.begin && !warn(disabled)) return
				disabled.begin = true
				socket.emit("vd begin")
			}}>Begin</button
		>
		<button
			class="btn btn-outline"
			onclick={() => {
				if (disabled.end && !warn(disabled)) return
				disabled.end = true
				socket.emit("vd end")
			}}>End</button
		>
		<button
			class="btn btn-primary"
			onclick={() => {
				if (disabled.show_pack && !warn(disabled)) return
				disabled.show_pack = true
				disabled.pick = false
				socket.emit("vd pack")
			}}>Show Pack</button
		>
	</div>

	{#each [0, 1, 2] as id}
		<div class="flex flex-row gap-4">
			{id + 1}.
			{#each [20, 30] as jd}
				<div class="flex flex-row gap-1">
					<input
						type="radio"
						name="pick{id}"
						id="pick{id}{jd}"
						class="radio-primary radio"
						bind:group={picks[id]}
						value={jd}
						onpointerdown={() => {
							if (disabled.pick && warn(disabled)) return (disabled.pick = false)
							disabled.star = false
						}}
					/>
					<label for="pick{id}{jd}">{jd}</label>
				</div>
			{/each}
		</div>
	{/each}
	<button
		class="btn btn-error"
		onclick={() => {
			picks = []
			socket.emit("vd picks", [
				[false, false, false],
				[false, false, false]
			])
		}}>Clear</button
	>
</div>

<div class="absolute top-[80vh] flex h-[10vh] w-full flex-col items-center justify-center p-4">
	<div class="flex items-center justify-center gap-3">
		<select
			class="select select-primary {star === undefined
				? 'text-error'
				: star
					? 'text-bell'
					: 'text-base-content'}"
			bind:value={star}
			onpointerdown={() => {
				if (disabled.star && warn(disabled)) return (disabled.star = false)
			}}
			onchange={() => {
				disabled.pick = true
				disabled.star = true
				disabled.show_question = false
			}}
		>
			<option disabled value={undefined}>NSHV?</option>
			<option value={false} class="text-base-content">0 NSHV</option>
			<option value={true} class="text-bell">Có NSHV</option>
		</select>
		<div class="text-3xl">Câu hỏi</div>
		<input
			type="number"
			class="input w-20 {question?.question ? 'input-success' : 'input-error'}"
			disabled={star === undefined}
			bind:value={id}
			onchange={page}
			onkeydown={show_question}
		/>
		<button
			class="btn btn-primary"
			onclick={() => {
				socket.emit("vd play")
			}}>▶️</button
		>
		<select
			class="select select-primary {time === 0 ? 'text-error' : ''}"
			bind:value={time}
			onpointerdown={() => {
				if (disabled.time && warn(disabled)) return (disabled.time = false)
			}}
			onchange={() => {
				disabled.time = true
				disabled.thuc_hanh = false
			}}
		>
			<option disabled value={0}>Thời gian</option>
			<option class="text-base-content" value={15}>15 giây</option>
			<option class="text-base-content" value={20}>20 giây</option>
			<option class="text-base-content" value={30}>30 giây</option>
			<option class="text-base-content" value={40}>40 giây</option>
			<option class="text-base-content" value={60}>60 giây</option>
		</select>
		<select
			class="select select-primary {thuc_hanh === undefined ? 'text-error' : ''}"
			bind:value={thuc_hanh}
			onpointerdown={() => {
				if (disabled.thuc_hanh && warn(disabled)) return (disabled.thuc_hanh = false)
			}}
			onchange={() => {
				disabled.thuc_hanh = true
				disabled.start = false
			}}
		>
			<option disabled value={undefined}>Thực hành?</option>
			<option class="text-base-content" value={false}>0 Thực hành</option>
			<option class="text-base-content" value={true}>Có Thực hành</option>
		</select>
		<button
			class="btn btn-primary"
			disabled={time === 0 || thuc_hanh === undefined}
			onclick={() => {
				if (time === 0) return alert("Please select time")
				if (thuc_hanh === undefined) return alert("Please select thuc hanh")
				if (disabled.start && !warn(disabled)) return
				disabled.start = true
				socket.emit("vd start", time, thuc_hanh)

				setTimeout(() => {
					disabled.bell = false
					disabled.right = false
				}, time)
			}}>Tính giờ</button
		>
		<div class="time text-3xl font-bold text-[#ff0000]">
			<span bind:this={time_element}></span>
		</div>

		<button
			class="btn-bell btn"
			onclick={() => {
				if (disabled.bell && !warn(disabled)) return
				disabled.bell = true
				disabled.right = false
				disabled.wrong = false

				socket.emit(
					"contestants",
					olympus.contestants.map((contestant, i) =>
						i === olympus.current ? contestant : { username: contestant.username, button: false }
					)
				)
				setTimeout(() => {
					socket.emit(
						"contestants",
						olympus.contestants.map((contestant, i) => ({
							username: contestant.username,
							button: true
						}))
					)
				}, duration.vd_5s)

				socket.emit("vd wrong", true)

				if (star) {
					const contestant = olympus.contestants[olympus.current]
					socket.emit("contestants", [
						{ username: contestant.username, score: contestant.score - (question?.score ?? 0) }
					])
				}
			}}>Mở chuông</button
		>
		<button
			disabled={star === undefined}
			class="btn btn-success"
			onclick={() => {
				if (disabled.right && !warn(disabled)) return
				disabled.bell = true
				disabled.right = true
				disabled.wrong = true
				disabled.star = false

				socket.emit("vd right")
				if (olympus.bells[0] !== undefined) {
					const beller = olympus.contestants[olympus.bells[0]]
					const contestant = olympus.contestants[olympus.current]

					socket.emit("contestants", [
						{
							username: beller.username,
							score: beller.score + (question?.score ?? 0)
						},
						{
							username: contestant.username,
							score: contestant.score - (!star && question?.score ? question.score : 0)
						}
					])
				} else {
					const contestant = olympus.contestants[olympus.current]
					socket.emit("contestants", [
						{
							username: contestant.username,
							score: contestant.score + (star ? 2 : 1) * (question?.score ?? 0)
						}
					])
				}
				star = undefined
			}}>Đúng</button
		>
		<button
			disabled={star === undefined}
			class="btn btn-error"
			onclick={() => {
				if (disabled.wrong && !warn(disabled)) return
				disabled.bell = true
				disabled.right = true
				disabled.wrong = true
				disabled.star = false

				socket.emit("vd wrong", false)

				if (olympus.bells[0] !== undefined) {
					const beller = olympus.contestants[olympus.bells[0]]
					socket.emit("contestants", [
						{ username: beller.username, score: beller.score - (question?.score ?? 0) / 2 }
					])
				}

				star = undefined
			}}>Sai</button
		>
	</div>
</div>
