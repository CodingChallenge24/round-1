<script lang="ts">
	// * Import
	import { olympus, socket } from "./const.svelte"

	// * Socket
	socket.on("kd", reset)
	socket.on("vcnv", reset)
	socket.on("tt", reset)
	socket.on("vd", reset)

	socket.on("kd bell", bell)
	socket.on("kd question", reset)

	socket.on("vcnv bell", bell)
	socket.on("vcnv question", reset)
	socket.on("vcnv wrong", () => {
		olympus.bells.shift()
		olympus.bells = olympus.bells
	})

	socket.on("vd bell", bell)
	socket.on("vd question", reset)

	// * Function

	function bell(username: string) {
		if (
			olympus.bells.includes(
				olympus.contestants.findIndex((contestant) => contestant.username === username)
			)
		)
			return
		olympus.bells.push(
			olympus.contestants.findIndex((contestant) => contestant.username === username)
		)
		olympus.bells = olympus.bells
	}

	function reset() {
		olympus.bells = []
	}
</script>
