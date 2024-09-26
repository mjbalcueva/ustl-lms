import * as React from 'react'
import type { Editor } from '@tiptap/react'
import type { VariantProps } from 'class-variance-authority'
import { TbBackground, TbCheck, TbChevronDown } from 'react-icons/tb'

import { EditorToolbarButton } from '@/client/components/tiptap/editor-toolbar-button'
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
	ToggleGroup,
	ToggleGroupItem,
	Tooltip,
	TooltipContent,
	TooltipTrigger
} from '@/client/components/ui'
import type { toggleVariants } from '@/client/components/ui'

interface ColorItem {
	color: string
	label: string
	darkLabel?: string
}

interface ColorPalette {
	label: string
	colors: ColorItem[]
	inverse: string
}

const COLORS: ColorPalette[] = [
	{
		label: 'Palette 1',
		inverse: 'text-foreground',
		colors: [
			{ color: 'bg-background', label: 'Default' },
			{ color: 'bg-blue-500', label: 'Bold blue' },
			{ color: 'bg-teal-500', label: 'Bold teal' },
			{ color: 'bg-green-500', label: 'Bold green' },
			{ color: 'bg-orange-500', label: 'Bold orange' },
			{ color: 'bg-red-500', label: 'Bold red' },
			{ color: 'bg-purple-500', label: 'Bold purple' }
		]
	},
	{
		label: 'Palette 2',
		inverse: 'text-foreground',
		colors: [
			{ color: 'bg-gray-500', label: 'Gray' },
			{ color: 'bg-blue-400', label: 'Blue' },
			{ color: 'bg-teal-400', label: 'Teal' },
			{ color: 'bg-green-400', label: 'Green' },
			{ color: 'bg-orange-400', label: 'Orange' },
			{ color: 'bg-red-400', label: 'Red' },
			{ color: 'bg-purple-400', label: 'Purple' }
		]
	},
	{
		label: 'Palette 3',
		inverse: 'text-foreground',
		colors: [
			{ color: 'bg-white', label: 'White', darkLabel: 'Black' },
			{ color: 'bg-blue-200', label: 'Blue subtle' },
			{ color: 'bg-teal-200', label: 'Teal subtle' },
			{ color: 'bg-green-200', label: 'Green subtle' },
			{ color: 'bg-yellow-200', label: 'Yellow subtle' },
			{ color: 'bg-red-200', label: 'Red subtle' },
			{ color: 'bg-purple-200', label: 'Purple subtle' }
		]
	}
]

const MemoizedColorButton = React.memo<{
	color: ColorItem
	isSelected: boolean
	inverse: string
	onClick: (value: string) => void
}>(({ color, isSelected, inverse, onClick }) => {
	return (
		<Tooltip>
			<TooltipTrigger asChild>
				<ToggleGroupItem
					className={`relative size-7 rounded-md p-0 ${color.color} hover:${color.color}`}
					value={color.color}
					aria-label={color.label}
					onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
						e.preventDefault()
						onClick(color.color)
					}}
				>
					{isSelected && <TbCheck className={`absolute inset-0 m-auto size-6 ${inverse}`} />}
				</ToggleGroupItem>
			</TooltipTrigger>
			<TooltipContent side="bottom">
				<p>{color.label}</p>
			</TooltipContent>
		</Tooltip>
	)
})

MemoizedColorButton.displayName = 'MemoizedColorButton'

const MemoizedColorPicker = React.memo<{
	palette: ColorPalette
	selectedColor: string
	inverse: string
	onColorChange: (value: string) => void
}>(({ palette, selectedColor, inverse, onColorChange }) => (
	<ToggleGroup
		type="single"
		value={selectedColor}
		onValueChange={(value: string) => {
			if (value) onColorChange(value)
		}}
		className="gap-1.5"
	>
		{palette.colors.map((color, index) => (
			<MemoizedColorButton
				key={index}
				inverse={inverse}
				color={color}
				isSelected={selectedColor === color.color}
				onClick={onColorChange}
			/>
		))}
	</ToggleGroup>
))

MemoizedColorPicker.displayName = 'MemoizedColorPicker'

type UpdateTextBackgroundProps = VariantProps<typeof toggleVariants> & {
	editor: Editor
}

export const UpdateTextBackground: React.FC<UpdateTextBackgroundProps> = ({ editor, size, variant }) => {
	const bgColor = (editor.getAttributes('textStyle')?.backgroundColor as string | undefined) ?? 'bg-transparent'
	const [selectedColor, setSelectedColor] = React.useState(bgColor)

	const handleColorChange = React.useCallback(
		(value: string) => {
			setSelectedColor(value)
			editor.chain().setBackgroundColor(value).run()
		},
		[editor]
	)

	React.useEffect(() => {
		setSelectedColor(bgColor)
	}, [bgColor])

	return (
		<Popover>
			<PopoverTrigger asChild>
				<EditorToolbarButton
					tooltip="Background color"
					aria-label="Background color"
					className="w-12"
					size={size}
					variant={variant}
				>
					<TbBackground className="size-5" />
					<TbChevronDown className="size-3" />
				</EditorToolbarButton>
			</PopoverTrigger>
			<PopoverContent align="start" className="w-full">
				<div className="space-y-1.5">
					{COLORS.map((palette, index) => (
						<MemoizedColorPicker
							key={index}
							palette={palette}
							inverse={palette.inverse}
							selectedColor={selectedColor}
							onColorChange={handleColorChange}
						/>
					))}
				</div>
			</PopoverContent>
		</Popover>
	)
}
