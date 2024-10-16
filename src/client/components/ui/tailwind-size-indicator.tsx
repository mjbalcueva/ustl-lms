export const TailwindSizeIndicator = () => {
	if (process.env.NODE_ENV === 'production') return null

	return (
		<span className="fixed bottom-1 right-1 z-50 flex h-6 w-6 items-center justify-center rounded-full border border-border bg-background bg-opacity-50 p-3 font-mono text-xs text-foreground backdrop-blur-md">
			<div className="block sm:hidden">xs</div>
			<div className="hidden sm:block md:hidden">sm</div>
			<div className="hidden md:block lg:hidden">md</div>
			<div className="hidden lg:block xl:hidden">lg</div>
			<div className="hidden xl:block 2xl:hidden">xl</div>
			<div className="hidden 2xl:block">2xl</div>
		</span>
	)
}
