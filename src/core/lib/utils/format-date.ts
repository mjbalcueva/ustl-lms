/**
 * Formats a date according to the specified options.
 * @param date - The date to format.
 * @param opts - The options for formatting the date.
 * @returns The formatted date string.
 */
export function formatDate(date: Date | string | number, opts: Intl.DateTimeFormatOptions = {}) {
	return new Intl.DateTimeFormat('en-US', {
		month: opts.month ?? 'long',
		day: opts.day ?? 'numeric',
		year: opts.year ?? 'numeric',
		...opts
	}).format(new Date(date))
}

/**
 * Gets the day of the week for a given date.
 * @param date - The date to get the day of the week for.
 * @returns The day of the week.
 */
export function getDayOfWeek(date: Date | string | number) {
	return new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(new Date(date))
}
