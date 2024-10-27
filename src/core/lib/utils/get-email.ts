/**
 * Extracts the username from an email address.
 * @param email - The email address to extract the username from.
 * @returns The username extracted from the email address.
 */
export function getEmail(email: string) {
	return `${email.split('@')[0]}`
}
