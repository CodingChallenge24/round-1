<script lang="ts">
	import IsNight from "./is_night.svelte"
	let is_night = $state(true)
</script>

<img
	class="fixed inset-0 -z-50 h-full w-full object-cover object-center opacity-5"
	src="{is_night ? '/' : '/day/'}bg.jpg"
	alt=""
/>

<IsNight bind:is_night></IsNight>
