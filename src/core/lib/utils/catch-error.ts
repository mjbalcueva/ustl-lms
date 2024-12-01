export async function catchError<T, E extends new (message: string) => Error>(
	promise: Promise<T>,
	errorsToCatch?: E[]
): Promise<[T, undefined] | [undefined, InstanceType<E>]> {
	try {
		const data = await promise
		return [data, undefined] as [T, undefined]
	} catch (error) {
		if (errorsToCatch == undefined) return [undefined, error as InstanceType<E>]
		if (errorsToCatch.some((e) => error instanceof e))
			return [undefined, error as InstanceType<E>]

		throw error
	}
}
