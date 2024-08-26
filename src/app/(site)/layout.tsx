import { cookies } from 'next/headers'
import { SessionProvider } from 'next-auth/react'

import { auth } from '@/server/lib/auth'

import { MainNav } from '@/client/components/navigation'
import { DeviceTypeProvider, type DeviceType } from '@/client/context'

export default async function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
	const session = await auth()
	const deviceSizeCookie = cookies().get('device-size')

	let defaultDeviceSize: DeviceType = ''
	if (deviceSizeCookie) defaultDeviceSize = JSON.parse(deviceSizeCookie.value) as DeviceType

	return (
		<SessionProvider session={session}>
			<DeviceTypeProvider defaultDeviceSize={defaultDeviceSize}>
				<div className="flex h-full flex-col bg-popover/50 text-foreground md:h-[100vh] md:flex-row md:bg-popover md:pt-3">
					<MainNav className="bg-popover/50 text-popover-foreground md:bg-popover" session={session!} />
					{children}
				</div>
			</DeviceTypeProvider>
		</SessionProvider>
	)
}
