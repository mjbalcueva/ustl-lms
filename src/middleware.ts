import NextAuth from 'next-auth'

import authConfig from '@/server/auth.config'

import { apiAuthPrefix, apiTRPCPrefix, authRoutes, DEFAULT_LOGIN_REDIRECT, publicRoutes } from '@/routes'

const { auth } = NextAuth(authConfig)

export default auth((req) => {
	const { nextUrl } = req
	const isLoggedIn = !!req.auth

	const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix)
	const isApiTRPCRoute = nextUrl.pathname.startsWith(apiTRPCPrefix)
	const isAuthRoute = authRoutes.includes(nextUrl.pathname)
	const isPublicRoute = publicRoutes.includes(nextUrl.pathname)

	// If the route is an API auth or TRPC route, don't redirect
	if (isApiAuthRoute || isApiTRPCRoute) return

	// If the request is an auth route and the user is logged in, redirect to the default login redirect
	if (isAuthRoute && isLoggedIn) return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl))

	// If the request is an auth route, redirect to the login page
	if (isAuthRoute) return

	// If the user is logged in or the request is a public route, don't redirect
	if (isLoggedIn || isPublicRoute) return

	// If the user is not logged in, redirect to the login page
	const callbackUrl = nextUrl.pathname + (nextUrl.search || '')
	const encodedCallbackUrl = encodeURIComponent(callbackUrl)

	// Redirect to the login page with the callback URL
	return Response.redirect(new URL(`/auth/login?callbackUrl=${encodedCallbackUrl}`, nextUrl))
})

export const config = {
	// Don't invoke Middleware on the following paths
	matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)']
}
