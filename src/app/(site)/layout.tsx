import { SessionProvider } from 'next-auth/react'

import { auth } from '@/server/lib/auth'

import { MainNav } from '@/client/components/navigation/main-nav'
import { TooltipProvider } from '@/client/components/ui/tooltip'
import { DeviceTypeProvider } from '@/client/context/device-type-provider'

export default async function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
	const session = await auth()

	return (
		<SessionProvider session={session}>
			<DeviceTypeProvider>
				<TooltipProvider>
					<div className="flex min-h-full flex-col text-foreground dark:bg-card md:h-[100vh] md:flex-row md:py-1.5 md:pr-1.5">
						<MainNav className="font-medium text-card-foreground md:text-foreground/80" />
						{children}
					</div>
				</TooltipProvider>
			</DeviceTypeProvider>
		</SessionProvider>
	)
}
