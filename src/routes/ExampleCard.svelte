<script lang="ts">
	import type { Snippet } from 'svelte';
	import { onDestroy } from 'svelte';

	interface Props {
		title: string;
		code: string;
		description?: Snippet;
		children: Snippet;
	}

	let { title, code, description, children }: Props = $props();

	let copied = $state(false);
	let copyTimeout: ReturnType<typeof setTimeout> | undefined;

	async function copyCode() {
		try {
			await navigator.clipboard.writeText(code);
			copied = true;
			clearTimeout(copyTimeout);
			copyTimeout = setTimeout(() => (copied = false), 1500);
		} catch (error) {
			alert(`Failed to copy code : ${error}`);
		}
	}

	onDestroy(() => {
		clearTimeout(copyTimeout);
	});
</script>

<section class="card">
	<header class="card-header">
		<h2>{title}</h2>
		{#if description}
			<p class="description">{@render description()}</p>
		{/if}
	</header>

	<div class="card-body">
		<div class="demo">
			{@render children()}
		</div>

		<div class="code-block">
			<button class="copy-button" onclick={copyCode} type="button">
				{copied ? 'Copié !' : 'Copier'}
			</button>
			<pre><code>{code}</code></pre>
		</div>
	</div>
</section>

<style>
	.card {
		border: 1px solid var(--border-color);
		border-radius: 12px;
		background: var(--card-bg);
		padding: 1.5rem;
	}

	.card-header {
		margin-bottom: 1.25rem;
	}

	.card-header h2 {
		margin: 0 0 0.35rem;
		font-size: 1.15rem;
	}

	.description {
		margin: 0;
		color: var(--text-muted);
		font-size: 0.9rem;
	}

	.card-body {
		display: grid;
		grid-template-columns: 1fr;
		gap: 1.25rem;
	}

	@media (min-width: 900px) {
		.card-body {
			grid-template-columns: 1fr 1fr;
			align-items: start;
		}
	}

	.demo {
		display: flex;
		align-items: center;
		justify-content: center;
		min-width: 0;
		min-height: 3rem;
	}

	.code-block {
		position: relative;
		min-width: 0;
	}

	.code-block pre {
		box-sizing: border-box;
		width: 100%;
		max-width: 100%;
		margin: 0;
		padding: 1rem;
		padding-top: 2.75rem;
		background: var(--code-bg);
		border: 1px solid var(--border-color);
		border-radius: 8px;
		overflow-x: auto;
		font-size: 0.8rem;
		line-height: 1.5;
	}

	.code-block code {
		font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, 'Liberation Mono', monospace;
		white-space: pre;
	}

	.copy-button {
		position: absolute;
		top: 0.5rem;
		right: 0.5rem;
		z-index: 1;
		border: 1px solid var(--border-color);
		border-radius: 6px;
		background: var(--card-bg);
		color: var(--text-color);
		font-size: 0.75rem;
		padding: 0.3rem 0.6rem;
		cursor: pointer;
		transition: background-color 0.15s ease;
	}

	.copy-button:hover {
		background: var(--border-color);
	}
</style>
