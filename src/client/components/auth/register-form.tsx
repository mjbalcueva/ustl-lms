'use client'

import { CardWrapper } from '@/client/components/auth'

export const RegisterForm = () => {
	return (
		<CardWrapper
			title="Welcome, Thomasian!"
			description="To get started, please create an account."
			backButtonLabel="Already have an account?"
			backButtonHref="/auth/login"
			showSocial
		>
			<h1>Register Page</h1>
		</CardWrapper>
	)
}
