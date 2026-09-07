<script lang="ts">
	import type { Snippet } from 'svelte';
	import PlayButton from './PlayButton.svelte';

	type ThumbnailQuality = 'mqdefault' | 'hqdefault' | 'sddefault' | 'maxresdefault';

	interface Props {
		/**
		 * YouTube video ID
		 */
		id: string;
		/**
		 * Appears in the iframe's title attribute and in the top section of the preview
		 */
		title?: string;
		/**
		 * Thumbnail quality to use for the preview image.
		 * mqdefault: lowest quality
		 * hqdefault : medium quality
		 * sddefault : standard quality (default)
		 * maxresdefault: highest quality (may not be available for every video)
		 */
		thumbnail?: ThumbnailQuality;
		/**
		 * Show or hide the title section in the top section of the preview
		 */
		showTitle?: boolean;
		playButton?: Snippet;
		/**
		 * Load the thumbnail only when the component enters the viewport.
		 * Falls back to immediate loading when IntersectionObserver is unavailable.
		 */
		lazy?: boolean;
		/**
		 * CSS margin around the viewport used to trigger lazy thumbnail loading early,
		 * passed as-is to IntersectionObserver's rootMargin (e.g. '200px', '10% 0px').
		 * Only relevant when `lazy` is true.
		 */
		lazyMargin?: string;
		/**
		 * YouTube playlist ID to play the video alongside (passed as the `list` parameter).
		 * `id` still selects which video plays; it should belong to this playlist.
		 */
		playlistId?: string;
		/**
		 * Width of the video container (e.g. '100%', '500px')
		 */
		width?: string;
		/**
		 * Height of the video container (e.g. '100%', '300px')
		 */
		height?: string;

		/*
		 * Additional or override parameters for the YouTube iframe
		 */
		params?: Record<string, string>;
	}

	let {
		id,
		title = '',
		thumbnail = 'sddefault',
		showTitle = true,
		playButton,
		lazy = false,
		lazyMargin = '200px',
		playlistId,
		width = '100%',
		height = '100%',
		params = {}
	}: Props = $props();

	let showVideo = $state(false);
	let element: HTMLAnchorElement | undefined;
	let hasLoadedThumbnail = $state(false);
	let shouldLoadThumbnail = $derived(!lazy || hasLoadedThumbnail);

	let embedUrl = $derived(
		`https://www.youtube-nocookie.com/embed/${id}?${new URLSearchParams({
			autoplay: '1',
			playsinline: '1',
			...(playlistId ? { list: playlistId } : {}),
			...params
		}).toString()}`
	);
	let thumbnailUrl = $derived(`https://i.ytimg.com/vi/${id}/${thumbnail}.jpg`);
	let youtubeUrl = $derived(`https://www.youtube.com/watch?v=${id}`);

	$effect(() => {
		if (!lazy || hasLoadedThumbnail) return;

		if (!('IntersectionObserver' in window)) {
			hasLoadedThumbnail = true;
			return;
		}

		if (!element) return;

		const observer = new IntersectionObserver(
			(entries) => {
				if (!entries.some((entry) => entry.isIntersecting)) return;

				hasLoadedThumbnail = true;
				observer.disconnect();
			},
			{ rootMargin: lazyMargin }
		);

		observer.observe(element);

		return () => {
			observer.disconnect();
		};
	});

	async function handleClick(event: MouseEvent) {
		if (event.metaKey || event.ctrlKey) return;
		event.preventDefault();
		showVideo = true;
	}
</script>

<a
	bind:this={element}
	href={youtubeUrl}
	target="_blank"
	rel="noopener noreferrer"
	class="Youtube"
	style="background-image: {shouldLoadThumbnail
		? `url(${thumbnailUrl})`
		: 'none'}; --width: {width}; --height: {height};"
	onclick={handleClick}
>
	{#if showVideo}
		<iframe
			title={title || 'YouTube video'}
			src={embedUrl}
			allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
			allowfullscreen
		></iframe>
	{:else}
		{#if showTitle && title}
			<div class="title">{title}</div>
		{/if}
		{#if playButton}
			{@render playButton()}
		{:else}
			<PlayButton />
		{/if}
	{/if}
</a>

<style>
	.title {
		position: absolute;
		top: 0;
		height: 50px;
		width: 100%;
		box-sizing: border-box;
		padding: 20px 10px 10px 20px;
		font-family: 'YouTube Noto', Roboto, Arial, Helvetica, sans-serif;
		font-size: 18px;
		color: #fff;
		text-shadow: 0 0 2px rgb(0 0 0 / 50%);
		text-overflow: ellipsis;
		overflow: hidden;
		background: rgb(0 0 0);
		background: linear-gradient(0deg, rgb(0 0 0 / 0%) 0%, rgb(0 0 0 / 66%) 100%);
	}
	.Youtube {
		display: block;
		position: relative;
		background-position: center center;
		background-size: cover;
		cursor: pointer;
		width: var(--width);
		height: var(--height);
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
