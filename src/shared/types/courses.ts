export type Option = {
	label: string
	value: string
	icon?: React.ComponentType<{ className?: string }>
	withCount?: boolean
}

export type CoursesFilterField<TData> = {
	label: string
	value: keyof TData
	placeholder?: string
	options?: Option[]
}
