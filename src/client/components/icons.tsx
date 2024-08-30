import {
	TbAlertTriangle,
	TbChartHistogram,
	TbCircleCheck,
	TbDiamond,
	TbInfoCircle,
	TbInfoTriangle,
	TbLayoutDashboard,
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

	navlinks: {
		dashboard: TbLayoutDashboard,
		learning: TbSchool,
		reports: TbChartHistogram,
		chat: TbMessage
	},

	account: {
		profile: TbUser,
		preference: TbPaint,
		settings: TbSettings2,
		logout: TbLogout
	},

	mode: {
		light: TbSunHigh,
		dark: TbMoonStars
	},

	status: {
		success: TbCircleCheck,
		info: TbInfoCircle,
		warning: TbAlertTriangle,
		error: TbInfoTriangle
	}
}
