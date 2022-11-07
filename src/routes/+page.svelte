<script>
	import Youtube from '$lib/Youtube.svelte';
</script>

<h1>svelte-youtube-lite demo</h1>

<h2>Minimal example</h2>
<Youtube id="QH2-TGUlwu4" />

<h2>With low quality thumbnail</h2>
<Youtube id="QH2-TGUlwu4" thumbnail="mqdefault" />

<h2>With custom iframe title</h2>
<p><em>(YouTube iframe API fallback uses the videos title as iframe title)</em></p>
<Youtube id="QH2-TGUlwu4" title="Cute cat video" />

<h2>Without title</h2>
<Youtube id="QH2-TGUlwu4" showTitle={false} />
