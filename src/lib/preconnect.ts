/**
 * Host serving the preview thumbnails (`i.ytimg.com/vi/<id>/<quality>.jpg`).
 *
 * The thumbnail is set as a `background-image` in an inline style, which the
 * browser's preload scanner cannot see: the request only starts once the
 * element has been styled and laid out. A `preconnect` emitted next to the
 * element gets the TCP+TLS handshake going in parallel with that work instead.
 */
export const THUMBNAIL_ORIGIN = 'https://i.ytimg.com';

/**
 * Host the iframe is embedded from, and — as of today — the one serving the
 * player's own assets: an embed page pulls `/s/player/<hash>/www-player.css`
 * and `.../base.js` from its own origin, so a single connection covers the
 * document and the code that runs in it.
 *
 * The lists that circulate for YouTube embeds (`s.ytimg.com`, `www.google.com`,
 * `googleads.g.doubleclick.net`, `static.doubleclick.net`) do not apply here:
 * none of them appears in a `youtube-nocookie` embed document. Preconnecting to
 * them anyway would hand the visitor's IP to Google's ad hosts before a single
 * click, which is precisely what this library exists to avoid. The media itself
 * streams from `*.googlevideo.com`, whose hostname the player resolves at
 * playback time, so there is nothing to warm up there ahead of time.
 */
export const PLAYER_ORIGIN = 'https://www.youtube-nocookie.com';

/**
 * When to open connections to the hosts the player needs.
 *
 * - `hover`: warm the thumbnail host as it is being fetched, and the player
 *   host on the first sign that the visitor intends to play (pointer, focus or
 *   touch). Nothing is contacted ahead of an actual need.
 * - `eager`: warm both hosts as soon as the component renders, server-side
 *   rendering included. Shaves the handshake off a click that comes too fast
 *   for the hover warm-up, at the cost of connections that a visitor who never
 *   plays the video pays for anyway.
 * - `none`: emit nothing.
 */
export type PreconnectMode = 'hover' | 'eager' | 'none';

type PreconnectState = {
	/** Whether the thumbnail request is under way (false for a lazy, off-screen preview). */
	loadsThumbnail: boolean;
	/** Whether the visitor has shown intent to play (pointer, focus or touch). */
	warmed: boolean;
};

/**
 * Origins worth a `<link rel="preconnect">` for the current state, in the order
 * they will be needed.
 *
 * Kept apart from the component so the policy — which host, how early, and
 * under which mode — can be read and tested on its own.
 */
export function preconnectOrigins(mode: PreconnectMode, state: PreconnectState): string[] {
	if (mode === 'none') return [];
	if (mode === 'eager') return [THUMBNAIL_ORIGIN, PLAYER_ORIGIN];

	return [
		...(state.loadsThumbnail ? [THUMBNAIL_ORIGIN] : []),
		...(state.warmed ? [PLAYER_ORIGIN] : [])
	];
}
