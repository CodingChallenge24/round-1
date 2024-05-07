<script lang="ts">
	// * Import
	import { olympus, socket } from "../const.svelte"

	// * Derived
	let pending_contestants = $derived(structuredClone($state.snapshot(olympus.contestants)))

	// * Function
	function update() {
		socket.emit("contestants", pending_contestants)
	}
</script>

<select
	class="select select-sm absolute left-[17.5%] top-[2.78%] z-10 h-[8.33%] w-[6.25%] {olympus.current ===
	0
		? 'select-success'
		: olympus.bells.includes(0)
			? 'select-bell'
			: 'select-primary'}"
	bind:value={pending_contestants[0].star}
	onchange={update}
>
	<option value={true}>1⭐</option>
	<option value={false}>0⭐</option>
</select>

<select
	class="select select-sm absolute left-[42.5%] top-[2.78%] z-10 h-[8.33%] w-[6.25%] {olympus.current ===
	1
		? 'select-success'
		: olympus.bells.includes(1)
			? 'select-bell'
			: 'select-primary'}"
	bind:value={pending_contestants[1].star}
	onchange={update}
>
	<option value={true}>1⭐</option>
	<option value={false}>0⭐</option>
</select>
<select
	class="select select-sm absolute left-[67.5%] top-[2.78%] z-10 h-[8.33%] w-[6.25%] {olympus.current ===
	2
		? 'select-success'
		: olympus.bells.includes(2)
			? 'select-bell'
			: 'select-primary'}"
	bind:value={pending_contestants[2].star}
	onchange={update}
>
	<option value={true}>1⭐</option>
	<option value={false}>0⭐</option></select
>
<select
	class="select select-sm absolute left-[92.5%] top-[2.78%] z-10 h-[8.33%] w-[6.25%] {olympus.current ===
	3
		? 'select-success'
		: olympus.bells.includes(3)
			? 'select-bell'
			: 'select-primary'}"
	bind:value={pending_contestants[3].star}
	onchange={update}
>
	<option value={true}>1⭐</option>
	<option value={false}>0⭐</option></select
>
