import { MainNav } from '@/client/components/navigation'

export default async function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
	return (
		<div className="flex flex-col md:h-[100vh] md:flex-row">
			<MainNav />
			<div className="flex flex-grow flex-col gap-2 overflow-y-auto bg-popover md:flex-row md:pt-3">{children}</div>
		</div>
	)
}
