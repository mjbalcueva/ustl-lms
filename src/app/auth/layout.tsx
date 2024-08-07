export default function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
	return (
		<div className="flex h-full items-center justify-center bg-popover bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-background to-popover">
			{children}
		</div>
	)
}

// <div className="bg-dot-white/[0.08] relative flex h-full items-center justify-center overflow-hidden bg-popover antialiased">
// 	<div className="pointer-events-none absolute inset-0 bg-popover [mask-image:radial-gradient(ellipse_at_center,transparent_20%,white)]" />
// 	{children}
// </div>
// <div className="bg-grid-white/[0.02] relative flex h-full items-center justify-center overflow-hidden bg-popover antialiased">
// 	<div className="pointer-events-none absolute inset-0 bg-popover [mask-image:radial-gradient(ellipse_at_center,transparent_20%,white)]" />
// 	{children}
// </div>
