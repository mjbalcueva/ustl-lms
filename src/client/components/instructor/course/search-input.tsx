import { Icons } from '@/client/components/icons'
import { Input } from '@/client/components/ui'

const SearchInput = () => {
	return (
		<div className="relative max-w-xs flex-grow rounded-lg">
			<Icons.search className="absolute left-3 size-4 translate-y-2/3 text-muted-foreground" />
			<Input placeholder="Search courses" className="bg-card pl-10" />
		</div>
	)
}

export { SearchInput }
