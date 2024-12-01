import * as React from 'react'
import { type Editor } from '@tiptap/react'
import { type VariantProps } from 'class-variance-authority'

import { ColorPicker } from '@/core/components/tiptap-editor/color-picker'
import { EditorToolbarButton } from '@/core/components/tiptap-editor/editor-toolbar-button'
import {
	Popover,
	PopoverContent,
	PopoverTrigger
} from '@/core/components/ui/popover'
import { type toggleVariants } from '@/core/components/ui/toggle'
import { ChevronDown, TextColor } from '@/core/lib/icons'
import { usePalettes } from '@/core/lib/tiptap-editor/palette'

type UpdateTextColorProps = VariantProps<typeof toggleVariants> & {
	editor: Editor
}

export const UpdateTextColor: React.FC<UpdateTextColorProps> = ({
	editor,
	size,
	variant
}) => {
	const color =
		(editor.getAttributes('textStyle')?.color as string | undefined) ??
		'hsl(var(--foreground))'
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
				<EditorToolbarButton
					tooltip="Text color"
					aria-label="Text color"
					size={size}
					variant={variant}
				>
					<TextColor className="size-5" />
					<ChevronDown className="size-3" />
				</EditorToolbarButton>
			</PopoverTrigger>
			<PopoverContent align="start" className="w-full">
				<div className="space-y-1.5">
					{usePalettes().map((palette, index) => (
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
