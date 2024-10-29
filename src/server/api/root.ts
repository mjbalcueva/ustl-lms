import { createCallerFactory, createTRPCRouter } from '@/server/api/trpc'

import { accountRouter } from '@/features/account/server/account-router'
import { authRouter } from '@/features/auth/server/auth-router'
import { chapterRouter } from '@/features/chapters/server/chapter-router'
import { courseRouter } from '@/features/courses/server/course-router'
import { enrollmentRouter } from '@/features/enrollment/server/enrollment-router'

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
	auth: authRouter,
	account: accountRouter,
	course: courseRouter,
	chapter: chapterRouter,
	enrollment: enrollmentRouter
})

// export type definition of API
export type AppRouter = typeof appRouter

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter)
