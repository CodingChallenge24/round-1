// * Import
import type { Socket } from "socket.io"
import type { client_server, data, server_client } from "../types"
import { db, questions, type DatabaseUser } from "./db"
import { io } from "./index"

// * Let
let belled = false

// * Export
export default function kd(
	socket: Socket<client_server, server_client, Record<string, never>, data>
) {
	socket.on("kd question", (id) => {
		const question = questions.kd.find((question) => question.id === id)
		if (!question) return socket.emit("error", "kd question", "Question not found.")
		belled = false
		const partial = structuredClone(question)
		io.to("mc").emit("kd question", question)
		partial.solution = ""
		io.except("mc").emit("kd question", partial)
	})
	socket.on("kd start", () => {
		io.emit("kd start")
	})
	socket.on("kd bell", () => {
		if (belled) return socket.emit("error", "kd bell", "Someone else already belled")
		const contestant = db
			.prepare(`SELECT * FROM user WHERE username = ?`)
			.get(socket.data.username) as DatabaseUser | undefined
		if (!contestant) return socket.emit("error", "kd bell", "Contestant not found.")
		if (contestant.button) return socket.emit("error", "kd bell", "The contestant bell is disabled")
		belled = true
		io.emit("kd bell", socket.data.username)
	})
	socket.on("kd id", (id) => {
		io.emit("kd id", id)
	})
	socket.on("kd right", () => {
		io.to("viewer").emit("kd right")
	})
	socket.on("kd wrong", () => {
		io.to("viewer").emit("kd wrong")
	})
	socket.on("kd current", (contestant) => {
		io.emit("kd current", contestant)
	})
	socket.on("kd opening", () => {
		io.to("viewer").emit("kd opening")
	})
	socket.on("kd prestart", () => {
		io.to("viewer").emit("kd prestart")
	})
	socket.on("kd prestart question", () => {
		io.to("viewer").emit("kd prestart question")
	})
	socket.on("kd finish", () => {
		io.to("viewer").emit("kd finish")
	})
	socket.on("kd solution", (solution) => {
		io.to("viewer").emit("kd solution", solution)
	})
}
