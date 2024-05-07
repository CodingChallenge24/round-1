<script lang="ts">
	// * Import
	import { olympus, socket } from "$lib/client/const.svelte"

	// * Props
	let { username }: { username: string } = $props()

	// * State
	let current = $state(0)
	let question = $state("")
	let answer = $state("")
	let sent = $state("")

	// * Socket
	socket.on("vcnv pick", (sub_id) => {
		current = sub_id
	})

	socket.on("vcnv question", (vcnv) => {
		question = vcnv
	})
	socket.on("vcnv start", () => {
		answer = ""
		sent = ""
	})
</script>

<div class="fixed inset-0 m-4 flex h-full flex-col gap-4">
	<div class="flex flex-row items-center justify-center text-5xl font-bold text-[#ff99cc]">
		VƯỢT CHƯỚNG NGẠI VẬT
	</div>
	<div class="flex flex-row items-center justify-center gap-4">
		<div class="absolute left-0 self-end font-bold italic">Hàng ngang số {current}</div>
	</div>

	<div class="flex-1 bg-black px-1 text-3xl font-bold italic text-white">
		{question}
	</div>
	<div class="flex h-72 w-full justify-center">
		<div class="flex w-[80%] flex-col">
			<div class="p-1 text-xl font-bold italic">TRẢ LỜI CỦA HỌC SINH</div>
			<input
				type="text"
				class="w-full border border-base-content p-1 text-3xl {olympus.contestants.find(
					(contestant) => contestant.username === username
				)?.input
					? 'bg-[#7f7f7f]'
					: 'bg-base-100'}"
				disabled={olympus.contestants.find((contestant) => contestant.username === username)?.input}
				bind:value={answer}
				onkeydown={(ev) => {
					if (ev.key !== "Enter") return
					socket.emit("vcnv answer", answer)
					sent = answer
					answer = ""
				}}
			/>
			<div class="mt-4 p-1 text-xl font-bold italic">TRẢ LỜI ĐÃ GỬI</div>
			<input type="text" class="w-full bg-[#ff99ff] p-1 text-3xl" bind:value={sent} readonly />
			<div class="flex h-24 flex-row items-center justify-center">
				<button
					class="w-96 self-center py-4 font-bold shadow-sm shadow-base-content {olympus.contestants.find(
						(contestant) => contestant.username === username
					)?.button
						? 'bg-[#7f7f7f]'
						: 'bg-[#ff0000]'}"
					onclick={() => {
						socket.emit("vcnv bell")
					}}>TRẢ LỜI CNV</button
				>
			</div>
		</div>
	</div>
</div>
