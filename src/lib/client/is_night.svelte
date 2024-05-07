<script lang="ts">
	let { is_night = $bindable() }: { is_night: boolean } = $props()

	$effect(() => {
		document.documentElement.addEventListener("change", update_theme)

		const system_dark = window.matchMedia("(prefers-color-scheme: dark)")
		system_dark.addEventListener("change", update_theme)

		update_theme()

		function update_theme() {
			const theme = document.documentElement.getAttribute("data-theme")
			switch (theme) {
				case null:
				case "":
					if (system_dark.matches) is_night = true
					else is_night = false
					break
				case "light":
					is_night = false
					break
				case "dark":
				case "black":
					is_night = true
					break
			}
		}
	})
</script>
