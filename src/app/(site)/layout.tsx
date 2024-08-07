import { MainNavigation } from '@/client/components/navigation'

export default function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
	return (
		<div className="flex flex-col bg-popover md:h-[100vh] md:flex-row">
			<MainNavigation />
			<div className="flex flex-grow flex-col gap-2 overflow-y-auto md:mt-3 md:flex-row">{children}</div>
		</div>
	)
}
