export default function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
	return <div className="flex h-full items-center justify-center bg-background">{children}</div>
	// return (
	// 	<div className="relative flex h-full items-center justify-center overflow-hidden bg-background antialiased bg-dot-white/[0.08]">
	// 		<div className="z-50">{children}</div>
	// 		<div className="pointer-events-none absolute inset-0 bg-background [mask-image:radial-gradient(ellipse_at_center,transparent_20%,white)]" />
	// 	</div>
	// )
	// return (
	// 	<div className="relative flex h-full items-center justify-center overflow-hidden bg-background antialiased bg-grid-white/[0.02]">
	// 		<div className="z-50">{children}</div>
	// 		<div className="pointer-events-none absolute inset-0 bg-background [mask-image:radial-gradient(ellipse_at_center,transparent_20%,white)]" />
	// 	</div>
	// )
}
