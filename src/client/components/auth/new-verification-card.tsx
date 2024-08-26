'use client'

import { useSearchParams } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'

import { newVerification } from '@/server/actions/new-verification'

import { CardWrapper, FormResponse } from '@/client/components/auth'
import { Loader } from '@/client/components/loader'

export const NewVerificationCard = () => {
	const [formSuccess, setFormSuccess] = useState<string | null>(null)
	const [formError, setFormError] = useState<string | null>(null)

	const searchParams = useSearchParams()
	const token = searchParams.get('token')

	const onSubmit = useCallback(async () => {
		if (!token) {
			setFormError('Missing token!')
			return
		}

		await newVerification(token)
			.then((data) => {
				if (data?.error) {
					setFormSuccess(null)
					return setFormError(data?.error)
				}
				if (data?.success) {
					setFormError(null)
					return setFormSuccess(data?.success)
				}
			})
			.catch(() => {
				setFormError('Something went wrong!')
			})
	}, [token])

	useEffect(() => {
		void onSubmit()
	}, [onSubmit])

	return (
		<CardWrapper
			title="Confirming your verification"
			description="We just want to make sure it's really you."
			backButtonHref="/auth/login"
			backButtonLabel="Back to login"
		>
			<div className="flex w-full items-center justify-center">
				{!formSuccess && !formError && <Loader variant="dots" size="extra-large" />}
				<FormResponse type="error" message={formError} />
				<FormResponse type="success" message={formSuccess} />
			</div>
		</CardWrapper>
	)
}
