import { describe, it, expect } from 'vitest';
import { assertSafeStyleValue } from './css-value.js';

describe('assertSafeStyleValue', () => {
	it.each([
		'100%',
		'300px',
		'100vh',
		'50rem',
		'auto',
		'calc(100% - 20px)',
		'min(100%, 500px)',
		'16 / 9',
		'9 / 16',
		'2.35',
		''
	])('returns %s unchanged', (value) => {
		expect(assertSafeStyleValue(value, 'width')).toBe(value);
	});

	it('rejects a semicolon, which would end the declaration and start a new one', () => {
		expect(() => assertSafeStyleValue('270px; position: fixed; inset: 0', 'width')).toThrow(
			/width/
		);
	});

	it('rejects a colon, which url(https://…) needs to reach an external host', () => {
		expect(() => assertSafeStyleValue('url(https://attacker.example/b.png)', 'ratio')).toThrow(
			/ratio/
		);
	});

	it.each([
		['a double quote', '100%" onmouseover="alert(1)'],
		['a single quote', "100%' onmouseover='alert(1)"],
		['angle brackets', '100%</style>'],
		['braces', '100%} .x {'],
		['a backslash escape', '100%\\3b'],
		['an at-rule', '100% @media'],
		['an !important override', '100% !important']
	])('rejects %s', (_label, value) => {
		expect(() => assertSafeStyleValue(value, 'height')).toThrow(/height/);
	});

	it('names the offending value in the error message', () => {
		expect(() => assertSafeStyleValue('1;2', 'ratio')).toThrow(/1;2/);
	});
});
