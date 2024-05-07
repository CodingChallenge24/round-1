<script lang="ts">
	// * Import
	import Background from "$lib/client/background.svelte"
	import Bell from "$lib/client/bell.svelte"
	import { olympus, socket } from "$lib/client/const.svelte"
	import Control_Reconnecting from "$lib/client/control/reconnecting.svelte"
	import Control_Score from "$lib/client/control/score.svelte"
	import Delta from "$lib/client/delta.svelte"
	import { warn } from "$lib/client/functions"
	import Head from "$lib/client/head.svelte"
	import Reconnecting from "$lib/client/reconnecting.svelte"
	import type { rounds } from "$lib/types"
	import { untrack } from "svelte"
	import { themeChange as theme_change } from "theme-change"
	import Title from "../control/0title.svelte"
	import Log from "./0log.svelte"
	import Kd from "./1kd.svelte"
	import Vcnv from "./2vcnv.svelte"
	import Tt from "./3tt.svelte"
	import Vd from "./4vd.svelte"

	// * Props
	let { data } = $props()

	// * State
	let round = $state<rounds | "log">("title")

	// * Effect
	$effect(() => untrack(() => theme_change(false)))

	// * Socket
	socket.emit("login", data.session_id)

	socket.on("title", () => {
		round = "title"
	})
	socket.on("kd", () => {
		round = "kd"
		socket.emit(
			"contestants",
			olympus.contestants.map((contestant) => ({
				username: contestant.username,
				input: true,
				button: true
			}))
		)
	})
	socket.on("vcnv", () => {
		round = "vcnv"
		socket.emit(
			"contestants",
			olympus.contestants.map((contestant) => ({
				username: contestant.username,
				input: true,
				button: true
			}))
		)
	})
	socket.on("tt", () => {
		round = "tt"
		socket.emit(
			"contestants",
			olympus.contestants.map((contestant) => ({
				username: contestant.username,
				input: true,
				button: true
			}))
		)
	})
	socket.on("vd", () => {
		round = "vd"
		socket.emit(
			"contestants",
			olympus.contestants.map((contestant) => ({
				username: contestant.username,
				input: true,
				button: true
			}))
		)
	})
</script>

<svelte:head>
	<title>Olympus / Control</title>
</svelte:head>

<Background></Background>
<Control_Reconnecting></Control_Reconnecting>
<Reconnecting />
<Head></Head>

<Delta show={true} />
<Control_Score />

<Bell />

<div class={round === "log" ? "" : "hidden"}>
	<Log />
</div>

<div class={round === "title" ? "" : "hidden"}>
	<Title />
</div>

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

<div class="absolute top-[90vh] flex w-full items-center justify-center gap-4">
	<button
		class="btn btn-primary"
		onclick={() => {
			round = "log"
		}}>LOG</button
	>
	<button
		class="btn btn-primary"
		onclick={() => {
			if (!warn({})) return
			socket.emit("title")
		}}>TITLE</button
	>
	<button
		class="btn btn-primary"
		onclick={() => {
			if (!warn({})) return
			socket.emit("kd")
		}}>KHỞI ĐỘNG</button
	>
	<button
		class="btn btn-primary"
		onclick={() => {
			if (!warn({})) return
			socket.emit("vcnv")
		}}>VƯỢT CHƯỚNG NGẠI VẬT</button
	>
	<button
		class="btn btn-primary"
		onclick={() => {
			if (!warn({})) return
			socket.emit("tt")
		}}>TĂNG TỐC</button
	>
	<button
		class="btn btn-primary"
		onclick={() => {
			if (!warn({})) return
			socket.emit("vd")
		}}>VỀ ĐÍCH</button
	>
</div>
