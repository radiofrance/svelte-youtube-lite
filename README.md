# svelte-youtube-lite

[![npm version](https://img.shields.io/npm/v/svelte-youtube-lite?logo=npm&color=cb3837)](https://www.npmjs.com/package/svelte-youtube-lite)
[![license](https://img.shields.io/npm/l/svelte-youtube-lite)](https://github.com/radiofrance/svelte-youtube-lite/blob/main/LICENSE)

A simple svelte component for creating YouTube embeds with a focus on performance and privacy (GDPR compliant).

- Loads the video thumbnail on page load
- Creates the embed when the thumbnail is clicked

**[Live demo](https://svelte-youtube-lite.vercel.app)** &middot; [npm](https://www.npmjs.com/package/svelte-youtube-lite) &middot; [GitHub](https://github.com/radiofrance/svelte-youtube-lite) &middot; [Issues](https://github.com/radiofrance/svelte-youtube-lite/issues)

## Compatibility

Version `1.0.0` and above are compatible with Svelte 5 (branch `main`). For Svelte 4 projects, use `^0.6.0` (branch `svelte4`)

## Installation

```sh
npm install -D svelte-youtube-lite
```

## Usage

_Every example below is live on the [demo page](https://svelte-youtube-lite.vercel.app), which you can also [run locally](#run-demo-locally)._

### Import

```html
<script>
	import { Youtube } from 'svelte-youtube-lite';
</script>
```

### Minimal example

```html
<Youtube id="aYtE6XE6b_s" />
```

### With low quality thumbnail

```html
<Youtube id="aYtE6XE6b_s" thumbnail="mqdefault" />
```

### With custom iframe title

_(YouTube iframe API fallback uses the videos title as iframe title)_

```html
<Youtube id="aYtE6XE6b_s" title="Cute cat video" />
```

### Without a visible title

_(the iframe still gets `title` as its `title` attribute for accessibility — `showTitle="{false}"` only hides it from the visual overlay)_

```html
<Youtube id="aYtE6XE6b_s" title="Cute cat video" showTitle="{false}" />
```

### With playlist

Plays `id` as part of the given playlist. `id` should belong to the playlist for the "play next" behavior to make sense.

```html
<Youtube id="aYtE6XE6b_s" playlistId="PLxxxxxxxxxxxxxxxx" />
```

### From a full YouTube URL

`id` is optional when `url` is given: pass any watch, `youtu.be`, `embed`, `shorts` or `live` URL and `id`, `playlistId` and the `start` time (from a `t` query param) are derived from it automatically. Explicit `id`/`playlistId`/`params` props always win over what's parsed from `url`.

```html
<Youtube url="https://www.youtube.com/watch?v=aYtE6XE6b_s&t=90&list=PLxxxxxxxxxxxxxxxx" />
```

A playlist URL without a video id (e.g. `youtube.com/playlist?list=...`) requires `id` to be passed explicitly — TypeScript will flag a hardcoded URL literal that's missing one at compile time, and a `url` coming from a dynamic source (e.g. fetched at runtime) throws instead.

### Aspect ratio

The player is 16:9 by default. `ratio` takes any CSS ratio and suggests `16 / 9`, `4 / 3`, `1 / 1` and `9 / 16` as presets — the union stays open, so `21 / 9` or `2.35` are just as valid.

```html
<Youtube id="aYtE6XE6b_s" ratio="4 / 3" />
```

`width`, `height` and `ratio` are concatenated into the component's inline `style` attribute, so they accept only the characters a CSS value needs — letters, digits, whitespace and `. , % / ( ) + - *` — and throw on anything else. That keeps a caller who forwards untrusted data into one of these props from injecting further declarations, such as a `background-image: url(…)` pointing at a host of their choosing.

### YouTube Shorts

A `shorts` URL sets `ratio` to `9 / 16` on its own, so the vertical video fills the player instead of sitting between black bars. It can be overridden by explicitly setting the `ratio` prop.

```html
<Youtube url="https://www.youtube.com/shorts/EWFiN3atGsM" />
```

A Short given as a bare `id` is indistinguishable from a regular video without asking YouTube, so pass the ratio explicitly in that case:

```html
<Youtube id="EWFiN3atGsM" ratio="9 / 16" />
```

### Preconnect

A click on the preview has to resolve DNS, open a TCP connection and negotiate TLS before the player can even start downloading. `preconnect` gets that out of the way ahead of time:

| value               | behavior                                                                                                                                                  |
| ------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `hover` _(default)_ | Warms `i.ytimg.com` while the preview thumbnail loads, and `www.youtube-nocookie.com` on the first pointer, focus or touch — nothing before it is needed. |
| `eager`             | Warms both hosts as soon as the component renders, server-side rendering included.                                                                        |
| `none`              | Emits nothing.                                                                                                                                            |

```html
<Youtube id="aYtE6XE6b_s" preconnect="eager" />
```

Only those two hosts are warmed. A `youtube-nocookie` embed serves its player CSS and JS from its own origin, so the hosts usually listed for YouTube embeds — `s.ytimg.com`, `www.google.com`, `googleads.g.doubleclick.net`, `static.doubleclick.net` — are never contacted by it; preconnecting to them would leak the visitor's IP to Google's ad hosts before any click, which is what this library exists to avoid. The video stream itself comes from `*.googlevideo.com`, whose hostname the player resolves at playback time, so there is nothing to warm up there in advance.

With `lazy`, an off-screen preview warms nothing until it enters the viewport.

### Custom Play Button

If you want to use a custom play button, you can use the `snippet` slot to add your own button. A `PlayButton` component is also provided if you simply want to change the `title` and `aria-label` of the default play button.

```html
<Youtube {id} showTitle="{false}">
	{#snippet playButton()}
	<button style="position: absolute; left: 50%; top: 50%; transform: translate3d(-50%, -50%, 0);">
		A completely custom button
	</button>
	{/snippet}
</Youtube>
```

## Run demo locally

```sh
git clone https://github.com/radiofrance/svelte-youtube-lite.git
cd svelte-youtube-lite
npm i
npm run dev
```

The demo page is deployed from `main` at [svelte-youtube-lite.vercel.app](https://svelte-youtube-lite.vercel.app).

## Todo

- [x] support for full youtube urls (eg: with playlist and start time) ?
- [x] support for youtube shorts ? change from 16:9 to vertical ?
- [x] use DNS preconnect for all youtube iframe assets
- [x] parameter (boolean) : load with intersection observer
- [x] parameter (number) : start time
- [x] parameter (string) : playlist id
- [ ] fallback to YouTube iframe API for browsers with bad autoplay support

## License

[MIT](https://github.com/radiofrance/svelte-youtube-lite/blob/main/LICENSE) &copy; Radio France
