import { parse } from "csv-parse/sync"
import { existsSync, readFileSync, writeFileSync } from "node:fs"

if (process.argv.length <= 2) {
	console.log("No file provided. Add a file to the end, like for example 'node vcnv.js vcnv.csv'")
	process.exit()
}

const questions: vcnv[] = []

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
	let records = parse(input, {
		columns: true,
		skip_empty_lines: true,
		bom: true
	}) as record[]

	console.log(`Parsed ${path} (${performance.now() - now}ms)\nProcessing ${path}...`)

	now = performance.now()

	records.shift()
	while (records.length) {
		questions.push({
			id: parseInt(records[0].id),
			questions: [
				records[0].question,
				records[1].question,
				records[2].question,
				records[3].question,
				records[4].question
			],
			audios: [
				records[0].audio,
				records[1].audio,
				records[2].audio,
				records[3].audio,
				records[4].audio
			],
			clues: [records[0].clue, records[1].clue, records[2].clue, records[3].clue, records[4].clue],
			images: [
				records[0].image,
				records[1].image,
				records[2].image,
				records[3].image,
				records[4].image
			],
			solution: records[0].solution
		})

		records = records.slice(6)
	}

	console.log(`Processed ${path} (${performance.now() - now}ms)`)
})

console.log(`Writing vcnv.json...`)
now = performance.now()
writeFileSync("./vcnv.json", JSON.stringify(questions))
console.log(`Written vcnv.json (${performance.now() - now}ms)`)

process.stdin.unref()

type vcnv = {
	id: number
	questions: string[]
	audios?: string[]
	clues: string[]
	images: string[]
	solution: string
}
type record = {
	id: string
	question: string
	audio: string
	clue: string
	image: string
	solution: string
}
