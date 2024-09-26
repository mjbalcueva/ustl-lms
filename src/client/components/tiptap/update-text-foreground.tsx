import * as React from 'react'
import type { Editor } from '@tiptap/react'
import type { VariantProps } from 'class-variance-authority'
import { TbCheck, TbChevronDown, TbTextColor } from 'react-icons/tb'

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

type ColorItem = {
	color: string
	label: string
	darkLabel?: string
}

type ColorPalette = {
	label: string
	colors: ColorItem[]
	inverse: string
}

const COLORS: ColorPalette[] = [
	{
		label: 'Palette 1',
		inverse: 'text-white',
		colors: [
			{ color: 'text-background', label: 'Default' },
			{ color: 'text-blue-500', label: 'Bold blue' },
			{ color: 'text-teal-500', label: 'Bold teal' },
			{ color: 'text-green-500', label: 'Bold green' },
			{ color: 'text-orange-500', label: 'Bold orange' },
			{ color: 'text-red-500', label: 'Bold red' },
			{ color: 'text-purple-500', label: 'Bold purple' }
		]
	},
	{
		label: 'Palette 2',
		inverse: 'text-white',
		colors: [
			{ color: 'text-gray-500', label: 'Gray' },
			{ color: 'text-blue-400', label: 'Blue' },
			{ color: 'text-teal-400', label: 'Teal' },
			{ color: 'text-green-400', label: 'Green' },
			{ color: 'text-orange-400', label: 'Orange' },
			{ color: 'text-red-400', label: 'Red' },
			{ color: 'text-purple-400', label: 'Purple' }
		]
	},
	{
		label: 'Palette 3',
		inverse: 'text-black',
		colors: [
			{ color: 'text-white', label: 'White', darkLabel: 'Black' },
			{ color: 'text-blue-200', label: 'Blue subtle' },
			{ color: 'text-teal-200', label: 'Teal subtle' },
			{ color: 'text-green-200', label: 'Green subtle' },
			{ color: 'text-yellow-200', label: 'Yellow subtle' },
			{ color: 'text-red-200', label: 'Red subtle' },
			{ color: 'text-purple-200', label: 'Purple subtle' }
		]
	}
]

const MemoizedColorButton = React.memo<{
	color: ColorItem
	isSelected: boolean
	inverse: string
	onClick: (value: string) => void
}>(({ color, isSelected, inverse, onClick }) => {
	const bg = color.color.replace('text-', 'bg-')

	return (
		<Tooltip>
			<TooltipTrigger asChild>
				<ToggleGroupItem
					className={`relative size-7 rounded-md p-0 ${bg} hover:${bg}`}
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

type UpdateTextForegroundProps = VariantProps<typeof toggleVariants> & {
	editor: Editor
}

export const UpdateTextForeground: React.FC<UpdateTextForegroundProps> = ({ editor, size, variant }) => {
	const color = (editor.getAttributes('textStyle')?.foregroundColor as string | undefined) ?? 'text-black'
	const [selectedColor, setSelectedColor] = React.useState(color)

	const handleColorChange = React.useCallback(
		(value: string) => {
			setSelectedColor(value)
			editor.chain().setForegroundColor(value).run()
		},
		[editor]
	)

	React.useEffect(() => {
		setSelectedColor(color)
	}, [color])

	return (
		<Popover>
			<PopoverTrigger asChild>
				<EditorToolbarButton tooltip="Foreground color" aria-label="Foreground color" size={size} variant={variant}>
					<TbTextColor className="size-5" />
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
