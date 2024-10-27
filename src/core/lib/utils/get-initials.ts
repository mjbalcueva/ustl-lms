/**
 * Extracts the initials from a name.
 * @param name - The name to extract initials from.
 * @returns The initials extracted from the name.
 */
export function getInitials(name: string) {
	return name
		.split(' ')
		.filter((n) => n)
		.map((n) => n[0])
		.join('')
		.substring(0, 2)
}
