import { authRouter } from '@/server/api/routers/auth'
import { courseRouter } from '@/server/api/routers/course'
import { postRouter } from '@/server/api/routers/post'
import { profileRouter } from '@/server/api/routers/profile'
import { createCallerFactory, createTRPCRouter } from '@/server/api/trpc'

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
	auth: authRouter,
	course: courseRouter,
	post: postRouter,
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
