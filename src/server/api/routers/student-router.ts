import { createTRPCRouter } from '@/server/api/trpc'

import { courseRouter } from '@/features/courses/student/server/course-router'
import { courseEnrollmentRouter } from '@/features/enrollments/student/server/course-enrollment-router'

export const studentRouter = createTRPCRouter({
	course: courseRouter,
	courseEnrollment: courseEnrollmentRouter
})
