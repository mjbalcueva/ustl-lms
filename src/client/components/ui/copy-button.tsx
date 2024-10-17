import { useState } from 'react'
import { TbCheck, TbCopy } from 'react-icons/tb'

import { Button } from '@/client/components/ui/button'

type CopyButtonProps = {
	onCopy: () => void
}

export const CopyButton = ({ onCopy }: CopyButtonProps) => {
	const [isCopied, setIsCopied] = useState(false)

	const handleClick = () => {
		onCopy()
		setIsCopied(true)
		setTimeout(() => setIsCopied(false), 2000) // Revert back after 2 seconds
	}

	return (
		<Button type="button" size="icon" variant="outline" className="px-4" onClick={handleClick}>
			{isCopied ? <TbCheck className="size-4 shrink-0" /> : <TbCopy className="size-4 shrink-0" />}
		</Button>
	)
}
