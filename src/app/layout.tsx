import '@/client/styles/globals.css'

import { type Metadata } from 'next'
import { cookies } from 'next/headers'
import { GeistSans } from 'geist/font/sans'
import { SessionProvider } from 'next-auth/react'

import { siteConfig } from '@/shared/config/site'
import { TRPCReactProvider } from '@/shared/trpc/react'

import { auth } from '@/server/auth'

import { TailwindSizeIndicator } from '@/client/components/tailwind-size-indicator'
import { Toaster } from '@/client/components/ui'
import { DeviceTypeProvider, ThemeProvider, type DeviceType } from '@/client/context'

export const metadata: Metadata = {
	title: siteConfig.title,
	description: siteConfig.description,
	icons: [{ rel: 'icon', url: '/favicon.ico' }]
}

export default async function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
	const session = await auth()
	const deviceSizeCookie = cookies().get('device-size')

	let defaultDeviceSize: DeviceType
	if (deviceSizeCookie) defaultDeviceSize = JSON.parse(deviceSizeCookie.value) as DeviceType

	return (
		<html lang="en" className={`${GeistSans.variable}`} suppressHydrationWarning>
			<body>
				<SessionProvider session={session}>
					<TRPCReactProvider>
						<DeviceTypeProvider defaultDeviceSize={defaultDeviceSize}>
							<ThemeProvider>
								{children}
								<Toaster />
								<TailwindSizeIndicator />
							</ThemeProvider>
						</DeviceTypeProvider>
					</TRPCReactProvider>
				</SessionProvider>
			</body>
		</html>
	)
}
