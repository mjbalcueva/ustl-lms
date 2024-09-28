import { Image as TiptapImage } from '@tiptap/extension-image'
import { ReactNodeViewRenderer } from '@tiptap/react'

import { ImageViewBlock } from '@/client/components/tiptap/image-view-block'

export const Image = TiptapImage.extend({
	addNodeView() {
		return ReactNodeViewRenderer(ImageViewBlock)
	}
})
