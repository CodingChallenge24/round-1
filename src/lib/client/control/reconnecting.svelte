<script lang="ts">
	// * Import
	import { untrack } from "svelte"
	import { olympus, socket } from "../const.svelte"

	// * Let
	let connected: string[] = []

	// * State
	let connected_contestants = $state([false, false, false, false])
	let viewer_connected = $state(false)
	let mc_connected = $state(false)

	// * Effect
	$effect(() => {
		olympus.contestants

		untrack(() => {
			connected.forEach((client) => {
				connected_contestants[
					olympus.contestants.findIndex((contestant) => contestant.username === client)
				] = true
			})
		})
	})

	// * Socket
	socket.on("client connect", (client) => {
		switch (client) {
			case "viewer":
				viewer_connected = true
				break
			case "mc":
				mc_connected = true
				break
			default:
				connected_contestants[
					olympus.contestants.findIndex((contestant) => contestant.username === client)
				] = true

				connected.push(client)
		}
	})

	socket.on("client disconnect", (client) => {
		switch (client) {
			case "viewer":
				viewer_connected = false
				break
			case "mc":
				mc_connected = false
				break
			default:
				connected_contestants[
					olympus.contestants.findIndex((contestant) => contestant.username === client)
				] = false

				connected.push(client)
		}
	})
</script>

<div class="absolute left-[1.25%] flex h-[2.08%] items-center justify-center text-xs">
	Điều khiển
</div>
<div class="absolute left-[95%] flex h-[2.08%] items-center justify-center text-xs">Khán giả</div>
<div class="absolute left-[1.25%] top-[97.92%] flex h-[2.08%] items-center justify-center text-xs">
	MC
</div>

{#if !viewer_connected}
	<img src="/img/reconnect.gif" alt="" class="absolute left-[99.06%] h-[2.08%] w-[0.94%]" />
{/if}
{#if !mc_connected}
	<img src="/img/reconnect.gif" alt="" class="absolute top-[97.92%] h-[2.08%] w-[0.94%]" />
{/if}
{#if !connected_contestants[0]}
	<img src="/img/reconnect.gif" alt="" class="absolute left-[0.25%] top-[9%] h-[2.08%] w-[0.94%]" />
{/if}
{#if !connected_contestants[1]}
	<img
		src="/img/reconnect.gif"
		alt=""
		class="absolute left-[25.25%] top-[9%] h-[2.08%] w-[0.94%]"
	/>
{/if}
{#if !connected_contestants[2]}
	<img
		src="/img/reconnect.gif"
		alt=""
		class="absolute left-[50.25%] top-[9%] h-[2.08%] w-[0.94%]"
	/>
{/if}
{#if !connected_contestants[3]}
	<img
		src="/img/reconnect.gif"
		alt=""
		class="absolute left-[75.25%] top-[9%] h-[2.08%] w-[0.94%]"
	/>
{/if}
