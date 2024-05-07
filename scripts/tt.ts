import { parse } from "csv-parse/sync"
import { existsSync, readFileSync, writeFileSync } from "node:fs"

if (process.argv.length <= 2) {
	console.log("No file provided. Add a file to the end, like for example 'node tt.js tt.csv'")
	process.exit()
}

const questions: tt[] = []

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
			image: record.image || undefined,
			video: record.video || undefined,
			solution: record.solution,
			time: parseInt(record.time) as 10 | 20 | 30 | 40
		})
	})

	console.log(`Processed ${path} (${performance.now() - now}ms)`)
})

console.log(`Writing tt	.json...`)
now = performance.now()
writeFileSync("./tt.json", JSON.stringify(questions))
console.log(`Written tt.json (${performance.now() - now}ms)`)

process.stdin.unref()

type tt = {
	id: number
	question: string
	image?: string
	video?: string
	solution: string
	time: 10 | 20 | 30 | 40
}
type record = {
	id: string
	question: string
	image: string
	video: string
	solution: string
	time: string
}
