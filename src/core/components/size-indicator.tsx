export const SizeIndicator = () => {
	if (process.env.NODE_ENV === 'production') return null

	return (
		<div className="fixed bottom-1 right-1 z-50 flex h-6 w-6 items-center justify-center rounded-full border border-border bg-background bg-opacity-50 p-3 font-mono text-xs text-foreground backdrop-blur-md">
			<span className="block sm:hidden">xs</span>
			<span className="hidden sm:block md:hidden">sm</span>
			<span className="hidden md:block lg:hidden">md</span>
			<span className="hidden lg:block xl:hidden">lg</span>
			<span className="hidden xl:block 2xl:hidden">xl</span>
			<span className="hidden 2xl:block">2xl</span>
		</div>
	)
}
