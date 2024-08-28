'use client'

import { useSearchParams } from 'next/navigation'
import { useState } from 'react'
import { signIn } from 'next-auth/react'

import { Icons } from '@/client/components/icons'
import { Loader } from '@/client/components/loader'
import { ButtonShining } from '@/client/components/ui'
import { cn } from '@/client/lib/utils'

import { DEFAULT_LOGIN_REDIRECT } from '@/routes'

type Provider = 'google'

type OAuthButtonProps = React.ComponentProps<typeof ButtonShining> & {
	text: string
	provider: Provider
}

const providerIcons: Record<Provider, React.ReactNode> = {
	google: <Icons.google className="size-4" />
}

export const OAuthButton = ({ text, provider, className, ...props }: OAuthButtonProps) => {
	const [isLoading, setIsLoading] = useState(false)

	const searchParams = useSearchParams()
	const callbackUrl = searchParams.get('callbackUrl')

	const handleClick = async () => {
		setIsLoading(true)
		await signIn(provider, {
			callbackUrl: callbackUrl ?? DEFAULT_LOGIN_REDIRECT
		})
	}

	return (
		<ButtonShining
			className={cn('items-center rounded-xl', className)}
			variant="outline"
			shiningClassName="bg-white/5"
			onClick={handleClick}
			disabled={isLoading}
			{...props}
		>
			<span className="mr-2">{isLoading ? <Loader /> : providerIcons[provider]}</span>
			<span className="leading-none">{text}</span>
		</ButtonShining>
	)
}