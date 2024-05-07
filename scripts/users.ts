import sqlite, { SqliteError } from "better-sqlite3"
import { generateId } from "lucia"
import { existsSync, readFileSync } from "node:fs"
import { Argon2id } from "oslo/password"

export const db = sqlite("./main.db")

db.exec(`CREATE TABLE IF NOT EXISTS user (
 id TEXT NOT NULL PRIMARY KEY,
 username TEXT NOT NULL UNIQUE,
 password TEXT NOT NULL,
 'name' TEXT,
	role TEXT,
	score INTEGER,
	star INTEGER,
	button INTEGER,
	input INTEGER,
	image TEXT,
	right INTEGER
)`)

db.exec(`CREATE TABLE IF NOT EXISTS session (
 id TEXT NOT NULL PRIMARY KEY,
 expires_at INTEGER NOT NULL,
 user_id TEXT NOT NULL,
 FOREIGN KEY (user_id) REFERENCES user(id)
)`)

if (process.argv.length <= 2) {
	console.log(
		"No file provided. Add a file to the end, like for example 'node users.js users.json'"
	)
	process.exit()
}

let now = 0
process.argv.slice(2).forEach((path) => {
	if (!existsSync(path)) {
		throw new Error(`${path} does not exist.`)
	}

	console.log(`Reading ${path}...`)

	now = performance.now()
	const input = readFileSync(path, "utf8").toString()
	console.log(`Read ${path} (${performance.now() - now}ms)\nParsing ${path}...`)

	now = performance.now()
	const records = JSON.parse(input) as record[]

	console.log(`Parsed ${path} (${performance.now() - now}ms)\nProcessing ${path}...`)

	now = performance.now()

	const username_regex = /^[a-zA-Z0-9-_]+$/
	const name_length = 32
	const username_length = [1, 31] as const
	const password_length = [1, 255] as const

	records.forEach(async (record) => {
		const username = record.username
		const password = record.password
		const name = record.name
		const role = record.role

		// basic check
		if (
			typeof username !== "string" ||
			username.length < username_length[0] ||
			username.length > username_length[1] ||
			!username_regex.test(username)
		) {
			throw new Error(
				`Username must be ${username_length[0]}-${username_length[1]} characters long and only consist of letters, numbers, dashes, and underscores`
			)
		}
		if (
			typeof password !== "string" ||
			password.length < password_length[0] ||
			password.length > password_length[1]
		) {
			throw new Error(
				`Password must be ${password_length[0]}-${password_length[1]} characters long`
			)
		}
		if (typeof name !== "string" || name.length < 1 || name.length > name_length) {
			throw new Error(`Name length must be 1-${name_length} characters!`)
		}
		if (typeof role !== "string" || !["control", "viewer", "mc", "contestant"].includes(role)) {
			throw new Error("Role must be one of control, viewer, mc, or contestant")
		}

		const hashedPassword = await new Argon2id().hash(password)
		const userId = generateId(15)

		try {
			console.log(`Writing users.db...`)
			now = performance.now()
			db.prepare(
				"INSERT INTO user (id, username, password, name, 	role, score, star, button, input, image, right) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
			).run(userId, username, hashedPassword, name, role, 0, 0, 0, 0, "", 0)
			console.log(`Written users.db (${performance.now() - now}ms)`)
		} catch (e) {
			if (e instanceof SqliteError && e.code === "SQLITE_CONSTRAINT_UNIQUE") {
				throw new Error("Username already taken")
			}
			console.log(e)
			throw new Error("An unknown error occurred")
		}
	})

	console.log(`Processed ${path} (${performance.now() - now}ms)`)
})

process.stdin.unref()

type record = {
	username: string
	password: string
	name: string
	role: "control" | "viewer" | "contestant"
}
