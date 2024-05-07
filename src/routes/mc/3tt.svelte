<script lang="ts">
	// * Import
	import { olympus, socket } from "$lib/client/const.svelte"
	import { auto_font_size } from "$lib/client/functions"
	import { duration, type tt } from "$lib/types"
	import { untrack } from "svelte"

	// * Let
	let progress_bar_element: HTMLDivElement
	let progress_bar_animation: Animation
	let container_element: HTMLDivElement
	let container_animation: Animation
	let circle_element: SVGCircleElement
	let circle_animation: Animation
	let answer_elements: HTMLDivElement[] = []
	let timestamp_elements: HTMLDivElement[] = []

	// * State
	let question = $state<tt | undefined>(undefined)
	let video = $state<HTMLVideoElement | undefined>(undefined)
	let hide = $state(false)
	let answer_view = $state(false)
	let answers = $state<{ name: string; username: string; answer: string; timestamp: number }[]>([])
	let rights = $state<Record<string, undefined | boolean>>({
		[olympus.contestants[0].username]: undefined,
		[olympus.contestants[1].username]: undefined,
		[olympus.contestants[2].username]: undefined,
		[olympus.contestants[3].username]: undefined
	})

	// * Effect
	$effect(() =>
		untrack(() => {
			progress_bar_animation = new Animation(
				new KeyframeEffect(
					progress_bar_element,
					{ width: ["0%", "94%"] },
					{ duration: duration.tt4, fill: "both" }
				)
			)
			container_animation = new Animation(
				new KeyframeEffect(
					container_element,
					{ left: ["0%", "94%"] },
					{ duration: duration.tt4, fill: "both" }
				)
			)
			circle_animation = new Animation(
				new KeyframeEffect(
					circle_element,
					{ r: ["25px", "50px"] },
					{
						duration: 1000,
						iterations: 40,
						direction: "alternate",
						fill: "both",
						easing: "ease-in-out"
					}
				)
			)
		})
	)

	// * Socket
	socket.on("tt question", (tt) => {
		answer_view = false
		question = tt
		hide = true

		if (progress_bar_animation.playbackRate !== -40) {
			progress_bar_animation.playbackRate = -40
			progress_bar_animation.play()
		}
		if (container_animation.playbackRate !== -40) {
			container_animation.playbackRate = -40
			container_animation.play()
		}
		if (circle_animation.playbackRate !== -40) {
			circle_animation.playbackRate = -40
			circle_animation.play()
		}
	})

	socket.on("tt start", (dur) => {
		if (video) {
			video.play()
			hide = false
		}

		progress_bar_animation.playbackRate = duration.tt4 / dur / 1000
		progress_bar_animation.cancel()
		progress_bar_animation.play()
		container_animation.playbackRate = duration.tt4 / dur / 1000
		container_animation.cancel()
		container_animation.play()
		circle_animation.effect?.updateTiming({ iterations: dur })
		circle_animation.playbackRate = 1
		circle_animation.cancel()
		circle_animation.play()
	})

	socket.on("tt answers", (_answers) => {
		answer_view = true
		answers = olympus.contestants
			.map((contestant) => {
				const answer = _answers.findLast((answer) => answer.contestant === contestant.username)
				return {
					username: contestant.username,
					name: contestant.name,
					timestamp: (answer?.answer ? answer.timestamp : undefined) ?? Number.POSITIVE_INFINITY,
					answer: answer?.answer ?? ""
				}
			})
			.sort((a, b) => a.timestamp - b.timestamp)

		auto_font_size([...answer_elements, ...timestamp_elements])

		rights = {
			[olympus.contestants[0].username]: undefined,
			[olympus.contestants[1].username]: undefined,
			[olympus.contestants[2].username]: undefined,
			[olympus.contestants[3].username]: undefined
		}
	})

	socket.on("tt rights", (r) => {
		rights = r
	})
</script>

<img src="/olympus/background.webp" class="fixed inset-0 object-cover" alt="" />

<div class={answer_view ? "hidden" : ""}>
	<div class="fixed flex h-screen w-screen items-center justify-center">
		<div class="relative aspect-[1180/908] h-[90%]">
			<img class="h-full w-full" src="/olympus	/tt/questionbar.webp" alt="" />
			<div
				class="absolute left-[0%] top-[0%] flex h-[19%] w-full items-center justify-center text-center text-3xl font-bold"
			>
				{question?.question ?? ""}
			</div>
			<div class="absolute left-[4%] top-[22%] flex h-[75%] w-[92%] items-center justify-center">
				{#if question?.image}
					<img
						src={question.image}
						class="max-h-full min-h-0 min-w-0 max-w-full object-contain"
						alt=""
					/>
				{/if}
				{#if question?.video}
					<video
						bind:this={video}
						src={question.video}
						muted
						class="max-h-full min-h-0 min-w-0 max-w-full object-contain {hide ? 'invisible' : ''}"
						><track kind="captions" /></video
					>
				{/if}
				<div
					class="absolute left-[1%] top-[102%] h-[1%] w-[94%] [background:linear-gradient(to_right,#000,#f00)]"
					bind:this={progress_bar_element}
				></div>
				<div
					class="absolute left-[94%] top-[100.5%] flex h-[4%] w-[2%] items-center justify-center"
					bind:this={container_element}
				>
					<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
						<circle cx="50" cy="50" r="25" bind:this={circle_element} fill="#f00" />
					</svg>
				</div>
			</div>
		</div>
	</div>
</div>

<div class="flex h-full w-full items-center justify-center {answer_view ? '' : 'hidden'}">
	<div class="absolute top-[10%] aspect-[886/883] h-[80%]">
		<img
			class="absolute h-full w-full object-contain"
			src="/olympus	/tt/contestantanswer.webp"
			alt=""
		/>

		<img
			class="absolute h-full w-full object-contain object-left [clip-path:url(#myClip2)]"
			src="/olympus	/tt/contestantanswer_wrong.webp"
			alt=""
		/>

		<svg>
			<defs>
				<clipPath id="myClip2" clipPathUnits="objectBoundingBox">
					{#if rights[answers[0]?.username] === false}
						<polygon points="0.21,0 1,0 1,0.28 0.21,0.28" />
					{/if}
					{#if rights[answers[1]?.username] === false}
						<polygon points="0.21,0.30 1,0.30 1,0.48 0.21,0.48" />
					{/if}
					{#if rights[answers[2]?.username] === false}
						<polygon points="0.21,0.51 1,0.51 1,0.70 0.21,0.70" />
					{/if}
					{#if rights[answers[3]?.username] === false}
						<polygon points="0.21,0.72 1,0.72 1,0.9 0.21,0.9" />
					{/if}
				</clipPath>
			</defs>
		</svg>

		{#each [0, 1, 2, 3] as id}
			<div
				class="absolute left-[21.4%] flex items-center justify-center text-xl font-bold {id === 0
					? 'top-[10%]'
					: id === 1
						? 'top-[30.3%]'
						: id === 2
							? 'top-[51.4%]'
							: id === 3
								? 'top-[71.8%]'
								: ''} h-[6.8%] w-[30%] {rights[answers[id]?.username] === false
					? 'opacity-50'
					: ''}"
			>
				{answers[id]?.name ?? ""}
			</div>
			<div
				class="absolute left-[21.4%] {id === 0
					? 'top-[16.7%]'
					: id === 1
						? 'top-[37%]'
						: id === 2
							? 'top-[58.1%]'
							: id === 3
								? 'top-[78.5%]'
								: ''} flex h-[11%] w-[62%] flex-row gap-[1%] px-[2%] text-5xl font-bold uppercase {rights[
					answers[id]?.username
				] === false
					? 'opacity-50'
					: ''}"
			>
				<div class="flex h-full w-[70%] items-center justify-start" bind:this={answer_elements[id]}>
					{answers[id]?.answer ?? ""}
				</div>
				<div
					class="flex h-full w-[30%] items-center justify-end {rights[answers[id]?.username] ===
					false
						? 'opacity-50'
						: ''}"
					bind:this={timestamp_elements[id]}
				>
					{#if answers[id]?.answer && answers[id]?.timestamp && answers[id].timestamp !== Number.POSITIVE_INFINITY}
						{(answers[id].timestamp / 1000).toFixed(2)}
					{/if}
				</div>
			</div>
		{/each}
	</div>

	{#if question?.solution}
		<div class="absolute bottom-[10%] left-[2%] aspect-[326/74] w-[20%]">
			<img class="absolute h-full w-full" src="/olympus/kd/english.webp" alt="" />
			<div
				class="absolute flex h-full w-full items-center justify-center text-2xl font-bold text-black"
			>
				{question?.solution}
			</div>
		</div>
	{/if}
</div>
