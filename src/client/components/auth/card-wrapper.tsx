'use client'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { signIn } from 'next-auth/react'

import { Icons } from '@/client/components/icons'
import {
	Button,
	buttonVariants,
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
	Separator
} from '@/client/components/ui'
import { cn } from '@/client/lib/utils'

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
		<Card className="w-[400px] border-2 border-border shadow-md">
			<CardHeader>
				<CardTitle>{title}</CardTitle>
				<CardDescription>{description}</CardDescription>
			</CardHeader>

			<CardContent>{children}</CardContent>

			{showSocial && (
				<CardContent className="flex flex-col space-y-6">
					<div className="relative w-full">
						<Separator />
						<div className="absolute left-0 right-0 flex translate-y-[-50%] items-center justify-center">
							<span className="pointer-events-none select-none bg-card px-2 text-sm leading-none text-muted-foreground">
								Or continue with
							</span>
						</div>
					</div>

					<Button
						className="group/button relative w-full overflow-hidden rounded-xl text-foreground hover:transition-all hover:duration-300 hover:ease-in-out"
						variant="outline"
						onClick={() =>
							signIn('google', {
								callbackUrl: callbackUrl ?? DEFAULT_LOGIN_REDIRECT
							})
						}
					>
						<Icons.google className="mr-2 size-4" />
						Sign in with Google
						<div className="absolute inset-0 flex h-full w-full justify-center [transform:skew(-13deg)_translateX(-100%)] group-hover/button:duration-1000 group-hover/button:[transform:skew(-13deg)_translateX(100%)]">
							<div className="relative h-full w-8 bg-white/[0.02]" />
						</div>
					</Button>
				</CardContent>
			)}

			<CardFooter className="flex justify-center pb-4 font-normal">
				<Link
					href={backButtonHref}
					className={cn(buttonVariants({ variant: 'link', size: 'sm' }), 'px-0 text-card-foreground')}
				>
					{backButtonLabel}
				</Link>
			</CardFooter>
		</Card>
	)
}
