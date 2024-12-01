import {
	type ChapterType,
	type Prisma,
	type Status,
	type User
} from '@prisma/client'

import { type db } from './config'

export type TopicTemplate = {
	mainTopic: string
	subTopic: string
	concept: string
	adjective: string
}

export type ChapterTemplate = {
	chapterId: string
	courseId: string
	title: string
	content: string
	position: number
	type: ChapterType
	status: Status
	topicIndex?: number
	sequenceNumber?: number
}

export type AssignmentType = 'Activity' | 'Project' | 'Task'
export type AssessmentType = 'Exam' | 'Quiz' | 'Test'

export type UserStats = {
	instructors: {
		total: number
		items: User[]
	}
	students: {
		total: number
		items: User[]
	}
}

export type TagStats = {
	total: number
	averagePerInstructor: number
	items: { tagId: string; name: string; instructorId: string }[]
}

export type CourseStats = {
	total: number
	averagePerInstructor: number
	averagePerCourse: number
	items: Awaited<ReturnType<typeof db.course.create>>[]
}

export type ChapterStats = {
	lessons: number
	assessments: number
	assignments: number
	total: number
	averagePerCourse: number
	items: Prisma.ChapterCreateManyInput[]
}

export type EnrollmentStats = {
	total: number
	averagePerStudent: number
	items: { enrollmentId: string; studentId: string; courseId: string }[]
}
