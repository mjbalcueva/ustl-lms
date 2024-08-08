import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { signIn } from 'next-auth/react'

import { Icons } from '@/client/components/icons'
import {
	Button,
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
	Separator
} from '@/client/components/ui'

import { DEFAULT_LOGIN_REDIRECT } from '@/routes'

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
	const searchParams = useSearchParams()
	const callbackUrl = searchParams.get('callbackUrl')

	return (
		<Card className="w-[400px] shadow-md">
			<CardHeader>
				<CardTitle>{title}</CardTitle>
				<CardDescription>{description}</CardDescription>
			</CardHeader>
			<CardContent>{children}</CardContent>

			{showSocial && (
				<CardFooter className="flex flex-col space-y-4 pb-4">
					<div className="relative m-2 w-full">
						<Separator />
						<div className="absolute -top-2 left-0 right-0 flex items-center justify-center">
							<span className="bg-card px-2 text-sm leading-none text-muted-foreground">Or continue with</span>
						</div>
					</div>
					<Button
						className="w-full bg-card"
						variant="outline"
						onClick={() =>
							signIn('google', {
								callbackUrl: callbackUrl ?? DEFAULT_LOGIN_REDIRECT
							})
						}
					>
						<Icons.google className="mr-2 size-4" />
						Register with Google
					</Button>
				</CardFooter>
			)}

			<CardFooter className="flex items-center justify-center">
				<Button variant="link" className="font-normal" size="sm" asChild>
					<Link href={backButtonHref}>{backButtonLabel}</Link>
				</Button>
			</CardFooter>
		</Card>
	)
}
