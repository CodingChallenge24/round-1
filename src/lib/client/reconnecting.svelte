<script lang="ts">
	// * Import
	import { olympus, socket } from "./const.svelte"

	// * Socket
	socket.on("error", (event, error) => {
		if (event === "login") location.href = "/"
		else console.log(`error {event: "${event}", error: "${error}"}`)
	})
	socket.on("contestants", async (data) => {
		olympus.deltas = data.map(
			(contestant, i) => contestant.score - olympus.contestants[i as 0 | 1 | 2 | 3].score
		) as [number, number, number, number]

		olympus.contestants = data
	})

	addEventListener("beforeunload", (event) => event.preventDefault())
</script>
