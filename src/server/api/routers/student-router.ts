import { createTRPCRouter } from '@/server/api/trpc'

import { courseEnrollmentRouter } from '@/features/enrollments/student/server/course-enrollment-router'

export const studentRouter = createTRPCRouter({
	courseEnrollment: courseEnrollmentRouter
})
