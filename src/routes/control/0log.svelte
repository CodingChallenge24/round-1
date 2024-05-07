<script lang="ts">
	// * Import
	import { socket } from "$lib/client/const.svelte"

	// * Let
	let element: HTMLDivElement

	// * State
	let logs = $state<string[]>([])

	// * Socket
	socket.on("log", (log) => {
		logs.push(log)
		logs = logs
		element.scrollTop = element.scrollHeight
	})
</script>

<div class="absolute top-[10vh] h-[68vh] w-full overflow-y-scroll p-4" bind:this={element}>
	{#each logs as log}
		{log}
		<br />
	{/each}
</div>
