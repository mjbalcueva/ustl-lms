'use client'

import * as React from 'react'

type DeviceType = 'mobile' | 'tablet' | 'desktop' | '' | undefined

type DeviceTypeContextType = {
	deviceSize: DeviceType
}

const DeviceTypeContext = React.createContext<DeviceTypeContextType | undefined>(undefined)

const DeviceTypeProvider: React.FC<{ children: React.ReactNode; defaultDeviceSize: DeviceType }> = ({
	children,
	defaultDeviceSize
}) => {
	const [deviceSize, setDeviceSize] = React.useState<DeviceType>(defaultDeviceSize)

	const getDeviceSize = (): DeviceType => {
		if (window.matchMedia('(min-width: 1024px)').matches) return 'desktop'
		if (window.matchMedia('(min-width: 768px)').matches) return 'tablet'
		if (window.matchMedia('(min-width: 0px)').matches) return 'mobile'
	}

	React.useEffect(() => {
		const handleResize = () => {
			const currentDeviceSize = getDeviceSize()
			setDeviceSize(currentDeviceSize)
			document.cookie = `device-size=${JSON.stringify(currentDeviceSize)}`
		}

		handleResize()
		window.addEventListener('resize', handleResize)

		return () => window.removeEventListener('resize', handleResize)
	}, [])

	return <DeviceTypeContext.Provider value={{ deviceSize }}>{children}</DeviceTypeContext.Provider>
}

const useDeviceType = () => {
	const context = React.useContext(DeviceTypeContext)
	if (context === undefined) {
		throw new Error('useDeviceTypeContext must be used within a DeviceTypeProvider')
	}
	return context
}

export { DeviceTypeProvider, useDeviceType, type DeviceType }
