// * Import
import { lucia } from "$lib/server/auth"
import { db } from "$lib/server/db"
import { fail, redirect } from "@sveltejs/kit"
import { Argon2id } from "oslo/password"

import { password_length, username_length } from "$lib/server/const"
import type { DatabaseUser } from "$lib/server/db"
import type { Actions, PageServerLoad } from "./$types"

// * Export
export const load: PageServerLoad = async (event) => {
	if (event.locals.user) {
		return redirect(302, `/${event.locals.user.role}`)
	}
	return {}
}

export const actions: Actions = {
	default: async (event) => {
		const formData = await event.request.formData()
		const username = formData.get("username")
		const password = formData.get("password")
		// basic check
		if (
			typeof username !== "string" ||
			username.length < username_length[0] ||
			username.length > username_length[1]
		) {
			return fail(400, {
				message: "Invalid username"
			})
		}
		if (
			typeof password !== "string" ||
			password.length < password_length[0] ||
			password.length > password_length[1]
		) {
			return fail(400, {
				message: "Invalid password"
			})
		}

		const existingUser = db.prepare("SELECT * FROM user WHERE username = ?").get(username) as
			| DatabaseUser
			| undefined
		if (!existingUser) {
			return fail(400, {
				message: "Incorrect username or password"
			})
		}

		console.log(existingUser)

		const validPassword = await new Argon2id().verify(existingUser.password, password)
		if (!validPassword) {
			return fail(400, {
				message: "Incorrect username or password"
			})
		}

		const session = await lucia.createSession(existingUser.id, {})
		const sessionCookie = lucia.createSessionCookie(session.id)
		event.cookies.set(sessionCookie.name, sessionCookie.value, {
			path: ".",
			...sessionCookie.attributes
		})

		return redirect(302, `/${existingUser.role}`)
	}
}
