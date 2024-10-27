import { useState } from 'react'

import { Button } from '@/core/components/ui/button'
import { Refresh } from '@/core/lib/icons'
import { cn } from '@/core/lib/utils/cn'

type GenerateButtonProps = {
	onGenerate: () => void
}

export const GenerateButton = ({ onGenerate }: GenerateButtonProps) => {
	const [isSpinning, setIsSpinning] = useState(false)

	function handleClick() {
		onGenerate()
		setIsSpinning(true)
		setTimeout(() => setIsSpinning(false), 250)
	}

	return (
		<Button type="button" size="icon" variant="outline" className="px-4" onClick={handleClick}>
			<Refresh className={cn(isSpinning && 'animate-spin duration-500')} />
		</Button>
	)
}
