'use client'

import { toast } from 'sonner'

import { CopyButton } from '@/core/components/copy-button'
import { Link } from '@/core/lib/icons'
import { getBaseUrl } from '@/core/lib/utils/get-base-url'

type CourseCopyInviteButtonProps = {
	token: string
}

export const CourseCopyInviteButton = ({ token }: CourseCopyInviteButtonProps) => {
	return (
		<CopyButton
			icon={Link}
			onCopy={async () => {
				await navigator.clipboard.writeText(`${getBaseUrl()}/enrollment?token=${token}`)
				toast.success('Invite link copied to clipboard!')
			}}
		/>
	)
}