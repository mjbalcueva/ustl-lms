import '@/client/styles/globals.css'

import { type Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'

import { siteConfig } from '@/shared/config/site'
import { TRPCReactProvider } from '@/shared/trpc/react'

import { TailwindSizeIndicator } from '@/client/components/tailwind-size-indicator'
import { Toaster } from '@/client/components/ui'
import { ThemeProvider } from '@/client/context'

export const metadata: Metadata = {
	title: siteConfig.title,
	description: siteConfig.description,
	icons: [{ rel: 'icon', url: '/favicon.ico' }]
}

export default async function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
	return (
		<html lang="en" className={`${GeistSans.variable}`} suppressHydrationWarning>
			<body id="body">
				<TRPCReactProvider>
					<ThemeProvider>
						{children}
						<Toaster />
						<TailwindSizeIndicator />
					</ThemeProvider>
				</TRPCReactProvider>
			</body>
		</html>
	)
}
