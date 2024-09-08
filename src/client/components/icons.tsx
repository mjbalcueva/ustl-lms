import {
	TbAlertTriangle,
	TbArchive,
	TbBook,
	TbChalkboard,
	TbChartHistogram,
	TbCircleCheck,
	TbCirclePlus,
	TbCircleX,
	TbDiamond,
	TbEdit,
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

	// course
	totalCourse: TbBook,
	publishedCourse: TbCircleCheck,
	draftCourse: TbEdit,
	archivedCourse: TbArchive,

	// misc
	plusCircle: TbCirclePlus
}
