'use client'

import { useRouter } from 'next/navigation'
import * as React from 'react'

import { api } from '@/services/trpc/react'

import {
	Avatar,
	AvatarFallback,
	AvatarImage
} from '@/core/components/ui/avatar'
import { Button } from '@/core/components/ui/button'
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList
} from '@/core/components/ui/command'
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger
} from '@/core/components/ui/dialog'
import { Check } from '@/core/lib/icons'
import { cn } from '@/core/lib/utils/cn'

type SearchUsersDialogProps = {
	children: React.ReactNode
}

export function SearchUsersDialog({ children }: SearchUsersDialogProps) {
	const [open, setOpen] = React.useState(false)
	const [search, setSearch] = React.useState('')
	const router = useRouter()

	const { data: users } = api.chat.searchUsers.useQuery(
		{ query: search },
		{
			enabled: search.length > 0
		}
	)

	const createDirectChat = api.chat.createDirectChat.useMutation({
		onSuccess: (data) => {
			router.push(`/chat/${data.chatId}`)
			setOpen(false)
		}
	})

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>{children}</DialogTrigger>
			<DialogContent className="gap-0 p-0">
				<DialogHeader className="p-4 pb-0">
					<DialogTitle>Search Users</DialogTitle>
				</DialogHeader>
				<Command className="bg-background">
					<CommandInput
						placeholder="Search users..."
						value={search}
						onValueChange={setSearch}
					/>
					<CommandList>
						<CommandEmpty>No users found.</CommandEmpty>
						<CommandGroup>
							{users?.map((user) => (
								<CommandItem
									key={user.id}
									onSelect={() => {
										createDirectChat.mutate({ userId: user.id })
									}}
									className="gap-2"
								>
									<Avatar className="size-8">
										<AvatarImage src={user.imageUrl ?? ''} />
										<AvatarFallback>
											{user.name?.[0]?.toUpperCase() ?? '?'}
										</AvatarFallback>
									</Avatar>
									<div className="flex-1">
										<p className="text-sm font-medium">{user.name}</p>
										{user.email && (
											<p className="text-xs text-muted-foreground">
												{user.email}
											</p>
										)}
									</div>
									<Button
										variant="ghost"
										size="icon"
										className={cn(
											'size-8',
											createDirectChat.isPending &&
												'cursor-not-allowed opacity-50'
										)}
										disabled={createDirectChat.isPending}
									>
										<Check className="size-4" />
									</Button>
								</CommandItem>
							))}
						</CommandGroup>
					</CommandList>
				</Command>
			</DialogContent>
		</Dialog>
	)
}
