/**
 * Capitalizes the first letter of a string and lowercases the rest.
 * @param str - The input string to be formatted.
 * @returns The formatted string with the first letter capitalized and the rest lowercased.
 */
export function capitalize(str: string): string {
	return str ? str.charAt(0).toUpperCase() + str.slice(1).toLowerCase() : str
}
