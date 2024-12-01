import { faker } from '@faker-js/faker'
import { ChapterType, type Status } from '@prisma/client'

import type { ChapterTemplate, TopicTemplate } from '../types'
import { toTitleCase } from '../utils'

export function generateLessonContent(): string {
	const sections = [
		`<h1 class="heading-node">${faker.company.catchPhrase()}</h1>`,
		`<p class="text-node">${faker.lorem.paragraphs(2)}</p>`,
		`<h2 class="heading-node">Key Concepts</h2>`,
		`<p class="text-node">${faker.lorem.paragraphs(1)}</p>`,
		`<h2 class="heading-node">Examples</h2>`,
		`<p class="text-node">${faker.lorem.paragraphs(1)}</p>`,
		`<h2 class="heading-node">Summary</h2>`,
		`<p class="text-node">${faker.lorem.paragraph()}</p>`
	]
	return sections.join('')
}

export function generateLessonTitle(topic: TopicTemplate): string {
	const prefix = faker.helpers.arrayElement([
		'Introduction to',
		'Understanding',
		'Exploring',
		'Fundamentals of',
		'Advanced Topics in',
		'Principles of',
		'Applications of'
	])

	const titleFormats = [
		`${prefix} ${toTitleCase(topic.mainTopic)}`,
		`${toTitleCase(topic.mainTopic)} ${toTitleCase(topic.subTopic)}`,
		`${prefix} ${toTitleCase(topic.mainTopic)} ${toTitleCase(topic.subTopic)}`,
		`${toTitleCase(topic.adjective)} ${toTitleCase(topic.mainTopic)}`
	]

	return faker.helpers.arrayElement(titleFormats)
}

export function createLesson(
	courseId: string,
	topic: TopicTemplate,
	status: Status,
	index: number
): ChapterTemplate {
	return {
		chapterId: faker.database.mongodbObjectId(),
		title: generateLessonTitle(topic),
		content: generateLessonContent(),
		position: 0,
		type: ChapterType.LESSON,
		status,
		courseId,
		topicIndex: index
	}
}
