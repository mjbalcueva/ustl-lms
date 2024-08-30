import Image from 'next/image'

import { CardWrapper } from '@/client/components/auth/card-wrapper'

type ErrorPageParam = 'Configuration' | 'AccessDenied' | 'Verification'

export default function Page({ searchParams }: { searchParams: { error: ErrorPageParam } }) {
	const errorMessages: Record<ErrorPageParam, { title: string; description: string }> = {
		AccessDenied: {
			title: 'Access Denied!',
			description: 'Please use your UST Legazpi email address.'
		},
		Configuration: {
			title: 'Configuration Error',
			description: 'There was an issue with the system configuration. Please contact support.'
		},
		Verification: {
			title: 'Verification Required',
			description: 'Please verify your account to proceed.'
		}
	}

	const { title, description } = errorMessages[searchParams.error] || {
		title: 'Something went wrong!',
		description: 'Please contact your system administrators for assistance.'
	}

	return (
		<CardWrapper title={title} description={description} backButtonHref="/auth/login" backButtonLabel="Back to login">
			<div className="flex w-full items-center justify-center">
				<Image src="/assets/error.svg" alt="Error" className="w-52" width={100} height={100} priority />
			</div>
		</CardWrapper>
	)
}
