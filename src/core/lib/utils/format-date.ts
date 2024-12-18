/**
 * Safely converts a value to a Date object
 * @param date - The date to convert
 * @returns A valid Date object or null if invalid
 */
function toValidDate(date: Date | string | number): Date | null {
	if (date instanceof Date) return isNaN(date.getTime()) ? null : date
	if (typeof date === 'number' && isNaN(date)) return null

	try {
		const parsed = new Date(date)
		return isNaN(parsed.getTime()) ? null : parsed
	} catch {
		return null
	}
}

/**
 * Formats a date according to the specified options.
 * @param date - The date to format.
 * @param opts - The options for formatting the date.
 * @returns The formatted date string.
 */
export function formatDate(
	date: Date | string | number,
	opts: Intl.DateTimeFormatOptions = {}
) {
	const validDate = toValidDate(date)
	if (!validDate) return 'Invalid date'

	return new Intl.DateTimeFormat('en-US', {
		month: opts.month ?? 'long',
		day: opts.day ?? 'numeric',
		year: opts.year ?? 'numeric',
		...opts
	}).format(validDate)
}

/**
 * Gets the day of the week for a given date.
 * @param date - The date to get the day of the week for.
 * @returns The day of the week.
 */
export function getDayOfWeek(date: Date | string | number) {
	const validDate = toValidDate(date)
	if (!validDate) return 'Invalid date'

	return new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(validDate)
}
