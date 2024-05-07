// * Import
import type { Socket } from "socket.io"
import type { client_server, data, server_client } from "../types"
import { db, questions, type DatabaseUser } from "./db"
import { io } from "./index"

// * Let
let belled = false

// * Export
export default function vd(
	socket: Socket<client_server, server_client, Record<string, never>, data>
) {
	socket.on("vd question", (id, star) => {
		const question = questions.vd.find((question) => question.id === id)
		if (!question) return socket.emit("error", "vd question", "Question not found.")
		belled = false
		const partial = structuredClone(question)
		partial.solution = ""
		io.to("mc").emit("vd question", question, star)
		io.except("mc").emit("vd question", partial, star)
	})
	socket.on("vd start", (duration, thuc_hanh) => {
		io.emit("vd start", duration, thuc_hanh)
	})
	socket.on("vd bell", () => {
		if (belled) return socket.emit("error", "vd bell", "Someone else already belled")
		const contestant = db
			.prepare(`SELECT * FROM user WHERE username = ?`)
			.get(socket.data.username) as DatabaseUser | undefined
		if (!contestant) return socket.emit("error", "vd bell", "Contestant not found.")
		if (contestant.button) return socket.emit("error", "vd bell", "The contestant bell is disabled")
		belled = true
		io.emit("vd bell", socket.data.username)
	})
	socket.on("vd play", () => {
		io.emit("vd play")
	})
	socket.on("vd current", (contestant) => {
		socket.broadcast.emit("vd current", contestant)
	})
	socket.on("vd picks", (picks) => {
		io.emit("vd picks", picks)
	})
	socket.on("vd right", () => {
		io.emit("vd right")
	})
	socket.on("vd wrong", (bell) => {
		io.emit("vd wrong", bell)
	})
	socket.on("vd opening", () => {
		io.emit("vd opening")
	})
	socket.on("vd begin", () => {
		io.emit("vd begin")
	})
	socket.on("vd end", () => {
		io.emit("vd end")
	})
	socket.on("vd pack", () => {
		io.emit("vd pack")
	})
}
