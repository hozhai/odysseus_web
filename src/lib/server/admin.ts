import { ADMIN_EMAIL } from '$env/static/private';

export function isAdmin(email: string | null | undefined): boolean {
	if (!email) return false;
	return email.toLowerCase() === ADMIN_EMAIL.toLowerCase();
}
