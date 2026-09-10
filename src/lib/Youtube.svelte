<script lang="ts" generics="U extends string = string">
	import type { Snippet } from 'svelte';
	import PlayButton from './PlayButton.svelte';
	import { parseYoutubeUrl, type ValidateYoutubeUrl } from './youtube-url.js';

	type ThumbnailQuality = 'mqdefault' | 'hqdefault' | 'sddefault' | 'maxresdefault';

	// `url` only needs to statically embed a video id (see ValidateYoutubeUrl)
	// when `id` isn't given explicitly; the union lets TS see that instead of
	// validating `url` in isolation, which would flag a valid id+playlistUrl pair.
	type IdOrUrl<U extends string> =
		| {
				/**
				 * YouTube video ID.
				 */
				id: string;
				/**
				 * Any YouTube URL (watch, youtu.be, embed, shorts or live) to derive
				 * `playlistId` and player params (e.g. `t` becomes `start`) from.
				 * Explicit `playlistId`/`params` props always take precedence over
				 * what's parsed from `url`.
				 */
				url?: string;
		  }
		| {
				id?: undefined;
				/**
				 * Any YouTube URL (watch, youtu.be, embed, shorts or live) to derive
				 * `id`, `playlistId` and player params (e.g. `t` becomes `start`)
				 * from. A playlist-only URL (no video id) requires `id` to be
				 * provided explicitly instead.
				 */
				url?: ValidateYoutubeUrl<U>;
		  };

	type Props = IdOrUrl<U> & {
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
		 * Show or hide `title` in the top section of the preview. The iframe's
		 * `title` attribute is unaffected: it's always set when `title` is provided,
		 * regardless of this option.
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
	};

	let {
		id,
		url,
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

	// `url`'s type is branded (ValidateYoutubeUrl<U>) for callers; once past that
	// check it's always a plain string, so parsing it back as one is safe here.
	let parsedUrl = $derived(url ? parseYoutubeUrl(url as string, { requireId: !id }) : undefined);
	// TS can't fully guarantee an id at the type level (e.g. plain JS callers,
	// `as any`, or a URL that type-checks but has no video id at runtime), so
	// this guards against silently rendering "…/undefined" URLs.
	let effectiveId = $derived.by(() => {
		const resolved = id ?? parsedUrl?.id;
		if (!resolved) {
			throw new Error(
				'<Youtube>: could not resolve a video id. Pass `id`, or a `url` that contains one.'
			);
		}
		return resolved;
	});
	let effectivePlaylistId = $derived(playlistId ?? parsedUrl?.playlistId);
	let effectiveParams = $derived({ ...parsedUrl?.params, ...params });

	let embedUrl = $derived(
		`https://www.youtube-nocookie.com/embed/${effectiveId}?${new URLSearchParams({
			autoplay: '1',
			playsinline: '1',
			...(effectivePlaylistId ? { list: effectivePlaylistId } : {}),
			...effectiveParams
		}).toString()}`
	);
	let thumbnailUrl = $derived(`https://i.ytimg.com/vi/${effectiveId}/${thumbnail}.jpg`);
	let youtubeUrl = $derived(`https://www.youtube.com/watch?v=${effectiveId}`);

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
