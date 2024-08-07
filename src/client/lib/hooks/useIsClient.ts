'use client'

import * as React from 'react'

const useIsClient = () => {
	const [isClient, setIsClient] = React.useState(false)

	React.useEffect(() => {
		setIsClient(true)
	}, [])

	return isClient
}

export { useIsClient }
