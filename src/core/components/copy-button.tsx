'use client'

import { useState } from 'react'
import { type IconType } from 'react-icons'

import { Button } from '@/core/components/ui/button'
import { Check } from '@/core/lib/icons'
import { cn } from '@/core/lib/utils/cn'

type CopyButtonProps = {
	onCopy: () => void
	icon: IconType
}

export const CopyButton = ({ onCopy, icon }: CopyButtonProps) => {
	const [isCopied, setIsCopied] = useState(false)
	const Icon = icon

	const handleClick = () => {
		onCopy()
		setIsCopied(true)
		setTimeout(() => setIsCopied(false), 2000)
	}

	return (
		<Button
			type="button"
			size="icon"
			variant="outline"
			className="relative px-4"
			onClick={handleClick}
		>
			<div className="absolute inset-0 flex items-center justify-center">
				<Check
					className={cn(
						'transition-transform ease-in-out',
						isCopied ? 'scale-100' : 'scale-0'
					)}
				/>
			</div>
			<Icon
				className={cn(
					'transition-transform ease-in-out',
					isCopied ? 'scale-0' : 'scale-100'
				)}
			/>
		</Button>
	)
}
