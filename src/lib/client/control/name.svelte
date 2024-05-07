<script lang="ts">
	// * Import
	import { olympus, socket } from "../const.svelte"

	// * Derived
	let pending_contestants = $derived(structuredClone($state.snapshot(olympus.contestants)))

	// * Function
	function update(e: KeyboardEvent) {
		if (e.key !== "Enter") return
		socket.emit("contestants", pending_contestants)
	}
</script>

<input
	type="text"
	class="input absolute left-[1.25%] top-[2.78%] h-[8.33%] w-[16.25%] p-0 text-3xl {olympus.current ===
	0
		? 'input-success'
		: olympus.bells.includes(0)
			? 'input-bell'
			: 'input-primary'}"
	bind:value={pending_contestants[0].name}
	onkeydown={update}
/>

<input
	type="text"
	class="input absolute left-[26.25%] top-[2.78%] h-[8.33%] w-[16.25%] p-0 text-3xl {olympus.current ===
	1
		? 'input-success'
		: olympus.bells.includes(1)
			? 'input-bell'
			: 'input-primary'}"
	bind:value={pending_contestants[1].name}
	onkeydown={update}
/>
<input
	type="text"
	class="input absolute left-[51.25%] top-[2.78%] h-[8.33%] w-[16.25%] p-0 text-3xl {olympus.current ===
	2
		? 'input-success'
		: olympus.bells.includes(2)
			? 'input-bell'
			: 'input-primary'}"
	bind:value={pending_contestants[2].name}
	onkeydown={update}
/>
<input
	type="text"
	class="input absolute left-[76.25%] top-[2.78%] h-[8.33%] w-[16.25%] p-0 text-3xl {olympus.current ===
	3
		? 'input-success'
		: olympus.bells.includes(3)
			? 'input-bell'
			: 'input-primary'}"
	bind:value={pending_contestants[3].name}
	onkeydown={update}
/>
