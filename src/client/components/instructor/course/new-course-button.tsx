import Link from 'next/link'

import { Icons } from '@/client/components/icons'
import { buttonVariants } from '@/client/components/ui'
import { cn } from '@/client/lib/utils'

const NewCourseButton = () => {
	return (
		<Link href="/courses/create" className={cn(buttonVariants(), 'h-10 w-32')}>
			<Icons.plusCircle className="mr-1 size-5 shrink-0" />
			New Course
		</Link>
	)
}

export { NewCourseButton }
