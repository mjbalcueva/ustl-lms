export default function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
	return (
		<div className="flex h-full items-center justify-center bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-background to-popover">
			{children}
		</div>
	)
}
