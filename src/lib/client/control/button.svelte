<script lang="ts">
	// * Import
	import { olympus, socket } from "$lib/client/const.svelte"

	// * Derived
	let pending_contestants = $derived(structuredClone($state.snapshot(olympus.contestants)))

	// * Function
	function update(index: 0 | 1 | 2 | 3) {
		pending_contestants[index].button = !pending_contestants[index].button
		socket.emit("contestants", pending_contestants)
	}
</script>

<button
	class="btn btn-sm absolute left-[1.25%] top-[2.78%] h-[8.33%] w-[8%] text-xl {pending_contestants[0]
		.button
		? 'btn-error'
		: 'btn-success'}"
	onclick={() => update(0)}
>
	Bell
</button>
<button
	class="btn btn-sm absolute left-[26.25%] top-[2.78%] h-[8.33%] w-[8%] text-xl {pending_contestants[1]
		.button
		? 'btn-error'
		: 'btn-success'}"
	onclick={() => update(1)}
>
	Bell
</button>
<button
	class="btn btn-sm absolute left-[51.25%] top-[2.78%] h-[8.33%] w-[8%] text-xl {pending_contestants[2]
		.button
		? 'btn-error'
		: 'btn-success'}"
	onclick={() => update(2)}
>
	Bell
</button>
<button
	class="btn btn-sm absolute left-[76.25%] top-[2.78%] h-[8.33%] w-[8%] text-xl {pending_contestants[3]
		.button
		? 'btn-error'
		: 'btn-success'}"
	onclick={() => update(3)}
>
	Bell
</button>
