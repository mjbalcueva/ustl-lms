'use client'

import Image from 'next/image'
import { useRouter } from 'next/navigation'
import * as React from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, type SubmitHandler } from 'react-hook-form'
import { LuImage, LuPencil, LuPlusCircle } from 'react-icons/lu'
import { toast } from 'sonner'

import { api } from '@/shared/trpc/react'
import { updateImageSchema, type UpdateImageSchema } from '@/shared/validations/course'

import { FileUpload } from '@/client/components/file-upload'
import {
	CardContent,
	CardContentContainer,
	CardHeader,
	CardTitle,
	CardWrapper
} from '@/client/components/instructor/course/card-wrapper'
import { Button, Form, FormControl, FormField, FormItem, FormMessage } from '@/client/components/ui'

type UpdateImageProps = {
	courseId: string
	initialData: {
		image: string
	}
}

export const UpdateImage = ({ courseId, initialData }: UpdateImageProps) => {
	const router = useRouter()

	const [isEditing, setIsEditing] = React.useState(false)
	const toggleEdit = () => setIsEditing((current) => !current)

	const form = useForm<UpdateImageSchema>({
		resolver: zodResolver(updateImageSchema),
		defaultValues: {
			courseId,
			image: initialData.image
		}
	})

	const { mutate } = api.course.updateImage.useMutation({
		onSuccess: async (data) => {
			router.refresh()
			form.reset({
				courseId,
				image: data.course.image ?? ''
			})
			toggleEdit()
			toast.success(data.message)
		},
		onError: (error) => {
			toast.error(error.message)
		}
	})

	const onSubmit: SubmitHandler<UpdateImageSchema> = (data) => mutate(data)

	return (
		<CardWrapper>
			<CardHeader>
				<div className="flex flex-col space-y-1.5">
					<CardTitle>Course Image</CardTitle>
				</div>
				<Button onClick={toggleEdit} variant="ghost" size="card">
					{!isEditing && initialData.image && <LuPencil className="mr-2 size-4" />}
					{!isEditing && !initialData.image && <LuPlusCircle className="mr-2 size-4" />}
					{isEditing ? 'Cancel' : initialData.image ? 'Edit' : 'Add'}
				</Button>
			</CardHeader>

			{!isEditing && (
				<CardContent>
					{initialData.image ? (
						<CardContentContainer>
							<Image src={initialData.image} alt="Course Image" width={100} height={100} className="rounded-xl" />
						</CardContentContainer>
					) : (
						<div className="flex items-center justify-center rounded-xl border border-input bg-card py-6 dark:bg-background">
							<LuImage className="size-10 text-card-foreground dark:text-muted-foreground" />
						</div>
					)}
				</CardContent>
			)}

			{isEditing && (
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)}>
						<CardContent>
							<FormField
								control={form.control}
								name="image"
								render={({ field }) => (
									<FormItem>
										<FormControl>
											<FileUpload endpoint="imageUpload" onChange={field.onChange} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</CardContent>
					</form>
				</Form>
			)}
		</CardWrapper>
	)
}
