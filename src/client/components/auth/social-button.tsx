'use client'

import { useSearchParams } from 'next/navigation'
import { useState } from 'react'
import { signIn } from 'next-auth/react'

import { ButtonShimmering } from '@/client/components/button-shimmering'
import { Icons } from '@/client/components/icons'
import { Loader } from '@/client/components/loader'
import { cn } from '@/client/lib/utils'

import { DEFAULT_LOGIN_REDIRECT } from '@/routes'

type Provider = 'google'

type SocialButtonProps = React.ComponentProps<typeof ButtonShimmering> & {
	text: string
	provider: Provider
}

const providerIcons: Record<Provider, React.ReactNode> = {
	google: <Icons.google className="size-4 min-h-4 min-w-4" />
}

export const SocialButton = ({ text, provider, className, ...props }: SocialButtonProps) => {
	const [isLoading, setIsLoading] = useState(false)

	const searchParams = useSearchParams()
	const callbackUrl = searchParams.get('callbackUrl')

	const handleClick = async () => {
		setIsLoading(true)
		await signIn(provider, {
			callbackUrl: callbackUrl ?? DEFAULT_LOGIN_REDIRECT
		}).finally(() => setIsLoading(false))
	}

	return (
		<ButtonShimmering
			className={cn('rounded-xl', className)}
			variant="outline"
			shimmerClassName="bg-white/5"
			onClick={handleClick}
			disabled={isLoading}
			{...props}
		>
			<span className="mr-2">{isLoading ? <Loader /> : providerIcons[provider]}</span>
			<span>{text}</span>
		</ButtonShimmering>
	)
}
