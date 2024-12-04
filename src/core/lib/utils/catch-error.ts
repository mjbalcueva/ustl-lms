/**
 * A type-safe error catching utility that returns a tuple of [data, error].
 * @template T - The expected return type of the promise
 * @template E - The expected error type(s)
 * @param promise - The promise to handle
 * @param errorsToCatch - Optional array of error constructors to catch specifically
 * @returns A tuple of [data, undefined] on success or [undefined, error] on failure
 */
export async function catchError<T, E extends Error = Error>(
	promise: Promise<T>,
	errorsToCatch?: (new (...args: unknown[]) => E)[]
): Promise<[T, null] | [null, E]> {
	try {
		const data = await promise
		return [data, null]
	} catch (error) {
		// If no specific errors to catch, return the error as is
		if (!errorsToCatch?.length) {
			return [null, error as E]
		}

		// Check if error matches any of the specified error types
		const isExpectedError = errorsToCatch.some(
			(ErrorClass) => error instanceof ErrorClass
		)
		if (isExpectedError) {
			return [null, error as E]
		}

		// Re-throw unexpected errors
		throw error
	}
}
