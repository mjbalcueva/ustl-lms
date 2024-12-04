import { createTRPCRouter } from '@/server/api/trpc'

import { chapterRouter } from '@/features/chapters/student/server/chapter-router'
import { chapterSubmissionAttachmentsRouter } from '@/features/chapters/student/server/chapter-submission-attachment-router'
import { chapterSubmissionRouter } from '@/features/chapters/student/server/chapter-submission-router'
import { courseRouter } from '@/features/courses/student/server/course-router'
import { courseEnrollmentRouter } from '@/features/enrollments/student/server/course-enrollment-router'

export const studentRouter = createTRPCRouter({
	course: courseRouter,
	courseEnrollment: courseEnrollmentRouter,
	chapter: chapterRouter,
	submission: chapterSubmissionRouter,
	submissionAttachment: chapterSubmissionAttachmentsRouter
})
