import * as React from 'react'

export const Editor = () => {
	const [value, setValue] = useState<Content>('')

	return (
		<MinimalTiptapEditor
			value={value}
			onChange={setValue}
			throttleDelay={2000}
			className="w-full"
			editorContentClassName="p-5"
			output="html"
			placeholder="Type your description here..."
			autofocus={true}
			immediatelyRender={true}
			editable={true}
			injectCSS={true}
			editorClassName="focus:outline-none"
		/>
	)
}
