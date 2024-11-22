'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'

import { Loader } from '@/core/components/ui/loader'
import { Google } from '@/core/lib/icons'
import { cn } from '@/core/lib/utils/cn'
import { DEFAULT_REDIRECT } from '@/core/routes/constants'

import { ButtonShining } from '@/features/auth/components/ui/button-shining'

type Provider = 'google'

type OAuthButtonProps = React.ComponentProps<typeof ButtonShining> & {
	callbackUrl?: string
	label: string
	provider: Provider
}

const providerIcons: Record<Provider, React.ReactNode> = {
	google: <Google />
}

export const OAuthButton = ({
	callbackUrl,
	label,
	provider,
	className,
	...props
}: OAuthButtonProps) => {
	const [isLoading, setIsLoading] = useState(false)

	const handleClick = async () => {
		setIsLoading(true)
		await signIn(provider, {
			callbackUrl: callbackUrl ?? DEFAULT_REDIRECT,
			prompt: 'select_account'
		})
	}

	return (
		<ButtonShining
			className={cn('items-center rounded-xl leading-none', className)}
			variant="outline"
			shiningClassName="bg-white/5"
			onClick={handleClick}
			disabled={isLoading}
			{...props}
		>
			{isLoading ? <Loader /> : providerIcons[provider]}
			{label}
		</ButtonShining>
	)
}
