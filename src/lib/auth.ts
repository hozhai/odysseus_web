import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './auth-schema';
import {
	DATABASE_URL,
	BETTER_AUTH_URL,
	GITHUB_CLIENT_ID,
	GITHUB_CLIENT_SECRET
} from '$env/static/private';

const db = drizzle(new Pool({ connectionString: DATABASE_URL }), {
	schema
});

export const auth = betterAuth({
	database: drizzleAdapter(db, { provider: 'pg', schema }),
	baseURL: BETTER_AUTH_URL,
	socialProviders: {
		github: {
			clientId: GITHUB_CLIENT_ID,
			clientSecret: GITHUB_CLIENT_SECRET
		}
	}
});

export { db };
