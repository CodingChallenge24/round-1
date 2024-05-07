// * Import
import type { client_server, server_client } from "$lib/types"
import io, { type Socket } from "socket.io-client"

// * Export
export const v = "2024.05.04.0"
export const audio = "olympus" as "audio" | "olympus"
export const max_font_size = 32
export const disable_auto_font_size = false
export const enable_warn = true
export const socket: Socket<server_client, client_server> = io()

export const olympus = $state<{
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
	deltas: number[]
	bells: number[]
	current: number
	finish_order: { name: string; username: string }[]
}>({
	contestants: [
		{
			username: "",
			name: "",
			score: 0,
			star: true,
			button: true,
			input: true,
			image: "",
			right: 0
		},
		{
			username: "",
			name: "",
			score: 0,
			star: true,
			button: true,
			input: true,
			image: "",
			right: 0
		},
		{
			username: "",
			name: "",
			score: 0,
			star: true,
			button: true,
			input: true,
			image: "",
			right: 0
		},
		{
			username: "",
			name: "",
			score: 0,
			star: true,
			button: true,
			input: true,
			image: "",
			right: 0
		}
	],
	deltas: [0, 0, 0, 0],
	bells: [],
	current: -1,
	finish_order: []
})

export const srcs = [
	"/audio/20.mp3",
	"/audio/48-0.mp3",
	"/audio/48-1.mp3",
	"/audio/60.mp3",
	"/audio/120-0.mp3",
	"/audio/120-1.mp3",
	"/audio/120-2.mp3",

	"/olympus/kd/opening.mp3",
	"/olympus/kd/prestart.ogg",
	"/olympus/kd/prestart-question.mp3",
	"/olympus/kd/60.mp3",
	"/olympus/kd/bell.mp3",
	"/olympus/kd/3.mp3",
	"/olympus/kd/right.mp3",
	"/olympus/kd/wrong.ogg",
	"/olympus/kd/finish.ogg",

	"/olympus/vcnv/opening.mp3",
	"/olympus/vcnv/open.ogg",
	"/olympus/vcnv/pick.mp3",
	"/olympus/vcnv/question.mp3",
	"/olympus/vcnv/15.mp3",
	"/olympus/vcnv/answer.ogg",
	"/olympus/vcnv/wrong.mp3",
	"/olympus/vcnv/right-0.mp3",
	"/olympus/vcnv/image.mp3",
	"/olympus/vcnv/bell.mp3",
	"/olympus/vcnv/right-1.ogg",

	"/olympus/tt/opening.mp3",
	"/olympus/tt/question.mp3",
	"/olympus/tt/10.mp3",
	"/olympus/tt/20.mp3",
	"/olympus/tt/30.mp3",
	"/olympus/tt/40.mp3",
	"/olympus/tt/answer.ogg",
	"/olympus/tt/right.mp3",

	"/olympus/vd/opening.mp3",
	"/olympus/vd/start.mp3",
	"/olympus/vd/option.ogg",
	"/olympus/vd/choose.ogg",
	"/olympus/vd/guest.mp3",
	"/olympus/vd/question.mp3",
	"/olympus/vd/star.mp3",
	"/olympus/vd/15.mp3",
	"/olympus/vd/20-0.mp3",
	"/olympus/vd/30.mp3",
	"/olympus/vd/60.mp3",
	"/olympus/vd/20-1.mp3",
	"/olympus/vd/40.mp3",
	"/olympus/vd/5.mp3",
	"/olympus/vd/bell.mp3",
	"/olympus/vd/right.ogg",
	"/olympus/vd/wrong.ogg",
	"/olympus/vd/finish.mp3"
] as const

export const sfx_srcs = {
	"kd/opening": "/olympus/kd/opening.mp3",
	"kd/prestart": "/olympus/kd/prestart.ogg",
	"kd/prestart-question": "/olympus/kd/prestart-question.mp3",
	"kd/60": "/olympus/kd/60.mp3",
	"kd/bell": "/olympus/kd/bell.mp3",
	"kd/3": "/olympus/kd/3.mp3",
	"kd/right": "/olympus/kd/right.mp3",
	"kd/wrong": "/olympus/kd/wrong.ogg",
	"kd/finish": "/olympus/kd/finish.ogg",

	"vcnv/opening": "/olympus/vcnv/opening.mp3",
	"vcnv/open": "/olympus/vcnv/open.ogg",
	"vcnv/pick": "/olympus/vcnv/pick.mp3",
	"vcnv/question": "/olympus/vcnv/question.mp3",
	"vcnv/15": "/olympus/vcnv/15.mp3",
	"vcnv/answer": "/olympus/vcnv/answer.ogg",
	"vcnv/wrong": "/olympus/vcnv/wrong.mp3",
	"vcnv/right-0": "/olympus/vcnv/right-0.mp3",
	"vcnv/image": "/olympus/vcnv/image.mp3",
	"vcnv/bell": "/olympus/vcnv/bell.mp3",
	"vcnv/right-1": "/olympus/vcnv/right-1.ogg",
	"tt/opening": "/olympus/tt/opening.mp3",
	"tt/question": "/olympus/tt/question.mp3",
	"tt/10": "/olympus/tt/10.mp3",
	"tt/20": "/olympus/tt/20.mp3",
	"tt/30": "/olympus/tt/30.mp3",
	"tt/40": "/olympus/tt/40.mp3",
	"tt/answer": "/olympus/tt/answer.ogg",
	"tt/right": "/olympus/tt/right.mp3",
	"vd/opening": "/olympus/vd/opening.mp3",
	"vd/start": "/olympus/vd/start.mp3",
	"vd/option": "/olympus/vd/option.ogg",
	"vd/choose": "/olympus/vd/choose.ogg",
	"vd/guest": "/olympus/vd/guest.mp3",
	"vd/question": "/olympus/vd/question.mp3",
	"vd/star": "/olympus/vd/star.mp3",
	"vd/15": "/olympus/vd/15.mp3",
	"vd/20-0": "/olympus/vd/20-0.mp3",
	"vd/30": "/olympus/vd/30.mp3",
	"vd/60": "/olympus/vd/60.mp3",
	"vd/20-1": "/olympus/vd/20-1.mp3",
	"vd/40": "/olympus/vd/40.mp3",
	"vd/5": "/olympus/vd/5.mp3",
	"vd/bell": "/olympus/vd/bell.mp3",
	"vd/right": "/olympus/vd/right.ogg",
	"vd/wrong": "/olympus/vd/wrong.ogg",
	"vd/finish": "/olympus/vd/finish.mp3"
} satisfies Record<string, (typeof srcs)[number]>
