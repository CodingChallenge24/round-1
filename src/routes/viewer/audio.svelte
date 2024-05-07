<script lang="ts" context="module">
	import { sfx_srcs, srcs } from "$lib/client/const.svelte"
	import { show_toast } from "$lib/client/toast.svelte"
	import { untrack } from "svelte"

	let context: AudioContext

	let audios: {
		node: AudioBufferSourceNode
		gain: GainNode
		src: string
		started: boolean
	}[] = []

	export function play(sfx: keyof typeof sfx_srcs | undefined, offset = 0) {
		if (!sfx) return
		const index = audios.findIndex((audio) => audio.src === sfx_srcs[sfx])
		const audio = audios[index]
		if (!audio) return
		if (audio.started) {
			const buffer = audio.node.buffer
			audio.node.stop()
			audio.node.disconnect()
			audio.node = new AudioBufferSourceNode(context, { buffer })
			audio.node.connect(audio.gain).connect(context.destination)
		}
		audio.node.start(0, offset)
		audio.started = true
	}

	export function play_custom(src: string) {
		const index = audios.findIndex((audio) => (audio.src = src))
		const audio = audios[index]
		if (!audio) return
		if (audio.started) {
			const buffer = audio.node.buffer
			audio.node.stop()
			audio.node.disconnect()
			audio.node = new AudioBufferSourceNode(context, { buffer })
			audio.node.connect(audio.gain).connect(context.destination)
		}
		audio.node.start(0)
		audio.started = true
	}
</script>

<script lang="ts">
	$effect(() =>
		untrack(() => {
			context = new AudioContext()
			let loaded = 0
			srcs.forEach(async (src) => {
				const buffer = await context.decodeAudioData(await (await fetch(src)).arrayBuffer())
				const node = new AudioBufferSourceNode(context, { buffer })
				const gain = new GainNode(context)
				node.connect(gain).connect(context.destination)
				audios.push({ node, gain, started: false, src })
				loaded += 1
				show_toast(`${loaded}/${srcs.length} sfx loaded`, "success", 3000)
			})
		})
	)
</script>
