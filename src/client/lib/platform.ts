type Platform = 'mac' | 'windows' | 'linux' | 'unknown'

let cachedPlatform: Platform | null = null

export const getPlatform = (): Platform => {
	if (typeof window === 'undefined') return 'unknown'

	const nav = window.navigator
	const platform = nav.platform || nav.userAgent || nav.appVersion || ''

	if (platform.toLowerCase().includes('mac')) return 'mac'
	if (platform.toLowerCase().includes('win')) return 'windows'
	if (platform.toLowerCase().includes('linux')) return 'linux'
	return 'unknown'
}

export const getPlatformSync = (): Platform => {
	if (cachedPlatform === null) {
		cachedPlatform = getPlatform()
	}
	return cachedPlatform
}
