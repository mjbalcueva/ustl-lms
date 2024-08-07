import '@/client/styles/globals.css'

import { type Metadata } from 'next'
import { cookies } from 'next/headers'
import { GeistSans } from 'geist/font/sans'

import { siteConfig } from '@/shared/config/site'
import { TRPCReactProvider } from '@/shared/trpc/react'

import { TailwindSizeIndicator } from '@/client/components/tailwind-size-indicator'
import { DeviceTypeProvider, ThemeProvider, type DeviceType } from '@/client/context'

export const metadata: Metadata = {
	title: siteConfig.title,
	description: siteConfig.description,
	icons: [{ rel: 'icon', url: '/favicon.ico' }]
}

export default function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
	const deviceSizeCookie = cookies().get('device-size')

	let defaultDeviceSize: DeviceType
	if (deviceSizeCookie) defaultDeviceSize = JSON.parse(deviceSizeCookie.value) as DeviceType

	return (
		<html lang="en" className={`${GeistSans.variable}`} suppressHydrationWarning>
			<body>
				<TRPCReactProvider>
					<DeviceTypeProvider defaultDeviceSize={defaultDeviceSize}>
						<ThemeProvider>
							{children}
							<TailwindSizeIndicator />
						</ThemeProvider>
					</DeviceTypeProvider>
				</TRPCReactProvider>
			</body>
		</html>
	)
}
