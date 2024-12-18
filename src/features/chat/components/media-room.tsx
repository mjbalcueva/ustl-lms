'use client'

import {
	ControlBar,
	GridLayout,
	LiveKitRoom,
	ParticipantTile,
	RoomAudioRenderer,
	useTracks
} from '@livekit/components-react'

import '@livekit/components-styles'

import { useEffect, useState } from 'react'
import { Track } from 'livekit-client'
import { useSession } from 'next-auth/react'

import { env } from '@/core/env/client'
import { Loader2 } from '@/core/lib/icons'

type MediaRoomProps = {
	chatId: string
	video: boolean
	audio: boolean
}

type LiveKitResponse = {
	token: string
}

export const MediaRoom = ({ chatId, video, audio }: MediaRoomProps) => {
	const { data: session } = useSession()
	const user = session?.user

	const [token, setToken] = useState('')

	useEffect(() => {
		if (!user?.name) return

		void (async () => {
			try {
				const resp = await fetch(
					`/api/livekit?room=${chatId}&username=${user.name}`
				)
				const data = (await resp.json()) as LiveKitResponse
				setToken(data.token)
			} catch (e) {
				console.log(e)
			}
		})()
	}, [user, chatId])

	if (token === '') {
		return (
			<div className="flex flex-1 flex-col items-center justify-center">
				<Loader2 className="my-4 size-7 animate-spin text-muted-foreground" />
				<p className="text-xs text-muted-foreground">Getting token...</p>
			</div>
		)
	}

	return (
		<LiveKitRoom
			video={video}
			audio={audio}
			token={token}
			serverUrl={env.NEXT_PUBLIC_LIVEKIT_URL}
			connect={true}
			// Use the default LiveKit theme for nice styles.
			data-lk-theme="default"
			style={{ height: '100dvh' }}
		>
			{/* Your custom component with basic video conferencing functionality. */}
			<MyVideoConference />
			{/* The RoomAudioRenderer takes care of room-wide audio for you. */}
			<RoomAudioRenderer />
			{/* Controls for the user to start/stop audio, video, and screen
      share tracks and to leave the room. */}
			<ControlBar variation="verbose" />
		</LiveKitRoom>
	)
}

function MyVideoConference() {
	// `useTracks` returns all camera and screen share tracks. If a user
	// joins without a published camera track, a placeholder track is returned.
	const tracks = useTracks(
		[
			{ source: Track.Source.Camera, withPlaceholder: true },
			{ source: Track.Source.ScreenShare, withPlaceholder: false }
		],
		{ onlySubscribed: false }
	)
	return (
		<GridLayout
			tracks={tracks}
			style={{ height: 'calc(96vh - var(--lk-control-bar-height))' }}
		>
			{/* The GridLayout accepts zero or one child. The child is used
      as a template to render all passed in tracks. */}
			<ParticipantTile />
		</GridLayout>
	)
}
