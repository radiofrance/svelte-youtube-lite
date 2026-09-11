import { describe, it, expect } from 'vitest';
import { preconnectOrigins, PLAYER_ORIGIN, THUMBNAIL_ORIGIN } from './preconnect.js';

describe('preconnectOrigins', () => {
	it('warms the thumbnail host as soon as the thumbnail is being fetched', () => {
		expect(preconnectOrigins('hover', { loadsThumbnail: true, warmed: false })).toEqual([
			THUMBNAIL_ORIGIN
		]);
	});

	it('leaves the thumbnail host alone while a lazy thumbnail is still out of view', () => {
		expect(preconnectOrigins('hover', { loadsThumbnail: false, warmed: false })).toEqual([]);
	});

	it('warms the player host once the visitor shows intent to play', () => {
		expect(preconnectOrigins('hover', { loadsThumbnail: true, warmed: true })).toEqual([
			THUMBNAIL_ORIGIN,
			PLAYER_ORIGIN
		]);
	});

	it('warms both hosts up front in eager mode, without waiting for the thumbnail', () => {
		expect(preconnectOrigins('eager', { loadsThumbnail: false, warmed: false })).toEqual([
			THUMBNAIL_ORIGIN,
			PLAYER_ORIGIN
		]);
	});

	it.each([
		['a thumbnail being fetched', { loadsThumbnail: true, warmed: false }],
		['a visitor showing intent to play', { loadsThumbnail: true, warmed: true }]
	])('contacts nobody in none mode, despite %s', (_label, state) => {
		expect(preconnectOrigins('none', state)).toEqual([]);
	});

	it('points at the same player origin the iframe is embedded from', () => {
		expect(PLAYER_ORIGIN).toBe('https://www.youtube-nocookie.com');
	});

	it('points at the same thumbnail origin the preview image comes from', () => {
		expect(THUMBNAIL_ORIGIN).toBe('https://i.ytimg.com');
	});
});
