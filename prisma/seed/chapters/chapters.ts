import { faker } from '@faker-js/faker'
import { ChapterType, type Prisma } from '@prisma/client'

import { db, SEED_RANGES } from '../config'
import type {
	AssessmentType,
	AssignmentType,
	ChapterStats,
	ChapterTemplate,
	TopicTemplate
} from '../types'
import {
	generateTopicTemplates,
	getRandomInRange,
	getRandomStatus,
	toTitleCase
} from '../utils'

// ==================== Chapter Content Generation ====================
function generateChapterContent(type: ChapterType): string {
	const sections = []

	switch (type) {
		case ChapterType.LESSON:
			sections.push(
				`<h1 class="heading-node">${faker.company.catchPhrase()}</h1>`,
				`<p class="text-node">${faker.lorem.paragraphs(2)}</p>`,
				`<h2 class="heading-node">Key Concepts</h2>`,
				`<p class="text-node">${faker.lorem.paragraphs(1)}</p>`,
				`<h2 class="heading-node">Examples</h2>`,
				`<p class="text-node">${faker.lorem.paragraphs(1)}</p>`,
				`<h2 class="heading-node">Summary</h2>`,
				`<p class="text-node">${faker.lorem.paragraph()}</p>`
			)
			break

		case ChapterType.ASSESSMENT:
			sections.push(
				`<h1 class="heading-node">Assessment Instructions</h1>`,
				`<p class="text-node">${faker.lorem.paragraph()}</p>`,
				`<h2 class="heading-node">Questions</h2>`,
				`<ol class="list-node">`,
				...Array.from(
					{ length: 5 },
					() => `<li><p class="text-node">${faker.lorem.sentence()}?</p></li>`
				),
				`</ol>`
			)
			break

		case ChapterType.ASSIGNMENT:
			sections.push(
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
			)
			break
	}

	return sections.join('')
}

// ==================== Chapter Title Generation ====================
function generateLessonTitle(topic: TopicTemplate): string {
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

function generateAssessmentTitle(
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

function generateAssignmentTitle(
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

// ==================== Chapter Creation and Organization ====================
function orderChapters(chapters: ChapterTemplate[]): ChapterTemplate[] {
	const lessonChapters = chapters.filter((c) => c.type === ChapterType.LESSON)
	const assessmentChapters = chapters
		.filter((c) => c.type === ChapterType.ASSESSMENT)
		.sort((a, b) => (a.sequenceNumber ?? 0) - (b.sequenceNumber ?? 0))
	const assignmentChapters = chapters
		.filter((c) => c.type === ChapterType.ASSIGNMENT)
		.sort((a, b) => (a.sequenceNumber ?? 0) - (b.sequenceNumber ?? 0))

	const orderedChapters: ChapterTemplate[] = []

	while (
		lessonChapters.length ||
		assessmentChapters.length ||
		assignmentChapters.length
	) {
		if (lessonChapters.length && Math.random() < 0.6) {
			orderedChapters.push(lessonChapters.shift()!)
			continue
		}

		if (Math.random() < 0.5) {
			if (assessmentChapters.length)
				orderedChapters.push(assessmentChapters.shift()!)
			else if (assignmentChapters.length)
				orderedChapters.push(assignmentChapters.shift()!)
		} else {
			if (assignmentChapters.length)
				orderedChapters.push(assignmentChapters.shift()!)
			else if (assessmentChapters.length)
				orderedChapters.push(assessmentChapters.shift()!)
		}

		if (
			orderedChapters.length === orderedChapters.length - 1 &&
			lessonChapters.length
		) {
			orderedChapters.push(lessonChapters.shift()!)
		}
	}

	return orderedChapters.map((chapter, index) => ({
		...chapter,
		position: index + 1
	}))
}

function cleanChapterData(
	chapters: ChapterTemplate[]
): Prisma.ChapterCreateManyInput[] {
	return chapters.map(({ ...chapter }) => ({
		chapterId: chapter.chapterId,
		title: chapter.title,
		content: chapter.content,
		position: chapter.position,
		type: chapter.type,
		status: chapter.status,
		courseId: chapter.courseId
	}))
}

// ==================== Chapter Statistics ====================
function createChapterStats(): ChapterStats {
	return {
		lessons: 0,
		assessments: 0,
		assignments: 0,
		total: 0,
		averagePerCourse: 0,
		items: []
	}
}

function updateChapterStats(stats: ChapterStats, type: ChapterType) {
	stats.total++
	switch (type) {
		case ChapterType.LESSON:
			stats.lessons++
			break
		case ChapterType.ASSESSMENT:
			stats.assessments++
			break
		case ChapterType.ASSIGNMENT:
			stats.assignments++
			break
	}
}

// ==================== Chapter Creation ====================
export async function createChapters(
	courses: Array<{ courseId: string }>
): Promise<ChapterStats> {
	const stats = createChapterStats()

	const chapterData = courses.flatMap((course) => {
		const topics = generateTopicTemplates(getRandomInRange([3, 6]))

		const typeCounters = {
			assignment: {
				Assignment: 0,
				Exercise: 0,
				Lab: 0,
				Project: 0,
				Task: 0
			},
			assessment: {
				Assessment: 0,
				Evaluation: 0,
				Exam: 0,
				Exercise: 0,
				Quiz: 0,
				Review: 0,
				Test: 0
			}
		}

		const lessons = Array.from({
			length: getRandomInRange(SEED_RANGES.LESSONS_PER_COURSE)
		}).map((_, index): ChapterTemplate => {
			const topic = topics[index % topics.length] ?? {
				mainTopic: 'General',
				subTopic: 'Introduction',
				concept: 'Basics',
				adjective: 'Core'
			}

			const status = getRandomStatus()
			updateChapterStats(stats, ChapterType.LESSON)

			return {
				chapterId: faker.database.mongodbObjectId(),
				title: generateLessonTitle(topic),
				content: generateChapterContent(ChapterType.LESSON),
				position: 0,
				type: ChapterType.LESSON,
				status,
				courseId: course.courseId,
				topicIndex: index
			}
		})

		const assessments = Array.from({
			length: getRandomInRange(SEED_RANGES.ASSESSMENTS_PER_COURSE)
		}).map((_, index): ChapterTemplate => {
			const topic = topics[index % topics.length] ?? {
				mainTopic: 'General',
				subTopic: 'Introduction',
				concept: 'Basics',
				adjective: 'Core'
			}

			const assessmentType = faker.helpers.arrayElement(
				Object.keys(typeCounters.assessment)
			) as AssessmentType
			typeCounters.assessment[assessmentType]++

			const status = getRandomStatus()
			updateChapterStats(stats, ChapterType.ASSESSMENT)

			return {
				chapterId: faker.database.mongodbObjectId(),
				title: generateAssessmentTitle(
					topic,
					typeCounters.assessment[assessmentType],
					assessmentType
				),
				content: generateChapterContent(ChapterType.ASSESSMENT),
				position: 0,
				type: ChapterType.ASSESSMENT,
				status,
				courseId: course.courseId,
				topicIndex: index,
				sequenceNumber: index + 1
			}
		})

		const assignments = Array.from({
			length: getRandomInRange(SEED_RANGES.ASSIGNMENTS_PER_COURSE)
		}).map((_, index): ChapterTemplate => {
			const topic = topics[index % topics.length] ?? {
				mainTopic: 'General',
				subTopic: 'Introduction',
				concept: 'Basics',
				adjective: 'Core'
			}

			const assignmentType = faker.helpers.arrayElement(
				Object.keys(typeCounters.assignment)
			) as AssignmentType
			typeCounters.assignment[assignmentType]++

			const status = getRandomStatus()
			updateChapterStats(stats, ChapterType.ASSIGNMENT)

			return {
				chapterId: faker.database.mongodbObjectId(),
				title: generateAssignmentTitle(
					topic,
					typeCounters.assignment[assignmentType],
					assignmentType
				),
				content: generateChapterContent(ChapterType.ASSIGNMENT),
				position: 0,
				type: ChapterType.ASSIGNMENT,
				status,
				courseId: course.courseId,
				topicIndex: index,
				sequenceNumber: index + 1
			}
		})

		return orderChapters([...lessons, ...assessments, ...assignments])
	})

	const cleanedChapterData = cleanChapterData(chapterData)
	await db.chapter.createMany({ data: cleanedChapterData })

	return {
		...stats,
		averagePerCourse: Number((stats.total / courses.length).toFixed(1)),
		items: cleanedChapterData
	}
}
