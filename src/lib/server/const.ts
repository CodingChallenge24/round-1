// * Import
import type { client_server } from "$lib/types"

// * Export
export const username_regex = /^[a-zA-Z0-9-_]+$/
export const name_length = 32
export const username_length = [1, 31] as const
export const password_length = [1, 255] as const

export const role_client_server: Record<"control" | "contestant", (keyof client_server)[]> = {
	control: [
		"contestants",
		"title",
		"kd",
		"vcnv",
		"tt",
		"vd",

		"kd question",
		"kd start",
		"kd id",
		"kd right",
		"kd wrong",
		"kd current",
		"kd opening",
		"kd prestart",
		"kd prestart",
		"kd finish",
		"kd solution",

		"vcnv pick",
		"vcnv clues",
		"vcnv question",
		"vcnv start",

		"vcnv play",
		"vcnv answers",
		"vcnv opening",
		"vcnv right",
		"vcnv wrong",
		"vcnv rights",

		"tt question",
		"tt start",
		"tt answers",
		"tt rights",
		"tt opening",

		"vd question",
		"vd start",
		"vd play",
		"vd current",
		"vd picks",
		"vd right",
		"vd wrong",
		"vd opening",
		"vd begin",
		"vd pack",
		"vd end"
	],
	contestant: ["kd bell", "vcnv answer", "vcnv bell", "tt answer", "vd bell"]
}
