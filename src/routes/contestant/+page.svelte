<script lang="ts">
	// * Import
	import { olympus, socket } from "$lib/client/const.svelte"
	import Head from "$lib/client/head.svelte"
	import Reconnecting from "$lib/client/reconnecting.svelte"
	import type { rounds } from "$lib/types"
	import { untrack } from "svelte"
	import { themeChange as theme_change } from "theme-change"
	import Kd from "./1kd.svelte"
	import Vcnv from "./2vcnv.svelte"
	import Tt from "./3tt.svelte"
	import Vd from "./4vd.svelte"

	// * Props
	let { data } = $props()

	// * State
	let round = $state<rounds>("title")

	// * Effect
	$effect(() => untrack(() => theme_change(false)))

	// * Socket
	socket.emit("login", data.session_id)

	socket.on("title", () => {
		reset()
		round = "title"
	})
	socket.on("kd", () => {
		reset()
		round = "kd"
	})
	socket.on("vcnv", () => {
		reset()
		round = "vcnv"
	})
	socket.on("tt", () => {
		reset()
		round = "tt"
	})
	socket.on("vd", () => {
		reset()
		round = "vd"
	})

	// * Functions
	function reset() {
		olympus.current = -1
		olympus.bells = []
		olympus.finish_order = []
	}
</script>

<svelte:head>
	<title>Olympus / Contestant</title>
</svelte:head>

<Head></Head>
<Reconnecting />

<div class="font-arial">
	<div class={round === "kd" ? "" : "hidden"}>
		<Kd username={data.username} />
	</div>

	<div class={round === "vcnv" ? "" : "hidden"}>
		<Vcnv username={data.username} />
	</div>

	<div class={round === "tt" ? "" : "hidden"}>
		<Tt username={data.username} />
	</div>

	<div class={round === "vd" ? "" : "hidden"}>
		<Vd username={data.username} />
	</div>
</div>
