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
	DialogTitle,
	DialogTrigger
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
import { Add, Delete } from '@/core/lib/icons'

import { questionTypeWordMap } from '@/features/assessment/shared/libs/question-type-word-map'
import {
	addAssessmentQuestionSchema,
	type AddAssessmentQuestionSchema
} from '@/features/assessment/shared/validations/assessments-question-schema'

import { Editor } from '../editor/editor'

export const AddAssessmentQuestionForm = ({
	assessmentId
}: {
	assessmentId: RouterOutputs['instructor']['assessment']['findOneAssessment']['assessment']['assessmentId']
}) => {
	const router = useRouter()

	const form = useForm<AddAssessmentQuestionSchema>({
		resolver: zodResolver(addAssessmentQuestionSchema),
		defaultValues: {
			assessmentId,
			question: '',
			questionType: 'MULTIPLE_CHOICE',
			options: {
				type: 'MULTIPLE_CHOICE',
				options: [] as string[]
			},
			points: 1
		}
	})

	const { mutate: addQuestion, isPending: isAdding } =
		api.instructor.assessmentQuestion.addQuestion.useMutation({
			onSuccess: async (data) => {
				form.reset({
					assessmentId,
					question: '',
					questionType: 'MULTIPLE_CHOICE',
					options: {
						type: 'MULTIPLE_CHOICE',
						options: [] as string[]
					}
				})
				router.refresh()
				toast.success(data.message)
			},
			onError: (error) => toast.error(error.message)
		})

	const handleTypeChange = (value: string) => {
		if (value === 'TRUE_OR_FALSE') {
			form.setValue('options', {
				options: ['True', 'False'],
				answer: 'True',
				type: 'TRUE_OR_FALSE'
			})
		} else if (value === 'MULTIPLE_SELECT') {
			form.setValue('options', {
				options: [],
				answer: [],
				type: 'MULTIPLE_SELECT'
			})
		} else {
			form.setValue('options', {
				options: [],
				answer: '',
				type: 'MULTIPLE_CHOICE'
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
		<Dialog>
			<DialogTrigger asChild>
				<Button variant="ghost" size="sm">
					<Add /> Add
				</Button>
			</DialogTrigger>

			<DialogContent>
				<DialogHeader>
					<DialogTitle>Add Question</DialogTitle>
					<DialogDescription>
						Create questions for your assessment section.
					</DialogDescription>
				</DialogHeader>

				<Form {...form}>
					<form
						onSubmit={form.handleSubmit((data) => addQuestion(data))}
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
											placeholder="e.g. 'Manila is the capital of France?'"
											throttleDelay={2000}
											output="html"
											autofocus={true}
											immediatelyRender={false}
											editable={!isAdding}
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
											onValueChange={(value) => {
												field.onChange(value)
												handleTypeChange(value)
											}}
											defaultValue={form.getValues('questionType')}
										>
											<FormControl>
												<SelectTrigger disabled={isAdding} className="!bg-card">
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
												disabled={isAdding}
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
												{field.value?.options?.map(
													(option: string, index: number) => (
														<div
															key={index}
															className="flex items-center gap-2"
														>
															<RadioGroup
																value={field.value?.answer?.toString()}
																onValueChange={(value) => {
																	field.onChange({
																		...field.value,
																		answer: value
																	})
																}}
															>
																<RadioGroupItem value={option} />
															</RadioGroup>
															<FormControl>
																<Input
																	placeholder={`Option ${index + 1}`}
																	disabled={isAdding}
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
																	field.value.answer.includes(
																		option as 'True' | 'False'
																	)
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
																	placeholder={`Option ${index + 1}`}
																	disabled={isAdding}
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
													defaultValue="true"
													className="flex flex-col gap-2"
												>
													<div className="flex items-center space-x-2">
														<RadioGroupItem value="true" id="true" />
														<Label htmlFor="true">True</Label>
													</div>
													<div className="flex items-center space-x-2">
														<RadioGroupItem value="false" id="false" />
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
									Done
								</Button>
							</DialogClose>
							<Button
								type="submit"
								disabled={isAdding}
								variant={isAdding ? 'shine' : 'default'}
							>
								{isAdding ? 'Adding...' : 'Add Question'}
							</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	)
}
