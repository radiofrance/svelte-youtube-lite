import { describe, it, expect } from 'vitest';
import { parseYoutubeUrl } from './youtube-url.js';

describe('parseYoutubeUrl', () => {
	it('extracts the video id from a watch URL', () => {
		const result = parseYoutubeUrl('https://www.youtube.com/watch?v=aYtE6XE6b_s');

		expect(result.id).toBe('aYtE6XE6b_s');
	});

	it('extracts the video id from a youtu.be URL', () => {
		const result = parseYoutubeUrl('https://youtu.be/aYtE6XE6b_s');

		expect(result.id).toBe('aYtE6XE6b_s');
	});

	it('extracts the video id from an embed URL', () => {
		const result = parseYoutubeUrl('https://www.youtube.com/embed/aYtE6XE6b_s');

		expect(result.id).toBe('aYtE6XE6b_s');
	});

	it('extracts the video id from a shorts URL', () => {
		const result = parseYoutubeUrl('https://www.youtube.com/shorts/aYtE6XE6b_s');

		expect(result.id).toBe('aYtE6XE6b_s');
	});

	it('extracts the video id from a live URL', () => {
		const result = parseYoutubeUrl('https://www.youtube.com/live/aYtE6XE6b_s');

		expect(result.id).toBe('aYtE6XE6b_s');
	});

	it('extracts the playlist id from the list query param', () => {
		const result = parseYoutubeUrl(
			'https://www.youtube.com/watch?v=l5OZu-IrXpw&list=PL6B3937A5D230E335'
		);

		expect(result.playlistId).toBe('PL6B3937A5D230E335');
	});

	it('converts a numeric t param to a start param in seconds', () => {
		const result = parseYoutubeUrl('https://www.youtube.com/watch?v=aYtE6XE6b_s&t=90');

		expect(result.params.start).toBe('90');
	});

	it.each([
		['10s', '10'],
		['2m30s', '150'],
		['1h2m3s', '3723'],
		['1h', '3600'],
		['2m', '120']
	])('converts a human-readable t=%s param to start=%s', (t, expected) => {
		const result = parseYoutubeUrl(`https://www.youtube.com/watch?v=aYtE6XE6b_s&t=${t}`);

		expect(result.params.start).toBe(expected);
	});

	it('passes through other query params without touching v, list or t', () => {
		const result = parseYoutubeUrl(
			'https://www.youtube.com/watch?v=aYtE6XE6b_s&list=PLxxx&t=10&mute=1'
		);

		expect(result.params).toEqual({ start: '10', mute: '1' });
	});

	it('throws when given a playlist-only URL without a video id', () => {
		expect(() =>
			parseYoutubeUrl('https://www.youtube.com/playlist?list=PL6B3937A5D230E335')
		).toThrow(/playlist/i);
	});

	it('does not throw for a playlist-only URL when requireId is false', () => {
		const result = parseYoutubeUrl('https://www.youtube.com/playlist?list=PL6B3937A5D230E335', {
			requireId: false
		});

		expect(result.id).toBeUndefined();
		expect(result.playlistId).toBe('PL6B3937A5D230E335');
	});

	it('throws when given an unrecognized URL', () => {
		expect(() => parseYoutubeUrl('https://example.com/watch?v=aYtE6XE6b_s')).toThrow(
			/unrecognized/i
		);
	});

	it('throws the same consistent error for an invalid/relative URL string', () => {
		expect(() => parseYoutubeUrl('not a url')).toThrow(/unrecognized/i);
	});
});
