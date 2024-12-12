export type Option = {
	label: string
	value: string
	icon?: React.ComponentType<{ className?: string }>
	withCount?: boolean
}

export type DataTableFilterField<TData> = {
	label: string
	value: string | keyof TData
	placeholder?: string
	options?: Option[]
}
