/**
 * Import the environment configuration for the server.
 * Use `SKIP_ENV_VALIDATION` to skip environment validation during the build or dev process.
 * This is especially useful for Docker builds.
 */
await import('./src/core/env/server.js');

/** 
 * @type {import("next").NextConfig} 
 * Next.js configuration object
 */
const config = {
  images: {
    remotePatterns: [
      { hostname: 'utfs.io' },
      { hostname: 'picsum.photos' },
      { hostname: 'loremflickr.com' },
    ],
  },
};

export default config;
