import { attachmentRouter } from '@/server/api/routers/attachment'
import { authRouter } from '@/server/api/routers/auth'
import { categoryRouter } from '@/server/api/routers/category'
import { courseRouter } from '@/server/api/routers/course'
import { profileRouter } from '@/server/api/routers/profile'
import { sessionRouter } from '@/server/api/routers/session'
import { createCallerFactory, createTRPCRouter } from '@/server/api/trpc'

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
	attachment: attachmentRouter,
	auth: authRouter,
	category: categoryRouter,
	course: courseRouter,
	session: sessionRouter,
	profile: profileRouter
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
