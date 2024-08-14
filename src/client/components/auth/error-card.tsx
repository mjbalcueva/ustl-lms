'use client'

import Image from 'next/image'
import { useSearchParams } from 'next/navigation'

import { CardWrapper } from '@/client/components/auth'

export const ErrorCard = () => {
	const searchParams = useSearchParams()
	const error = searchParams.get('error') as 'Configuration' | 'AccessDenied' | 'Verification'

	let title, description
	if (error === 'AccessDenied') {
		title = 'Access Denied!'
		description = 'Please use your UST Legazpi email address.'
	} else {
		title = 'Something went wrong!'
		description = 'Please contact your system administrators for assistance.'
	}

	return (
		<CardWrapper title={title} description={description} backButtonHref="/auth/login" backButtonLabel="Back to login">
			<div className="flex w-full items-center justify-center">
				<Image src="/assets/error.svg" alt="Error" className="w-52" width={100} height={100} priority />
			</div>
		</CardWrapper>
	)
}
