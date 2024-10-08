import { LuSearch } from 'react-icons/lu'
import {
	TbAlertTriangle,
	TbArchive,
	TbBook,
	TbBook2,
	TbChalkboard,
	TbChartHistogram,
	TbCircleCheck,
	TbCirclePlus,
	TbDiamond,
	TbEdit,
	TbFilter,
	TbInfoCircle,
	TbInfoTriangle,
	TbLayoutDashboard,
	TbLayoutSidebar,
	TbLayoutSidebarFilled,
	TbLogout,
	TbMessage,
	TbMoonStars,
	TbNotebook,
	TbNotes,
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
	courses: TbTools,
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
	course: TbNotebook,
	totalCourse: TbBook,
	publishedCourse: TbBook2,
	draftCourse: TbEdit,
	archivedCourse: TbArchive,

	// chapter
	chapter: TbNotes,

	// misc
	filter: TbFilter,
	plusCircle: TbCirclePlus,
	search: LuSearch
}
