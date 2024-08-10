'use client'

import { useSearchParams } from 'next/navigation'
import { signIn } from 'next-auth/react'

import { ButtonShimmering } from '@/client/components/button-shimmering'
import { Icons } from '@/client/components/icons'
import { cn } from '@/client/lib/utils'

import { DEFAULT_LOGIN_REDIRECT } from '@/routes'

type Provider = 'google'

type SocialButtonProps = React.ComponentProps<typeof ButtonShimmering> & {
	text: string
	provider: Provider
}

const providerIcons: Record<Provider, React.ReactNode> = {
	google: <Icons.google className="mr-2 size-4 min-h-4 min-w-4" />
}

export const SocialButton = ({ text, provider, className, ...props }: SocialButtonProps) => {
	const searchParams = useSearchParams()
	const callbackUrl = searchParams.get('callbackUrl')

	const handleClick = async () => {
		await signIn(provider, {
			callbackUrl: callbackUrl ?? DEFAULT_LOGIN_REDIRECT
		})
	}

	return (
		<ButtonShimmering
			className={cn('rounded-xl', className)}
			variant="outline"
			shimmerClassName="bg-white/5"
			onClick={handleClick}
			{...props}
		>
			{providerIcons[provider]} {text}
		</ButtonShimmering>
	)
}
