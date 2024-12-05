'use client'

import { useState } from 'react'

import { type RouterOutputs } from '@/services/trpc/react'

import { ContentViewer } from '@/core/components/tiptap-editor/content-viewer'
import { Badge } from '@/core/components/ui/badge'
import { Button } from '@/core/components/ui/button'
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger
} from '@/core/components/ui/tooltip'
import { Flag } from '@/core/lib/icons'

import { DisplayQuestion } from '@/features/chapters/student/components/assessment/question/display-question'

type Question = NonNullable<
	RouterOutputs['student']['chapter']['findOneChapter']['chapter']
>['assessments'][number]['questions'][number]

interface AssessmentQuestionCardProps {
	question: Question
	index: number
}

export const AssessmentQuestionCard = ({
	question,
	index
}: AssessmentQuestionCardProps) => {
	const [isFlagged, setIsFlagged] = useState(false)

	const toggleFlag = () => {
		setIsFlagged((prev) => !prev)
	}

	return (
		<div className="rounded-xl border border-input bg-card dark:bg-background">
			<div className="flex items-center gap-2 px-3 pb-2.5 pt-3">
				<Badge variant="secondary" className="text-sm font-medium leading-4">
					Question #{index + 1}
				</Badge>

				<span className="flex items-center gap-2 text-sm text-muted-foreground">
					({question.points} {question.points === 1 ? 'point' : 'points'})
				</span>

				<Tooltip>
					<TooltipTrigger asChild>
						<Button
							variant={isFlagged ? 'shine' : 'ghost'}
							size="icon"
							className="ml-auto h-6 w-6"
							onClick={toggleFlag}
						>
							<Flag className="h-4 w-4" />
						</Button>
					</TooltipTrigger>
					<TooltipContent>
						{isFlagged ? 'Remove flag' : 'Flag for later'}
					</TooltipContent>
				</Tooltip>
			</div>

			<div className="px-6 pb-4">
				<ContentViewer className="text-sm" content={question.question} />
				<DisplayQuestion question={question} />
			</div>
		</div>
	)
}
