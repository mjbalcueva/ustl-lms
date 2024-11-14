import { Underline as TiptapUnderline } from '@tiptap/extension-underline'

export const Underline = TiptapUnderline.extend({
	addKeyboardShortcuts() {
		return {
			'Mod-u': () => this.editor.commands.toggleUnderline()
		}
	},
	addOptions() {
		return {
			...this.parent?.(),
			HTMLAttributes: {
				class: 'underline'
			}
		}
	}
})
