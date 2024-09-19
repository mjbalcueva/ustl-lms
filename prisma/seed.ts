import { PrismaClient } from '@prisma/client'

const db = new PrismaClient()

async function main() {
	try {
		await db.category.createMany({
			data: [{ name: 'Major' }, { name: 'Minor' }, { name: 'Elective' }, { name: 'Certificate' }, { name: 'Core' }]
		})

		console.log('Categories seeded successfully')
	} catch (error) {
		console.error('Error seeding categories', error)
	} finally {
		await db.$disconnect()
	}
}

await main()
