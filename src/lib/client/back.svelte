<script lang="ts">
	let {
		shallow = false,
		href = "",
		style = ""
	}: { shallow?: boolean; href?: string; style?: string } = $props()
</script>

{#if shallow}
	<button
		class="btn btn-primary {style}"
		onclick={() => {
			history.back()
		}}
	>
		{@render svg()}
	</button>
{:else if href}
	<a {href} class="link link-primary {style}">
		{@render svg()}
	</a>
{:else}
	<div class="pointer-events-none h-12 w-12 {style}"></div>
{/if}

{#snippet svg()}
	<svg
		xmlns="http://www.w3.org/2000/svg"
		fill="none"
		viewBox="0 0 24 24"
		stroke-width="1.5"
		stroke="currentColor"
		class="h-12 w-12"
	>
		<path
			stroke-linecap="round"
			stroke-linejoin="round"
			d="M9 15 3 9m0 0 6-6M3 9h12a6 6 0 0 1 0 12h-3"
		/>
	</svg>
{/snippet}
