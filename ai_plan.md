## DIY Tutorial: Protected Admin JSON Uploads to Postgres

Build a secret `/admin` area that forces GitHub login, checks one approved email address, and lets that one user upload and manage JSON data stored directly in Postgres via Drizzle. The bot can query the database anytime it needs the data, no file downloads or extra storage layers needed. The app already has Better Auth, GitHub OAuth, and Drizzle wired, so the job is not "build auth from scratch" but "add a clean admin gate and a small CRUD surface for JSON management."

The architecture is straightforward:

- GitHub login proves who the user is.
- A server-side email check decides whether they are allowed into `/admin`.
- Postgres stores the JSON in a `jsonb` column.
- The Discord bot queries the database directly whenever it needs the data.
- `/admin` becomes the control panel for upload, list, and delete.
- No files, no extra storage, no complexity.

### Quick Start Guide for Beginners

This tutorial is structured as 9 concrete steps. Here is roughly what each step does:

1. **Understand the existing auth** (reading only, no code changes)
2. **Create an admin check helper** (new file: `src/lib/server/admin.ts`)
3. **Add a database table** (modify: `src/lib/auth-schema.ts`)
4. **Build the `/admin` page UI** (new files: `src/routes/admin/+page.server.ts` and `+page.svelte`)
5. **Handle uploads** (code added to `+page.server.ts`)
6. **Handle deletes** (code added to `+page.server.ts`)
7. **Show your bot how to read the data** (instructions for your Discord bot project)
8. **Test everything** (manual testing in the browser)
9. **Wire the bot** (integrate the bot code into your Discord bot project)

By the end, you will have:

- A login-protected admin page at `/admin`.
- The ability to upload 3 JSON files through the admin page.
- The Discord bot able to fetch those JSON files from the database without restarting.

### What you are building

You will end up with a flow like this:

1. A guest visits `/admin`.
2. The page checks for a session.
3. If there is no session, show a GitHub login button.
4. If there is a session but the email is not allowed, show a denied state.
5. If the email is allowed, show an upload form and a list of uploaded JSON entries.
6. When a JSON file is uploaded, the server validates it, parses it, and inserts the data into Postgres.
7. When an entry is deleted, the server removes the row from the database.
8. The Discord bot queries the same table anytime it needs the data and uses it immediately.

### Environment setup

**Do this first, before starting the steps below.**

Open your `.env` file and add this line:

```bash
ADMIN_EMAIL="your-github-email@example.com"
```

Replace `your-github-email@example.com` with the email address associated with your GitHub account.

The `DATABASE_URL` you already have is all the bot needs. No extra secrets required.

---

## Implementation Steps

### Step 1: Understand how the existing auth works

Start from the current Better Auth setup in [src/lib/auth.ts](src/lib/auth.ts) and [hooks.server.ts](hooks.server.ts). Do not add a second auth library.

**Key concept:** When a user visits your site and they have already logged in with GitHub, the `hooks.server.ts` file automatically handles the session and makes it available to your pages.

In SvelteKit, when you create a page at `/admin/+page.server.ts`, the `load` function receives an `event` parameter that contains information about the request, including the user session.

Open [hooks.server.ts](hooks.server.ts) and look at how it uses `svelteKitHandler`. This is the middleware that connects auth to your pages. You do not need to change it; it is already set up.

Now look at [src/lib/auth.ts](src/lib/auth.ts) to see the `auth` object. This is where Better Auth is configured with GitHub OAuth. Notice the `socialProviders` section with `github` — that is what lets users log in.

**What to verify:**

- The `DATABASE_URL` in `.env` works (you already have it).
- The GitHub OAuth credentials are set in your environment (you should already have `GITHUB_CLIENT_ID` and `GITHUB_CLIENT_SECRET`).

You do not need to change any auth code yet. The next step is just getting the session in your admin page.

### Step 2: Create the admin authorization helper

Create a new file at `src/lib/server/admin.ts` with this helper function:

```ts
// src/lib/server/admin.ts
export function isAdmin(email: string | null | undefined): boolean {
  if (!email) return false;
  const adminEmail = process.env.ADMIN_EMAIL?.toLowerCase();
  return email.toLowerCase() === adminEmail;
}
```

This function checks if an email matches the admin email from your environment variables. You will use it in three places:

1. In the `/admin` page load to decide who can see the page.
2. In the upload action to block non-admins from uploading.
3. In the delete action to block non-admins from deleting.

**Why a separate file?** It keeps your route files clean and lets you reuse the function if you add more protected routes later.

**Note:** You need to add `ADMIN_EMAIL` to your `.env` file. See the "Environment setup" section below.

### Step 3: Add the database table

Open [src/lib/auth-schema.ts](src/lib/auth-schema.ts) and add this new table definition at the end of the file, after the existing auth tables:

```ts
export const botData = pgTable('bot_data', {
  id: text('id').primaryKey(),
  name: text('name').notNull().unique(),
  jsonContent: jsonb('json_content').notNull(),
  uploadedBy: text('uploaded_by').notNull(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull()
});

export const botDataRelations = relations(botData, ({ one }) => ({
  uploadedByUser: one(user, {
    fields: [botData.uploadedBy],
    references: [user.id]
  })
}));
```

**What this does:**

- `id`: A unique identifier for each uploaded JSON file (you can use `crypto.randomUUID()` when inserting).
- `name`: A descriptive label like "item-prices", "quest-data", or "character-builds" — this is how your bot will ask for specific data.
- `jsonContent`: The actual JSON data stored as a Postgres `jsonb` type (which means it is already parsed when you read it).
- `uploadedBy`: The user ID of who uploaded it (for tracking).
- `updatedAt` and `createdAt`: Timestamps so you know when things changed.

**After adding this to the schema:**

1. Create a migration file. In your terminal, run:

   ```bash
   npx drizzle-kit generate
   ```

   This will create a migration file in a `drizzle/migrations/` folder.

2. Apply the migration to your database:
   ```bash
   npx drizzle-kit migrate
   ```

If you are not sure whether these commands work, check your `package.json` to see what scripts are available for Drizzle. You might need `bun` instead of `npx` depending on your setup.

**Why Drizzle relations?** It lets the database know that `uploadedBy` is connected to the `user` table. This is optional for the basic functionality but good practice.

### Step 4: Build the `/admin` page as the control panel

Create the `/admin` route by adding these two files:

#### File 1: `src/routes/admin/+page.server.ts`

This file handles the server-side logic for the `/admin` page. It checks permissions and loads the data.

```ts
// src/routes/admin/+page.server.ts
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { isAdmin } from '$lib/server/admin';
import { db } from '$lib/db'; // You may need to export this from auth.ts
import { botData } from '$lib/auth-schema';

export const load: PageServerLoad = async ({ locals }) => {
  // Step 1: Check if user is logged in
  const session = locals.session; // Better Auth puts the session here

  if (!session) {
    throw redirect(303, '/'); // Send to home if not logged in
  }

  // Step 2: Check if user's email is the admin email
  const userEmail = session.user?.email;

  if (!isAdmin(userEmail)) {
    // User is logged in but not admin, show denied state
    return {
      session,
      authorized: false
    };
  }

  // Step 3: User is admin, load all the uploaded data
  const entries = await db.select().from(botData).all();

  return {
    session,
    authorized: true,
    entries
  };
};

export const actions = {
  upload: async ({ request, locals }) => {
    // This will be filled in Step 5
  },

  delete: async ({ request, locals }) => {
    // This will be filled in Step 6
  }
};
```

**Important:** You need to export the `db` instance from [src/lib/auth.ts](src/lib/auth.ts) so you can import and use it here. Add this line to auth.ts:

```ts
export { db };
```

#### File 2: `src/routes/admin/+page.svelte`

This is the UI that users see. Create this file:

```svelte
<!-- src/routes/admin/+page.svelte -->
<script lang="ts">
	import { authClient } from '$lib/auth-client';

	let { data } = $props();

	async function signIn() {
		await authClient.signIn.social({
			provider: 'github',
			callbackURL: '/admin'
		});
	}
</script>

<div class="admin-container">
	<!-- Show if not logged in -->
	{#if !data.session}
		<div>
			<h1>Admin Access Required</h1>
			<p>You must be logged in to access this area.</p>
			<button onclick={signIn}>Sign in with GitHub</button>
		</div>
	{/if}

	<!-- Show if logged in but not admin -->
	{#if data.session && !data.authorized}
		<div>
			<h1>Access Denied</h1>
			<p>Your account is logged in, but you do not have admin permissions.</p>
			<p>Your email: {data.session.user?.email}</p>
		</div>
	{/if}

	<!-- Show if admin -->
	{#if data.authorized}
		<div>
			<h1>Admin Panel</h1>
			<p>Welcome, {data.session.user?.email}!</p>

			<!-- Upload form -->
			<section>
				<h2>Upload New JSON Data</h2>
				<form method="POST" action="?/upload" enctype="multipart/form-data">
					<input type="text" name="name" placeholder="Data name (e.g., item-prices)" required />
					<input type="file" name="file" accept=".json" required />
					<button type="submit">Upload</button>
				</form>
			</section>

			<!-- List of uploaded data -->
			<section>
				<h2>Uploaded Data</h2>
				{#if data.entries.length === 0}
					<p>No data uploaded yet.</p>
				{:else}
					<ul>
						{#each data.entries as entry (entry.id)}
							<li>
								<strong>{entry.name}</strong>
								<br />
								Updated: {new Date(entry.updatedAt).toLocaleString()}
								<br />
								<form method="POST" action="?/delete" style="display: inline;">
									<input type="hidden" name="id" value={entry.id} />
									<button type="submit">Delete</button>
								</form>
							</li>
						{/each}
					</ul>
				{/if}
			</section>
		</div>
	{/if}
</div>

<style>
	.admin-container {
		max-width: 800px;
		margin: 0 auto;
		padding: 2rem;
	}

	section {
		margin-top: 2rem;
		padding: 1rem;
		border: 1px solid #ccc;
		border-radius: 4px;
	}

	form {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	input,
	button {
		padding: 0.5rem;
		font-size: 1rem;
	}

	ul {
		list-style: none;
		padding: 0;
	}

	li {
		padding: 1rem;
		margin-bottom: 0.5rem;
		border: 1px solid #ddd;
		border-radius: 4px;
	}
</style>
```

**What happens here:**

- If not logged in: shows a GitHub login button.
- If logged in but not admin: shows "access denied".
- If admin: shows the upload form and list of all uploaded data.

### Step 5: Implement upload handling on the server

Go back to `src/routes/admin/+page.server.ts` and fill in the `upload` action. Replace the empty `upload` function with this:

```ts
upload: async ({ request, locals }) => {
  // Step 1: Check if user is admin
  const session = locals.session;
  const userEmail = session?.user?.email;

  if (!isAdmin(userEmail)) {
    return { error: 'Unauthorized' };
  }

  // Step 2: Read the form data
  const formData = await request.formData();
  const file = formData.get('file') as File | null;
  const name = formData.get('name') as string | null;

  // Step 3: Validate inputs
  if (!file) {
    return { error: 'No file provided' };
  }

  if (!name || name.trim() === '') {
    return { error: 'No name provided' };
  }

  if (!file.name.endsWith('.json')) {
    return { error: 'File must be a .json file' };
  }

  // Step 4: Read file as text and parse JSON
  let jsonContent: any;
  try {
    const fileText = await file.text();
    jsonContent = JSON.parse(fileText);
  } catch (err) {
    return { error: 'Invalid JSON in file' };
  }

  // Step 5: Insert into database
  try {
    const newEntry = await db.insert(botData).values({
      id: crypto.randomUUID(),
      name: name.trim(),
      jsonContent,
      uploadedBy: session.user.id
    }).returning();

    return {
      success: true,
      message: `Uploaded "${name}"`,
      entry: newEntry[0]
    };
  } catch (err) {
    // This catches duplicate name errors
    if (err.message.includes('unique')) {
      return { error: `A dataset named "${name}" already exists` };
    }
    return { error: 'Database error: ' + err.message };
  }
}
```

**What this does:**

1. Checks if the user is an admin.
2. Gets the file and name from the form.
3. Validates that the file is a `.json` file and contains valid JSON.
4. Stores the parsed JSON in the database.
5. Returns success or error messages that you can display to the user.

**Error handling:** If something goes wrong, it returns an error message instead of crashing. The frontend can display this message.

### Step 6: Implement delete handling on the server

Go back to `src/routes/admin/+page.server.ts` and fill in the `delete` action:

```ts
delete: async ({ request, locals }) => {
  // Step 1: Check if user is admin
  const session = locals.session;
  const userEmail = session?.user?.email;

  if (!isAdmin(userEmail)) {
    return { error: 'Unauthorized' };
  }

  // Step 2: Get the ID to delete
  const formData = await request.formData();
  const id = formData.get('id') as string | null;

  if (!id) {
    return { error: 'No ID provided' };
  }

  // Step 3: Delete from database
  try {
    await db.delete(botData).where(eq(botData.id, id));
    return {
      success: true,
      message: 'Dataset deleted'
    };
  } catch (err) {
    return { error: 'Failed to delete: ' + err.message };
  }
}
```

**Important:** Add this import at the top of `+page.server.ts`:

```ts
import { eq } from 'drizzle-orm';
```

**What this does:**

1. Checks if the user is an admin.
2. Gets the ID of the row to delete.
3. Removes the row from the database.
4. Returns success or error messages.

**Important note:** This deletes from the database only. The JSON data is gone forever, so you might want to add a confirmation dialog on the frontend later.

### Step 7: Show the bot how to query the data

Your Discord bot (the separate Node.js project) should use the same `DATABASE_URL` environment variable to connect to the same Postgres database. Here is exactly how to do it:

**In your Discord bot project's `.env` file:**

```bash
DATABASE_URL="postgresql://postgres.nhcgpbtlhugrdjhxgnxz:Zz239653960!@aws-1-us-west-1.pooler.supabase.com:6543/postgres"
```

(Use the exact same value as your website.)

**In your Discord bot's code (example: a handler for a slash command):**

If your bot also uses Drizzle ORM:

```ts
// your-discord-bot/src/commands/fetch-data.ts
import { db } from '../database'; // Your bot's Drizzle instance
import { botData } from '../schema'; // Import the same schema
import { eq } from 'drizzle-orm';

export async function handleFetchData(interaction, dataName: string) {
  try {
    const result = await db
      .select()
      .from(botData)
      .where(eq(botData.name, dataName))
      .then(rows => rows[0]);

    if (!result) {
      await interaction.reply(`No data found for "${dataName}"`);
      return;
    }

    // jsonContent is already a parsed object!
    const data = result.jsonContent;

    // Use the data immediately
    console.log('Loaded data:', data);
    await interaction.reply(`Loaded ${dataName}`);
  } catch (err) {
    await interaction.reply(`Error: ${err.message}`);
  }
}
```

If your bot uses plain `pg` instead of Drizzle:

```ts
// your-discord-bot/src/commands/fetch-data.ts
import { Pool } from 'pg';

const db = new Pool({ connectionString: process.env.DATABASE_URL });

export async function handleFetchData(interaction, dataName: string) {
  try {
    const result = await db.query(
      'SELECT json_content FROM bot_data WHERE name = $1',
      [dataName]
    );

    if (result.rows.length === 0) {
      await interaction.reply(`No data found for "${dataName}"`);
      return;
    }

    // json_content is already parsed by the pg library
    const data = result.rows[0].json_content;

    // Use the data immediately
    console.log('Loaded data:', data);
    await interaction.reply(`Loaded ${dataName}`);
  } catch (err) {
    await interaction.reply(`Error: ${err.message}`);
  }
}
```

**Key point:** When you query the database, the JSON is already parsed into a JavaScript object. You can use it immediately without any `JSON.parse()` calls.

**To refresh data without restarting the bot:** Just call this function again whenever a slash command is executed. The bot will fetch the latest data from the database each time.

### Step 8: Verify the whole flow

Before integrating with the bot, test everything end-to-end:

1. **Start your dev server:** Run `npm run dev` or `bun run dev` in the website project.
2. **Open `/admin` while signed out:** Visit `http://localhost:5173/admin`.
   - You should see a message that you are not signed in and a GitHub login button.
3. **Sign in with a non-admin GitHub account:** Click the button and use a GitHub account that is NOT your admin email.
   - You should see "Access Denied" after logging in.
4. **Log out and sign in with the admin email:** Use your admin GitHub account this time.
   - You should see the upload form and the "Uploaded Data" section (currently empty).
5. **Create a test JSON file:** Make a file called `test.json` with this content:
   ```json
   {
   	"test": "value",
   	"number": 42
   }
   ```
6. **Upload the file:**
   - Type "test-data" in the Name field.
   - Select your `test.json` file.
   - Click "Upload".
   - You should see "test-data" appear in the Uploaded Data list.
7. **Check the database:** You can verify the row was created by running this in a database client:
   ```sql
   SELECT id, name, uploaded_by, created_at FROM bot_data;
   ```
8. **Delete the entry:** Click the "Delete" button next to "test-data".
   - It should disappear from the list.
   - Confirm it is gone from the database.

**Test failure cases:**

- Try uploading a non-JSON file (should be rejected).
- Try uploading invalid JSON (should be rejected).
- Try uploading a file with the same name twice (should be rejected).

### Step 9: Wire the bot to use the data

Now test that your Discord bot can read the data from the database:

1. **Add the code from Step 7** to your bot project.
2. **Create test data via the admin panel** (same steps as above).
3. **Run a slash command** that calls your `handleFetchData()` function.
4. **Confirm the bot loads the data** from the database and displays it.
5. **Test live updates:** Upload a new file via `/admin` and run the command again without restarting the bot. The data should update immediately.

### Practical implementation order

If you want the shortest path from zero to working, build it in this order:

1. **Add the admin check helper:** Create `src/lib/server/admin.ts` with the `isAdmin()` function (Step 2).
2. **Add the `botData` table:** Add the table definition to `src/lib/auth-schema.ts` (Step 3).
3. **Export db from auth.ts:** Add `export { db };` to `src/lib/auth.ts` so you can import it in routes.
4. **Run a migration:** Run `npx drizzle-kit generate` and `npx drizzle-kit migrate` to create the table in Postgres.
5. **Create the admin routes:** Create `src/routes/admin/+page.server.ts` and `src/routes/admin/+page.svelte` (Step 4).
6. **Add the upload action:** Fill in the `upload` function in `+page.server.ts` (Step 5).
7. **Add the delete action:** Fill in the `delete` function in `+page.server.ts` (Step 6).
8. **Test in the browser:**
   - Visit `http://localhost:5173/admin` while not logged in.
   - Log in with a non-admin GitHub account and confirm access is denied.
   - Log in with the admin email and confirm you see the upload form.
   - Upload a test JSON file and confirm it appears in the list.
   - Delete it and confirm it is gone.
9. **Write a quick bot query:** In your Discord bot project, add the query code from Step 7.
10. **Wire the bot:** Call the query function on slash command execution.

### Relevant files to create or modify

**Modify:**

- [src/lib/auth.ts](src/lib/auth.ts) — add `export { db };` at the end to make the database accessible from routes
- [src/lib/auth-schema.ts](src/lib/auth-schema.ts) — add the `botData` table definition

**Create:**

- `src/lib/server/admin.ts` — helper file with the `isAdmin()` function
- `src/routes/admin/+page.server.ts` — server-side load and actions (upload, delete)
- `src/routes/admin/+page.svelte` — the admin UI

**Reference (do not change):**

- [hooks.server.ts](hooks.server.ts) — already set up with auth
- [src/lib/auth-client.ts](src/lib/auth-client.ts) — client auth entry point for GitHub login

### Verification

1. Run the project checks after each major slice, using the existing SvelteKit typecheck and lint scripts.
2. Manually test three states in the browser: not logged in, logged in with the wrong email, and logged in with the approved email.
3. Upload a valid JSON file, confirm the row appears in the database, then delete it and confirm the row is gone.
4. Try one invalid JSON upload to confirm the server rejects bad input cleanly.
5. Query the database or use a test script to confirm the bot can parse the returned JSON without extra work.

### Decisions

- **Store JSON directly in Postgres:** The JSON data lives in a `jsonb` column in the `bot_data` table. When the bot queries it, it is already parsed into a JavaScript object. No file downloads or extra storage layers.
- **One admin email:** Only the email address in `ADMIN_EMAIL` can access `/admin`. The database will reject attempts by other logged-in users.
- **Server-side authorization:** The browser cannot forge requests to upload or delete. All security checks happen on the server.
- **Page actions for simplicity:** Using SvelteKit's `export const actions` is simpler than creating separate API endpoints for a first version.
- **Multiple datasets in one table:** You can upload 3 distinct JSON files by giving each a different `name` (e.g., "item-prices", "quest-data", "character-builds"). The bot queries by name.

### Further considerations

1. **Multiple admins:** If you later want more people to upload data, you could replace `ADMIN_EMAIL` with a `ADMIN_EMAILS` list or a table of admin users.
2. **Bot live updates:** The bot will always fetch fresh data from the database when a command is run. There is no caching, so changes are immediate.
3. **Backup the database:** Since the JSON files are stored in Postgres, make sure you have backups of your database (Supabase handles this automatically).
4. **Version history:** If you want to see who uploaded what and when, the `uploadedBy`, `createdAt`, and `updatedAt` fields are already tracked. You can add an "audit log" page later.
5. **Confirm on delete:** Add a confirmation dialog in the UI later so accidental deletes are caught: `if (confirm('Are you sure?'))`.
6. **Large JSON files:** If your JSON files get very large (>1 MB), monitor database performance. For now, this setup handles typical bot config files fine.

### Important Notes for Beginners

**File paths matter:** SvelteKit is very specific about where files go. Make sure you create files in exactly the right directories:

- `src/lib/server/admin.ts` goes in the `src/lib/server/` folder (you may need to create the `server` folder).
- `src/routes/admin/+page.server.ts` and `+page.svelte` go in `src/routes/admin/` folder (create if it doesn't exist).

**Watch for import errors:** If you get an error like "Cannot find module...", make sure:

- You are using the correct file paths in your `import` statements.
- You exported everything you need to import from other files.
- You added `export { db };` to [src/lib/auth.ts](src/lib/auth.ts).

**The database migration is mandatory:** Do not skip the `npx drizzle-kit generate` and `npx drizzle-kit migrate` steps. Without these, the `bot_data` table will not exist in your database, and uploads will fail.

**Test the admin email:** Make sure the email in your `.env` matches the email address GitHub shows for your account. If they do not match, you will be locked out of `/admin`. To check:

1. Go to GitHub settings and look at your email.
2. Make sure `ADMIN_EMAIL` in `.env` matches exactly (case-insensitive, but should still match).
3. After logging in, check your email in the browser console: `console.log(data.session.user?.email)`.

**TypeScript errors are OK initially:** As you add code, TypeScript might complain about missing types or incorrect imports. This is normal. Run `npm run check` to see all errors at once, then fix them one by one.

**Start simple:** Do not try to make the UI fancy at first. The basic HTML form and list are enough to get working. You can style it later with CSS or a component library once the core flow works.
