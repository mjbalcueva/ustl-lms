import { createEnv } from '@t3-oss/env-nextjs'
import { z } from 'zod'

export const env = createEnv({
	skipValidation: !!process.env.SKIP_ENV_VALIDATION,
	emptyStringAsUndefined: true,
	server: {
		AUTH_SECRET: process.env.NODE_ENV === 'production' ? z.string() : z.string().optional(),
		AUTH_URL: z.preprocess(
			(str) => process.env.VERCEL_URL ?? str,
			process.env.VERCEL ? z.string() : z.string().url()
		),
		AUTH_GOOGLE_ID: z.string(),
		AUTH_GOOGLE_SECRET: z.string(),
		DATABASE_URL: z.string().url(),
		MODEL_ID: z.string(),
		MUX_TOKEN_ID: z.string(),
		MUX_TOKEN_SECRET: z.string(),
		NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
		OPENAI_API_KEY: z.string(),
		POSTGRES_DATABASE: z.string(),
		POSTGRES_HOST: z.string(),
		POSTGRES_PASSWORD: z.string(),
		POSTGRES_PRISMA_URL: z.string(),
		POSTGRES_URL_NO_SSL: z.string(),
		POSTGRES_URL_NON_POOLING: z.string(),
		POSTGRES_URL: z.string(),
		POSTGRES_USER: z.string(),
		RESEND_API_KEY: z.string(),
		UPLOADTHING_TOKEN: z.string()
	},
	runtimeEnv: {
		AUTH_GOOGLE_ID: process.env.AUTH_GOOGLE_ID,
		AUTH_GOOGLE_SECRET: process.env.AUTH_GOOGLE_SECRET,
		AUTH_SECRET: process.env.AUTH_SECRET,
		AUTH_URL: process.env.AUTH_URL,
		DATABASE_URL: process.env.DATABASE_URL,
		MODEL_ID: process.env.MODEL_ID,
		MUX_TOKEN_ID: process.env.MUX_TOKEN_ID,
		MUX_TOKEN_SECRET: process.env.MUX_TOKEN_SECRET,
		NODE_ENV: process.env.NODE_ENV,
		OPENAI_API_KEY: process.env.OPENAI_API_KEY,
		POSTGRES_DATABASE: process.env.POSTGRES_DATABASE,
		POSTGRES_HOST: process.env.POSTGRES_HOST,
		POSTGRES_PASSWORD: process.env.POSTGRES_PASSWORD,
		POSTGRES_PRISMA_URL: process.env.POSTGRES_PRISMA_URL,
		POSTGRES_URL_NO_SSL: process.env.POSTGRES_URL_NO_SSL,
		POSTGRES_URL_NON_POOLING: process.env.POSTGRES_URL_NON_POOLING,
		POSTGRES_URL: process.env.POSTGRES_URL,
		POSTGRES_USER: process.env.POSTGRES_USER,
		RESEND_API_KEY: process.env.RESEND_API_KEY,
		UPLOADTHING_TOKEN: process.env.UPLOADTHING_TOKEN
	}
})
