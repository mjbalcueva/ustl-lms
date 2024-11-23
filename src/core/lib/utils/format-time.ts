/**
 * Formats a time according to the specified options.
 * @param date - The time to format.
 * @param opts - The options for formatting the time.
 * @returns The formatted time string.
 */
export function formatTime(date: Date | string | number, opts: Intl.DateTimeFormatOptions = {}) {
	return new Intl.DateTimeFormat('en-US', {
		hour: opts.hour ?? 'numeric',
		minute: opts.minute ?? 'numeric',
		...opts
	}).format(new Date(date))
}
