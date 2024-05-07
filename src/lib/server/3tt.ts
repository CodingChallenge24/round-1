// * Import
import type { Socket } from "socket.io"
import type { answer, client_server, data, server_client } from "../types"
import { answers, db, questions, type DatabaseUser } from "./db"
import { io } from "./index"

// * Let
let start = 0
let question_id = 0

// * Export
export default function tt(
	socket: Socket<client_server, server_client, Record<string, never>, data>
) {
	socket.on("tt question", (id) => {
		const question = questions.tt.find((question) => question.id === id)
		if (!question) return socket.emit("error", "tt question", "Question not found.")
		const partial = structuredClone(question)
		partial.solution = ""
		io.to("mc").emit("tt question", question)
		io.except("mc").emit("tt question", partial)
		question_id = id
	})
	socket.on("tt start", (duration) => {
		start = Date.now()
		io.emit("tt start", duration)
	})
	socket.on("tt answer", (answer) => {
		const now = Date.now()

		const contestant = db
			.prepare(`SELECT * FROM user WHERE username = ?`)
			.get(socket.data.username) as DatabaseUser | undefined
		if (!contestant) return socket.emit("error", "vcnv answer", "Contestant not found.")
		if (contestant.input)
			return socket.emit("error", "vcnv answer", "The contestant input is disabled")
		io.emit("tt answer", socket.data.username, answer, now - start)
		answers.push({
			round: "tt",
			contestant: socket.data.username,
			start,
			id: question_id,
			answer,
			timestamp: now - start
		})
	})
	socket.on("tt answers", () => {
		io.emit(
			"tt answers",
			answers.filter(
				(answer) => answer.round === "tt" && answer.id === question_id && answer.start === start
			) as Extract<answer, { round: "tt" }>[]
		)
	})
	socket.on("tt rights", (rights) => {
		io.emit("tt rights", rights)
	})
	socket.on("tt opening", () => {
		io.emit("tt opening")
	})
}
