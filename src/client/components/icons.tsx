import {
	TbAlertTriangle,
	TbChartHistogram,
	TbCircleCheck,
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
	TbSchool,
	TbSettings2,
	TbSunHigh,
	TbUser
} from 'react-icons/tb'

export const Icons = {
	logo: TbDiamond,

	// navlinks
	dashboard: TbLayoutDashboard,
	learning: TbSchool,
	reports: TbChartHistogram,
	chat: TbMessage,

	// account settings
	profile: TbUser,
	preference: TbPaint,
	settings: TbSettings2,
	logout: TbLogout,

	// theme
	lightMode: TbSunHigh,
	darkMode: TbMoonStars,

	// nav
	sidebarOpen: TbLayoutSidebar,
	sidebarClose: TbLayoutSidebarFilled,

	// variants
	circleCheckFilled: TbCircleCheck,
	circleInfoFilled: TbInfoCircle,
	triangleAlertFilled: TbAlertTriangle,
	triangleInfoFilled: TbInfoTriangle
}
