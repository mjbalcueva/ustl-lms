import { NextResponse, type NextRequest } from 'next/server'
import { AccessToken } from 'livekit-server-sdk'

import { env as clientEnv } from '@/core/env/client'
import { env as serverEnv } from '@/core/env/server'

export async function GET(req: NextRequest) {
	const room = req.nextUrl.searchParams.get('room')
	const username = req.nextUrl.searchParams.get('username')
	if (!room) {
		return NextResponse.json(
			{ error: 'Missing "room" query parameter' },
			{ status: 400 }
		)
	} else if (!username) {
		return NextResponse.json(
			{ error: 'Missing "username" query parameter' },
			{ status: 400 }
		)
	}

	const apiKey = serverEnv.LIVEKIT_API_KEY
	const apiSecret = serverEnv.LIVEKIT_API_SECRET
	const wsUrl = clientEnv.NEXT_PUBLIC_LIVEKIT_URL

	if (!apiKey || !apiSecret || !wsUrl) {
		return NextResponse.json({ error: 'Server misconfigured' }, { status: 500 })
	}

	const at = new AccessToken(apiKey, apiSecret, { identity: username })

	at.addGrant({ room, roomJoin: true, canPublish: true, canSubscribe: true })

	return NextResponse.json({ token: await at.toJwt() })
}
