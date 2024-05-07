<script lang="ts">
	// * Import
	import { olympus, socket } from "$lib/client/const.svelte"
	import { duration, type vd } from "$lib/types"
	import { untrack } from "svelte"
	import { play } from "./audio.svelte"

	// * Let
	let video: HTMLVideoElement | undefined
	let progress_bar_element: HTMLDivElement
	let container_element: HTMLDivElement
	let circle_element: SVGCircleElement
	let progress_bar_animation: Animation
	let container_animation: Animation
	let circle_animation: Animation

	// * State
	let question = $state<vd | undefined>(undefined)
	let ticks = $state([
		[false, false, false],
		[false, false, false]
	])
	let star = $state(false)
	let view = $state<"question" | "video" | "pick">("question")

	// * Effect
	$effect(() =>
		untrack(() => {
			progress_bar_animation = new Animation(
				new KeyframeEffect(
					progress_bar_element,
					{ width: ["0%", "95%"] },
					{ duration: duration.vd_30_diem, fill: "both" }
				)
			)
			container_animation = new Animation(
				new KeyframeEffect(
					container_element,
					{ left: ["3%", "98%"] },
					{ duration: duration.vd_30_diem, fill: "both" }
				)
			)
			circle_animation = new Animation(
				new KeyframeEffect(
					circle_element,
					{ r: ["25px", "50px"] },
					{
						duration: 1000,
						iterations: 20,
						direction: "alternate",
						fill: "both",
						easing: "ease-in-out"
					}
				)
			)
		})
	)

	// * Socket
	socket.on("vd question", (vd, st) => {
		star = st
		play(star ? "vd/star" : "vd/question")
		question = vd
		view = "question"

		if (progress_bar_animation.playbackRate !== -20) {
			progress_bar_animation.playbackRate = -20
			progress_bar_animation.play()
		}
		if (container_animation.playbackRate !== -20) {
			container_animation.playbackRate = -20
			container_animation.play()
		}
		if (circle_animation.playbackRate !== -20) {
			circle_animation.playbackRate = -20
			circle_animation.play()
		}
	})

	socket.on("vd play", () => {
		if (video) {
			video.play()
			view = "video"
		}
	})

	socket.on("vd start", (dur, thuc_hanh) => {
		view = "question"

		play(
			dur === 20
				? thuc_hanh
					? "vd/20-1"
					: "vd/20-0"
				: dur === 15
					? "vd/15"
					: dur === 30
						? "vd/30"
						: dur === 40
							? "vd/40"
							: dur === 60
								? "vd/60"
								: undefined
		)

		// if (thuc_hanh) {
		// } else {
		progress_bar_animation.playbackRate = duration.vd_30_diem / dur / 1000
		progress_bar_animation.cancel()
		progress_bar_animation.play()
		container_animation.playbackRate = duration.vd_30_diem / dur / 1000
		container_animation.cancel()
		container_animation.play()
		circle_animation.effect?.updateTiming({ iterations: dur })
		circle_animation.playbackRate = 1
		circle_animation.cancel()
		circle_animation.play()
		// }
	})

	socket.on("vd bell", () => {
		play("vd/bell")
	})

	socket.on("vd current", (username) => {
		olympus.current = olympus.contestants.findIndex(
			(contestant) => contestant.username === username
		)
	})

	socket.on("vd picks", (picks) => {
		ticks = picks
		if (!picks.some((picks) => picks.some((pick) => pick))) return
		play("vd/choose")
	})

	socket.on("vd wrong", (bell) => {
		if (bell) {
			play("vd/5")

			progress_bar_animation.playbackRate = duration.vd_30_diem / duration.vd_5s
			progress_bar_animation.cancel()
			progress_bar_animation.play()
			container_animation.playbackRate = duration.vd_30_diem / duration.vd_5s
			container_animation.cancel()
			container_animation.play()
			circle_animation.effect?.updateTiming({ iterations: duration.vd_5s / 1000 })
			circle_animation.playbackRate = 1
			circle_animation.cancel()
			circle_animation.play()
		} else {
			play("vd/wrong")
		}
	})
	socket.on("vd right", () => {
		play("vd/right")
	})
	socket.on("vd opening", () => {
		play("vd/opening")
	})

	socket.on("vd begin", () => {
		play("vd/start")
	})

	socket.on("vd end", () => {
		play("vd/finish")
	})

	socket.on("vd pack", () => {
		play("vd/option")
		view = "pick"
	})
</script>

{#each [0, 1] as id}
	<div
		class="{view === 'pick' ? '' : 'hidden'} absolute bottom-[19%] {id === 0
			? 'left-[17%]'
			: 'right-[19%]'} aspect-[912/344] w-[25%]"
	>
		<img class="absolute h-full w-full" src="/olympus/vd/scorepack.webp" alt="" />
		<div
			class="absolute flex h-full w-full items-center justify-center text-6xl font-bold uppercase"
		>
			{id === 0 ? 20 : 30} Điểm
		</div>
	</div>
	<div
		class="absolute flex w-[3.1%] {view === 'pick' ? '' : 'hidden'} flex-col gap-[0.1vh] {id === 0
			? 'left-[43%]'
			: 'left-[82%]'} bottom-[19%]"
	>
		{#each [0, 1, 2] as jd}
			<img
				class="aspect-square w-full"
				src="/olympus/vd/{ticks[id][jd] ? '' : 'no_'}tick.webp"
				alt=""
			/>
		{/each}
	</div>
{/each}

<div
	class="absolute bottom-[5vh] left-[6vw] aspect-[1778/410] w-[70vw] {view === 'question'
		? ''
		: 'hidden'}"
>
	<img class="absolute h-full w-full" src="/olympus/vd/questionbar.webp" alt="" />
	{#each [0, 1, 2, 3] as id}
		<div
			class="absolute {id === 0
				? 'left-[0%]'
				: id === 1
					? 'left-[24.4%]'
					: id === 2
						? 'left-[49%]'
						: id === 3
							? 'left-[73.4%]'
							: ''} top-[0%] h-[24%] w-[24%] text-xl font-bold"
		>
			{#if id === olympus.current}
				<img src="/olympus/vd/contestantbar_current.webp" class="absolute h-full w-full" alt="" />
			{/if}
			{#if olympus.bells.includes(id)}
				<img src="/olympus/vd/contestantbar_buzzer.webp" class="absolute h-full w-full" alt="" />
			{/if}
			<div class="absolute flex h-full w-full items-center justify-center">
				{olympus.contestants[id].name}
				{#if id !== olympus.current}({olympus.contestants[id].score}){/if}
			</div>
		</div>
	{/each}
	<div class="absolute top-[24%] h-[69%] w-full px-2 text-3xl">
		{question?.question ?? ""}
	</div>
	<div
		class="absolute left-[4%] top-[95%] h-[3%] w-[95%] [background:linear-gradient(to_right,#000,#f00)]"
		bind:this={progress_bar_element}
	></div>
	<div
		class="absolute left-[98%] top-[95%] flex h-[3%] w-[2%] items-center justify-center"
		bind:this={container_element}
	>
		<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
			<circle cx="50" cy="50" r="25" bind:this={circle_element} fill="#f00" />
		</svg>
	</div>
</div>

<div
	class="absolute bottom-[5vh] right-[6vw] aspect-[298/272] w-[17vw] {view === 'question'
		? ''
		: 'hidden'}"
>
	<img src="/olympus/vd/contestant_scoreboard.webp" class="absolute h-full w-full" alt="" />
	<div
		class="absolute flex h-[20%] w-full items-center justify-center text-xl font-bold uppercase {question?.score
			? ''
			: 'hidden'}"
	>
		Câu {question?.score} Điểm
	</div>
	<div
		class="absolute top-[20%] flex h-[80%] w-full items-center justify-center text-8xl font-bold"
	>
		{olympus.contestants[olympus.current]?.score ?? ""}
	</div>
</div>

<img
	class="absolute bottom-[27vh] right-[20vw] aspect-square w-[15vw] {view === 'question' && star
		? ''
		: 'hidden'}"
	src="/olympus/vd/ngoisaohyvong.webp"
	alt=""
/>

<div
	class="absolute flex h-full w-full items-center justify-center {view === 'video' ? '' : 'hidden'}"
>
	<video
		src={question?.video}
		bind:this={video}
		class="max-h-full min-h-0 min-w-0 max-w-full object-contain"
	>
		<track kind="captions" />
	</video>
</div>
