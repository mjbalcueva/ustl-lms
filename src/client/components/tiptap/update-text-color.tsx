import * as React from 'react'
import type { Editor } from '@tiptap/react'
import type { VariantProps } from 'class-variance-authority'
import { TbChevronDown, TbTextColor } from 'react-icons/tb'

import { ColorPicker, type ColorPalette } from '@/client/components/tiptap/color-picker'
import { EditorToolbarButton } from '@/client/components/tiptap/editor-toolbar-button'
import { Popover, PopoverContent, PopoverTrigger } from '@/client/components/ui'
import type { toggleVariants } from '@/client/components/ui'

const COLORS: ColorPalette[] = [
	{
		label: 'Palette 1',
		inverse: 'hsl(var(--background))',
		colors: [
			{ cssVar: 'hsl(var(--foreground))', label: 'Default' },
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

type UpdateTextColorProps = VariantProps<typeof toggleVariants> & {
	editor: Editor
}

export const UpdateTextColor: React.FC<UpdateTextColorProps> = ({ editor, size, variant }) => {
	const color = (editor.getAttributes('textStyle')?.color as string | undefined) ?? 'hsl(var(--foreground))'
	const [selectedColor, setSelectedColor] = React.useState(color)

	const handleColorChange = React.useCallback(
		(value: string) => {
			setSelectedColor(value)
			editor.chain().setColor(value).run()
		},
		[editor]
	)

	React.useEffect(() => {
		setSelectedColor(color)
	}, [color])

	return (
		<Popover>
			<PopoverTrigger asChild>
				<EditorToolbarButton tooltip="Text color" aria-label="Text color" size={size} variant={variant}>
					<TbTextColor className="size-5" />
					<TbChevronDown className="size-3" />
				</EditorToolbarButton>
			</PopoverTrigger>
			<PopoverContent align="start" className="w-full">
				<div className="space-y-1.5">
					{COLORS.map((palette, index) => (
						<ColorPicker
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
