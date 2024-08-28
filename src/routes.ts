/**
 * an array of routes that are public these routes do not require authentication
 */
export const publicRoutes: string[] = ['/auth/verify-email']

/**
 * An array of routes that are used for authentication. The login will redirect logged in users to /settings
 */
export const authRoutes: string[] = [
	'/auth/error',
	'/auth/forgot-password',
	'/auth/login',
	'/auth/register',
	'/auth/reset-password'
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
