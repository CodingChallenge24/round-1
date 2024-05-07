<script context="module" lang="ts">
	let timeout: NodeJS.Timeout

	let toast = $state({
		message: "",
		background: "base" as "error" | "warning" | "success" | "primary" | "base",
		show: false
	})

	export async function show_toast(
		message: typeof toast.message,
		background: typeof toast.background,
		duration: number
	) {
		clearTimeout(timeout)
		if (toast.show) {
			toast.show = false
			await sleep(150)
		}
		toast.show = true
		toast = {
			message,
			background: background,
			show: true
		}
		if (duration === Number.POSITIVE_INFINITY) return
		timeout = setTimeout(() => {
			toast.show = false
		}, duration)
	}

	async function sleep(ms: number) {
		return await new Promise((r) => setTimeout(r, ms))
	}
</script>

<div
	class="pointer-events-none fixed m-1 flex w-full items-center justify-center transition-[top] {toast.show
		? 'top-0'
		: '-top-12'}"
>
	<div
		class="rounded px-6 py-1 text-2xl {toast.background === 'error'
			? 'bg-error'
			: toast.background === 'warning'
				? 'bg-warning'
				: toast.background === 'success'
					? 'bg-success'
					: toast.background === 'primary'
						? 'bg-primary'
						: toast.background === 'base'
							? 'bg-base-100'
							: ''}"
	>
		{toast.message}
	</div>
</div>
