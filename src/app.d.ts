/// <reference types="@sveltejs/kit" />

// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
// and what to do when importing types
declare namespace App {
	// interface Locals {}
	// interface PageData {}
	// interface Error {}
	// interface Platform {}
}

declare interface Window {
	/**
	 * A function called by the youtube API once the page is done loading the javascript file
	 * https://developers.google.com/youtube/iframe_api_reference#Requirements
	 * @returns void
	 */
	onYouTubeIframeAPIReady: () => void;
}

type ThumbnailQuality = 'mqdefault' | 'hqdefault' | 'sddefault' | 'maxresdefault';
