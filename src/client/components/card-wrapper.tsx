import { Card } from '@/client/components/ui'

export const CardWrapper = ({ children }: { children: React.ReactNode }) => {
	return (
		<Card className="w-full overflow-y-auto rounded-none bg-background shadow-inner md:rounded-xl">{children}</Card>
	)
}
