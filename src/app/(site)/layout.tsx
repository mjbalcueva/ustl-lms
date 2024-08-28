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
				<div className="flex flex-col bg-card/50 text-foreground md:h-[100vh] md:flex-row md:bg-card md:pt-3">
					<MainNav className="text-card-foreground" session={session!} />
					{children}
				</div>
			</DeviceTypeProvider>
		</SessionProvider>
	)
}
