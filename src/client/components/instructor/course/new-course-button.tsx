import { DialogTrigger } from '@radix-ui/react-dialog'

import { Icons } from '@/client/components/icons'
import { CreateCourseForm } from '@/client/components/instructor/course/forms/create-course'
import {
	Button,
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	Separator
} from '@/client/components/ui'

const NewCourseButton = () => {
	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button className="h-10 w-32">
					<Icons.plusCircle className="mr-1 size-5 shrink-0" />
					New Course
				</Button>
			</DialogTrigger>

			<DialogContent>
				<DialogHeader>
					<DialogTitle>Create new course</DialogTitle>
					<DialogDescription>Create a new course to start teaching your students.</DialogDescription>
				</DialogHeader>
				<Separator />
				<CreateCourseForm />
			</DialogContent>
		</Dialog>
	)
}

export { NewCourseButton }
