import * as React from 'react'

import { ToggleGroup, ToggleGroupItem } from '@/core/components/ui/toggle-group'
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger
} from '@/core/components/ui/tooltip'
import { useUserTheme } from '@/core/lib/hooks/use-user-theme'
import { Check } from '@/core/lib/icons'

export type ColorItem = {
	cssVar: string
	label: string
	darkLabel?: string
}

export type ColorPalette = {
	label: string
	colors: ColorItem[]
	inverse: string
}

export type ColorButtonProps = {
	color: ColorItem
	isSelected: boolean
	inverse: string
	onClick: (value: string) => void
}

export const ColorButton: React.FC<ColorButtonProps> = ({
	color,
	isSelected,
	inverse,
	onClick
}) => {
	const { mode } = useUserTheme()
	const isDarkMode = mode === 'dark'
	const label = isDarkMode && color.darkLabel ? color.darkLabel : color.label

	return (
		<Tooltip>
			<TooltipTrigger asChild>
				<ToggleGroupItem
					className="relative size-7 rounded-md p-0"
					value={color.cssVar}
					aria-label={label}
					style={{ backgroundColor: color.cssVar }}
					onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
						e.preventDefault()
						onClick(color.cssVar)
					}}
				>
					{isSelected && (
						<Check
							className="absolute inset-0 m-auto size-6"
							style={{ color: inverse }}
						/>
					)}
				</ToggleGroupItem>
			</TooltipTrigger>
			<TooltipContent side="bottom">
				<p>{label}</p>
			</TooltipContent>
		</Tooltip>
	)
}
ColorButton.displayName = 'ColorButton'

type ColorPickerProps = {
	palette: ColorPalette
	selectedColor: string
	inverse: string
	onColorChange: (value: string) => void
}

export const ColorPicker: React.FC<ColorPickerProps> = ({
	palette,
	selectedColor,
	inverse,
	onColorChange
}) => (
	<ToggleGroup
		type="single"
		value={selectedColor}
		onValueChange={(value: string) => {
			if (value) onColorChange(value)
		}}
		className="gap-1.5"
	>
		{palette.colors.map((color, index) => (
			<ColorButton
				key={index}
				inverse={inverse}
				color={color}
				isSelected={selectedColor === color.cssVar}
				onClick={onColorChange}
			/>
		))}
	</ToggleGroup>
)
ColorPicker.displayName = 'ColorPicker'
