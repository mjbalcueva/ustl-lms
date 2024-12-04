import { faker } from '@faker-js/faker'
import { hash } from 'bcryptjs'

import { db, DEFAULT_PASSWORD, EMAIL_DOMAIN, SEED_RANGES } from '../config'
import type { UserStats } from '../types'
import { getRandomInRange } from '../utils'

export async function createUsers(): Promise<UserStats> {
	const hashedPassword = await hash(DEFAULT_PASSWORD, 10)

	async function createUserBatch(
		role: 'INSTRUCTOR' | 'STUDENT',
		count: number
	) {
		const userData = Array.from({ length: count }, () => {
			const firstName = faker.person.firstName()
			const lastName = faker.person.lastName()
			return {
				id: faker.database.mongodbObjectId(),
				email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}${EMAIL_DOMAIN}`,
				password: hashedPassword,
				role,
				emailVerified: new Date(),
				profile: {
					create: {
						name: `${firstName} ${lastName}`,
						imageUrl: faker.image.url(),
						bio: faker.lorem.sentence()
					}
				}
			}
		})

		return db.$transaction(userData.map((data) => db.user.create({ data })))
	}

	const instructors = await createUserBatch(
		'INSTRUCTOR',
		getRandomInRange(SEED_RANGES.INSTRUCTORS)
	)
	const students = await createUserBatch(
		'STUDENT',
		getRandomInRange(SEED_RANGES.STUDENTS)
	)

	return {
		instructors: {
			total: instructors.length,
			items: instructors
		},
		students: {
			total: students.length,
			items: students
		}
	}
}
