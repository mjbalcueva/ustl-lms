import { type Metadata } from 'next'
import Image from 'next/image'

import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardLink,
	CardLogoutButton,
	CardTitle
} from '@/features/auth/components/ui/card'

export const metadata: Metadata = {
	title: 'Authentication Error',
	description:
		'An error occurred during the authentication process. Please review the details and try again.'
}

type ErrorPageParam = 'Configuration' | 'AccessDenied' | 'Verification'

export default function Page({
	searchParams: { error }
}: {
	searchParams: { error: ErrorPageParam }
}) {
	const errorMessages: Record<
		ErrorPageParam,
		{ title: string; description: string }
	> = {
		AccessDenied: {
			title: 'Access Denied!',
			description: 'Please use your UST Legazpi email address.'
		},
		Configuration: {
			title: 'Configuration Error',
			description:
				'There was an issue with the system configuration. Please contact support.'
		},
		Verification: {
			title: 'Verification Required',
			description: 'Please verify your account to proceed.'
		}
	}

	const { title, description } = errorMessages[error] || {
		title: 'Something went wrong!',
		description: 'Please contact your system administrators for assistance.'
	}

	return (
		<Card>
			<CardHeader>
				<CardTitle>{title}</CardTitle>
				<CardDescription>{description}</CardDescription>
			</CardHeader>
			<CardContent className="items-center justify-center">
				<Image
					src="/assets/error.svg"
					alt="Error"
					width={200}
					height={200}
					priority
				/>
			</CardContent>
			<CardFooter>
				{error === 'AccessDenied' || error === 'Configuration' ? (
					<CardLogoutButton />
				) : (
					<CardLink href="/login" label="Back to login" />
				)}
				<CardLink href="/privacy" label="Privacy" className="!ml-auto" />
				<CardLink href="/terms" label="Terms" />
			</CardFooter>
		</Card>
	)
}
