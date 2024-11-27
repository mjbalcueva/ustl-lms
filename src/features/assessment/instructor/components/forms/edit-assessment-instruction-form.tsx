'use client'

import { useRouter } from 'next/navigation'
import * as React from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { api, type RouterOutputs } from '@/services/trpc/react'

import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle
} from '@/core/components/compound-card'
import { ContentViewer } from '@/core/components/tiptap-editor/content-viewer'
import { Button } from '@/core/components/ui/button'
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormMessage
} from '@/core/components/ui/form'
import { Separator } from '@/core/components/ui/separator'
import { Add, Edit } from '@/core/lib/icons'

import { Editor } from '@/features/assessment/instructor/components/editor/editor'
import {
	editAssessmentInstructionSchema,
	type EditAssessmentInstructionSchema
} from '@/features/assessment/shared/validations/assessments-schema'

export const EditAssessmentInstructionForm = ({
	assessmentId,
	instruction
}: {
	assessmentId: RouterOutputs['instructor']['assessment']['findOneAssessment']['assessment']['assessmentId']
	instruction: RouterOutputs['instructor']['assessment']['findOneAssessment']['assessment']['instruction']
}) => {
	const router = useRouter()

	const [isEditing, setIsEditing] = React.useState(false)
	const toggleEdit = () => {
		setIsEditing((current) => !current)
		form.reset()
	}

	const form = useForm<EditAssessmentInstructionSchema>({
		resolver: zodResolver(editAssessmentInstructionSchema),
		defaultValues: { assessmentId, instruction: instruction ?? '' }
	})
	const formDescription = form.getValues('instruction')

	const { mutate, isPending } =
		api.instructor.assessment.editInstruction.useMutation({
			onSuccess: async (data) => {
				toggleEdit()
				form.reset({
					assessmentId,
					instruction: data.newInstruction
				})
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
					{formDescription ? (
						<>
							<Separator className="mb-4" />
							<ContentViewer value={formDescription} />
						</>
					) : (
						'No instructions added'
					)}
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
											<Editor
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
