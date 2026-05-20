<script>
	import Youtube from '$lib/Youtube.svelte';
	import PlayButton from '$lib/PlayButton.svelte';

	const id = 'aYtE6XE6b_s';
</script>

<div class="page">
	<h1>svelte-youtube-lite demo</h1>

	<h2>Minimal example</h2>
	<Youtube {id} />

	<h2>With low quality thumbnail</h2>
	<Youtube {id} thumbnail="mqdefault" />

	<h2>With custom iframe title</h2>
	<p><em>(YouTube iframe API fallback uses the videos title as iframe title)</em></p>
	<Youtube {id} title="Cute cat video" />

	<h2>Without title</h2>
	<Youtube {id} showTitle={false} />

	<h2>With custom aria label button</h2>
	<Youtube {id} showTitle={false}>
		{#snippet playButton()}
			<PlayButton ariaLabel="Custom play button" />
		{/snippet}
	</Youtube>

	<h2>With custom button</h2>
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
</style>
