<script lang="ts">
	import Youtube from '$lib/Youtube.svelte';
	import PlayButton from '$lib/PlayButton.svelte';
	import ExampleCard from './ExampleCard.svelte';

	const id = 'aYtE6XE6b_s';
	const lazyId = '9jLTaiT_cVs';
	const playlistVideoId = 'l5OZu-IrXpw';
	const playlistId = 'PL6B3937A5D230E335';
	const shortId = '6IlJ-caK_7A';
</script>

<div class="page">
	<header class="hero">
		<h1>svelte-youtube-lite</h1>
		<p>
			A lightweight Svelte wrapper around the YouTube embed, loading only a thumbnail until the user
			presses play.
		</p>
		<a
			class="repo-link"
			href="https://github.com/radiofrance/svelte-youtube-lite"
			target="_blank"
			rel="noopener noreferrer">View on GitHub</a
		>
	</header>

	<div class="examples">
		<ExampleCard
			title="Basic example (fits container size)"
			code={`<div style="width: 100%; height: 300px;">
	<Youtube id="${id}" />
</div>`}
		>
			<div class="container">
				<Youtube {id} />
			</div>
		</ExampleCard>

		<ExampleCard
			title="Fixed size example"
			code={`<Youtube id="${id}" width="100px" height="100px" />`}
		>
			<Youtube {id} width="100px" height="100px" />
		</ExampleCard>

		<ExampleCard
			title="Responsive size example"
			code={`<div style="width: 100%; height: 400px;">
	<Youtube id="${id}" width="100%" height="100%" />
</div>`}
		>
			<div class="responsive-container">
				<Youtube {id} width="100%" height="100%" />
			</div>
		</ExampleCard>

		<ExampleCard
			title="Low quality thumbnail"
			code={`<Youtube id="${id}" thumbnail="mqdefault" />`}
		>
			<Youtube {id} thumbnail="mqdefault" />
		</ExampleCard>

		<ExampleCard title="Custom iframe title" code={`<Youtube id="${id}" title="Cute cat video" />`}>
			{#snippet description()}
				(YouTube iframe API fallback uses the video's title as iframe title)
			{/snippet}
			<Youtube {id} title="Cute cat video" />
		</ExampleCard>

		<ExampleCard
			title="Without a visible title"
			code={`<Youtube id="${id}" title="Cute cat video" showTitle={false} />`}
		>
			{#snippet description()}
				(the iframe still gets "Cute cat video" as its title attribute for accessibility; showTitle
				only hides it from the visual overlay)
			{/snippet}
			<Youtube {id} title="Cute cat video" showTitle={false} />
		</ExampleCard>

		<ExampleCard
			title="Custom aria label button"
			code={`<Youtube id="${id}" showTitle={false}>
	{#snippet playButton()}
		<PlayButton ariaLabel="Custom play button" />
	{/snippet}
</Youtube>`}
		>
			<Youtube {id} showTitle={false}>
				{#snippet playButton()}
					<PlayButton ariaLabel="Custom play button" />
				{/snippet}
			</Youtube>
		</ExampleCard>

		<ExampleCard
			title="Custom button"
			code={`<Youtube id="${id}" showTitle={false}>
	{#snippet playButton()}
		<button
			style="position: absolute; left: 50%; top: 50%; transform: translate3d(-50%, -50%, 0);"
		>
			A completely custom button
		</button>
	{/snippet}
</Youtube>`}
		>
			<Youtube {id} showTitle={false}>
				{#snippet playButton()}
					<button
						style="position: absolute; left: 50%; top: 50%; transform: translate3d(-50%, -50%, 0);"
						>A completely custom button</button
					>
				{/snippet}
			</Youtube>
		</ExampleCard>

		<ExampleCard
			title="With custom player parameters"
			code={`<Youtube id="${id}" params={{ start: '30', mute: '1' }} />`}
		>
			{#snippet description()}
				Video starts at 30s and is muted
			{/snippet}
			<Youtube {id} params={{ start: '30', mute: '1' }} />
		</ExampleCard>

		<ExampleCard
			title="Lazy loaded thumbnail"
			code={`<Youtube id="${lazyId}" lazy title="Lazy loaded YouTube thumbnail" />`}
		>
			{#snippet description()}
				Loads only when the video enters the viewport.
			{/snippet}
			<Youtube id={lazyId} lazy title="Lazy loaded YouTube thumbnail" />
		</ExampleCard>

		<ExampleCard
			title="With playlist"
			code={`<Youtube id="${playlistVideoId}" playlistId="${playlistId}" title="Singularity" />`}
		>
			{#snippet description()}
				Plays as part of the "Official Blender Open Movies" playlist.
			{/snippet}
			<Youtube id={playlistVideoId} {playlistId} title="Singularity" />
		</ExampleCard>

		<ExampleCard
			title="From a full YouTube URL"
			code={`<Youtube
	url="https://www.youtube.com/watch?v=l5OZu-IrXpw&list=PL6B3937A5D230E335"
	title="Singularity"
/>`}
		>
			{#snippet description()}
				id and playlistId are both derived from a single watch URL.
			{/snippet}
			<Youtube
				url="https://www.youtube.com/watch?v=l5OZu-IrXpw&list=PL6B3937A5D230E335"
				title="Singularity"
			/>
		</ExampleCard>

		<ExampleCard
			title="From a youtu.be URL with a timestamp"
			code={`<Youtube url="https://youtu.be/${id}?t=30" />`}
		>
			{#snippet description()}
				Video starts at 30s, derived from the `t` query param.
			{/snippet}
			<Youtube url="https://youtu.be/{id}?t=30" />
		</ExampleCard>

		<ExampleCard
			title="YouTube Short from its URL"
			code={`<Youtube url="https://www.youtube.com/shorts/${shortId}" width="270px" />`}
		>
			{#snippet description()}
				A shorts URL switches the player to a 9 / 16 ratio on its own, so the vertical video fills
				it instead of being letterboxed. It can be overridden by explicitly setting the `ratio`
				prop.
			{/snippet}
			<Youtube url="https://www.youtube.com/shorts/{shortId}" width="270px" />
		</ExampleCard>

		<ExampleCard
			title="Explicit aspect ratio"
			code={`<Youtube id="${shortId}" ratio="9 / 16" width="270px" />`}
		>
			{#snippet description()}
				A bare Short id looks like any other video id, so pass `ratio` yourself. '16 / 9', '4 / 3',
				'1 / 1' and '9 / 16' are offered as presets, and any other CSS ratio works too.
			{/snippet}
			<Youtube id={shortId} ratio="9 / 16" width="270px" />
		</ExampleCard>

		<ExampleCard title="Eager preconnect" code={`<Youtube id="${id}" preconnect="eager" />`}>
			{#snippet description()}
				Connections to the thumbnail and player hosts are normally opened as they are needed: the
				thumbnail host while the preview loads, the player host on the first pointer, focus or
				touch. `eager` opens both as soon as the component renders, which suits a player the visitor
				is expected to start right away. `none` opens neither.
			{/snippet}
			<Youtube {id} preconnect="eager" width="270px" />
		</ExampleCard>
	</div>
</div>

<style>
	:global(:root) {
		--bg: #ffffff;
		--text-color: #1a1a1a;
		--text-muted: #6b6b6b;
		--border-color: #e2e2e2;
		--card-bg: #fafafa;
		--code-bg: #f2f2f2;
		--accent: #ff0000;
	}

	@media (prefers-color-scheme: dark) {
		:global(:root) {
			--bg: #121212;
			--text-color: #f0f0f0;
			--text-muted: #a0a0a0;
			--border-color: #2e2e2e;
			--card-bg: #1a1a1a;
			--code-bg: #0f0f0f;
			--accent: #ff4d4d;
		}
	}

	:global(body) {
		background: var(--bg);
		color: var(--text-color);
		font-family:
			-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
	}

	.page {
		max-width: 1100px;
		margin: 0 auto;
		padding: 2.5rem 1.5rem 4rem;
	}

	.hero {
		text-align: center;
		margin-bottom: 3rem;
	}

	.hero h1 {
		margin: 0 0 0.5rem;
		font-size: 2rem;
	}

	.hero p {
		max-width: 40rem;
		margin: 0 auto 1rem;
		color: var(--text-muted);
	}

	.repo-link {
		display: inline-block;
		color: var(--accent);
		font-weight: 600;
		text-decoration: none;
	}

	.repo-link:hover {
		text-decoration: underline;
	}

	.examples {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
	}

	.container {
		width: 100%;
		height: 300px;
	}

	.responsive-container {
		width: 100%;
		height: 400px;
	}

	@media (max-width: 768px) {
		.responsive-container {
			height: 300px;
		}
	}
</style>
