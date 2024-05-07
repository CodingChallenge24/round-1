<script lang="ts">
	// * Import
	import { olympus, socket } from "$lib/client/const.svelte"

	// * Derived
	let pending_contestants = $derived(structuredClone($state.snapshot(olympus.contestants)))

	// * Function
	function update(index: 0 | 1 | 2 | 3) {
		pending_contestants[index].input = !pending_contestants[index].input
		socket.emit("contestants", pending_contestants)
	}
</script>

<button
	class="btn btn-sm absolute left-[9.5%] top-[2.78%] h-[8.33%] w-[8%] text-xl {pending_contestants[0]
		.input
		? 'btn-error'
		: 'btn-success'}"
	onclick={() => update(0)}
>
	Input
</button>
<button
	class="btn btn-sm absolute left-[34.5%] top-[2.78%] h-[8.33%] w-[8%] text-xl {pending_contestants[1]
		.input
		? 'btn-error'
		: 'btn-success'}"
	onclick={() => update(1)}
>
	Input
</button>
<button
	class="btn btn-sm absolute left-[59.5%] top-[2.78%] h-[8.33%] w-[8%] text-xl {pending_contestants[2]
		.input
		? 'btn-error'
		: 'btn-success'}"
	onclick={() => update(2)}
>
	Input
</button>
<button
	class="btn btn-sm absolute left-[84.5%] top-[2.78%] h-[8.33%] w-[8%] text-xl {pending_contestants[3]
		.input
		? 'btn-error'
		: 'btn-success'}"
	onclick={() => update(3)}
>
	Input
</button>
