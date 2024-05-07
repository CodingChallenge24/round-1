import { parse } from "csv-parse/sync"
import { existsSync, readFileSync, writeFileSync } from "node:fs"

if (process.argv.length <= 2) {
	console.log("No file provided. Add a file to the end, like for example 'node vd.js vd.csv'")
	process.exit()
}

const questions: vd[] = []

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
			solution: record.solution,
			score: parseInt(record.score) as 20 | 30,
			thuc_hanh: record.thuc_hanh === "true" || undefined,
			video: record.video || undefined
		})
	})

	console.log(`Processed ${path} (${performance.now() - now}ms)`)
})

console.log(`Writing vd.json...`)
now = performance.now()
writeFileSync("./vd.json", JSON.stringify(questions))
console.log(`Written vd.json (${performance.now() - now}ms)`)

process.stdin.unref()

type vd = {
	id: number
	question: string
	solution: string
	score: 20 | 30
	thuc_hanh?: true
	video?: string
}
type record = {
	id: string
	question: string
	solution: string
	score: string
	thuc_hanh: string
	video: string
}
