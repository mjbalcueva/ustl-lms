import Image from 'next/image'
import { useMemo } from 'react'
import { isNumber, NodeViewWrapper, type NodeViewProps } from '@tiptap/react'

import { useTiptapImageLoad } from '@/core/lib/hooks/use-tiptap-image-load'
import { cn } from '@/core/lib/utils/cn'

export const ImageViewBlock = ({ editor, node, getPos }: NodeViewProps) => {
	const imgSize = useTiptapImageLoad(node.attrs.src as string)

	const paddingBottom = useMemo(() => {
		if (!imgSize.width || !imgSize.height) {
			return 0
		}

		return (imgSize.height / imgSize.width) * 100
	}, [imgSize.width, imgSize.height])

	return (
		<NodeViewWrapper>
			<div draggable data-drag-handle>
				<figure>
					<div
						className="relative w-full"
						style={{
							paddingBottom: `${isNumber(paddingBottom) ? paddingBottom : 0}%`
						}}
					>
						<div className="absolute h-full w-full">
							<div
								className={cn(
									'relative h-full max-h-full w-full max-w-full rounded transition-all'
								)}
								style={{
									boxShadow:
										editor.state.selection.from === getPos()
											? '0 0 0 1px hsl(var(--primary))'
											: 'none'
								}}
							>
								<div className="relative flex h-full max-h-full w-full max-w-full overflow-hidden">
									<Image
										src={node.attrs.src as string}
										alt={node.attrs.alt as string}
										width={imgSize.width}
										height={imgSize.height}
										className="absolute left-2/4 top-2/4 m-0 h-full max-w-full -translate-x-2/4 -translate-y-2/4 transform object-contain"
									/>
								</div>
							</div>
						</div>
					</div>
				</figure>
			</div>
		</NodeViewWrapper>
	)
}
