<script lang="ts">
	// * Import
	import { enhance } from "$app/forms"
	import { page } from "$app/stores"
	import Background from "$lib/client/background.svelte"
	import { v } from "$lib/client/const.svelte"
	import Head from "$lib/client/head.svelte"
	import Template from "$lib/client/template.svelte"
	import Toast, { show_toast } from "$lib/client/toast.svelte"

	page.subscribe(($page) => {
		if ($page.form?.message) show_toast($page.form.message, "error", Number.POSITIVE_INFINITY)
	})
</script>

<Head title="Olympus" />
<Background></Background>
<Template name="Olympus" version={v}></Template>
<Toast></Toast>

<div class="m-1 flex flex-col items-center justify-center gap-4">
	<form class="flex flex-col items-center justify-center gap-4" method="post" use:enhance>
		<div class="flex flex-col gap-1">
			<div>Username</div>
			<input
				class="input input-primary"
				name="username"
				type="text"
				autocomplete="username"
				placeholder="Username"
			/>
		</div>
		<div class="flex flex-col gap-1">
			<div>Password</div>
			<input
				class="input input-primary"
				name="password"
				autocomplete="current-password"
				type="password"
				placeholder="Password"
			/>
		</div>

		<input class="btn btn-primary" type="submit" value="Login" />
	</form>
</div>
