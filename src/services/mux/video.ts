import { Mux } from '@mux/mux-node'

import { env } from '@/core/env/server'

export const { video: muxVideo } = new Mux({
	tokenId: env.MUX_TOKEN_ID,
	tokenSecret: env.MUX_TOKEN_SECRET
})
