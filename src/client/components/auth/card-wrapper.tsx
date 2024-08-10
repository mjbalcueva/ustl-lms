import Link from 'next/link'

import { SeparatorWithText, SocialButton } from '@/client/components/auth'
import {
	buttonVariants,
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle
} from '@/client/components/ui'
import { cn } from '@/client/lib/utils'

type CardWrapperProps = {
	children: React.ReactNode
	title: string
	description: string
	backButtonLabel: string
	backButtonHref: string
	showSocial?: boolean
}

export const CardWrapper = ({
	children,
	title,
	description,
	showSocial,
	backButtonLabel,
	backButtonHref
}: CardWrapperProps) => {
	return (
		<Card className="w-[400px] border-2 border-border shadow-md">
			<CardHeader>
				<CardTitle>{title}</CardTitle>
				<CardDescription>{description}</CardDescription>
			</CardHeader>

			<CardContent className="flex flex-col space-y-6">
				{children}
				{showSocial && (
					<>
						<SeparatorWithText text="Or continue with" />
						<SocialButton provider="google" text="Sign in with Google" />
					</>
				)}
			</CardContent>

			<CardFooter className="flex justify-center pb-4 font-normal">
				<Link
					href={backButtonHref}
					className={cn(buttonVariants({ variant: 'link', size: 'sm' }), 'px-0 text-xs text-card-foreground')}
				>
					{backButtonLabel}
				</Link>
			</CardFooter>
		</Card>
	)
}
