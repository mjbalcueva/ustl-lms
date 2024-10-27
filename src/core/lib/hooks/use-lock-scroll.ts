export const useLockScroll = () => {
	const toggleScroll = (disable: boolean) => {
		document.body.style.overflow = disable ? 'hidden' : ''
	}

	return {
		setLockScroll: (disable: boolean) => toggleScroll(disable)
	}
}
