'use client'

import { useRouter } from 'next/navigation'
import * as React from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { api } from '@/services/trpc/react'

import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle
} from '@/core/components/compound-card'
import { Button } from '@/core/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/core/components/ui/form'
import { Add, Edit } from '@/core/lib/icons'

import {
	editAssessmentInstructionSchema,
	type EditAssessmentInstructionSchema
} from '@/features/questions/validations/assessment-instruction-schema'

import { TiptapEditor } from '../tiptap-editor/editor'

export const EditAssessmentInstructionForm = ({
	chapterId,
	assessmentId,
	instruction
}: EditAssessmentInstructionSchema) => {
	const router = useRouter()

	const [isEditing, setIsEditing] = React.useState(false)
	const toggleEdit = () => {
		setIsEditing((current) => !current)
		form.reset()
	}

	const form = useForm<EditAssessmentInstructionSchema>({
		resolver: zodResolver(editAssessmentInstructionSchema),
		defaultValues: { chapterId, assessmentId, instruction }
	})
	const formDescription = form.getValues('instruction')

	const { mutate, isPending } = api.question.editAssessmentInstruction.useMutation({
		onSuccess: async (data) => {
			toggleEdit()
			form.reset({ chapterId, assessmentId, instruction: data.newInstruction ?? '' })
			router.refresh()
			toast.success(data.message)
		},
		onError: (error) => toast.error(error.message)
	})

	return (
		<Card showBorderTrail={isEditing}>
			<CardHeader>
				<CardTitle>Instruction</CardTitle>
				<Button onClick={toggleEdit} variant="ghost" size="sm">
					{!isEditing && (formDescription ? <Edit /> : <Add />)}
					{isEditing ? 'Cancel' : formDescription ? 'Edit' : 'Add'}
				</Button>
			</CardHeader>

			{!isEditing && (
				<CardContent isEmpty={!formDescription}>
					{formDescription ? formDescription : 'No instructions added'}
				</CardContent>
			)}

			{isEditing && (
				<Form {...form}>
					<form onSubmit={form.handleSubmit((data) => mutate(data))}>
						<CardContent>
							<FormField
								control={form.control}
								name="instruction"
								render={({ field }) => (
									<FormItem>
										<FormControl>
											<TiptapEditor
												placeholder="e.g. 'Read each question carefully and choose the correct answer (type 'T' for True or 'F' for False)'"
												throttleDelay={2000}
												output="html"
												autofocus={true}
												immediatelyRender={false}
												editable={true}
												injectCSS={true}
												onUpdate={field.onChange}
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</CardContent>
						<CardFooter>
							<Button
								type="submit"
								size="sm"
								disabled={!form.formState.isDirty || isPending}
								variant={isPending ? 'shine' : 'default'}
							>
								{isPending ? 'Saving...' : 'Save'}
							</Button>
						</CardFooter>
					</form>
				</Form>
			)}
		</Card>
	)
}
