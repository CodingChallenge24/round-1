// * Import
import { disable_auto_font_size, enable_warn, max_font_size } from "./const.svelte"

// * Export
export function sleep(ms: number) {
	return new Promise((r) => setTimeout(r, ms))
}

export function warn(disabled: Record<string, boolean | boolean[]>, custom = "") {
	if (!enable_warn) return true
	const keys: string[] = []

	Object.entries(disabled).forEach(([key, value]) => {
		switch (typeof value) {
			case "boolean":
				if (value) return
				keys.push(key)
				break
			case "object":
				value.forEach((value, i) => {
					if (value) return
					keys.push(`${key}[${i}]`)
				})

				break
		}
	})

	return (
		prompt(
			`${custom}\nENABLED: ${keys.join(",")}\nARE YOU SURE? TYPE 'Y' TO CONFIRM`
		)?.toLowerCase() === "y"
	)
}

export function auto_font_size(
	elements: (HTMLElement | SVGElement | undefined) | (HTMLElement | SVGElement | undefined)[]
) {
	_auto_font_size(max_font_size, elements)
}

async function _auto_font_size(
	max_font_size: number,
	elements: (HTMLElement | SVGElement | undefined) | (HTMLElement | SVGElement | undefined)[]
) {
	if (disable_auto_font_size) return

	await sleep(0)

	let current_font_size = max_font_size

	if (!Array.isArray(elements)) elements = [elements]

	elements.forEach((element) => {
		if (!element) return

		element.style.fontSize = `${current_font_size}px`

		while (element.scrollHeight > element.clientHeight) {
			current_font_size -= 1
			element.style.fontSize = `${current_font_size}px`
		}
	})

	elements.forEach((element) => {
		if (!element) return
		element.style.fontSize = `${current_font_size}px`
	})
}
