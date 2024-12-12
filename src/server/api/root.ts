import { instructorRouter } from '@/server/api/routers/instructor-router'
import { studentRouter } from '@/server/api/routers/student-router'
import { createCallerFactory, createTRPCRouter } from '@/server/api/trpc'

import { accountRouter } from '@/features/account/server/account-router'
import { authRouter } from '@/features/auth/server/auth-router'
import { roleManagementRouter } from '@/features/role-management/server/role-management-router'

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
	auth: authRouter,
	account: accountRouter,
	instructor: instructorRouter,
	student: studentRouter,
	roleManagement: roleManagementRouter
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
