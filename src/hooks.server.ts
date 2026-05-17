import { auth } from '$lib/auth';
import { svelteKitHandler } from 'better-auth/svelte-kit';
import { building } from '$app/environment';

export async function handle({ event, resolve }) {
	const session = await auth.api.getSession({
		headers: event.request.headers
	});

	if (session?.session && session.user) {
		event.locals.session = {
			user: {
				id: session.user.id,
				email: session.user.email,
				name: session.user.name ?? undefined,
				image: session.user.image ?? undefined
			},
			expiresAt: session.session.expiresAt
		};
	} else {
		event.locals.session = null;
	}

	return svelteKitHandler({ event, resolve, auth, building });
}
