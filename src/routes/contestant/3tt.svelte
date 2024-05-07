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
	socket.on("tt question", (tt) => {
		question = tt.question
		current = tt.id
	})

	socket.on("tt start", () => {
		sent = ""
		answer = ""
	})
</script>

<div class="fixed inset-0 m-4 flex h-full flex-col gap-4">
	<div class="flex w-full items-center">
		<img src="/img/logo.png" width="100" alt="Coding Challenge Logo" />
		<h1 class="grow text-center text-5xl font-bold text-[#02ABA7]">TĂNG TỐC</h1>
	</div>
	<div class="flex flex-row items-center justify-center gap-4">
		<div class="absolute left-0 self-end font-bold italic">Câu hỏi số {current}</div>
	</div>

	<div class="flex-1 bg-black px-1 text-3xl font-bold italic text-white">
		{question}
	</div>
	<div class="mb-4 flex h-24 w-full flex-row gap-4">
		<div class="flex-1">
			<div class="text-xl font-bold italic">TRẢ LỜI CỦA THÍ SINH</div>
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
					socket.emit("tt answer", answer)
					sent = answer
					answer = ""
				}}
			/>
		</div>

		<div class="flex-1">
			<div class="text-xl font-bold italic">TRẢ LỜI ĐÃ GỬI</div>
			<input
				type="text"
				class="w-full border border-transparent bg-[#FEE53D] p-1 text-3xl"
				bind:value={sent}
				readonly
			/>
		</div>
	</div>
</div>
