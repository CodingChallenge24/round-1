// * Import
import type { answer, kd, tt, vcnv, vd } from "$lib/types"
import sqlite from "better-sqlite3"
import { readFileSync, writeFileSync } from "fs"

try {
	readFileSync("src/lib/server/answers.json", "utf8")
} catch {
	writeFileSync("src/lib/server/answers.json", "[]")
}

// * Export
export const questions = {
	kd: JSON.parse(readFileSync("src/lib/server/1kd.json", "utf8")) as kd[],
	vcnv: JSON.parse(readFileSync("src/lib/server/2vcnv.json", "utf8")) as vcnv[],
	tt: JSON.parse(readFileSync("src/lib/server/3tt.json", "utf8")) as tt[],
	vd: JSON.parse(readFileSync("src/lib/server/4vd.json", "utf8")) as vd[]
}

export const answers = JSON.parse(readFileSync("src/lib/server/answers.json", "utf8")) as answer[]

export interface DatabaseUser {
	id: string
	username: string
	password: string
	name: string
	role: "viewer" | "control" | "contestant" | "mc"
	score: number
	star: number
	button: number
	input: number
	image: string
	right: number
}

export const db = sqlite("src/lib/server/main.db")

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
