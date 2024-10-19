'use client'

import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { type Category } from '@prisma/client'
import { toast } from 'sonner'

import { api } from '@/shared/trpc/react'

import { Badge } from '@/client/components/ui/badge'
import { Button } from '@/client/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/client/components/ui/card'
import { Icons } from '@/client/components/ui/icons'

type EnrollmentDetailsCardProps = {
	token: string
	code: string
	title: string
	description: string | null
	categories: Category[]
	image: string | null
	instructor: string | null | undefined
}

export const EnrollmentDetailsCard = ({
	token,
	code,
	title,
	description,
	categories,
	image,
	instructor
}: EnrollmentDetailsCardProps) => {
	const router = useRouter()

	const { mutate, isPending } = api.enrollment.enroll.useMutation({
		onSuccess: (data) => {
			toast.success(data.message)
			router.refresh()
		},
		onError: (error) => toast.error(error.message)
	})

	return (
		<Card className="flex w-full max-w-md flex-col overflow-hidden">
			{image ? (
				<div className="relative aspect-video max-h-[240px] w-full">
					<Image
						src={image}
						alt="Course Image"
						fill
						className="object-cover dark:[mask-image:linear-gradient(to_top,transparent,black_20%)]"
						priority
						sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
					/>
				</div>
			) : (
				<div className="flex aspect-video w-full items-center justify-center bg-muted">
					<Icons.image className="size-16 text-muted-foreground" />
				</div>
			)}

			<CardHeader className="flex-col items-start p-6">
				<div className="flex items-center justify-between gap-2">
					<CardTitle className="text-2xl font-bold leading-tight">{title ?? 'Class Details'}</CardTitle>
					<Badge variant="outline" className="shrink-0 font-medium">
						{code ?? 'N/A'}
					</Badge>
				</div>
				{instructor && (
					<span className="text-sm text-muted-foreground">
						by <span className="font-medium text-foreground">{instructor}</span>
					</span>
				)}
			</CardHeader>

			<CardContent className="flex-1 space-y-6 px-6 pb-6">
				<div className="space-y-1">
					<h4 className="font-semibold">Description</h4>
					<CardDescription className="text-sm leading-relaxed">
						{description ?? 'No description available'}
					</CardDescription>
				</div>

				<div className="space-y-1">
					<h4 className="font-semibold">Categories</h4>
					<div className="flex flex-wrap gap-2">
						{categories && categories.length > 0 ? (
							categories.map((category) => (
								<Badge key={category.id} variant="secondary" className="text-xs">
									{category.name}
								</Badge>
							))
						) : (
							<Badge variant="outline" className="text-xs">
								No categories
							</Badge>
						)}
					</div>
				</div>
			</CardContent>

			<CardFooter>
				<Button
					type="submit"
					variant={isPending ? 'shine' : 'default'}
					className="w-full"
					onClick={() => mutate({ token })}
					disabled={isPending}
				>
					{isPending ? 'Enrolling...' : 'Enroll Now'}
				</Button>
			</CardFooter>
		</Card>
	)
}
