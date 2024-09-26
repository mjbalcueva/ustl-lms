import { Extension } from '@tiptap/core'

import '@tiptap/extension-text-style'

export type BackgroundColorOptions = {
	types: string[]
}

declare module '@tiptap/core' {
	interface Commands<ReturnType> {
		backgroundColor: {
			/**
			 * Set the background color
			 */
			setBackgroundColor: (color: string) => ReturnType
			/**
			 * Unset the background color
			 */
			unsetBackgroundColor: () => ReturnType
		}
	}
}

export const BackgroundColor = Extension.create<BackgroundColorOptions>({
	name: 'backgroundColor',

	addOptions() {
		return {
			types: ['textStyle']
		}
	},

	addGlobalAttributes() {
		return [
			{
				types: this.options.types,
				attributes: {
					backgroundColor: {
						default: null,
						parseHTML: (element) =>
							element.classList.contains('bg-')
								? element.className.split(' ').find((cls) => cls.startsWith('bg-'))
								: null,
						renderHTML: (attributes) => {
							if (!attributes.backgroundColor) {
								return {}
							}
							return {
								class: attributes.backgroundColor as string
							}
						}
					}
				}
			}
		]
	},

	addCommands() {
		return {
			setBackgroundColor:
				(color) =>
				({ chain }) => {
					return chain().setMark('textStyle', { backgroundColor: color }).run()
				},
			unsetBackgroundColor:
				() =>
				({ chain }) => {
					return chain().setMark('textStyle', { backgroundColor: null }).removeEmptyTextStyle().run()
				}
		}
	}
})
