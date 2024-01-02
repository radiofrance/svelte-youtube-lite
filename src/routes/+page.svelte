<script>
	import Youtube from '$lib/Youtube.svelte';
</script>

<div class="page">
	<h1>svelte-youtube-lite demo</h1>

	<h2>Minimal example</h2>
	<Youtube id="aYtE6XE6b_s" />

	<h2>With low quality thumbnail</h2>
	<Youtube id="aYtE6XE6b_s" thumbnail="mqdefault" />

	<h2>With custom iframe title</h2>
	<p><em>(YouTube iframe API fallback uses the videos title as iframe title)</em></p>
	<Youtube id="aYtE6XE6b_s" title="Cute cat video" />

	<h2>Without title</h2>
	<Youtube id="aYtE6XE6b_s" showTitle={false} />
</div>

<style>
	.page {
		max-width: 608px;
		margin-left: auto;
		margin-right: auto;
	}
</style>
