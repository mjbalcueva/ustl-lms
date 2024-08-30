'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { FcGoogle } from 'react-icons/fc'

import { Loader } from '@/client/components/loader'
import { ButtonShining } from '@/client/components/ui'
import { cn } from '@/client/lib/utils'

import { DEFAULT_LOGIN_REDIRECT } from '@/routes'

type Provider = 'google'

type OAuthButtonProps = React.ComponentProps<typeof ButtonShining> & {
	callbackUrl?: string
	label: string
	provider: Provider
}

const providerIcons: Record<Provider, React.ReactNode> = {
	google: <FcGoogle className="size-4" />
}

export const OAuthButton = ({ callbackUrl, label, provider, className, ...props }: OAuthButtonProps) => {
	const [isLoading, setIsLoading] = useState(false)

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
			<span className="leading-none">{label}</span>
		</ButtonShining>
	)
}
