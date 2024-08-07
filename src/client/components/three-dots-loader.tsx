export const ThreeDotsLoader = () => {
	return (
		<div className="fixed bottom-0 left-0 right-0 top-0 flex h-screen items-center justify-center overflow-hidden bg-background">
			<div className="flex flex-row gap-2">
				<div className="h-2 w-2 animate-bounce rounded-full bg-primary"></div>
				<div className="h-2 w-2 animate-bounce rounded-full bg-primary [animation-delay:-.3s]"></div>
				<div className="h-2 w-2 animate-bounce rounded-full bg-primary [animation-delay:-.5s]"></div>
			</div>
		</div>
	)
}
