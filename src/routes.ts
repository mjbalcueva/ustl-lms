/**
 * an array of routes that are public these routes do not require authentication
 */
export const publicRoutes: string[] = ['/auth/new-verification']

/**
 * An array of routes that are used for authentication. The login will redirect logged in users to /settings
 */
export const authRoutes: string[] = [
	'/auth/login',
	'/auth/register',
	'/auth/error',
	'/auth/reset',
	'/auth/new-password'
]

/**
 * The prefix for authentication routes. Routes that start with this prefix are used for API authentication purposes.
 */
export const apiAuthPrefix = '/api/auth'

/**
 * The prefix for TRPC routes. Routes that start with this prefix are used for TRPC purposes.
 */
export const apiTRPCPrefix = '/api/trpc'

/**
 * The default redirect path after logging in.
 */
export const DEFAULT_LOGIN_REDIRECT = '/dashboard'
