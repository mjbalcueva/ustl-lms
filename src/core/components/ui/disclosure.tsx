'use client'

import * as React from 'react'
import { createContext, useContext, useId, useState } from 'react'
import { Slot } from '@radix-ui/react-slot'
import {
	AnimatePresence,
	motion,
	MotionConfig,
	type Transition,
	type Variant,
	type Variants
} from 'framer-motion'

import { cn } from '@/core/lib/utils/cn'

type DisclosureContextType = {
	open: boolean
	toggle: () => void
	variants?: { expanded: Variant; collapsed: Variant }
}

const DisclosureContext = createContext<DisclosureContextType | undefined>(undefined)

type DisclosureProviderProps = {
	children: React.ReactNode
	open: boolean
	onOpenChange: (open: boolean) => void
	variants?: { expanded: Variant; collapsed: Variant }
}

function DisclosureProvider({ children, open, onOpenChange, variants }: DisclosureProviderProps) {
	const toggle = () => {
		onOpenChange(!open)
	}

	return (
		<DisclosureContext.Provider
			value={{
				open,
				toggle,
				variants
			}}
		>
			{children}
		</DisclosureContext.Provider>
	)
}

function useDisclosure() {
	const context = useContext(DisclosureContext)
	if (!context) {
		throw new Error('useDisclosure must be used within a DisclosureProvider')
	}
	return context
}

type DisclosureProps = {
	defaultOpen?: boolean
	open?: boolean
	onOpenChange?: (open: boolean) => void
	children?: React.ReactNode
	className?: string
	variants?: { expanded: Variant; collapsed: Variant }
	transition?: Transition
}

export const Disclosure = ({
	defaultOpen = false,
	open: controlledOpen,
	onOpenChange,
	children,
	className,
	transition,
	variants
}: DisclosureProps) => {
	const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen)

	const isControlled = controlledOpen !== undefined
	const open = isControlled ? controlledOpen : uncontrolledOpen

	const handleOpenChange = (newOpen: boolean) => {
		if (!isControlled) {
			setUncontrolledOpen(newOpen)
		}
		onOpenChange?.(newOpen)
	}

	return (
		<MotionConfig transition={transition}>
			<DisclosureProvider open={open} onOpenChange={handleOpenChange} variants={variants}>
				<div className={className} data-state={open ? 'open' : 'closed'}>
					{children}
				</div>
			</DisclosureProvider>
		</MotionConfig>
	)
}

type DisclosureTriggerProps = React.ComponentPropsWithoutRef<'button'> & {
	asChild?: boolean
}

export const DisclosureTrigger = React.forwardRef<HTMLButtonElement, DisclosureTriggerProps>(
	({ children, className, asChild = false, ...props }, ref) => {
		const { toggle, open } = useDisclosure()
		const Comp = asChild ? Slot : 'button'

		return (
			<Comp
				type={asChild ? undefined : 'button'}
				ref={ref}
				onClick={(e) => {
					e.preventDefault()
					toggle()
				}}
				aria-expanded={open}
				className={cn(className)}
				data-state={open ? 'open' : 'closed'}
				{...props}
			>
				{children}
			</Comp>
		)
	}
)

DisclosureTrigger.displayName = 'DisclosureTrigger'

type DisclosureContentProps = {
	children: React.ReactNode
	className?: string
}

export const DisclosureContent = ({ children, className }: DisclosureContentProps) => {
	const { open, variants } = useDisclosure()
	const uniqueId = useId()

	const BASE_VARIANTS: Variants = {
		expanded: {
			height: 'auto',
			opacity: 1,
			transition: {
				height: { duration: 0.2 },
				opacity: { duration: 0.2 }
			}
		},
		collapsed: {
			height: 0,
			opacity: 0,
			transition: {
				height: { duration: 0.2 },
				opacity: { duration: 0.2 }
			}
		}
	}

	const combinedVariants = {
		expanded: { ...BASE_VARIANTS.expanded, ...variants?.expanded },
		collapsed: { ...BASE_VARIANTS.collapsed, ...variants?.collapsed }
	}

	return (
		<AnimatePresence initial={true}>
			{open && (
				<motion.div
					key={uniqueId}
					id={uniqueId}
					className={cn('overflow-hidden', className)}
					data-state={open ? 'open' : 'closed'}
					variants={combinedVariants}
					initial={open ? 'expanded' : 'collapsed'}
					animate="expanded"
					exit="collapsed"
				>
					{children}
				</motion.div>
			)}
		</AnimatePresence>
	)
}
