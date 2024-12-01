import { faker } from '@faker-js/faker'
import { ChapterType, type Status } from '@prisma/client'

import type { AssessmentType, ChapterTemplate, TopicTemplate } from '../types'
import { toTitleCase } from '../utils'

export function generateAssessmentContent(): string {
	const sections = [
		`<h1 class="heading-node">Assessment Instructions</h1>`,
		`<p class="text-node">${faker.lorem.paragraph()}</p>`,
		`<h2 class="heading-node">Questions</h2>`,
		`<ol class="list-node">`,
		...Array.from(
			{ length: 5 },
			() => `<li><p class="text-node">${faker.lorem.sentence()}?</p></li>`
		),
		`</ol>`
	]
	return sections.join('')
}

export function generateAssessmentTitle(
	topic: TopicTemplate,
	sequence: number,
	type: AssessmentType
): string {
	const formats = [
		`${type} ${sequence}: ${toTitleCase(topic.mainTopic)} Fundamentals`,
		`${type} ${sequence}: ${toTitleCase(topic.mainTopic)} ${toTitleCase(topic.subTopic)}`,
		`${type} ${sequence}: ${toTitleCase(topic.adjective)} ${toTitleCase(topic.mainTopic)}`,
		`${toTitleCase(topic.mainTopic)} ${type} ${sequence}`
	]

	return faker.helpers.arrayElement(formats)
}

export function createAssessment(
	courseId: string,
	topic: TopicTemplate,
	status: Status,
	index: number,
	assessmentType: AssessmentType,
	typeCounter: number
): ChapterTemplate {
	return {
		chapterId: faker.database.mongodbObjectId(),
		title: generateAssessmentTitle(topic, typeCounter, assessmentType),
		content: generateAssessmentContent(),
		position: 0,
		type: ChapterType.ASSESSMENT,
		status,
		courseId,
		topicIndex: index,
		sequenceNumber: index + 1
	}
}
