import { faker } from '@faker-js/faker'
import { Status } from '@prisma/client'

import type { TopicTemplate } from './types'

export function getRandomInRange([min, max]: readonly [
	number,
	number
]): number {
	return faker.number.int({ min, max })
}

export function getRandomStatus(): Status {
	return faker.helpers.arrayElement(Object.values(Status))
}

export function toTitleCase(str: string): string {
	return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}

export function generateTopicTemplates(count: number): TopicTemplate[] {
	return Array.from({ length: count }, () => ({
		mainTopic: faker.helpers.arrayElement([
			faker.word.noun(),
			faker.word.adjective(),
			faker.word.verb()
		]),
		subTopic: faker.word.adjective(),
		concept: faker.word.noun(),
		adjective: faker.word.adjective()
	}))
}
