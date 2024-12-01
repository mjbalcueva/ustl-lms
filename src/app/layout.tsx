import { type Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'

import { TRPCReactProvider } from '@/services/trpc/react'

import { ThemeProvider } from '@/core/components/context/theme-provider'
import { SizeIndicator } from '@/core/components/size-indicator'
import { Toaster } from '@/core/components/ui/sonner'
import { siteConfig } from '@/core/config/site'

import '@/core/styles/globals.css'

export const metadata: Metadata = {
	title: siteConfig.title,
	description: siteConfig.description,
	icons: [{ rel: 'icon', url: '/favicon.ico' }]
}

export default async function Layout({
	children
}: Readonly<{ children: React.ReactNode }>) {
	return (
		<html
			lang="en"
			className={`${GeistSans.variable} scroll-smooth`}
			suppressHydrationWarning
		>
			<body>
				<TRPCReactProvider>
					<ThemeProvider>
						{children}
						<Toaster duration={5000} gap={10} visibleToasts={4} />
						<SizeIndicator />
					</ThemeProvider>
				</TRPCReactProvider>
			</body>
		</html>
	)
}
