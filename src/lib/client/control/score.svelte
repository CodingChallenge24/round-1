<script lang="ts">
	// * Import
	import { olympus, socket } from "../const.svelte"

	// * Derived
	let pending_contestants = $derived(structuredClone($state.snapshot(olympus.contestants)))

	// * Function
	function update(e: KeyboardEvent) {
		e.stopPropagation()
		if (e.key !== "Enter") return
		socket.emit("contestants", pending_contestants)
	}
</script>

<input
	type="number"
	min="0"
	max="995"
	step="5"
	class="input absolute left-[17.5%] top-[2.78%] h-[8.33%] w-[6.25%] p-0 text-right text-3xl {olympus.current ===
	0
		? 'input-success'
		: olympus.bells.includes(0)
			? 'input-bell'
			: 'input-primary'}"
	bind:value={pending_contestants[0].score}
	onkeydown={update}
/>

<input
	type="number"
	min="0"
	max="995"
	step="5"
	class="input absolute left-[42.5%] top-[2.78%] h-[8.33%] w-[6.25%] p-0 text-right text-3xl {olympus.current ===
	1
		? 'input-success'
		: olympus.bells.includes(1)
			? 'input-bell'
			: 'input-primary'}"
	bind:value={pending_contestants[1].score}
	onkeydown={update}
/>
<input
	type="number"
	min="0"
	max="995"
	step="5"
	class="input absolute left-[67.5%] top-[2.78%] h-[8.33%] w-[6.25%] p-0 text-right text-3xl {olympus.current ===
	2
		? 'input-success'
		: olympus.bells.includes(2)
			? 'input-bell'
			: 'input-primary'}"
	bind:value={pending_contestants[2].score}
	onkeydown={update}
/>
<input
	type="number"
	min="0"
	max="995"
	step="5"
	class="input absolute left-[92.5%] top-[2.78%] h-[8.33%] w-[6.25%] p-0 text-right text-3xl {olympus.current ===
	3
		? 'input-success'
		: olympus.bells.includes(3)
			? 'input-bell'
			: 'input-primary'}"
	bind:value={pending_contestants[3].score}
	onkeydown={update}
/>
