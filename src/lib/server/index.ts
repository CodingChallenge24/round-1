// * Import
import type http from "http"
import type { Http2SecureServer } from "http2"
import { Server } from "socket.io"
import { type client_server, type data, type rounds, type server_client } from "../types"
import kd from "./1kd"
import vcnv from "./2vcnv"
import tt from "./3tt"
import vd from "./4vd"
import { lucia } from "./auth"
import { role_client_server } from "./const"
import { db, questions, type DatabaseUser } from "./db"
import { log } from "./log"

// * Const
const connected_clients: string[] = []

// * Export
export let $round: rounds = "title"

export let io: Server<client_server, server_client, Record<string, never>, data>

export const $contestants = (
	db.prepare(`SELECT * FROM user WHERE role = 'contestant'`).all() as DatabaseUser[]
).map((contestant) => ({
	username: contestant.username,
	name: contestant.name,
	score: contestant.score,
	star: Boolean(contestant.star),
	button: Boolean(contestant.button),
	input: Boolean(contestant.input),
	image: contestant.image,
	right: contestant.right
}))

export default function (server: http.Server | Http2SecureServer) {
	io = new Server<client_server, server_client, Record<string, never>, data>(server)

	io.on("connection", (socket) => {
		socket.use(([event], next) => {
			if (
				(event !== "login" && !["contestant", "control"].includes(socket.data.role)) ||
				(role_client_server.contestant.includes(event as keyof client_server) &&
					socket.data.role !== "contestant") ||
				(role_client_server.control.includes(event as keyof client_server) &&
					socket.data.role !== "control")
			) {
				const error = new Error("Unauthorized")
				error.name = event
				return next(error)
			}

			if (
				!["title", "kd", "vcnv", "tt", "vd", "login", "contestants"].includes(event) &&
				!event.startsWith($round)
			) {
				const error = new Error("Round mismatch")
				error.name = event
				return next(error)
			}

			next()
		})

		socket.on("error", (err) => {
			socket.emit("error", err.name as keyof client_server, err.message)
		})

		socket.on("login", async (sessionId) => {
			const { user } = await lucia.validateSession(sessionId)

			if (!user) return socket.emit("error", "login", "Invalid Session ID!")

			socket.data.username = user.username
			socket.data.role = user.role

			socket.emit("contestants", $contestants)

			socket.join(user.role)
			if (user.role === "contestant") socket.join(user.username)

			io.to("control").emit(
				"client connect",
				user.role === "contestant" ? user.username : user.role
			)

			connected_clients.push(user.role === "contestant" ? user.username : user.role)

			switch ($round) {
				case "title":
					socket.emit("title")
					break
				case "kd":
					socket.emit("kd")
					break
				case "vcnv":
					socket.emit("vcnv")
					break
				case "tt":
					socket.emit("tt")
					break
				case "vd":
					socket.emit("vd")
					break
			}

			if (socket.data.role !== "control") return

			socket.emit("questions", questions)

			connected_clients.forEach((client) => socket.emit("client connect", client))
		})

		socket.on("title", () => {
			$round = "title"
			io.emit("title")
			log("round: title")
		})
		socket.on("kd", () => {
			$round = "kd"
			io.emit("kd")
			log("round: kd")
		})
		socket.on("vcnv", () => {
			$round = "vcnv"
			io.emit("vcnv")
			log("round: vcnv")
		})
		socket.on("tt", () => {
			$round = "tt"
			io.emit("tt")
			log("round: tt")
		})
		socket.on("vd", () => {
			$round = "vd"
			io.emit("vd")
			log("round: vd")
		})

		socket.on("contestants", (new_contestants) => {
			log(`contestants: ${JSON.stringify(new_contestants)}`)

			new_contestants.forEach((c) => {
				const contestant = $contestants.find((contestant) => contestant.username === c.username)

				if (!contestant) {
					return socket.emit(
						"error",
						"contestants",
						`Contestants: contestant ${c.username} not in database`
					)
				}

				if (c.name) contestant.name = c.name

				if (c.star !== undefined) contestant.star = c.star

				if (c.score !== undefined) contestant.score = c.score < 0 ? 0 : c.score

				if (c.button !== undefined) contestant.button = c.button

				if (c.input !== undefined) contestant.input = c.input

				if (c.right !== undefined) contestant.right = c.right

				db.prepare(
					[
						"UPDATE user",
						"SET name = ?, score = ?, star = ?, button = ?, input = ?, right = ?",
						"WHERE username = ?"
					].join("\n")
				).run(
					contestant.name,
					contestant.score,
					Number(contestant.star),
					Number(contestant.button),
					Number(contestant.input),
					contestant.right,
					contestant.username
				)
			})

			io.emit("contestants", $contestants)
		})

		socket.on("disconnect", () => {
			log(`disconnect: role=${socket.data.role} username=${socket.data.username}`)

			if (!socket.data.username || !socket.data.role) return
			connected_clients.splice(
				connected_clients.indexOf(
					socket.data.role === "contestant" ? socket.data.username : socket.data.role
				),
				1
			)

			io.to("control").emit(
				"client disconnect",
				socket.data.role === "contestant" ? socket.data.username : socket.data.role
			)
		})

		kd(socket)
		vcnv(socket)
		tt(socket)
		vd(socket)
	})
}
