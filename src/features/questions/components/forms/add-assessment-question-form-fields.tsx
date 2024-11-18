'use client'

import { QuestionType } from '@prisma/client'
import { type UseFormReturn } from 'react-hook-form'

import { Button } from '@/core/components/ui/button'
import { Checkbox } from '@/core/components/ui/checkbox'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/core/components/ui/form'
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

import { TiptapEditor } from '@/features/questions/components/tiptap-editor/editor'
import { questionTypeWordMap } from '@/features/questions/lib/question-type-word-map'
import { type AddAssessmentQuestionSchema } from '@/features/questions/validations/assessment-questions-schema'

type AddAssessmentQuestionFormFieldsProps = {
	form: UseFormReturn<AddAssessmentQuestionSchema>
	isSubmitting: boolean
}

export const AddAssessmentQuestionFormFields = ({
	form,
	isSubmitting
}: AddAssessmentQuestionFormFieldsProps) => {
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
		<>
			<FormField
				control={form.control}
				name="question"
				render={({ field }) => (
					<FormItem>
						<FormLabel>Question</FormLabel>
						<FormControl>
							<TiptapEditor
								placeholder="e.g. 'Manila is the capital of France?'"
								throttleDelay={2000}
								output="html"
								autofocus={true}
								immediatelyRender={false}
								editable={!isSubmitting}
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
					name="type"
					render={({ field }) => (
						<FormItem className="flex-1">
							<FormLabel>Type</FormLabel>
							<Select
								name="type"
								onValueChange={(value) => {
									field.onChange(value)
									handleTypeChange(value)
								}}
								defaultValue={QuestionType.MULTIPLE_CHOICE}
							>
								<FormControl>
									<SelectTrigger disabled={isSubmitting} className="!bg-card">
										<SelectValue />
									</SelectTrigger>
								</FormControl>
								<SelectContent>
									{Object.values(QuestionType).map((type) => {
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
								<InputNumber className="!bg-card" disabled={isSubmitting} {...field} />
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
						<FormLabel>Options</FormLabel>
						<div className="space-y-2">
							{form.watch('type') === QuestionType.MULTIPLE_CHOICE && (
								<>
									{field.value?.options?.map((option: string, index: number) => (
										<div key={index} className="flex items-center gap-2">
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
													disabled={isSubmitting}
													value={option}
													onChange={(e) => handleOptionChange(index, e.target.value, field)}
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
														answer: field.value.answer === option ? '' : field.value.answer
													})
												}}
											>
												<Delete />
											</Button>
										</div>
									))}
								</>
							)}

							{form.watch('type') === QuestionType.MULTIPLE_SELECT && (
								<>
									{field.value?.options?.map((option: string, index: number) => (
										<div key={index} className="flex items-center gap-2">
											<Checkbox
												checked={
													Array.isArray(field.value?.answer) &&
													field.value.answer.includes(option as 'True' | 'False')
												}
												onCheckedChange={(checked: boolean) => {
													const answers = Array.isArray(field.value.answer)
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
													disabled={isSubmitting}
													value={option}
													onChange={(e) => handleOptionChange(index, e.target.value, field)}
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
															? field.value.answer.filter((a) => a !== option)
															: field.value.answer
													})
												}}
											>
												<Delete />
											</Button>
										</div>
									))}
								</>
							)}

							{form.watch('type') !== QuestionType.TRUE_OR_FALSE && (
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

							{form.watch('type') === QuestionType.TRUE_OR_FALSE && (
								<div className="flex flex-col gap-2">
									<RadioGroup defaultValue="true" className="flex flex-col gap-2">
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
		</>
	)
}
