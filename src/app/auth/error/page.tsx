import { type Metadata } from 'next'
import Image from 'next/image'

import {
	AuthCard,
	AuthCardContent,
	AuthCardFooter,
	AuthCardHeader,
	AuthCardLink,
	AuthCardLogoutButton
} from '@/client/components/auth/auth-card'

export const metadata: Metadata = {
	title: 'Authentication Error',
	description: 'An error occurred during the authentication process. Please review the details and try again.'
}

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
		<AuthCard>
			<AuthCardHeader title={title} description={description} />
			<AuthCardContent className="items-center justify-center">
				<Image src="/assets/error.svg" alt="Error" width={200} height={200} priority />
			</AuthCardContent>
			<AuthCardFooter>
				{searchParams.error === 'AccessDenied' || searchParams.error === 'Configuration' ? (
					<AuthCardLogoutButton />
				) : (
					<AuthCardLink href="/auth/login" label="Back to login" />
				)}
				<AuthCardLink href="/privacy" label="Privacy" className="!ml-auto" />
				<AuthCardLink href="/terms" label="Terms" />
			</AuthCardFooter>
		</AuthCard>
	)
}
