// Import necessary modules
import NextAuth from 'next-auth'

import { config as authConfig } from '@/services/authjs/config'

import { authRoutes } from '@/core/routes/auth'
import { DEFAULT_REDIRECT } from '@/core/routes/constants'
import { instructorRoutes } from '@/core/routes/instructor'
import { publicRoutes } from '@/core/routes/public'
import { skippedRoutes } from '@/core/routes/skipped'

const { auth } = NextAuth(authConfig)

export default auth((req) => {
	const { nextUrl, auth: session } = req
	const isLoggedIn = !!session
	const isInstructor = session?.user.role === 'INSTRUCTOR'
	const { pathname, search } = nextUrl

	// Allow access to routes that bypass authentication checks
	if (skippedRoutes.some((route) => pathname.startsWith(route))) return

	// Redirect logged-in users away from authentication routes (e.g., login, register)
	if (authRoutes.includes(pathname) && isLoggedIn) {
		return Response.redirect(new URL(DEFAULT_REDIRECT, nextUrl))
	}

	// Allow non-logged-in users access to authentication routes
	if (authRoutes.includes(pathname)) return

	// Prevent students from accessing instructor-only routes
	if (
		instructorRoutes.some((route) => pathname.startsWith(route)) &&
		isInstructor
	) {
		return Response.redirect(new URL(DEFAULT_REDIRECT, nextUrl))
	}

	// Allow access to public routes or if the user is logged in
	if (publicRoutes.includes(pathname) || isLoggedIn) return

	// Redirect unauthenticated users to the login page with a callback URL
	const callbackUrl = `${pathname}${search || ''}`
	return Response.redirect(
		new URL(`/login?callbackUrl=${encodeURIComponent(callbackUrl)}`, nextUrl)
	)
})

export const config = {
	// Match all paths except static files or Next.js internal routes
	matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)']
}
