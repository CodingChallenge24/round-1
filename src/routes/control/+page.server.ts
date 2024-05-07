// * Import
import { redirect } from "@sveltejs/kit"
import type { PageServerLoad } from "./$types"

// * Export
export const load: PageServerLoad = async (event) => {
	if (!event.locals.user || !event.locals.session || event.locals.user.role !== "control") {
		return redirect(302, "/")
	}

	return {
		id: event.locals.user.id,
		username: event.locals.user.username,
		name: event.locals.user.name,
		role: event.locals.user.role,
		score: event.locals.user.score,
		star: event.locals.user.star,
		button: event.locals.user.button,
		input: event.locals.user.input,
		image: event.locals.user.image,
		right: event.locals.user.right,
		session_id: event.locals.session.id
	}
}
