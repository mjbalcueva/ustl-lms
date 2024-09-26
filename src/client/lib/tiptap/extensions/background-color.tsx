import { Extension } from '@tiptap/core'

import '@tiptap/extension-text-style'

export interface BackgroundColorOptions {
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
						parseHTML: (element) => element.style.backgroundColor?.replace(/['"]+/g, ''),
						renderHTML: (attributes) => {
							if (!attributes.backgroundColor) {
								return {}
							}
							return {
								style: `background-color: ${attributes.backgroundColor}`
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
