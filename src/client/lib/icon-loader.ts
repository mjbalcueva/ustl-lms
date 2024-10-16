import { type IconType } from 'react-icons'
import * as LuIcons from 'react-icons/lu'
import * as TbIcons from 'react-icons/tb'

const iconLibraries = {
	Tb: TbIcons,
	Lu: LuIcons
} as const

type IconLibrary = keyof typeof iconLibraries
type IconName<T extends IconLibrary> = keyof (typeof iconLibraries)[T]

type IconIdentifier = `${IconLibrary}/${string}`

const iconCache = new Map<IconIdentifier, IconType>()

export function getIcon(iconName: IconIdentifier): IconType {
	if (iconCache.has(iconName)) {
		return iconCache.get(iconName)!
	}

	const [libraryName, iconKey] = iconName.split('/') as [IconLibrary, string]
	const library = iconLibraries[libraryName]
	const Icon = library[iconKey as IconName<typeof libraryName>]

	if (!Icon) {
		throw new Error(`Icon ${iconKey} not found in library ${libraryName}`)
	}

	iconCache.set(iconName, Icon)
	return Icon
}

export type { IconIdentifier }
