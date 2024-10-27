'use client'

import * as React from 'react'

import { api } from '@/services/trpc/react'

import { FormResponse } from '@/core/components/ui/form-response'
import { Loader } from '@/core/components/ui/loader'

export const VerifyEmailForm = ({ token }: { token: string }) => {
	const { mutate, data, error, isPending } = api.auth.verifyEmail.useMutation()

	React.useEffect(() => {
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
