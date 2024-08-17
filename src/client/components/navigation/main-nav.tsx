'use client'

import { Inter } from 'next/font/google'
import { type motion } from 'framer-motion'

import { SideNav, TopNav } from '@/client/components/navigation'
import { useDeviceType } from '@/client/context'
import { cn } from '@/client/lib/utils'

const inter = Inter({
	subsets: ['latin'],
	display: 'swap'
})

export const MainNav = ({ className, ...props }: React.ComponentProps<typeof motion.div>) => {
	const { deviceSize } = useDeviceType()

	if (!deviceSize)
		return (
			<div className="fixed bottom-0 left-0 right-0 top-0 grid place-items-center bg-background">
				<div className="flex flex-col items-center gap-6">
					<h1 className="text-lg font-semibold">
						{'Loading'.split('').map((char, index) => (
							<span key={index} className="inline-block animate-bounce" style={{ animationDelay: `${index * 0.08}s` }}>
								{char}
							</span>
						))}
					</h1>
				</div>
			</div>
		)

	return (
		<>
			{deviceSize === 'mobile' ? (
				<TopNav className={cn(className, inter.className)} {...props} />
			) : (
				<SideNav className={cn(className, inter.className)} {...props} />
			)}
		</>
	)
}
