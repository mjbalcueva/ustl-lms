import { faker } from '@faker-js/faker'
import { ChapterType, type Prisma } from '@prisma/client'

import { db, SEED_RANGES } from '../config'
import type {
	AssessmentType,
	AssignmentType,
	ChapterStats,
	ChapterTemplate
} from '../types'
import {
	generateTopicTemplates,
	getRandomInRange,
	getRandomStatus
} from '../utils'
import { createAssessment } from './assessments'
import { createAssignment } from './assignments'
import { createLesson } from './lessons'

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
				Activity: 0,
				Project: 0,
				Task: 0
			},
			assessment: {
				Exam: 0,
				Quiz: 0,
				Test: 0
			}
		}

		const lessons = Array.from({
			length: getRandomInRange(SEED_RANGES.LESSONS_PER_COURSE)
		}).map((_, index) => {
			const topic = topics[index % topics.length] ?? {
				mainTopic: 'General',
				subTopic: 'Introduction',
				concept: 'Basics',
				adjective: 'Core'
			}

			const status = getRandomStatus()
			updateChapterStats(stats, ChapterType.LESSON)

			return createLesson(course.courseId, topic, status, index)
		})

		const assessments = Array.from({
			length: getRandomInRange(SEED_RANGES.ASSESSMENTS_PER_COURSE)
		}).map((_, index) => {
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

			return createAssessment(
				course.courseId,
				topic,
				status,
				index,
				assessmentType,
				typeCounters.assessment[assessmentType]
			)
		})

		const assignments = Array.from({
			length: getRandomInRange(SEED_RANGES.ASSIGNMENTS_PER_COURSE)
		}).map((_, index) => {
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

			return createAssignment(
				course.courseId,
				topic,
				status,
				index,
				assignmentType,
				typeCounters.assignment[assignmentType]
			)
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
