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
 * Formats a date to include creation and last edited information.
 * @param createdAt - The creation date.
 * @param updatedAt - The last edited date.
 * @returns The formatted date string.
 */
export function formatCreatedAndEditedDates(
	createdAt: Date | string | number,
	updatedAt: Date | string | number
) {
	const createdDate = new Intl.DateTimeFormat('en-US', {
		month: 'long',
		day: 'numeric',
		year: 'numeric'
	}).format(new Date(createdAt))

	const now = new Date()
	const updatedDate = new Date(updatedAt)
	const timeDifference = Math.floor((now.getTime() - updatedDate.getTime()) / (1000 * 60 * 60 * 24)) // difference in days

	const lastEdited = timeDifference === 0 ? 'Today' : `${timeDifference}d`

	return `Created on: ${createdDate} II Last edited on: ${lastEdited}`
}
