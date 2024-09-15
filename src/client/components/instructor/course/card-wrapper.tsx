import * as React from 'react'

type CardWrapperProps = React.HTMLAttributes<HTMLDivElement>

export const CardWrapper = ({ ...props }: CardWrapperProps) => {
	return <div className="mt-6 rounded-xl border border-border bg-card p-4" {...props} />
}
