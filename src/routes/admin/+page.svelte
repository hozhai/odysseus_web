<script lang="ts">
	import { authClient } from '$lib/auth-client';

	let { data } = $props();

	async function signIn() {
		await authClient.signIn.social({
			provider: 'github',
			callbackURL: '/admin'
		});
	}

	async function signOut() {
		await authClient.signOut();
		window.location.href = '/admin';
	}
</script>

<div class="admin-container">
	<!-- Show if not logged in -->
	{#if !data.session}
		<div>
			<h1>Admin Access Required</h1>
			<p>You must be logged in to access this area.</p>
			<button type="button" onclick={signIn}>Sign in with GitHub</button>
			<button type="button" onclick={signOut}>Sign out</button>
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
			<p>Welcome, {data.session?.user?.email}!</p>

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
				{#if data.entries?.length === 0}
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
