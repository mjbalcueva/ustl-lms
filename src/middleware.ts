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
	const isStudent = session?.user.role === 'STUDENT'

	const { pathname, search } = nextUrl

	// Route type checks
	const isAuthRoute = authRoutes.includes(pathname)
	const isInstructorRoute = instructorRoutes.some((route) => pathname.startsWith(route))
	const isPublicRoute = publicRoutes.includes(pathname)
	const isSkippedRoute = skippedRoutes.some((route) => pathname.startsWith(route))

	// Allow access to routes that bypass authentication checks
	if (isSkippedRoute) return

	// Redirect logged-in users away from authentication-related routes (e.g., login, register)
	if (isAuthRoute && isLoggedIn) {
		return Response.redirect(new URL(DEFAULT_REDIRECT, nextUrl))
	}

	// Allow non-logged-in users access to authentication routes
	if (isAuthRoute) return

	// Prevent students from accessing instructor-only routes
	if (isInstructorRoute && isStudent) {
		return Response.redirect(new URL(DEFAULT_REDIRECT, nextUrl))
	}

	// Allow access to public routes or if the user is logged in
	if (isPublicRoute || isLoggedIn) return

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
