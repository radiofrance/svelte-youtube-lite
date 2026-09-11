type HasVideoId<S extends string> = S extends `${string}v=${string}`
	? true
	: S extends `${string}youtu.be/${string}`
		? true
		: S extends `${string}/embed/${string}`
			? true
			: S extends `${string}/shorts/${string}`
				? true
				: S extends `${string}/live/${string}`
					? true
					: false;

type IsPlaylistOnly<S extends string> = S extends `${string}/playlist${string}`
	? HasVideoId<S> extends true
		? false
		: true
	: false;

export type ValidateYoutubeUrl<S extends string> =
	IsPlaylistOnly<S> extends true
		? { error: 'Playlist URL without a video id — pass `id` explicitly' }
		: S;

export interface ParsedYoutubeUrl {
	id?: string;
	playlistId?: string;
	params: Record<string, string>;
	/**
	 * Whether the URL points at a YouTube Short, which is filmed vertically and
	 * therefore wants a vertical player instead of the default 16:9 one.
	 */
	isShort: boolean;
}

const SHORTS_PREFIX = '/shorts/';

const PATH_PREFIXES = ['/embed/', SHORTS_PREFIX, '/live/'];

const HUMAN_READABLE_TIME = /^(?:(\d+)h)?(?:(\d+)m)?(?:(\d+)s)?$/;

function toStartSeconds(t: string): string {
	if (/^\d+$/.test(t)) return t;

	const match = HUMAN_READABLE_TIME.exec(t);
	if (!match) return t;

	const [, hours = '0', minutes = '0', seconds = '0'] = match;
	return String(Number(hours) * 3600 + Number(minutes) * 60 + Number(seconds));
}

function extractId(parsed: URL): string | undefined {
	if (parsed.hostname === 'youtu.be') {
		return parsed.pathname.slice(1) || undefined;
	}

	const prefix = PATH_PREFIXES.find((p) => parsed.pathname.startsWith(p));
	if (prefix) {
		return parsed.pathname.slice(prefix.length) || undefined;
	}

	return parsed.searchParams.get('v') ?? undefined;
}

function isYoutubeHostname(hostname: string): boolean {
	return hostname === 'youtu.be' || hostname.endsWith('.youtube.com') || hostname === 'youtube.com';
}

export function parseYoutubeUrl(
	url: string,
	{ requireId = true }: { requireId?: boolean } = {}
): ParsedYoutubeUrl {
	let parsed: URL;
	try {
		parsed = new URL(url);
	} catch {
		throw new Error(`Unrecognized YouTube URL: ${url}`);
	}

	if (!isYoutubeHostname(parsed.hostname)) {
		throw new Error(`Unrecognized YouTube URL: ${url}`);
	}

	const id = extractId(parsed);
	if (parsed.pathname === '/playlist' && !id && requireId) {
		throw new Error(
			`Playlist URL without a video id: ${url}. Pass \`id\` explicitly, or a URL that also contains a video id.`
		);
	}

	const params: Record<string, string> = {};

	for (const [key, value] of parsed.searchParams) {
		if (key === 'v' || key === 'list') continue;
		if (key === 't') {
			params.start = toStartSeconds(value);
			continue;
		}
		params[key] = value;
	}

	return {
		id,
		playlistId: parsed.searchParams.get('list') ?? undefined,
		params,
		isShort:
			parsed.pathname.startsWith(SHORTS_PREFIX) || parsed.pathname === SHORTS_PREFIX.slice(0, -1)
	};
}
