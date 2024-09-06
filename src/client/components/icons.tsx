import {
	TbAlertTriangle,
	TbChalkboard,
	TbChartHistogram,
	TbCircleCheck,
	TbCirclePlus,
	TbDiamond,
	TbInfoCircle,
	TbInfoTriangle,
	TbLayoutDashboard,
	TbLayoutSidebar,
	TbLayoutSidebarFilled,
	TbLogout,
	TbMessage,
	TbMoonStars,
	TbPaint,
	TbPresentationAnalytics,
	TbSchool,
	TbSettings2,
	TbSmartHome,
	TbSunHigh,
	TbTools,
	TbUser
} from 'react-icons/tb'

export const Icons = {
	// site
	logo: TbDiamond,

	// home
	home: TbSmartHome,
	dashboard: TbLayoutDashboard,
	learning: TbSchool,
	reports: TbChartHistogram,
	chat: TbMessage,

	// instructor
	instructor: TbChalkboard,
	course: TbTools,
	analytics: TbPresentationAnalytics,

	// account
	profile: TbUser,
	preference: TbPaint,
	settings: TbSettings2,
	logout: TbLogout,

	// navbar
	navbarOpen: TbLayoutSidebar,
	navbarClose: TbLayoutSidebarFilled,

	// mode
	light: TbSunHigh,
	dark: TbMoonStars,

	// status
	success: TbCircleCheck,
	info: TbInfoCircle,
	warning: TbAlertTriangle,
	error: TbInfoTriangle,

	// misc
	plusCircle: TbCirclePlus
}
