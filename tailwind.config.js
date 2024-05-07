/** @type {import('tailwindcss').Config} */
export default {
	content: ["./src/**/*.{html,js,svelte,ts}"],
	theme: {
		extend: { colors: { gold: "gold", silver: "silver", bronze: "#cd7f32", bell: "#ffff00" } },
		fontFamily: { arial: ["Arial"], calibri: ["Calibri"] }
	},
	plugins: [require("daisyui")],
	daisyui: {
		themes: [
			{
				light: {
					...require("daisyui/src/theming/themes")["light"], // eslint-disable-line @typescript-eslint/no-var-requires
					primary: "#37aad9",
					secondary: "#eea231"
				}
			},
			{
				dark: {
					...require("daisyui/src/theming/themes")["dark"], // eslint-disable-line @typescript-eslint/no-var-requires
					primary: "#37aad9",
					secondary: "#eea231",
					"base-content": "#fff"
				}
			},
			{
				black: {
					...require("daisyui/src/theming/themes")["dark"], // eslint-disable-line @typescript-eslint/no-var-requires
					primary: "#37aad9",
					secondary: "#eea231",
					"base-100": "#000",
					"base-content": "#fff"
				}
			}
		]
	}
}
