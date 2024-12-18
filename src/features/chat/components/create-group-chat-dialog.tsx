'use client'

import { useRouter } from 'next/navigation'
import * as React from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

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
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage
} from '@/core/components/ui/form'
import { Input } from '@/core/components/ui/input'
import { Check, X } from '@/core/lib/icons'

const formSchema = z.object({
	name: z.string().min(1, 'Group name is required'),
	memberIds: z.array(z.string()).min(1, 'At least one member is required')
})

type FormValues = z.infer<typeof formSchema>

type CreateGroupChatDialogProps = {
	children: React.ReactNode
}

export function CreateGroupChatDialog({
	children
}: CreateGroupChatDialogProps) {
	const [open, setOpen] = React.useState(false)
	const [search, setSearch] = React.useState('')
	const router = useRouter()

	const form = useForm<FormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			name: '',
			memberIds: []
		}
	})

	const { data: users, isLoading } = api.chat.searchUsers.useQuery(
		{ query: search },
		{
			enabled: search.length > 0
		}
	)

	const createGroupChat = api.chat.createGroupChat.useMutation({
		onSuccess: (data) => {
			router.push(`/chat/${data.chatId}`)
			setOpen(false)
		}
	})

	const onSubmit = (values: FormValues) => {
		createGroupChat.mutate(values)
	}

	const selectedMembers = form.watch('memberIds')

	const toggleMember = (userId: string) => {
		const currentMembers = form.getValues('memberIds')
		const newMembers = currentMembers.includes(userId)
			? currentMembers.filter((id) => id !== userId)
			: [...currentMembers, userId]
		form.setValue('memberIds', newMembers, { shouldValidate: true })
	}

	const handleSearchChange = (value: string) => {
		setSearch(value.trim())
	}

	React.useEffect(() => {
		if (!open) {
			setSearch('')
			form.reset()
		}
	}, [open, form])

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>{children}</DialogTrigger>
			<DialogContent className="gap-0 p-4">
				<DialogHeader className="pb-4">
					<DialogTitle>Create Group Chat</DialogTitle>
				</DialogHeader>

				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
						<FormField
							control={form.control}
							name="name"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Group Name</FormLabel>
									<FormControl>
										<Input placeholder="Enter group name..." {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="memberIds"
							render={() => (
								<FormItem>
									<FormLabel>Members</FormLabel>
									<FormControl>
										<Command className="border">
											<CommandInput
												placeholder="Search users..."
												value={search}
												onValueChange={handleSearchChange}
											/>
											<CommandList className="max-h-52 overflow-y-auto">
												{selectedMembers.length > 0 && (
													<CommandGroup heading="Selected Members">
														{users
															?.filter((user) =>
																selectedMembers.includes(user.id)
															)
															.map((user) => (
																<CommandItem
																	key={user.id}
																	onSelect={() => toggleMember(user.id)}
																	className="gap-2"
																>
																	<Avatar className="size-8">
																		<AvatarImage src={user.imageUrl ?? ''} />
																		<AvatarFallback>
																			{user.name?.[0]?.toUpperCase() ?? '?'}
																		</AvatarFallback>
																	</Avatar>
																	<div className="flex-1">
																		<p className="text-sm font-medium">
																			{user.name}
																		</p>
																		{user.email && (
																			<p className="text-xs text-muted-foreground">
																				{user.email}
																			</p>
																		)}
																	</div>
																	<Button
																		type="button"
																		variant="ghost"
																		size="icon"
																		className="size-8 text-primary"
																	>
																		<Check className="size-4" />
																	</Button>
																</CommandItem>
															))}
													</CommandGroup>
												)}

												<CommandEmpty>
													{isLoading
														? 'Searching...'
														: search.length > 0
															? 'No users found'
															: 'Start typing to search users'}
												</CommandEmpty>

												{users && users.length > 0 && (
													<CommandGroup heading="Search Results">
														{users
															.filter(
																(user) => !selectedMembers.includes(user.id)
															)
															.map((user) => (
																<CommandItem
																	key={user.id}
																	onSelect={() => toggleMember(user.id)}
																	className="gap-2"
																>
																	<Avatar className="size-8">
																		<AvatarImage src={user.imageUrl ?? ''} />
																		<AvatarFallback>
																			{user.name?.[0]?.toUpperCase() ?? '?'}
																		</AvatarFallback>
																	</Avatar>
																	<div className="flex-1">
																		<p className="text-sm font-medium">
																			{user.name}
																		</p>
																		{user.email && (
																			<p className="text-xs text-muted-foreground">
																				{user.email}
																			</p>
																		)}
																	</div>
																	<Button
																		type="button"
																		variant="ghost"
																		size="icon"
																		className="size-8"
																	>
																		<X className="size-4" />
																	</Button>
																</CommandItem>
															))}
													</CommandGroup>
												)}
											</CommandList>
										</Command>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<Button
							type="submit"
							className="w-full"
							disabled={createGroupChat.isPending}
						>
							Create Group Chat
						</Button>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	)
}
