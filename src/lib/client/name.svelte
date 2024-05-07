<script lang="ts">
	// * Import
	import { untrack } from "svelte"
	import { olympus, socket } from "./const.svelte"
	import { auto_font_size } from "./functions"

	// * Const
	const client_name_elements: HTMLDivElement[] = []

	// * State
	let stars = $state(false)
	let mode = $state<"input" | "button" | "none">("none")

	// * Effect
	$effect(() => {
		olympus.contestants
		olympus.bells
		olympus.finish_order

		untrack(() => auto_font_size(client_name_elements))
	})

	// * Socket
	socket.on("title", () => {
		hide_stars()
		mode = "none"
	})
	socket.on("kd", () => {
		hide_stars()
		mode = "button"
	})
	socket.on("vcnv", () => {
		hide_stars()
		mode = "button"
	})
	socket.on("tt", () => {
		hide_stars()
		mode = "none"
	})
	socket.on("vd", () => {
		show_stars()
		mode = "button"
	})

	// * Function
	function show_stars() {
		stars = true
		auto_font_size(client_name_elements)
	}

	function hide_stars() {
		stars = false
		auto_font_size(client_name_elements)
	}
</script>

<div
	bind:this={client_name_elements[0]}
	class="absolute left-[1.25%] top-[2.78%] flex h-[8.33%] w-[16.25%] items-center justify-center border border-solid bg-base-100 px-1 text-xl {olympus.current ===
	0
		? 'border-green-500'
		: olympus.bells.includes(0)
			? 'border-bell'
			: (mode === 'button' && olympus.contestants[0].button) ||
				  (mode === 'input' && olympus.contestants[0].input)
				? 'border-gray-500'
				: 'border-primary'}"
>
	{olympus.bells.length > 1 && olympus.bells.includes(0)
		? `${olympus.bells.indexOf(0) + 1}. `
		: olympus.finish_order.length
			? `${
					olympus.finish_order.findIndex(
						(contestant) => contestant.username === olympus.contestants[0].username
					) + 1
				}. `
			: ""}{olympus.contestants[0].name}{stars && olympus.contestants[0].star ? "⭐" : ""}
</div>
<div
	bind:this={client_name_elements[1]}
	class="absolute left-[26.25%] top-[2.78%] flex h-[8.33%] w-[16.25%] items-center justify-center border border-solid bg-base-100 px-1 text-xl {olympus.current ===
	1
		? 'border-green-500'
		: olympus.bells.includes(1)
			? 'border-bell'
			: (mode === 'button' && olympus.contestants[1].button) ||
				  (mode === 'input' && olympus.contestants[1].input)
				? 'border-gray-500'
				: 'border-primary'}"
>
	{olympus.bells.length > 1 && olympus.bells.includes(1)
		? `${olympus.bells.indexOf(1) + 1}. `
		: olympus.finish_order.length
			? `${
					olympus.finish_order.findIndex(
						(contestant) => contestant.username === olympus.contestants[1].username
					) + 1
				}. `
			: ""}{olympus.contestants[1].name}{stars && olympus.contestants[1].star ? "⭐" : ""}
</div>
<div
	bind:this={client_name_elements[2]}
	class="absolute left-[51.25%] top-[2.78%] flex h-[8.33%] w-[16.25%] items-center justify-center border border-solid bg-base-100 px-1 text-xl {olympus.current ===
	2
		? 'border-green-500'
		: olympus.bells.includes(2)
			? 'border-bell'
			: (mode === 'button' && olympus.contestants[2].button) ||
				  (mode === 'input' && olympus.contestants[2].input)
				? 'border-gray-500'
				: 'border-primary'}"
>
	{olympus.bells.length > 1 && olympus.bells.includes(2)
		? `${olympus.bells.indexOf(2) + 1}. `
		: olympus.finish_order.length
			? `${
					olympus.finish_order.findIndex(
						(contestant) => contestant.username === olympus.contestants[2].username
					) + 1
				}. `
			: ""}{olympus.contestants[2].name}{stars && olympus.contestants[2].star ? "⭐" : ""}
</div>
<div
	bind:this={client_name_elements[3]}
	class="absolute left-[76.25%] top-[2.78%] flex h-[8.33%] w-[16.25%] items-center justify-center border border-solid bg-base-100 px-1 text-xl {olympus.current ===
	3
		? 'border-green-500'
		: olympus.bells.includes(3)
			? 'border-bell'
			: (mode === 'button' && olympus.contestants[3].button) ||
				  (mode === 'input' && olympus.contestants[3].input)
				? 'border-gray-500'
				: 'border-primary'}"
>
	{olympus.bells.length > 1 && olympus.bells.includes(3)
		? `${olympus.bells.indexOf(3) + 1}. `
		: olympus.finish_order.length
			? `${
					olympus.finish_order.findIndex(
						(contestant) => contestant.username === olympus.contestants[3].username
					) + 1
				}. `
			: ""}{olympus.contestants[3].name}{stars && olympus.contestants[3].star ? "⭐" : ""}
</div>
