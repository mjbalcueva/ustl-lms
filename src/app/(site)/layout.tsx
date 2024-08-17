import { MainNav } from '@/client/components/navigation'

export default async function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
	return (
		<div className="flex flex-col bg-popover/50 text-foreground md:h-[100vh] md:flex-row md:bg-popover md:pt-3">
			<MainNav className="bg-popover/50 text-popover-foreground md:bg-popover" />
			{children}
		</div>
	)
}
