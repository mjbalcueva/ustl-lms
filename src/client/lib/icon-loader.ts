import { type IconType } from 'react-icons'
import * as AiIcons from 'react-icons/ai'
import * as FaIcons from 'react-icons/fa'
import * as LuIcons from 'react-icons/lu'
import * as TbIcons from 'react-icons/tb'

const iconLibraries = {
	Tb: TbIcons,
	Lu: LuIcons,
	Ai: AiIcons,
	Fa: FaIcons
} as const

type IconLibrary = keyof typeof iconLibraries
type IconName<T extends IconLibrary> = keyof (typeof iconLibraries)[T]

type IconIdentifier = {
	[K in IconLibrary]: `${K & string}/${IconName<K> & string}`
}[IconLibrary]

const iconCache: Record<string, IconType> = {}

export function getIcon(iconName: IconIdentifier): IconType {
	if (iconCache[iconName]) {
		return iconCache[iconName]
	}

	const [libraryName, iconKey] = iconName.split('/') as [IconLibrary, string]

	const library = iconLibraries[libraryName]
	const Icon = library[iconKey as IconName<typeof libraryName>]

	if (!Icon) {
		throw new Error(`Icon ${iconKey} not found in library ${libraryName}`)
	}

	iconCache[iconName] = Icon
	return Icon
}

export type { IconIdentifier }
