/**
 * Removes the file extension from a filename.
 * @param filename - The filename to remove the extension from.
 * @returns The filename without the extension.
 */
export function removeExtension(filename: string) {
	return filename.replace(/\.[^/.]+$/, '')
}
