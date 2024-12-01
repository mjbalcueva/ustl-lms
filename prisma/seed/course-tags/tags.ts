import { faker } from '@faker-js/faker'
import type { User } from '@prisma/client'

import { db, SEED_RANGES } from '../config'
import type { TagStats } from '../types'
import { getRandomInRange, toTitleCase } from '../utils'

export async function createTags(instructors: User[]): Promise<TagStats> {
	const tagData = instructors.flatMap((instructor) => {
		const tagCount = getRandomInRange(SEED_RANGES.COURSE_TAGS_PER_INSTRUCTOR)
		const instructorTags = new Set<string>()

		return Array.from({ length: tagCount }, () => {
			let tagName: string
			do {
				const words = faker.helpers.maybe(
					() => [faker.word.adjective(), faker.word.noun()],
					{ probability: 0.33 }
				) ?? [faker.word.noun()]

				tagName = words
					.filter(Boolean)
					.join(' ')
					.replace(/[^a-zA-Z\s]/g, '')
					.trim()
					.split(' ')
					.map(toTitleCase)
					.join(' ')
			} while (instructorTags.has(tagName))

			instructorTags.add(tagName)
			return {
				tagId: faker.database.mongodbObjectId(),
				name: tagName,
				instructorId: instructor.id
			}
		})
	})

	await db.courseTag.createMany({
		data: tagData,
		skipDuplicates: true
	})

	return {
		total: tagData.length,
		averagePerInstructor: Number(
			(tagData.length / instructors.length).toFixed(1)
		),
		items: tagData
	}
}
