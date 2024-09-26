import * as React from 'react'
import type { Editor } from '@tiptap/react'
import type { VariantProps } from 'class-variance-authority'
import { TbBackground, TbChevronDown } from 'react-icons/tb'

import { ColorPicker } from '@/client/components/tiptap/color-picker'
import { EditorToolbarButton } from '@/client/components/tiptap/editor-toolbar-button'
import { Popover, PopoverContent, PopoverTrigger } from '@/client/components/ui'
import type { toggleVariants } from '@/client/components/ui'
import { usePalettes } from '@/client/lib/tiptap/palette'

type UpdateTextHighlightProps = VariantProps<typeof toggleVariants> & {
	editor: Editor
}

export const UpdateTextHighlight: React.FC<UpdateTextHighlightProps> = ({ editor, size, variant }) => {
	const color = (editor.getAttributes('textStyle')?.color as string | undefined) ?? 'hsl(var(--foreground))'
	const [selectedColor, setSelectedColor] = React.useState(color)

	const handleColorChange = React.useCallback(
		(value: string) => {
			setSelectedColor(value)
			editor.chain().setHighlight({ color: value }).run()
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
					<TbBackground className="size-5" />
					<TbChevronDown className="size-3" />
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
