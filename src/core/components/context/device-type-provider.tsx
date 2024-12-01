'use client'

import * as React from 'react'

import { usePersistedState } from '@/core/lib/hooks/use-persist-state'

type DeviceType = 'mobile' | 'tablet' | 'desktop' | '' | undefined

type DeviceTypeContextType = {
	deviceSize: DeviceType
}

const DeviceTypeContext = React.createContext<
	DeviceTypeContextType | undefined
>(undefined)

const DeviceTypeProvider: React.FC<{ children: React.ReactNode }> = ({
	children
}) => {
	const [deviceSize, setDeviceSize] = usePersistedState<DeviceType>(
		'device-size',
		''
	)

	const getDeviceSize = (): DeviceType => {
		if (window.matchMedia('(min-width: 1024px)').matches) return 'desktop'
		if (window.matchMedia('(min-width: 768px)').matches) return 'tablet'
		if (window.matchMedia('(min-width: 0px)').matches) return 'mobile'
	}

	React.useEffect(() => {
		const handleResize = () => {
			const currentDeviceSize = getDeviceSize()
			setDeviceSize(currentDeviceSize)
		}

		handleResize()
		window.addEventListener('resize', handleResize)

		return () => window.removeEventListener('resize', handleResize)
	}, [setDeviceSize])

	return (
		<DeviceTypeContext.Provider value={{ deviceSize }}>
			{children}
		</DeviceTypeContext.Provider>
	)
}

const useDeviceType = () => {
	const context = React.useContext(DeviceTypeContext)
	if (context === undefined) {
		throw new Error(
			'useDeviceTypeContext must be used within a DeviceTypeProvider'
		)
	}
	return context
}

export { DeviceTypeProvider, useDeviceType, type DeviceType }
