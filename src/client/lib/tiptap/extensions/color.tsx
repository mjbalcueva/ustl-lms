import { Extension } from '@tiptap/core'

import '@tiptap/extension-text-style'

export type ColorOptions = {
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
		foregroundColor: {
			/**
			 * Set the foreground color
			 */
			setForegroundColor: (color: string) => ReturnType
			/**
			 * Unset the foreground color
			 */
			unsetForegroundColor: () => ReturnType
		}
	}
}

export const Color = Extension.create<ColorOptions>({
	name: 'color',

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
					},
					foregroundColor: {
						default: null,
						parseHTML: (element) =>
							element.classList.contains('text-')
								? element.className.split(' ').find((cls) => cls.startsWith('text-'))
								: null,
						renderHTML: (attributes) => {
							if (!attributes.foregroundColor) {
								return {}
							}
							return {
								class: attributes.foregroundColor as string
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
				},
			setForegroundColor:
				(color) =>
				({ chain }) => {
					return chain().setMark('textStyle', { foregroundColor: color }).run()
				},
			unsetForegroundColor:
				() =>
				({ chain }) => {
					return chain().setMark('textStyle', { foregroundColor: null }).removeEmptyTextStyle().run()
				}
		}
	}
})
