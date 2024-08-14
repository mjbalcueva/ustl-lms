import { auth } from '@/server/auth'

import { MainNav } from '@/client/components/navigation'

export default async function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
	const session = await auth()

	if (!session) return null

	return (
		<div className="flex flex-col sm:bg-popover md:h-[100vh] md:flex-row">
			<MainNav session={session} />
			<div className="flex flex-grow flex-col gap-2 overflow-y-auto md:mt-3 md:flex-row">{children}</div>
		</div>
	)
}
