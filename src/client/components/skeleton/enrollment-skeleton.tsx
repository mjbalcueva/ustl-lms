import { Card, CardContent, CardFooter, CardHeader } from '@/client/components/ui/card'
import { Skeleton } from '@/client/components/ui/skeleton'

export const EnrollmentSkeleton = () => {
	return (
		<Card className="w-full max-w-md">
			<CardHeader className="flex items-center justify-normal gap-2">
				<Skeleton className="h-6 w-3/4" />
				<Skeleton className="h-4 w-9" />
			</CardHeader>
			<CardContent className="space-y-4">
				<Skeleton className="h-40 w-full" /> {/* Image placeholder */}
				<div className="space-y-2">
					<Skeleton className="h-4 w-full" />
					<Skeleton className="h-4 w-5/6" />
					<Skeleton className="h-4 w-4/5" />
				</div>
				<div className="flex space-x-2">
					<Skeleton className="h-6 w-20" /> {/* Category badge placeholder */}
					<Skeleton className="h-6 w-24" /> {/* Category badge placeholder */}
				</div>
				<div className="flex items-center space-x-2">
					<Skeleton className="h-10 w-10 rounded-full" /> {/* Instructor avatar placeholder */}
					<Skeleton className="h-4 w-32" /> {/* Instructor name placeholder */}
				</div>
			</CardContent>
			<CardFooter>
				<Skeleton className="h-10 w-full" /> {/* Button placeholder */}
			</CardFooter>
		</Card>
	)
}
