import {
	IconChartHistogram,
	IconDiamondFilled,
	IconLayoutDashboard,
	IconLayoutSidebar,
	IconLayoutSidebarFilled,
	IconLogout,
	IconMessage,
	IconMoonStars,
	IconPaint,
	IconSchool,
	IconSelector,
	IconSettings2,
	IconSunHigh,
	IconUser,
	type TablerIcon
} from '@tabler/icons-react'

import { cn } from '@/client/lib/utils'

export const Icons = {
	dashboard: IconLayoutDashboard,
	dropdown: IconSelector,
	learning: IconSchool,
	logout: IconLogout,
	messages: IconMessage,
	moon: IconMoonStars,
	profile: IconUser,
	reports: IconChartHistogram,
	settings: IconSettings2,
	sidebarClose: IconLayoutSidebarFilled,
	sidebarOpen: IconLayoutSidebar,
	sun: IconSunHigh,
	theme: IconPaint,
	logo2: ({ className, ...props }: { className?: string }) => (
		<div className={cn('flex items-center justify-center rounded-md', className)} {...props}>
			<IconDiamondFilled className="h-7 w-7 flex-shrink-0" />
		</div>
	),
	logo: (props: TablerIcon) => (
		<svg width="512" height="512" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
			<rect
				id="ri"
				width="512"
				height="512"
				x="0"
				y="0"
				rx="120"
				fill="url(#rj)"
				stroke="#FFFFFF"
				strokeWidth="0"
				strokeOpacity="100%"
				paintOrder="stroke"
			></rect>
			<defs>
				<linearGradient id="rj" gradientUnits="userSpaceOnUse" gradientTransform="rotate(45)">
					<stop stopColor="#F5AF19"></stop>
					<stop offset="1" stopColor="#F12711"></stop>
				</linearGradient>
				<radialGradient
					id="rk"
					cx="0"
					cy="0"
					r="1"
					gradientUnits="userSpaceOnUse"
					gradientTransform="translate(256) rotate(90) scale(512)"
				>
					<stop stopColor="white"></stop>
					<stop offset="1" stopColor="white" stopOpacity="0"></stop>
				</radialGradient>
			</defs>
			<svg
				width="352"
				height="352"
				viewBox="0 0 150 190"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
				x="80"
				y="80"
				alignmentBaseline="middle"
			>
				<path
					d="M39.4156 33.9286C55.6699 11.5789 63.7971 0.404044 75 0.404044C86.2029 0.404044 94.3301 11.5789 110.584 33.9285L136.178 69.1204C145.258 81.6041 149.797 87.846 149.797 95C149.797 102.154 145.258 108.396 136.179 120.88L110.584 156.071C94.3301 178.421 86.2029 189.596 75 189.596C63.7971 189.596 55.6699 178.421 39.4156 156.071L13.8215 120.88C4.74246 108.396 0.202941 102.154 0.202941 95C0.202941 87.846 4.74246 81.6041 13.8215 69.1204L39.4156 33.9286Z"
					fill="white"
				></path>
			</svg>
		</svg>
	)
}
