/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
await import('./src/env.js')

/** @type {import("next").NextConfig} */
const config = {
	experimental: {
		optimizePackageImports: [
			'@/client/components/auth',
			'@/client/components/navigation',
			'@/client/components/ui',
			'@/client/context',
			'@/client/lib/hooks',
			'@/shared/schemas',
			'@/shared/types'
		]
	}
}

export default config
