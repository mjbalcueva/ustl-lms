import { SessionProvider } from 'next-auth/react'

import { api } from '@/services/trpc/server'

import { DeviceTypeProvider } from '@/core/components/context/device-type-provider'
import { MainNav } from '@/core/components/nav-bar/main-nav'
import { PageWrapper } from '@/core/components/ui/page'
import { TooltipProvider } from '@/core/components/ui/tooltip'

export default async function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
	const session = await api.session.getSession()

	return (
		<SessionProvider session={session}>
			<DeviceTypeProvider>
				<TooltipProvider>
					<div className="flex min-h-full flex-col text-foreground dark:bg-card md:h-[100vh] md:flex-row md:py-1.5 md:pr-1.5">
						<MainNav
							className="font-medium text-card-foreground md:text-foreground/80"
							session={session}
						/>
						<PageWrapper>{children}</PageWrapper>
					</div>
				</TooltipProvider>
			</DeviceTypeProvider>
		</SessionProvider>
	)
}
