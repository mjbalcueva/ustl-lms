'use client'

import { useState } from 'react'

import { Icons } from '@/client/components/icons'
import {
	Button,
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuTrigger
} from '@/client/components/ui'

const FilterButton = () => {
	const [checked, setChecked] = useState({
		published: false,
		draft: false,
		archived: false
	})

	const handleCheck = (status: keyof typeof checked) => {
		setChecked((prevState) => ({
			...prevState,
			[status]: !prevState[status]
		}))
	}

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="card" className="rounded-xl font-normal shadow-sm">
					<Icons.filter className="mr-2 h-4 w-4" />
					Status
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent>
				<DropdownMenuCheckboxItem checked={checked.published} onCheckedChange={() => handleCheck('published')}>
					Published
				</DropdownMenuCheckboxItem>
				<DropdownMenuCheckboxItem checked={checked.draft} onCheckedChange={() => handleCheck('draft')}>
					Draft
				</DropdownMenuCheckboxItem>
				<DropdownMenuCheckboxItem checked={checked.archived} onCheckedChange={() => handleCheck('archived')}>
					Archived
				</DropdownMenuCheckboxItem>
			</DropdownMenuContent>
		</DropdownMenu>
	)
}

export { FilterButton }
