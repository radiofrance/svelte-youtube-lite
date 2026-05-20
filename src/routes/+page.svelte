<script>
	import Youtube from '$lib/Youtube.svelte';
	import PlayButton from '$lib/PlayButton.svelte';

	const id = 'aYtE6XE6b_s';
</script>

<div class="page">
	<h1>svelte-youtube-lite demo</h1>

	<h2>Basic Example (Fits Container Size)</h2>
	<div class="container">
		<Youtube {id} />
	</div>

	<h2>Fixed Size Example</h2>
	<Youtube {id} width="100px" height="100px" />

	<h2>Responsive Size Example</h2>
	<div class="responsive-container">
		<Youtube {id} width="100%" height="100%" />
	</div>

	<h2>Low Quality Thumbnail</h2>
	<Youtube {id} thumbnail="mqdefault" />

	<h2>Custom iframe Title</h2>
	<p><em>(YouTube iframe API fallback uses the video's title as iframe title)</em></p>
	<Youtube {id} title="Cute cat video" />

	<h2>Without Title</h2>
	<Youtube {id} showTitle={false} />

	<h2>Custom aria label button</h2>
	<Youtube {id} showTitle={false}>
		{#snippet playButton()}
			<PlayButton ariaLabel="Custom play button" />
		{/snippet}
	</Youtube>

	<h2>Custom button</h2>
	<Youtube {id} showTitle={false}>
		{#snippet playButton()}
			<button
				style="position: absolute; left: 50%; top: 50%; transform: translate3d(-50%, -50%, 0);"
				>A completely custom button</button
			>
		{/snippet}
	</Youtube>

	<h2>With custom player parameters</h2>
	<p>Video starts at 30s and is muted</p>
	<Youtube {id} params={{ start: '30', mute: '1' }} />
</div>

<style>
	.page {
		max-width: 608px;
		margin-left: auto;
		margin-right: auto;
	}

	.container {
		width: 100%;
		height: 300px;
		margin-bottom: 2rem;
	}

	.responsive-container {
		width: 100%;
		height: 400px;
		margin-bottom: 2rem;
	}

	@media (max-width: 768px) {
		.responsive-container {
			height: 300px;
		}
	}
</style>
