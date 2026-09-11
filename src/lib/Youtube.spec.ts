import { describe, it, expect } from 'vitest';
import { render } from 'svelte/server';
import Youtube from './Youtube.svelte';

const HOSTILE = '9 / 16; background-image: url(https://attacker.example/beacon.png)';

function styleOf(props: Record<string, unknown>): string {
	const { body } = render(Youtube, { props });
	return body.match(/style="[^"]*"/)?.[0] ?? '';
}

function preconnectedHosts(props: Record<string, unknown>): string[] {
	const { head } = render(Youtube, { props });
	return [...head.matchAll(/<link rel="preconnect" href="https:\/\/([^"]+)"/g)].map(
		([, host]) => host
	);
}

describe('Youtube', () => {
	it('derives a vertical ratio from a shorts URL', () => {
		expect(styleOf({ url: 'https://www.youtube.com/shorts/EWFiN3atGsM' })).toContain(
			'--ratio: 9 / 16'
		);
	});

	it('defaults to a 16 / 9 ratio', () => {
		expect(styleOf({ id: 'aYtE6XE6b_s' })).toContain('--ratio: 16 / 9');
	});

	it.each([
		['ratio', '2.35'],
		['width', 'calc(100% - 20px)'],
		['height', 'min(100%, 500px)']
	])('passes a legitimate %s through to the inline style', (prop, value) => {
		expect(styleOf({ id: 'aYtE6XE6b_s', [prop]: value })).toContain(`${value}`);
	});

	it.each(['ratio', 'width', 'height'])(
		'refuses a %s that would inject a further declaration',
		(prop) => {
			expect(() => styleOf({ id: 'aYtE6XE6b_s', [prop]: HOSTILE })).toThrow(
				new RegExp(`\`${prop}\`.*not allowed in an inline style value`)
			);
		}
	);
});

describe('Youtube preconnect', () => {
	it('warms the thumbnail host on render, but not the player host', () => {
		expect(preconnectedHosts({ id: 'aYtE6XE6b_s' })).toEqual(['i.ytimg.com']);
	});

	it('warms nothing for a lazy preview that has not entered the viewport yet', () => {
		expect(preconnectedHosts({ id: 'aYtE6XE6b_s', lazy: true })).toEqual([]);
	});

	it('warms both hosts on render in eager mode, lazy preview included', () => {
		expect(preconnectedHosts({ id: 'aYtE6XE6b_s', lazy: true, preconnect: 'eager' })).toEqual([
			'i.ytimg.com',
			'www.youtube-nocookie.com'
		]);
	});

	it('warms nothing at all in none mode', () => {
		expect(preconnectedHosts({ id: 'aYtE6XE6b_s', preconnect: 'none' })).toEqual([]);
	});

	it('leaves the link uncredentialed, so it warms the pool the iframe and image use', () => {
		const { head } = render(Youtube, { props: { id: 'aYtE6XE6b_s', preconnect: 'eager' } });
		expect(head).not.toContain('crossorigin');
	});
});
