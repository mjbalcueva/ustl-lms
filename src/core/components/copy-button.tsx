import { useState } from 'react'
import { type IconType } from 'react-icons'

import { Button } from '@/core/components/ui/button'
import { Check } from '@/core/lib/icons'

type CopyButtonProps = {
	onCopy: () => void
	icon: IconType
}

export const CopyButton = ({ onCopy, icon }: CopyButtonProps) => {
	const [isCopied, setIsCopied] = useState(false)

	const handleClick = () => {
		onCopy()
		setIsCopied(true)
		setTimeout(() => setIsCopied(false), 2000) // Revert back after 2 seconds
	}

	const Icon = icon

	return (
		<Button type="button" size="icon" variant="outline" className="px-4" onClick={handleClick}>
			{isCopied ? <Check /> : <Icon />}
		</Button>
	)
}
