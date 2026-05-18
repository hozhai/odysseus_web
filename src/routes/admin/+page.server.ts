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
		const data = await db.select().from(botData).where(eq(botData.id, 1));
		return {
			session,
			authorized: true,
			botData: data[0] || null
		};
	}

	return {
		session,
		authorized: false,
		botData: null
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
		const itemsFile = formData.get('items') as File | null;
		const weaponsFile = formData.get('weapons') as File | null;
		const magicsFile = formData.get('magics') as File | null;

		// At least one file must be provided
		if (!itemsFile && !weaponsFile && !magicsFile) {
			return { error: 'Please upload at least one JSON file' };
		}

		let items: unknown = null;
		let weapons: unknown = null;
		let magics: unknown = null;

		try {
			if (itemsFile && itemsFile.size > 0) {
				if (!itemsFile.name.endsWith('.json')) {
					return { error: 'Items file must be a .json file' };
				}
				items = JSON.parse(await itemsFile.text());
			}

			if (weaponsFile && weaponsFile.size > 0) {
				if (!weaponsFile.name.endsWith('.json')) {
					return { error: 'Weapons file must be a .json file' };
				}
				weapons = JSON.parse(await weaponsFile.text());
			}

			if (magicsFile && magicsFile.size > 0) {
				if (!magicsFile.name.endsWith('.json')) {
					return { error: 'Magics file must be a .json file' };
				}
				magics = JSON.parse(await magicsFile.text());
			}
		} catch (err) {
			return { error: 'Invalid JSON in file: ' + err };
		}

		try {
			if (!session || !session.user) {
				return { error: 'No session' };
			}

			// Check if row exists
			const existing = await db.select().from(botData).where(eq(botData.id, 1));

			if (existing.length > 0) {
				// Update existing row
				await db
					.update(botData)
					.set({
						items: items || existing[0].items,
						weapons: weapons || existing[0].weapons,
						magics: magics || existing[0].magics,
						uploadedBy: session.user.id,
						updatedAt: new Date()
					})
					.where(eq(botData.id, 1));
			} else {
				// Insert new row
				await db.insert(botData).values({
					id: 1,
					items,
					weapons,
					magics,
					uploadedBy: session.user.id
				});
			}

			return {
				success: true,
				message: 'Bot data updated successfully'
			};
		} catch (err) {
			const errorMessage = err instanceof Error ? err.message : String(err);
			return { error: 'Database error: ' + errorMessage };
		}
	}
};
