import { createEnv } from '@t3-oss/env-nextjs'

export const env = createEnv({
	skipValidation: !!process.env.SKIP_ENV_VALIDATION,
	emptyStringAsUndefined: true,
	client: {},
	runtimeEnv: {}
})
