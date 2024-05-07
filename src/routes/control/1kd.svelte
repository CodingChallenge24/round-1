<script lang="ts">
	// * Import
	import { olympus, socket } from "$lib/client/const.svelte"
	import Control_Button from "$lib/client/control/button.svelte"
	import { warn } from "$lib/client/functions"
	import Name from "$lib/client/name.svelte"
	import { duration, type kd } from "$lib/types"
	import { untrack } from "svelte"

	// * Const
	const disabled = {
		show_question: false,
		start: true,
		opening: false,
		prestart: false,
		prestart_question: false,
		finish: false,
		solution: false
	}

	// * Let
	let questions: kd[] = []
	let time_element: HTMLSpanElement
	let time_animation: Animation

	// * State
	let id = $state(0)
	let fake_id = $state(0)
	let question = $state<kd | undefined>(undefined)
	let scored = $state(true)
	let auto_enable_bell = $state(false)
	let auto_enable_bell_after = $state(0)

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

	$effect(() => {
		socket.emit("kd current", olympus.contestants[olympus.current]?.username ?? "")
	})

	// * Socket
	socket.on("questions", ({ kd }) => {
		questions = kd
		page()
	})
	socket.on("kd bell", () => {
		socket.emit(
			"contestants",
			olympus.contestants.map((contestant) => ({ username: contestant.username, button: true }))
		)
	})
	function page() {
		question = questions.find((question) => question.id === id)
	}
	function show_question(ev?: KeyboardEvent) {
		ev?.stopPropagation()
		if (ev && ev.key !== "Enter") return
		if (
			disabled.show_question &&
			!warn(disabled, "Hiện lại câu hỏi mở lại chuông, để không mở lại chuông chạy lại thời gian")
		)
			return
		if (!question) return alert("Question not found")
		disabled.start = false
		disabled.show_question = true
		socket.emit("kd question", id)
		socket.emit("kd id", fake_id)
		scored = false
		if (!auto_enable_bell) return
		setTimeout(() => {
			socket.emit(
				"contestants",
				olympus.contestants.map((contestant) => ({
					username: contestant.username,
					button: false
				}))
			)
		}, auto_enable_bell_after * 1000)
	}

	socket.on("kd question", () => {
		time_animation.cancel()
		time_animation.currentTime = 0
	})

	socket.on("kd start", () => {
		time_animation.cancel()
		time_animation.play()
	})

	socket.on("title", () => document.removeEventListener("keydown", keybinds))
	socket.on("kd", () => document.addEventListener("keydown", keybinds))
	socket.on("vcnv", () => document.removeEventListener("keydown", keybinds))
	socket.on("tt", () => document.removeEventListener("keydown", keybinds))
	socket.on("vd", () => document.removeEventListener("keydown", keybinds))

	function keybinds(ev: KeyboardEvent) {
		switch (ev.key) {
			case "ArrowRight":
				next()
				break
			case "ArrowDown":
				wrong()
				break
			case "ArrowUp":
				right()
				break
			case " ":
				start()
				break
		}
	}

	function next() {
		id += 1
		fake_id += 1
		page()
		show_question()
	}

	function wrong() {
		scored = true
		socket.emit("kd wrong")

		disabled.solution = false
		disabled.show_question = false

		const contestant = olympus.contestants[olympus.bells[0]]
		if (!contestant) return
		socket.emit("contestants", [{ username: contestant.username, score: contestant.score - 5 }])
	}

	function right() {
		disabled.solution = false
		disabled.show_question = false

		const contestant = olympus.contestants[olympus.bells[0] ?? olympus.current]
		if (!contestant) return

		socket.emit("contestants", [
			{
				username: contestant.username,
				score: contestant.score + 10,
				right: (contestant.right += 1)
			}
		])
		scored = true
		socket.emit("kd right")
	}

	function start() {
		if (disabled.start && !warn(disabled)) return
		disabled.start = true
		socket.emit("kd start")
		setTimeout(() => {
			disabled.solution = false
			disabled.show_question = false
			socket.emit(
				"contestants",
				olympus.contestants.map((contestant) => ({
					username: contestant.username,
					button: true
				}))
			)
		}, duration.kd)
	}
</script>

<div class="peer">
	<Name />
</div>

<div class="invisible hover:visible peer-hover:visible">
	<Control_Button />

	<div
		class="absolute left-[9.5%] top-[2.78%] flex h-[8.33%] w-[8%] flex-row items-center justify-center bg-base-100"
	>
		<input
			type="number"
			class="input input-primary w-1/2 px-1 text-right text-xl"
			bind:value={olympus.contestants[0].right}
			onkeydown={(ev) => {
				if (ev.key !== "Enter") return
				socket.emit("contestants", olympus.contestants)
			}}
		/>
		<div class="flex w-1/2 items-center justify-center">
			<input
				type="radio"
				name="current"
				class="radio-primary radio"
				value={0}
				bind:group={olympus.current}
				onclick={() => {
					if (olympus.current === 0) olympus.current = -1
				}}
			/>
		</div>
	</div>

	<div
		class="absolute left-[34.5%] top-[2.78%] flex h-[8.33%] w-[8%] flex-row items-center justify-center bg-base-100"
	>
		<input
			type="number"
			class="input input-primary w-1/2 px-1 text-right text-xl"
			bind:value={olympus.contestants[1].right}
			onkeydown={(ev) => {
				if (ev.key !== "Enter") return
				socket.emit("contestants", olympus.contestants)
			}}
		/>
		<div class="flex w-1/2 items-center justify-center">
			<input
				type="radio"
				name="current"
				class="radio-primary radio"
				value={1}
				bind:group={olympus.current}
				onclick={() => {
					if (olympus.current === 1) olympus.current = -1
				}}
			/>
		</div>
	</div>

	<div
		class="absolute left-[59.5%] top-[2.78%] flex h-[8.33%] w-[8%] flex-row items-center justify-center bg-base-100"
	>
		<input
			type="number"
			class="input input-primary w-1/2 px-1 text-right text-xl"
			bind:value={olympus.contestants[2].right}
			onkeydown={(ev) => {
				if (ev.key !== "Enter") return
				socket.emit("contestants", olympus.contestants)
			}}
		/>
		<div class="flex w-1/2 items-center justify-center">
			<input
				type="radio"
				name="current"
				class="radio-primary radio"
				value={2}
				bind:group={olympus.current}
				onclick={() => {
					if (olympus.current === 2) olympus.current = -1
				}}
			/>
		</div>
	</div>

	<div
		class="absolute left-[84.5%] top-[2.78%] flex h-[8.33%] w-[8%] flex-row items-center justify-center bg-base-100"
	>
		<input
			type="number"
			class="input input-primary w-1/2 px-1 text-right text-xl"
			bind:value={olympus.contestants[3].right}
			onkeydown={(ev) => {
				if (ev.key !== "Enter") return
				socket.emit("contestants", olympus.contestants)
			}}
		/>
		<div class="flex w-1/2 items-center justify-center">
			<input
				type="radio"
				name="current"
				class="radio-primary radio"
				value={3}
				bind:group={olympus.current}
				onclick={() => {
					if (olympus.current === 3) olympus.current = -1
				}}
			/>
		</div>
	</div>
</div>

<div class="absolute top-[20vh] flex h-[50vh] w-full flex-col items-center justify-center p-4">
	<div class="text-3xl {question?.question ? '' : 'text-error'}">{question?.question}</div>

	{#if question?.audio}
		<audio src={question.audio} controls></audio>
	{/if}
</div>

<div
	class="absolute top-[70vh] flex h-[10vh] w-full flex-row items-center justify-center gap-4 p-4"
>
	<button
		onkeydown={(ev) => ev.stopPropagation()}
		class="btn btn-outline"
		onclick={() => {
			if (disabled.opening && !warn(disabled)) return
			disabled.opening = true
			socket.emit("kd opening")
		}}>Opening</button
	>
	<button
		onkeydown={(ev) => ev.stopPropagation()}
		class="btn btn-outline"
		onclick={() => {
			if (disabled.prestart && !warn(disabled)) return
			disabled.prestart = true
			socket.emit("kd prestart")
		}}
	>
		Prestart
	</button>
	<button
		onkeydown={(ev) => ev.stopPropagation()}
		class="btn btn-outline"
		onclick={() => {
			if (disabled.prestart_question && !warn(disabled)) return
			disabled.prestart_question = true
			socket.emit("kd prestart question")
		}}
	>
		Prestart Question
	</button>
	<button
		onkeydown={(ev) => ev.stopPropagation()}
		class="btn btn-outline"
		onclick={() => {
			if (disabled.finish && !warn(disabled)) return
			disabled.finish = true
			socket.emit("kd finish")
		}}>Finish</button
	>
	<button
		onkeydown={(ev) => ev.stopPropagation()}
		class="btn btn-error"
		onclick={() => {
			if (!question?.solution) return alert("SOLUTION IS UNDEFINED")
			if (disabled.solution && !warn(disabled)) return
			disabled.solution = true
			disabled.show_question = false
			socket.emit("kd solution", question?.solution)
		}}>Show Solution</button
	>
</div>

<div class="absolute top-[80vh] flex h-[10vh] w-full flex-col items-center justify-center p-4">
	<div class="flex items-center justify-center gap-3">
		<div>Câu hỏi</div>
		<input
			type="number"
			class="input {question?.question ? 'input-success' : 'input-error'}"
			bind:value={id}
			onchange={page}
			onkeydown={show_question}
			min="-9"
			max="99"
		/>
		<button onkeydown={(ev) => ev.stopPropagation()} class="btn btn-success" onclick={next}
			>+1</button
		>
		<div>Mở chuông</div>
		<input
			onkeydown={(ev) => ev.stopPropagation()}
			type="checkbox"
			bind:checked={auto_enable_bell}
			class="toggle-bell toggle"
		/>
		<div>Mở chuông sau (giây)</div>
		<input
			onkeydown={(ev) => ev.stopPropagation()}
			disabled={!auto_enable_bell}
			type="number"
			bind:value={auto_enable_bell_after}
			class="input input-primary"
			min="0"
			max="9"
		/>
		<button onkeydown={(ev) => ev.stopPropagation()} class="btn btn-primary" onclick={start}
			>Tính giờ</button
		>
		<button
			onkeydown={(ev) => ev.stopPropagation()}
			class="btn btn-success"
			disabled={scored || (olympus.bells[0] === undefined && olympus.current === -1)}
			onclick={right}>Đúng</button
		>
		<button
			onkeydown={(ev) => ev.stopPropagation()}
			class="btn btn-error"
			disabled={scored ||
				(olympus.bells[0] === undefined && olympus.current === -1 && !auto_enable_bell)}
			onclick={wrong}>Sai</button
		>

		<div class="time text-3xl font-bold text-[#ff0000]">
			<span bind:this={time_element}></span>
		</div>
		<div>Fake ID:</div>
		<input
			type="number"
			class="input input-primary"
			bind:value={fake_id}
			onkeydown={() => {
				socket.emit("kd id", fake_id)
			}}
			min="-9"
			max="99"
		/>
		<button
			onkeydown={(ev) => ev.stopPropagation()}
			class="btn btn-error"
			onclick={() => {
				fake_id = 0
				socket.emit("kd id", fake_id)
				socket.emit(
					"contestants",
					olympus.contestants.map((contestant) => ({
						username: contestant.username,
						right: 0
					}))
				)
			}}>Reset</button
		>
	</div>
</div>
