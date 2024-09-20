import { type IconType } from 'react-icons/lib'

import { IconBadge } from '@/client/components/ui'

const SectionTitle = ({ title, icon }: { title: string; icon: IconType }) => {
	return (
		<div className="mb-2.5 flex items-center gap-x-2 sm:mb-4 md:mb-5">
			<IconBadge icon={icon} />
			<h2 className="text-xl">{title}</h2>
		</div>
	)
}

export { SectionTitle }
