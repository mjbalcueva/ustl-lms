import { cookies } from 'next/headers'
import { SessionProvider } from 'next-auth/react'

import { api } from '@/shared/trpc/server'

import { MainNav } from '@/client/components/navigation/main-nav'
import { TooltipProvider } from '@/client/components/ui'
import { DeviceTypeProvider, type DeviceType } from '@/client/context/device-type-provider'

export default async function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
	const deviceSizeCookie = cookies().get('device-size')

	let defaultDeviceSize: DeviceType = ''
	if (deviceSizeCookie) defaultDeviceSize = JSON.parse(deviceSizeCookie.value) as DeviceType

	const session = await api.auth.getSession()

	return (
		<SessionProvider session={session}>
			<DeviceTypeProvider defaultDeviceSize={defaultDeviceSize}>
				<TooltipProvider>
					<div className="flex flex-col bg-background text-foreground md:h-[100vh] md:flex-row md:bg-card md:pt-3">
						<MainNav className="text-card-foreground" />
						{children}
					</div>
				</TooltipProvider>
			</DeviceTypeProvider>
		</SessionProvider>
	)
}
