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

		<button type="button" onclick={signOut}>Sign out</button>
	{/if}

	<!-- Show if admin -->
	{#if data.authorized}
		<div>
			<h1>Admin Panel</h1>
			<p>Welcome, {data.session?.user?.email}!</p>

			<!-- Upload form -->
			<section>
				<h2>Upload Bot Data Files</h2>
				<form method="POST" action="?/upload" enctype="multipart/form-data">
					<div style="margin-bottom: 1rem;">
						<label for="items">Items JSON:</label>
						<input type="file" id="items" name="items" accept=".json" />
					</div>
					<div style="margin-bottom: 1rem;">
						<label for="weapons">Weapons JSON:</label>
						<input type="file" id="weapons" name="weapons" accept=".json" />
					</div>
					<div style="margin-bottom: 1rem;">
						<label for="magics">Magics JSON:</label>
						<input type="file" id="magics" name="magics" accept=".json" />
					</div>
					<button type="submit">Upload</button>
				</form>
			</section>

			<!-- Current data status -->
			<section>
				<h2>Current Bot Data</h2>
				{#if !data.botData}
					<p>No data uploaded yet.</p>
				{:else}
					<div>
						<p>
							<strong>Last Updated:</strong>
							{new Date(data.botData.updatedAt).toLocaleString()}
						</p>
						<p>
							<strong>Items:</strong>
							{data.botData.items ? 'Loaded' : 'Not loaded'}
						</p>
						<p>
							<strong>Weapons:</strong>
							{data.botData.weapons ? 'Loaded' : 'Not loaded'}
						</p>
						<p>
							<strong>Magics:</strong>
							{data.botData.magics ? 'Loaded' : 'Not loaded'}
						</p>
					</div>
				{/if}
			</section>

			<button type="button" onclick={signOut}>Sign out</button>
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

	label {
		display: block;
		margin-bottom: 0.25rem;
		font-weight: 500;
	}
</style>
