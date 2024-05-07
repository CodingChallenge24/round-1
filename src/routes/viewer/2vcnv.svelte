<script lang="ts">
	// * Import
	import { olympus, socket } from "$lib/client/const.svelte"
	import { auto_font_size } from "$lib/client/functions"
	import { duration, type answer } from "$lib/types"
	import { untrack } from "svelte"
	import { play, play_custom } from "./audio.svelte"

	// * Let
	let progress_bar_element: HTMLDivElement
	let progress_bar_animation: Animation
	let container_element: HTMLDivElement
	let container_animation: Animation
	let circle_element: SVGCircleElement
	let circle_animation: Animation
	let answer_elements: HTMLDivElement[] = []
	let already: number[] = []
	let audios = ["", "", "", ""]
	let first = true

	// * State
	let selected = $state(-1)
	let question = $state("")
	let images = $state(["", "", "", "", ""])
	let solution = $state("")
	let clues = $state(["", "", "", ""])
	let answers = $state<Extract<answer, { round: "vcnv" }>[]>([])
	let answer_view = $state(false)
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
					{ duration: duration.vcnv, fill: "both" }
				)
			)
			container_animation = new Animation(
				new KeyframeEffect(
					container_element,
					{ left: ["4%", "98%"] },
					{ duration: duration.vcnv, fill: "both" }
				)
			)
			circle_animation = new Animation(
				new KeyframeEffect(
					circle_element,
					{ r: [25, 50] },
					{
						duration: 1000,
						iterations: 15,
						direction: "alternate",
						fill: "both",
						easing: "ease-in-out"
					}
				)
			)
		})
	)

	// * Socket
	socket.on("vcnv pick", (sub_id) => {
		selected = sub_id
		play("vcnv/pick")
		question = ""
		answer_view = false
		if (progress_bar_animation.playbackRate !== -10) {
			progress_bar_animation.playbackRate = -10
			progress_bar_animation.play()
		}
		if (container_animation.playbackRate !== -10) {
			container_animation.playbackRate = -10
			container_animation.play()
		}
		if (circle_animation.playbackRate !== -10) {
			circle_animation.playbackRate = -10
			circle_animation.play()
		}
	})

	socket.on("vcnv question", (q) => {
		play("vcnv/question")
		if (!already.includes(selected)) already.push(selected)
		question = q
		answer_view = false
		if (progress_bar_animation.playbackRate !== -10) {
			progress_bar_animation.playbackRate = -10
			progress_bar_animation.play()
		}
		if (container_animation.playbackRate !== -10) {
			container_animation.playbackRate = -10
			container_animation.play()
		}
		if (circle_animation.playbackRate !== -10) {
			circle_animation.playbackRate = -10
			circle_animation.play()
		}
	})

	socket.on("vcnv clues", (q) => {
		images = q.images
		solution = q.solution
		clues = q.clues
		if (q.audios) audios = q.audios
		question = ""
		answer_view = false
		if (progress_bar_animation.playbackRate !== -10) {
			progress_bar_animation.playbackRate = -10
			progress_bar_animation.play()
		}
		if (container_animation.playbackRate !== -10) {
			container_animation.playbackRate = -10
			container_animation.play()
		}
		if (circle_animation.playbackRate !== -10) {
			circle_animation.playbackRate = -10
			circle_animation.play()
		}
		play("vcnv/image")
	})

	socket.on("vcnv update", (q) => {
		if (first) {
			play("vcnv/open")
			first = false
		}
		images = q.images
		solution = q.solution
		clues = q.clues
		if (q.audios) audios = q.audios
		answer_view = false
		question = ""
		if (progress_bar_animation.playbackRate !== -10) {
			progress_bar_animation.playbackRate = -10
			progress_bar_animation.play()
		}
		if (container_animation.playbackRate !== -10) {
			container_animation.playbackRate = -10
			container_animation.play()
		}
		if (circle_animation.playbackRate !== -10) {
			circle_animation.playbackRate = -10
			circle_animation.play()
		}
	})

	socket.on("vcnv start", () => {
		play("vcnv/15")
		progress_bar_animation.playbackRate = 1
		progress_bar_animation.play()
		container_animation.playbackRate = 1
		container_animation.play()
		circle_animation.playbackRate = 1
		circle_animation.play()
	})

	socket.on("vcnv play", () => {
		if (audios[selected - 1]) {
			play_custom(audios[selected - 1])
		}
	})

	socket.on("vcnv bell", () => {
		play("vcnv/bell")
	})

	socket.on("vcnv answers", (_answers) => {
		answer_view = true
		answers = _answers
		play("vcnv/answer")
		auto_font_size(answer_elements)
		rights = {
			[olympus.contestants[0].username]: undefined,
			[olympus.contestants[1].username]: undefined,
			[olympus.contestants[2].username]: undefined,
			[olympus.contestants[3].username]: undefined
		}
	})

	socket.on("vcnv rights", (r) => {
		rights = r
		play(Object.values(rights).some((value) => value) ? "vcnv/right-0" : "vcnv/wrong")
	})

	socket.on("vcnv opening", () => {
		play("vcnv/opening")
	})

	socket.on("vcnv right", () => {
		play("vcnv/right-1")
	})

	socket.on("vcnv wrong", () => {
		play("vcnv/wrong")
	})
</script>

<img src="/olympus/background.webp" class="fixed inset-0 object-cover" alt="" />

<div class={answer_view ? "hidden" : ""}>
	<div class="flex h-screen w-full flex-col gap-4 p-4">
		<div class="flex min-h-0 flex-1 flex-row justify-center gap-4">
			<div class="relative aspect-[1822/1125]">
				<img class="absolute h-full w-full" src="/olympus/vcnv/puzzleboard.webp" alt="" />
				{#if images[0]}
					<img
						class="absolute h-1/2 w-1/2 [clip-path:polygon(0%_0%,100%_0%,100%_57%,56%_57%,56%_100%,0%_100%)]"
						src={images[0]}
						alt=""
					/>
				{/if}
				{#if images[1]}
					<img
						class="absolute left-1/2 h-1/2 w-1/2 [clip-path:polygon(0%_0%,100%_0%,100%_100%,45%_100%,45%_57%,0%_57%)]"
						src={images[1]}
						alt=""
					/>
				{/if}
				{#if images[2]}
					<img
						class="absolute left-1/2 top-1/2 h-1/2 w-1/2 [clip-path:polygon(45%_0%,100%_0%,100%_100%,0%_100%,0%_44%,45%_44%)]"
						src={images[2]}
						alt=""
					/>
				{/if}
				{#if images[3]}
					<img
						class="absolute top-1/2 h-1/2 w-1/2 [clip-path:polygon(0%_0%,56%_0%,56%_44%,100%_44%,100%_100%,0%_100%)]"
						src={images[3]}
						alt=""
					/>
				{/if}
				{#if images[4]}
					<img class="absolute left-[27%] top-[28%] h-[44%] w-[46%]" src={images[4]} alt="" />
				{/if}
			</div>
			<div class="relative aspect-[978/528]">
				<img class="absolute h-full w-full" src="/olympus/vcnv/keywordbar.webp" alt="" />
				<div
					class="absolute left-[11.2%] flex h-[15%] w-[75%] items-center justify-center text-3xl font-bold text-white"
				>
					{solution}
				</div>
				<img
					class="absolute right-[5%] top-[20%] h-[75%]"
					src="/olympus/vcnv/numberorder.webp"
					alt=""
				/>
				{#each [0, 1, 2, 3] as id}
					<div
						class="absolute {id === 0
							? 'top-[20%]'
							: id === 1
								? 'top-[40%]'
								: id === 2
									? 'top-[60%]'
									: id === 3
										? 'top-[80%]'
										: ''} left-[1%] flex h-[18%] w-full flex-row"
					>
						{#each clues[id]?.split("") ?? [] as char}
							<div class="relative aspect-square h-full overflow-hidden">
								<img
									src="/olympus/vcnv/keyword.webp"
									class="absolute h-full object-cover {id + 1 === selected || char !== ' '
										? 'object-center'
										: already.includes(id + 1)
											? 'object-right'
											: 'object-left'}"
									alt=""
								/>
								<div
									class="absolute flex h-full w-full items-center justify-center pb-[10%] pr-[5%] text-5xl font-bold uppercase text-black"
								>
									{char}
								</div>
							</div>
						{/each}
					</div>
				{/each}
			</div>
		</div>
		<div class="flex min-h-0 flex-1 flex-row justify-center gap-4">
			<div class="relative aspect-[891/398]">
				<img class="absolute h-full w-full" src="/olympus/vcnv/questionbar.webp" alt="" />
				<div class="absolute h-[95%] w-full px-2 py-1 text-3xl">{question}</div>
				<div class="absolute right-0 top-[80%] flex h-[10%] w-full justify-end gap-4 px-4">
					{#each [3, 2, 1, 0] as id}
						{#if olympus.bells[id] !== undefined}
							<div class="relative aspect-[1280/266] h-full">
								<img
									src="/olympus/vcnv/contestantbar_buzzer.svg"
									class="absolute h-full w-full"
									alt=""
								/>
								<div
									class="absolute flex h-full w-full items-center justify-center text-xl font-bold text-white"
								>
									{olympus.contestants[olympus.bells[id]].name}
								</div>
							</div>
						{/if}
					{/each}
				</div>
				<div
					class="absolute left-[5%] top-[97%] h-[2%] w-[94%] [background:linear-gradient(to_right,#000,#f00)]"
					bind:this={progress_bar_element}
				></div>
				<div
					class="absolute left-[97.6%] top-[95.5%] flex h-[5%] w-[2%] items-center justify-center"
					bind:this={container_element}
				>
					<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
						<circle cx="50" cy="50" r="25" bind:this={circle_element} fill="#f00" />
					</svg>
				</div>
			</div>
			<div class="relative flex aspect-[24293989/19701000] h-full items-center justify-center">
				<img class="absolute h-full w-full object-cover" src="/bg.jpg" alt="" />
			</div>
		</div>
	</div>
</div>

<div class="{answer_view ? '' : 'hidden'} flex h-full w-full items-center justify-center">
	<div class="absolute top-[10%] aspect-[1618/876] h-[80%]">
		<img
			src="/olympus/vcnv/contestantanswer.webp"
			alt=""
			class="absolute h-full w-full object-contain"
		/>

		<img
			class="absolute h-full w-full object-contain [clip-path:url(#myClip)]"
			src="/olympus/vcnv/contestantanswer_wrong.webp"
			alt=""
		/>

		<svg>
			<defs>
				<clipPath id="myClip" clipPathUnits="objectBoundingBox">
					{#if rights[olympus.contestants[0].username] === false}
						<polygon points="0.59,0 1,0 1,0.5 0.59,0.5" />
					{/if}
					{#if rights[olympus.contestants[1].username] === false}
						<polygon points="0,0 0.41,0 0.41,0.5 0,0.5" />
					{/if}
					{#if rights[olympus.contestants[2].username] === false}
						<polygon points="0,0.5 0.41,0.5 0.41,1 0,1" />
					{/if}
					{#if rights[olympus.contestants[3].username] === false}
						<polygon points="0.59,0.5 1,0.5 1,1 0.59,1" />
					{/if}
				</clipPath>
			</defs>
		</svg>

		{#each [0, 1, 2, 3] as id}
			<div
				class="absolute {id % 2 === 0 ? 'left-[58.9%]' : 'left-[24.5%]'} {id === 0
					? 'top-[9%]'
					: id === 1
						? 'top-[29.5%]'
						: id === 2
							? 'top-[50.8%]'
							: id === 3
								? 'top-[71.3%]'
								: ''} flex h-[7.2%] w-[16.6%] items-center justify-center text-xl font-bold text-white {rights[
					olympus.contestants[id].username
				] === false
					? 'opacity-50'
					: ''}"
			>
				{olympus.contestants[id].name}
			</div>

			<div
				class="absolute {id % 2 === 0
					? 'left-[58.9%] justify-start'
					: 'left-[7%] justify-end'} {id === 0
					? 'top-[16%]'
					: id === 1
						? 'top-[36.5%]'
						: id === 2
							? 'top-[57.8%]'
							: id === 3
								? 'top-[78.2%]'
								: ''} flex h-[11.2%] w-[34%] items-center px-[1%] text-5xl font-bold uppercase text-white {rights[
					olympus.contestants[id].username
				] === false
					? 'opacity-50'
					: ''}"
				bind:this={answer_elements[id]}
			>
				{answers.findLast((answer) => answer.contestant === olympus.contestants[id].username)
					?.answer ?? ""}
			</div>
		{/each}

		<div class="absolute right-0 top-[100%] flex h-[5%] w-full justify-center gap-4 px-4">
			{#each [3, 2, 1, 0] as id}
				{#if olympus.bells[id] !== undefined}
					<div class="relative aspect-[1280/266] h-full">
						<img
							src="/olympus/vcnv/contestantbar_buzzer.svg"
							class="absolute h-full w-full"
							alt=""
						/>
						<div
							class="absolute flex h-full w-full items-center justify-center text-xl font-bold text-white"
						>
							{olympus.contestants[olympus.bells[id]].name}
						</div>
					</div>
				{/if}
			{/each}
		</div>
	</div>
</div>
