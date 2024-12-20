import { type Editor } from '@tiptap/core'

// eslint-disable-next-line boundaries/element-types
import { type EditorProps } from '@/features/chapters/instructor/components/editor/editor'

/**
 * Formats the content of a Tiptap editor based on the specified format.
 * @param editor - The Tiptap editor instance.
 * @param format - The format of the output.
 * @returns The formatted content.
 */
export function getOutput(editor: Editor, format: EditorProps['output']) {
	if (format === 'json') {
		return editor.getJSON()
	}

	if (format === 'html') {
		return editor.getText() ? editor.getHTML() : ''
	}

	return editor.getText()
}
