import { lucia } from "$lib/server/auth"
import { redirect } from "@sveltejs/kit"
import type { PageServerLoad } from "./$types"

export const load: PageServerLoad = async (event) => {
	if (!event.locals.session) {
		return redirect(302, "/")
	}

	await lucia.invalidateSession(event.locals.session?.id)

	const sessionCookie = lucia.createBlankSessionCookie()
	event.cookies.set(sessionCookie.name, sessionCookie.value, {
		path: ".",
		...sessionCookie.attributes
	})

	redirect(302, "/")
}
