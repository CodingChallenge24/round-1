// * Import
import { BetterSqlite3Adapter } from "@lucia-auth/adapter-sqlite"
import { Lucia } from "lucia"
import { db, type DatabaseUser } from "./db"

// * Let
const adapter = new BetterSqlite3Adapter(db, {
	user: "user",
	session: "session"
})

// * Export
export const lucia = new Lucia(adapter, {
	sessionCookie: {
		attributes: {
			secure: false
		}
	},
	getUserAttributes: (attributes) => {
		return {
			username: attributes.username,
			name: attributes.name,
			role: attributes.role,
			score: attributes.score,
			star: attributes.star,
			button: attributes.button,
			input: attributes.input,
			image: attributes.image,
			right: attributes.right
		}
	}
})

declare module "lucia" {
	interface Register {
		Lucia: typeof lucia
		DatabaseUserAttributes: Omit<DatabaseUser, "id">
	}
}
