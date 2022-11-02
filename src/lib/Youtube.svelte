<script lang="ts">
	import { tick } from 'svelte';
	import { createYoutubeEmbed, getYTApiRequirements } from '../embedUtils';
	import PlayButton from '../components/PlayButton.svelte';

	/**
	 * YouTube video ID
	 */
	export let id: string;
	/**
	 * Appears in the iframe's title attribute
	 */
	export let title: string = 'Youtube video';
	/**
	 * Thumbnail quality to use for the preview image.
	 * mqdefault: lowest quality
	 * hqdefault : medium quality
	 * sddefault : standard quality (default)
	 * maxresdefault: highest quality (may not be available for every video)
	 */
	export let thumbnail: ThumbnailQuality = 'sddefault';

	let showVideo = false;
	let embedUrl = '';
	let thumbnailUrl = '';
	let youtubeUrl = '';
	let needsYTApiForAutoplay = true;
	let YTApiScript: HTMLScriptElement;
	let YTApiContainer: HTMLDivElement;

	const params = new URLSearchParams({ autoplay: '1', playsinline: '1' });

	$: embedUrl = `https://www.youtube-nocookie.com/embed/${id}?${params.toString()}`;
	$: thumbnailUrl = `https://i.ytimg.com/vi/${id}/${thumbnail}.jpg`;
	$: youtubeUrl = `https://www.youtube.com/watch?v=${id}`;

	async function handleClick(event: MouseEvent) {
		// needsYTApiForAutoplay = getYTApiRequirements();
		if (event.metaKey || event.ctrlKey) return;
		event.preventDefault();
		showVideo = true;

		if (needsYTApiForAutoplay) {
			await tick();
			window.onYouTubeIframeAPIReady = createYoutubeEmbed(YTApiContainer, id, params);
		}
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
		{#if needsYTApiForAutoplay}
			<script
				async={true}
				src="https://www.youtube.com/iframe_api"
				bind:this={YTApiScript}
			></script>
			<div bind:this={YTApiContainer} />
		{:else}
			<iframe
				{title}
				src={embedUrl}
				allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
				allowfullscreen
			/>
		{/if}
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
