/**
 * Characters that can legitimately appear in the CSS values this component
 * accepts: lengths and percentages ('300px', '100%'), keywords ('auto'),
 * ratios ('16 / 9', '2.35') and math functions ('calc(100% - 20px)').
 */
const SAFE_STYLE_VALUE = /^[a-zA-Z0-9\s.,%/()+*-]*$/;

/**
 * Guards a value on its way into the component's inline `style` attribute.
 *
 * `width`, `height` and `ratio` are concatenated into a single `style`
 * attribute as custom property values. A value carrying a `;` therefore closes
 * its own declaration and opens another one, so a caller who passes untrusted
 * data into one of these props hands the attacker arbitrary CSS on the
 * rendered `<a>`. Two consequences are worth naming:
 *
 * - `background-image: url(…)` fires a request to a host of the attacker's
 *   choosing, which defeats this library's entire purpose: contacting nobody
 *   until the user presses play.
 * - `position: fixed; inset: 0; z-index: 9999` turns the element — a link to
 *   youtube.com — into a click target covering the whole viewport.
 *
 * This stops short of XSS: Svelte escapes `"` in attribute values, so the
 * injection cannot break out of the attribute into HTML, and a declaration
 * list offers no way to open a new selector. It is CSS injection on a single
 * element. Svelte's `style:` directive is not a fix either — under SSR it
 * serializes into the same attribute and the injected declaration lands just
 * the same, so the value itself has to be checked.
 *
 * The check is an allowlist rather than a `;` blocklist, so that no escape or
 * alternate spelling has to be anticipated. It throws instead of falling back
 * to a default, matching how an unresolvable video id is handled, so that a
 * mistake surfaces loudly rather than silently rendering something else.
 */
export function assertSafeStyleValue(value: string, prop: string): string {
	if (!SAFE_STYLE_VALUE.test(value)) {
		throw new Error(
			`<Youtube>: \`${prop}\` contains characters that are not allowed in an inline ` +
				`style value: ${JSON.stringify(value)}. Allowed are letters, digits, whitespace ` +
				`and . , % / ( ) + - *`
		);
	}

	return value;
}
