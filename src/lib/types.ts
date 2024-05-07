import type { questions } from "./server/db"

export type client_server = {
	"login"(sessionId: string): void

	"contestants"(
		contestants: {
			username: string
			score?: number
			name?: string
			star?: boolean
			button?: boolean
			input?: boolean
			right?: number
		}[]
	): void

	"title"(): void

	"kd"(): void
	"kd question"(id: number): void
	"kd start"(): void
	"kd bell"(): void
	"kd id"(id: number): void
	"kd right"(): void
	"kd wrong"(): void
	"kd current"(contestant: string): void
	"kd opening"(): void
	"kd prestart question"(): void
	"kd prestart"(): void
	"kd finish"(): void
	"kd solution"(solution: string): void

	"vcnv"(): void
	"vcnv pick"(sub_id: number): void
	"vcnv clues"(clues: [boolean, boolean, boolean, boolean, boolean]): void
	"vcnv question"(id: number, sub_id: number): void
	"vcnv start"(): void
	"vcnv answer"(answer: string): void
	"vcnv bell"(): void
	"vcnv play"(): void
	"vcnv answers"(): void
	"vcnv opening"(): void
	"vcnv right"(): void
	"vcnv wrong"(): void
	"vcnv rights"(rights: Record<string, boolean>): void

	"tt"(): void
	"tt question"(id: number): void
	"tt start"(duration: number): void
	"tt answer"(answer: string): void
	"tt answers"(): void
	"tt rights"(rights: Record<string, boolean>): void
	"tt opening"(): void

	"vd"(): void
	"vd question"(id: number, star: boolean): void
	"vd start"(duration: 15 | 20 | 30 | 40 | 60, thuc_hanh: boolean): void
	"vd bell"(): void
	"vd play"(): void
	"vd current"(contestant: string): void
	"vd picks"(picks: boolean[][]): void
	"vd right"(): void
	"vd wrong"(bell: boolean): void
	"vd opening"(): void
	"vd begin"(): void
	"vd pack"(): void
	"vd end"(): void
}

export type server_client = {
	"error"(event: keyof client_server, error: string): void
	"questions"(q: typeof questions): void

	"contestants"(
		contestants: {
			username: string
			name: string
			score: number
			star: boolean
			button: boolean
			input: boolean
			image: string
			right: number
		}[]
	): void

	"client connect"(client: string): void
	"client disconnect"(client: string): void
	"log"(log: string): void

	"title"(): void

	"kd"(): void
	"kd question"(question: kd): void
	"kd start"(): void
	"kd bell"(contestant: string): void
	"kd id"(id: number): void
	"kd right"(): void
	"kd wrong"(): void
	"kd current"(contestant: string): void
	"kd opening"(): void
	"kd prestart"(): void
	"kd prestart question"(): void
	"kd finish"(): void
	"kd solution"(solution: string): void

	"vcnv"(): void
	"vcnv question"(question: string): void
	"vcnv start"(): void
	"vcnv answer"(contestant: string, answer: string): void
	"vcnv bell"(contestant: string): void
	"vcnv update"(question: vcnv): void
	"vcnv play"(): void
	"vcnv answers"(answers: Extract<answer, { round: "vcnv" }>[]): void
	"vcnv pick"(sub_id: number): void
	"vcnv clues"(question: vcnv): void
	"vcnv opening"(): void
	"vcnv right"(): void
	"vcnv wrong"(): void
	"vcnv rights"(rights: Record<string, boolean>): void

	"tt"(): void
	"tt question"(question: tt): void
	"tt start"(duration: number): void
	"tt answer"(contestant: string, answer: string, timestamp: number): void
	"tt answers"(answers: Extract<answer, { round: "tt" }>[]): void
	"tt rights"(rights: Record<string, boolean>): void
	"tt opening"(): void

	"vd"(): void
	"vd question"(question: vd, star: boolean): void
	"vd start"(duration: 15 | 20 | 30 | 40 | 60, thuc_hanh: boolean): void
	"vd bell"(contestant: string): void
	"vd play"(): void
	"vd current"(contestant: string): void
	"vd picks"(picks: boolean[][]): void
	"vd right"(): void
	"vd wrong"(bell: boolean): void
	"vd opening"(): void
	"vd begin"(): void
	"vd pack"(): void
	"vd end"(): void
}

export type data = {
	username: string
	role: roles
}

export type kd = {
	id: number
	question: string
	solution: string
	audio?: string
}

export type vcnv = {
	id: number
	questions: string[]
	audios?: string[]
	clues: string[]
	images: string[]
	solution: string
}

export type tt = {
	id: number
	question: string
	image?: string
	video?: string
	solution: string
	time: 10 | 20 | 30 | 40
}

export type vd = {
	id: number
	question: string
	solution: string
	score: 20 | 30
	thuc_hanh?: true
	video?: string
}

type roles = "control" | "contestant" | "mc" | "viewer"
export type rounds = "title" | "kd" | "vcnv" | "tt" | "vd"

export type answer = { id: number; contestant: string; answer: string; start: number } & (
	| {
			round: "vcnv"
	  }
	| { round: "tt"; timestamp: number }
)

export enum duration {
	kd = 3000,
	vcnv = 15000,
	tt1 = 10000,
	tt2 = 20000,
	tt3 = 30000,
	tt4 = 40000,
	vd_20_diem = 15000, // eslint-disable-line @typescript-eslint/no-duplicate-enum-values
	vd_20_thuc_hanh = 30000, // eslint-disable-line @typescript-eslint/no-duplicate-enum-values
	vd_30_diem = 20000, // eslint-disable-line @typescript-eslint/no-duplicate-enum-values
	vd_30_thuc_hanh = 60000, // eslint-disable-line @typescript-eslint/no-duplicate-enum-values
	vd_5s = 5000
}
