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
import { useUserTheme } from '@/client/lib/hooks/use-user-theme'

interface ColorItem {
	cssVar: string
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
		inverse: 'hsl(var(--background))',
		colors: [
			{ cssVar: 'none', label: 'Default' },
			{ cssVar: 'var(--mt-accent-bold-blue)', label: 'Bold blue' },
			{ cssVar: 'var(--mt-accent-bold-teal)', label: 'Bold teal' },
			{ cssVar: 'var(--mt-accent-bold-green)', label: 'Bold green' },
			{ cssVar: 'var(--mt-accent-bold-orange)', label: 'Bold orange' },
			{ cssVar: 'var(--mt-accent-bold-red)', label: 'Bold red' },
			{ cssVar: 'var(--mt-accent-bold-purple)', label: 'Bold purple' }
		]
	},
	{
		label: 'Palette 2',
		inverse: 'hsl(var(--background))',
		colors: [
			{ cssVar: 'var(--mt-accent-gray)', label: 'Gray' },
			{ cssVar: 'var(--mt-accent-blue)', label: 'Blue' },
			{ cssVar: 'var(--mt-accent-teal)', label: 'Teal' },
			{ cssVar: 'var(--mt-accent-green)', label: 'Green' },
			{ cssVar: 'var(--mt-accent-orange)', label: 'Orange' },
			{ cssVar: 'var(--mt-accent-red)', label: 'Red' },
			{ cssVar: 'var(--mt-accent-purple)', label: 'Purple' }
		]
	},
	{
		label: 'Palette 3',
		inverse: 'hsl(var(--foreground))',
		colors: [
			{ cssVar: 'hsl(var(--background))', label: 'White', darkLabel: 'Black' },
			{ cssVar: 'var(--mt-accent-blue-subtler)', label: 'Blue subtle' },
			{ cssVar: 'var(--mt-accent-teal-subtler)', label: 'Teal subtle' },
			{ cssVar: 'var(--mt-accent-green-subtler)', label: 'Green subtle' },
			{ cssVar: 'var(--mt-accent-yellow-subtler)', label: 'Yellow subtle' },
			{ cssVar: 'var(--mt-accent-red-subtler)', label: 'Red subtle' },
			{ cssVar: 'var(--mt-accent-purple-subtler)', label: 'Purple subtle' }
		]
	}
]

const MemoizedColorButton = React.memo<{
	color: ColorItem
	isSelected: boolean
	inverse: string
	onClick: (value: string) => void
}>(({ color, isSelected, inverse, onClick }) => {
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
					{isSelected && <TbCheck className="absolute inset-0 m-auto size-6" style={{ color: inverse }} />}
				</ToggleGroupItem>
			</TooltipTrigger>
			<TooltipContent side="bottom">
				<p>{label}</p>
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
				isSelected={selectedColor === color.cssVar}
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
	// Change to get the background color attribute
	const bgColor = (editor.getAttributes('textStyle')?.backgroundColor as string | undefined) ?? 'transparent'
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
