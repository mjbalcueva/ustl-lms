import { createRouteHandler } from 'uploadthing/next'

import { ourFileRouter } from '@/services/uploadthing/core'

export const { GET, POST } = createRouteHandler({
	router: ourFileRouter
})
