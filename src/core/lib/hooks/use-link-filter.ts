import { useMemo } from 'react'
import { useSession } from 'next-auth/react'

import { type Link as NavLinks } from '@/core/types/links'

/**
 * @description This hook is used to filter the links based on the user's role and the level of the links.
 * @param links - The links to filter.
 * @param level - The level of the links to filter.
 * @returns The filtered links.
 */
export function useLinkFilter(links: NavLinks[], level = 0): NavLinks[] {
	const { data: session } = useSession()
	const userRole = session?.user?.role

	return useMemo(() => {
		if (level === 0) return links.slice(0, 1).map((link) => ({ ...link, children: undefined }))

		/**
		 * @description This function is used to filter the links based on the user's role and the level of the links.
		 * @param links - The links to filter.
		 * @param parentRole - The role of the parent link.
		 * @param currentLevel - The current level of the links.
		 * @returns The filtered links.
		 */
		const filterLinks = (
			links: NavLinks[],
			parentRole?: string[],
			currentLevel = 0
		): NavLinks[] => {
			if (currentLevel > level) return []

			return links.flatMap((link) => {
				const linkRoles = link.roles ?? parentRole
				if (linkRoles && !linkRoles.includes(userRole as string)) return []

				const filteredLink: NavLinks = { ...link }
				delete filteredLink.children

				if (currentLevel < level && link.children)
					filteredLink.children = filterLinks(link.children, linkRoles, currentLevel + 1)

				return [filteredLink]
			})
		}

		return filterLinks(links)
	}, [links, userRole, level])
}
