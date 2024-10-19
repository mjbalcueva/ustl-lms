'use client'

import { useRouter } from 'next/navigation'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { api } from '@/shared/trpc/react'
import { enrollmentSchema, type EnrollmentSchema } from '@/shared/validations/enrollment'

import { Button } from '@/client/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/client/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/client/components/ui/form'
import { Input } from '@/client/components/ui/input'

export const EnrollmentForm = ({ token }: EnrollmentSchema) => {
	const router = useRouter()

	const form = useForm<EnrollmentSchema>({
		resolver: zodResolver(enrollmentSchema),
		defaultValues: { token }
	})

	const { mutate, isPending } = api.enrollment.join.useMutation({
		onSuccess: async (data) => {
			form.reset({ token })
			router.refresh()
			toast.success(data.message)
		},
		onError: (error) => toast.error(error.message)
	})

	return (
		<Card className="pt-2">
			<CardHeader className="flex-col items-start">
				<CardTitle className="text-2xl">Join a Course</CardTitle>
				<CardDescription>Enter the 6-character course enrollment code provided by your instructor</CardDescription>
			</CardHeader>

			<Form {...form}>
				<form onSubmit={form.handleSubmit((data) => mutate(data))}>
					<CardContent className="md:pb-6">
						<FormField
							control={form.control}
							name="token"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Token</FormLabel>
									<FormControl>
										<Input {...field} placeholder="Enter enrollment code" />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</CardContent>

					<CardContent className="space-y-1 text-muted-foreground md:pb-6">
						<h4 className="font-medium">How to Join:</h4>
						<ul className="list-inside list-disc">
							<li>Enter the provided code and click &quot;Join&quot;</li>
							<li>After successful enrollment, you will be redirected to the course page</li>
						</ul>
					</CardContent>

					<CardFooter className="flex justify-end gap-2">
						<Button variant="outline" onClick={() => router.back()} className="rounded-lg">
							Cancel
						</Button>

						<Button type="submit" disabled={isPending} variant={isPending ? 'shine' : 'default'} className="rounded-lg">
							{isPending ? 'Joining...' : 'Join'}
						</Button>
					</CardFooter>
				</form>
			</Form>
		</Card>
	)
}
