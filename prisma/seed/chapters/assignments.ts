import { faker } from '@faker-js/faker'
import { ChapterType, type Status } from '@prisma/client'

import type { AssignmentType, ChapterTemplate, TopicTemplate } from '../types'
import { toTitleCase } from '../utils'

export function generateAssignmentContent(): string {
	const sections = [
		`<h1 class="heading-node">Assignment Overview</h1>`,
		`<p class="text-node">${faker.lorem.paragraph()}</p>`,
		`<h2 class="heading-node">Requirements</h2>`,
		`<ul class="list-node">`,
		...Array.from(
			{ length: 3 },
			() => `<li><p class="text-node">${faker.lorem.sentence()}</p></li>`
		),
		`</ul>`,
		`<h2 class="heading-node">Submission Guidelines</h2>`,
		`<p class="text-node">${faker.lorem.paragraph()}</p>`
	]
	return sections.join('')
}

export function generateAssignmentTitle(
	topic: TopicTemplate,
	sequence: number,
	type: AssignmentType
): string {
	const action = faker.helpers.arrayElement([
		'Building',
		'Implementing',
		'Developing',
		'Creating',
		'Designing',
		'Analyzing',
		'Optimizing'
	])

	const formats = [
		`${type} ${sequence}: ${action} ${toTitleCase(topic.concept)}`,
		`${type} ${sequence}: ${toTitleCase(topic.mainTopic)} ${action}`,
		`${type} ${sequence}: ${action} ${toTitleCase(topic.adjective)} ${toTitleCase(topic.concept)}`,
		`${toTitleCase(topic.mainTopic)} ${type} ${sequence}: ${action} Project`
	]

	return faker.helpers.arrayElement(formats)
}

export function createAssignment(
	courseId: string,
	topic: TopicTemplate,
	status: Status,
	index: number,
	assignmentType: AssignmentType,
	typeCounter: number
): ChapterTemplate {
	return {
		chapterId: faker.database.mongodbObjectId(),
		title: generateAssignmentTitle(topic, typeCounter, assignmentType),
		content: generateAssignmentContent(),
		position: 0,
		type: ChapterType.ASSIGNMENT,
		status,
		courseId,
		topicIndex: index,
		sequenceNumber: index + 1
	}
}
