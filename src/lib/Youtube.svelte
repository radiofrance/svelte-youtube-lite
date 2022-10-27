<script lang="ts">
	import PlayButton from './PlayButton.svelte';

	export let youtubeId: string = '';

	let showVideo = false;
	let embedUrl = '';
	let thumbnailUrl = '';
	let youtubeUrl = '';

	const params = new URLSearchParams({ autoplay: '1', playsinline: '1' });

	$: youtubeId = youtubeId.startsWith('http') ? youtubeId.split('v=')[1] : youtubeId;
	$: embedUrl = `https://www.youtube-nocookie.com/embed/${youtubeId}?${params.toString()}`;
	$: thumbnailUrl = `https://i.ytimg.com/vi/${youtubeId}/hqdefault.jpg`; // props to use sddefault/maxresdefault ?
	$: youtubeUrl = `https://www.youtube.com/watch?v=${youtubeId}`;

	function handleClick(event: MouseEvent) {
		if (event.metaKey || event.ctrlKey) return;
		event.preventDefault();
		showVideo = true;
	}
</script>

<a
	href={youtubeUrl}
	target="_blank"
	rel="noopener noreferrer"
	class="Youtube"
	style="background-image: url({thumbnailUrl});"
	on:click={handleClick}
>
	{#if showVideo}
		<iframe
			title="Youtube video"
			src={embedUrl}
			allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
			allowfullscreen
		/>
	{:else}
		<PlayButton />
	{/if}
</a>

<style>
	.Youtube {
		display: block;
		position: relative;
		background-position: center center;
		background-size: cover;
		cursor: pointer;
		max-width: 720px;
	}

	:global(.Youtube:hover .PlayButton) {
		filter: grayscale(0);
	}

	.Youtube::after {
		content: '';
		display: block;
		padding-bottom: calc(100% / (16 / 9));
	}

	.Youtube iframe {
		position: absolute;
		border: none;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
	}
</style>
