import { parse } from "csv-parse/sync"
import { existsSync, readFileSync, writeFileSync } from "node:fs"

if (process.argv.length <= 2) {
	console.log("No file provided. Add a file to the end, like for example 'node kd.js kd.csv'")
	process.exit()
}

const questions: kd[] = []

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
	const records = parse(input, {
		columns: true,
		skip_empty_lines: true,
		bom: true
	}) as record[]

	console.log(`Parsed ${path} (${performance.now() - now}ms)\nProcessing ${path}...`)

	now = performance.now()

	records.forEach((record) => {
		questions.push({
			id: parseInt(record.id),
			question: record.question.replace(/\n/g, "<br>"),
			solution: record.solution || undefined,
			audio: record.audio || undefined
		})
	})

	console.log(`Processed ${path} (${performance.now() - now}ms)`)
})

console.log(`Writing kd.json...`)
now = performance.now()
writeFileSync("./kd.json", JSON.stringify(questions))
console.log(`Written kd.json (${performance.now() - now}ms)`)

process.stdin.unref()

type kd = { id: number; question: string; solution?: string; audio?: string }
type record = { id: string; question: string; solution: string; audio: string }
