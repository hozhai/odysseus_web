import type { PageServerLoad } from './$types';
import { isAdmin } from '$lib/server/admin';
import { db } from '$lib/auth';
import { botData } from '$lib/auth-schema';
import { eq } from 'drizzle-orm';

export const load: PageServerLoad = async ({ locals }) => {
	const session = locals.session; // Better Auth puts the session here
	const userEmail = session?.user?.email;
	const authorized = isAdmin(userEmail);

	if (authorized) {
		const entries = await db.select().from(botData);
		return {
			session,
			authorized: true,
			entries
		};
	}

	return {
		session,
		authorized: false,
		entries: []
	};
};

export const actions = {
	upload: async ({ request, locals }) => {
		const session = locals.session;
		const userEmail = session?.user?.email;

		if (!isAdmin(userEmail)) {
			return { error: 'Unauthorized' };
		}

		const formData = await request.formData();
		const file = formData.get('file') as File | null;
		const name = formData.get('name') as string | null;

		if (!file) {
			return { error: 'No file provided' };
		}

		if (!name || name.trim() === '') {
			return { error: 'No name provided' };
		}

		if (!file.name.endsWith('.json')) {
			return { error: 'File must be a .json file' };
		}

		let jsonContent: unknown;
		try {
			const fileText = await file.text();
			jsonContent = JSON.parse(fileText);
		} catch (err) {
			return { error: 'Invalid JSON in file: ' + err };
		}

		try {
			if (!session || !session.user) {
				return { error: 'No session' };
			}

			const newEntry = await db
				.insert(botData)
				.values({
					id: crypto.randomUUID(),
					name: name.trim(),
					jsonContent,
					uploadedBy: session.user.id
				})
				.returning();

			return {
				success: true,
				message: `Uploaded "${name}"`,
				entry: newEntry[0]
			};
		} catch (err) {
			const errorMessage = err instanceof Error ? err.message : String(err);
			// This catches duplicate name errors
			if (errorMessage.includes('unique')) {
				return { error: `A dataset named "${name}" already exists` };
			}
			return { error: 'Database error: ' + errorMessage };
		}
	},

	delete: async ({ request, locals }) => {
		const session = locals.session;
		const userEmail = session?.user?.email;

		if (!isAdmin(userEmail)) {
			return { error: 'Unauthorized' };
		}

		const formData = await request.formData();
		const id = formData.get('id') as string | null;

		if (!id) {
			return { error: 'No ID provided' };
		}

		try {
			await db.delete(botData).where(eq(botData.id, id));
			return {
				success: true,
				message: 'Dataset deleted'
			};
		} catch (err) {
			const errorMessage = err instanceof Error ? err.message : String(err);
			return { error: 'Failed to delete: ' + errorMessage };
		}
	}
};
