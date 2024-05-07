<script lang="ts">
	// * Import
	import Bell from "$lib/client/bell.svelte"
	import { socket } from "$lib/client/const.svelte"
	import Head from "$lib/client/head.svelte"
	import Reconnecting from "$lib/client/reconnecting.svelte"
	import Toast from "$lib/client/toast.svelte"
	import type { rounds } from "$lib/types"
	import { untrack } from "svelte"
	import { themeChange as theme_change } from "theme-change"
	import Kd from "./1kd.svelte"
	import Vcnv from "./2vcnv.svelte"
	import Tt from "./3tt.svelte"
	import Vd from "./4vd.svelte"
	import Audio from "./audio.svelte"

	// * Props
	let { data } = $props()

	// * State
	let round = $state<rounds>("title")

	// * Effect
	$effect(() => untrack(() => theme_change(false)))

	// * Socket
	socket.emit("login", data.session_id)
	socket.on("title", () => {
		round = "title"
	})
	socket.on("kd", () => {
		round = "kd"
	})
	socket.on("vcnv", () => {
		round = "vcnv"
	})
	socket.on("tt", () => {
		round = "tt"
	})
	socket.on("vd", () => {
		round = "vd"
	})
</script>

<svelte:head>
	<title>Olympus / Viewer</title>
</svelte:head>

<Audio></Audio>
<Head></Head>

<div class="font-calibri">
	<Reconnecting />
	<Bell></Bell>

	<div class={round === "kd" ? "" : "hidden"}>
		<Kd />
	</div>

	<div class={round === "vcnv" ? "" : "hidden"}>
		<Vcnv />
	</div>

	<div class={round === "tt" ? "" : "hidden"}>
		<Tt />
	</div>

	<div class={round === "vd" ? "" : "hidden"}>
		<Vd />
	</div>
</div>

<Toast></Toast>
