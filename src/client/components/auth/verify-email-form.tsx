'use client'

import { useSearchParams } from 'next/navigation'
import { useEffect } from 'react'

import { api } from '@/shared/trpc/react'

import { CardWrapper, FormResponse } from '@/client/components/auth'
import { Loader } from '@/client/components/loader'

export const VerifyEmailForm = () => {
	const searchParams = useSearchParams()
	const token = searchParams.get('token')

	const { mutate, data, error, isPending } = api.user.verifyToken.useMutation()

	useEffect(() => {
		mutate({ token })
	}, [token, mutate])

	return (
		<CardWrapper
			title="Confirming your verification"
			description="We just want to make sure it's really you."
			backButtonHref="/auth/login"
			backButtonLabel="Back to login"
		>
			<div className="flex w-full items-center justify-center">
				{isPending && <Loader variant="dots" size="extra-large" />}
				<FormResponse type="error" message={error?.message} />
				<FormResponse type="success" message={data?.message} />
			</div>
		</CardWrapper>
	)
}
