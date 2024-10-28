/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
await import('./src/core/env/server.js')

/** @type {import("next").NextConfig} */
const config = {
	images: {
		remotePatterns: [
			{ hostname: 'utfs.io' },
			{ hostname: 'picsum.photos' },
			{ hostname: 'loremflickr.com' }
		]
	}
}

export default config
