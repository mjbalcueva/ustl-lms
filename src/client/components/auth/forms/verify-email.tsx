'use client'

import { useEffect } from 'react'

import { api } from '@/shared/trpc/react'

import { FormResponse } from '@/client/components/auth/form-response'
import { Loader } from '@/client/components/ui'

export const VerifyEmailForm = ({ token }: { token: string }) => {
	const { mutate, data, error, isPending } = api.auth.verifyEmail.useMutation()

	useEffect(() => {
		mutate({ token })
	}, [token, mutate])

	return (
		<>
			{isPending && <Loader variant="dots" size="extra-large" className="mx-auto" />}
			<FormResponse type="error" message={error?.message} />
			<FormResponse type="success" message={data?.message} />
		</>
	)
}
