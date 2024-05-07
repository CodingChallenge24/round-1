// * Import
import type { Socket } from "socket.io"
import type { answer, client_server, data, server_client, vcnv } from "../types"
import { answers, db, questions, type DatabaseUser } from "./db"
import { $contestants, io } from "./index"

// * Let
let current_question: vcnv | undefined
let partial_question: vcnv | undefined
let start = 0

// * Export
export default function vcnv(
	socket: Socket<client_server, server_client, Record<string, never>, data>
) {
	socket.on("vcnv pick", (sub_id) => {
		io.emit("vcnv pick", sub_id)
	})
	socket.on("vcnv clues", (clues) => {
		if (!partial_question)
			return socket.emit("error", "vcnv clues", `partial question is ${partial_question}`)
		if (current_question && partial_question && current_question.id === partial_question.id) {
			clues.forEach((clue, i) => {
				if (!partial_question || !current_question) return
				const real_clue = current_question.clues[i]
				if (!real_clue) return
				partial_question.clues[i] = clue
					? real_clue.replace(/ +/g, "")
					: Array((current_question.clues[i]?.replace(/ +/g, "").length ?? 0) + 1).join(" ")

				const image = current_question.images[i]
				if (!image) return
				partial_question.images[i] = clue ? image : ""
			})
		}

		io.except("mc").emit("vcnv clues", partial_question)
	})
	socket.on("vcnv question", (id, sub_id) => {
		const question = questions.vcnv.find((question) => question.id === id)
		if (!question) return socket.emit("error", "vcnv question", "Question not found.")
		if (!current_question || !partial_question || current_question.id !== partial_question.id) {
			current_question = structuredClone(question)
			partial_question = structuredClone(question)
			partial_question.clues.forEach((clue, i) => {
				if (!partial_question || !current_question) return
				current_question.clues[i] = clue.replace(/ +/g, "")
				partial_question.clues[i] = Array(clue.replace(/ +/g, "").length + 1).join(" ")
			})
			partial_question.questions.forEach((_, i) => {
				if (!partial_question) return
				partial_question.questions[i] = ""
			})
			partial_question.images.forEach((_, i) => {
				if (!partial_question) return
				partial_question.images[i] = ""
			})
			partial_question.solution = `CHƯỚNG NGẠI VẬT CÓ ${
				current_question.solution.replace(/ +/g, "").length
			} KÝ TỰ`
		}

		io.to("mc").emit("vcnv update", current_question)
		io.except("mc").emit("vcnv update", partial_question)

		const real_question = current_question.questions[sub_id - 1]
		if (!real_question) return socket.emit("error", "vcnv question", "Question not found.")
		io.emit("vcnv question", real_question)

		start = Date.now()
	})
	socket.on("vcnv answer", (answer) => {
		const contestant = db
			.prepare(`SELECT * FROM user WHERE username = ?`)
			.get(socket.data.username) as DatabaseUser | undefined
		if (!contestant) return socket.emit("error", "vcnv answer", "Contestant not found.")
		if (contestant.input)
			return socket.emit("error", "vcnv answer", "The contestant input is disabled")
		io.emit("vcnv answer", socket.data.username, answer)
		answers.push({
			round: "vcnv",
			contestant: socket.data.username,
			start,
			id: current_question?.id ?? 0,
			answer
		})
	})
	socket.on("vcnv bell", () => {
		const contestant = $contestants.find(
			(contestant) => contestant.username === socket.data.username
		)
		if (!contestant) return socket.emit("error", "vcnv bell", "Contestant not found.")
		if (contestant.button)
			return socket.emit("error", "vcnv bell", "The contestant bell is disabled")
		io.emit("vcnv bell", socket.data.username)
	})
	socket.on("vcnv start", () => {
		io.emit("vcnv start")
	})
	socket.on("vcnv play", () => {
		io.emit("vcnv play")
	})
	socket.on("vcnv answers", () => {
		io.emit(
			"vcnv answers",
			answers.filter((answer) => answer.round === "vcnv" && answer.start === start) as Extract<
				answer,
				{ round: "vcnv" }
			>[]
		)
	})
	socket.on("vcnv opening", () => {
		io.emit("vcnv opening")
	})
	socket.on("vcnv wrong", () => {
		io.emit("vcnv wrong")
	})
	socket.on("vcnv right", () => {
		io.emit("vcnv right")
	})
	socket.on("vcnv rights", (rights) => {
		io.emit("vcnv rights", rights)
	})
}
