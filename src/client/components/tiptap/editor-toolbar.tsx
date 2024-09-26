import { type Editor } from '@tiptap/react'

import { UpdateTextStyle } from '@/client/components/tiptap/update-text-style'
import { Separator } from '@/client/components/ui'

export const EditorToolbar = ({ editor }: { editor: Editor }) => (
	<div className="shrink-0 overflow-x-auto rounded-xl border border-input">
		<div className="flex w-max items-center gap-px p-1">
			<UpdateTextStyle editor={editor} activeLevels={[1, 2, 3, 4, 5, 6]} />

			<Separator orientation="vertical" className="mx-2 h-7" />

			{/* <SectionTwo
				editor={editor}
				activeActions={['bold', 'italic', 'strikethrough', 'code', 'clearFormatting']}
				mainActionCount={2}
			/> */}

			<Separator orientation="vertical" className="mx-2 h-7" />

			{/* <SectionThree editor={editor} /> */}

			<Separator orientation="vertical" className="mx-2 h-7" />

			{/* <SectionFour editor={editor} activeActions={['orderedList', 'bulletList']} mainActionCount={0} /> */}

			<Separator orientation="vertical" className="mx-2 h-7" />

			{/* <SectionFive editor={editor} activeActions={['codeBlock', 'blockquote', 'horizontalRule']} mainActionCount={0} /> */}
		</div>
	</div>
)
