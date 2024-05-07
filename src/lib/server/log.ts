// * Import
import { createWriteStream } from "fs"
import { io } from "."

// * Const
const date = new Date()

const log_stream = createWriteStream("src/lib/server/log.txt", { flags: "a" })
log_stream.write(
	`\n${date.getFullYear()}.${`${date.getMonth() + 1}`.padStart(
		2,
		"0"
	)}.${`${date.getDate()}`.padStart(2, "0")} ${`${date.getHours()}`.padStart(
		2,
		"0"
	)}:${`${date.getMinutes()}`.padStart(2, "0")}:${`${date.getSeconds()}`.padStart(
		2,
		"0"
	)}.${`${date.getMilliseconds()}`.padStart(3, "0")}\n`
)

// * Export
export const logs: string[] = []

export function log(log: string) {
	const date = new Date()
	const line = `${`${date.getHours()}`.padStart(2, "0")}:${`${date.getMinutes()}`.padStart(
		2,
		"0"
	)}:${`${date.getSeconds()}`.padStart(2, "0")}.${`${date.getMilliseconds()}`.padStart(
		3,
		"0"
	)} ${log}\n`
	logs.push(line)
	log_stream.write(line)
	io.to("control").emit("log", line)
}
