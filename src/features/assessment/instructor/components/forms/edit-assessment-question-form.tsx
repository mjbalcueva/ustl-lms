'use client'

import { useRouter } from 'next/navigation'
import { zodResolver } from '@hookform/resolvers/zod'
import { AssessmentQuestionType } from '@prisma/client'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { api, type RouterOutputs } from '@/services/trpc/react'

import { Button } from '@/core/components/ui/button'
import { Checkbox } from '@/core/components/ui/checkbox'
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle
} from '@/core/components/ui/dialog'
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage
} from '@/core/components/ui/form'
import { Input } from '@/core/components/ui/input'
import { InputNumber } from '@/core/components/ui/input-number'
import { Label } from '@/core/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/core/components/ui/radio-group'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from '@/core/components/ui/select'
import { Delete } from '@/core/lib/icons'

import { questionTypeWordMap } from '@/features/assessment/shared/libs/question-type-word-map'
import {
	editAssessmentQuestionSchema,
	type EditAssessmentQuestionSchema,
	type QuestionOptions
} from '@/features/assessment/shared/validations/assessments-question-schema'

import { Editor } from '../editor/editor'

export const EditAssessmentQuestionForm = ({
	isOpen,
	onClose,
	question
}: {
	isOpen: boolean
	onClose: () => void
	question: RouterOutputs['instructor']['assessment']['findOneAssessment']['assessment']['questions'][number]
}) => {
	const router = useRouter()

	const form = useForm<EditAssessmentQuestionSchema>({
		resolver: zodResolver(editAssessmentQuestionSchema),
		defaultValues: {
			questionId: question.questionId,
			assessmentId: question.assessmentId,
			questionType: question.questionType,
			question: question.question,
			options: question.options as QuestionOptions,
			points: question.points
		}
	})

	const { mutate: editQuestion, isPending: isEditing } =
		api.instructor.assessmentQuestion.editQuestion.useMutation({
			onSuccess: () => {
				toast.success('Question updated successfully')
				onClose()
				router.refresh()
			},
			onError: (error) => toast.error(error.message)
		})

	const handleTypeChange = (value: AssessmentQuestionType) => {
		if (value === AssessmentQuestionType.TRUE_OR_FALSE) {
			form.setValue('options', {
				type: 'TRUE_OR_FALSE',
				options: ['True', 'False'],
				answer: 'True'
			})
		} else if (value === AssessmentQuestionType.MULTIPLE_SELECT) {
			form.setValue('options', {
				type: 'MULTIPLE_SELECT',
				options: [],
				answer: []
			})
		} else {
			form.setValue('options', {
				type: 'MULTIPLE_CHOICE',
				options: [],
				answer: ''
			})
		}
	}

	const handleOptionChange = (
		index: number,
		value: string,
		field: {
			value?: {
				options?: string[]
				[key: string]: unknown
			}
			onChange: (value: { options: string[] } & Record<string, unknown>) => void
		}
	) => {
		const newOptions = [...(field.value?.options ?? [])]
		newOptions[index] = value
		field.onChange({
			...field.value,
			options: newOptions
		})
	}

	const handleAddOption = (field: {
		value?: {
			options?: string[]
			[key: string]: unknown
		}
		onChange: (value: { options: string[] } & Record<string, unknown>) => void
	}) => {
		const newOptions = [...(field.value?.options ?? []), '']
		field.onChange({
			...field.value,
			options: newOptions
		})
	}

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Edit Question</DialogTitle>
					<DialogDescription>
						Update the question details below.
					</DialogDescription>
				</DialogHeader>

				<Form {...form}>
					<form
						onSubmit={form.handleSubmit((data) => editQuestion(data))}
						className="space-y-4"
					>
						<FormField
							control={form.control}
							name="question"
							render={({ field }) => (
								<FormItem>
									<div className="text-sm font-medium leading-none">
										Question
									</div>
									<FormControl className="text-sm">
										<Editor
											placeholder="Enter your question"
											throttleDelay={2000}
											output="html"
											autofocus={true}
											immediatelyRender={false}
											editable={!isEditing}
											injectCSS={true}
											onUpdate={field.onChange}
											inputClassName="!bg-card"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<div className="flex items-center gap-2">
							<FormField
								control={form.control}
								name="questionType"
								render={({ field }) => (
									<FormItem className="flex-1">
										<FormLabel>Type</FormLabel>
										<Select
											name="questionType"
											onValueChange={(value: AssessmentQuestionType) => {
												field.onChange(value)
												handleTypeChange(value)
											}}
											defaultValue={field.value}
											// className="!bg-card"
										>
											<FormControl>
												<SelectTrigger
													disabled={isEditing}
													className="!bg-card"
												>
													<SelectValue />
												</SelectTrigger>
											</FormControl>
											<SelectContent>
												{Object.values(AssessmentQuestionType).map((type) => {
													return (
														<SelectItem key={type} value={type}>
															{questionTypeWordMap[type]}
														</SelectItem>
													)
												})}
											</SelectContent>
										</Select>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="points"
								render={({ field }) => (
									<FormItem className="w-1/3">
										<FormLabel>Points</FormLabel>
										<FormControl>
											<InputNumber
												className="!bg-card"
												disabled={isEditing}
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>

						<FormField
							control={form.control}
							name="options"
							render={({ field }) => (
								<FormItem>
									<div className="text-sm font-medium leading-none">
										Options
									</div>
									<div className="space-y-2">
										{form.watch('questionType') ===
											AssessmentQuestionType.MULTIPLE_CHOICE && (
											<>
												<RadioGroup
													value={field.value?.answer?.toString()}
													onValueChange={(value) => {
														field.onChange({
															...field.value,
															answer: value
														})
													}}
												>
													{field.value?.options?.map(
														(option: string, index: number) => (
															<div
																key={index}
																className="flex items-center gap-2"
															>
																<RadioGroupItem
																	value={option}
																	id={`option-${index}`}
																/>
																<FormControl>
																	<Input
																		id={`input-option-${index}`}
																		placeholder={`Option ${index + 1}`}
																		disabled={isEditing}
																		value={option}
																		onChange={(e) =>
																			handleOptionChange(
																				index,
																				e.target.value,
																				field
																			)
																		}
																		className="!bg-card"
																	/>
																</FormControl>
																<Button
																	type="button"
																	variant="ghost"
																	className="size-10 px-3"
																	onClick={() => {
																		const newOptions = [...field.value.options]
																		newOptions.splice(index, 1)
																		field.onChange({
																			...field.value,
																			options: newOptions,
																			answer:
																				field.value.answer === option
																					? ''
																					: field.value.answer
																		})
																	}}
																>
																	<Delete />
																</Button>
															</div>
														)
													)}
												</RadioGroup>
											</>
										)}

										{form.watch('questionType') ===
											AssessmentQuestionType.MULTIPLE_SELECT && (
											<>
												{field.value?.options?.map(
													(option: string, index: number) => (
														<div
															key={index}
															className="flex items-center gap-2"
														>
															<Checkbox
																checked={
																	Array.isArray(field.value?.answer) &&
																	field.value.answer.includes(option)
																}
																onCheckedChange={(checked: boolean) => {
																	const answers = Array.isArray(
																		field.value.answer
																	)
																		? field.value.answer
																		: []
																	field.onChange({
																		...field.value,
																		answer: checked
																			? [...answers, option]
																			: answers.filter((a) => a !== option)
																	})
																}}
															/>
															<FormControl>
																<Input
																	id={`input-option-${index}`}
																	placeholder={`Option ${index + 1}`}
																	disabled={isEditing}
																	value={option}
																	onChange={(e) =>
																		handleOptionChange(
																			index,
																			e.target.value,
																			field
																		)
																	}
																	className="!bg-card"
																/>
															</FormControl>
															<Button
																type="button"
																variant="ghost"
																className="size-10 px-3"
																onClick={() => {
																	const newOptions = [...field.value.options]
																	newOptions.splice(index, 1)
																	field.onChange({
																		...field.value,
																		options: newOptions,
																		answer: Array.isArray(field.value.answer)
																			? field.value.answer.filter(
																					(a) => a !== option
																				)
																			: field.value.answer
																	})
																}}
															>
																<Delete />
															</Button>
														</div>
													)
												)}
											</>
										)}

										{form.watch('questionType') !==
											AssessmentQuestionType.TRUE_OR_FALSE && (
											<Button
												type="button"
												variant="outline"
												size="md"
												onClick={() => handleAddOption(field)}
												className="bg-card hover:bg-accent dark:bg-background dark:hover:bg-accent"
											>
												Add Option
											</Button>
										)}

										{form.watch('questionType') ===
											AssessmentQuestionType.TRUE_OR_FALSE && (
											<div className="flex flex-col gap-2">
												<RadioGroup
													value={field.value?.answer?.toString()}
													onValueChange={(value) => {
														field.onChange({
															...field.value,
															answer: value
														})
													}}
													className="flex flex-col gap-2"
												>
													<div className="flex items-center space-x-2">
														<RadioGroupItem value="True" id="true" />
														<Label htmlFor="true">True</Label>
													</div>
													<div className="flex items-center space-x-2">
														<RadioGroupItem value="False" id="false" />
														<Label htmlFor="false">False</Label>
													</div>
												</RadioGroup>
											</div>
										)}
									</div>
									<FormMessage />
								</FormItem>
							)}
						/>

						<DialogFooter className="gap-2 md:gap-0">
							<DialogClose asChild>
								<Button
									type="button"
									variant="outline"
									onClick={() => form.reset()}
									className="bg-card dark:bg-background dark:hover:bg-accent"
								>
									Cancel
								</Button>
							</DialogClose>
							<Button type="submit" disabled={isEditing}>
								{isEditing ? 'Saving...' : 'Save Changes'}
							</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	)
}
