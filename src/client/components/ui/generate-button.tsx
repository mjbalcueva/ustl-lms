import { useState } from 'react'
import { TbRefresh } from 'react-icons/tb'

import { Button } from '@/client/components/ui/button'

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
			<TbRefresh className={`size-4 shrink-0 ${isSpinning ? 'animate-spin duration-500' : ''}`} />
		</Button>
	)
}
