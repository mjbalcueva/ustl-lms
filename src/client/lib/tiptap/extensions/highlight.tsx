import { Highlight as TiptapHighlight } from '@tiptap/extension-highlight'
import { Plugin } from '@tiptap/pm/state'

export const Highlight = TiptapHighlight.extend({
	addProseMirrorPlugins() {
		return [
			...(this.parent?.() ?? []),
			new Plugin({
				props: {
					handleKeyDown: (_, event) => {
						if (event.key === 'Enter') {
							this.editor.commands.unsetHighlight()
						}
						return false
					}
				}
			})
		]
	}
})
