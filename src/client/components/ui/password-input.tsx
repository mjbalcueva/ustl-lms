'use client'

import * as React from 'react'
import { EyeIcon, EyeOffIcon } from 'lucide-react'

import { Button } from '@/client/components/ui/button'
import { Input, type InputProps } from '@/client/components/ui/input'
import { cn } from '@/client/lib/utils'

const PasswordInput = React.forwardRef<HTMLInputElement, InputProps>(({ className, ...props }, ref) => {
	const [showPassword, setShowPassword] = React.useState(false)
	const disabled = props.value === '' || props.value === undefined || props.disabled

	return (
		<div className="relative">
			<Input
				type={showPassword ? 'text' : 'password'}
				className={cn('hide-password-toggle pr-10', className)}
				ref={ref}
				{...props}
			/>
			{!disabled && (
				<Button
					type="button"
					variant="ghost"
					size="sm"
					className="absolute bottom-0 right-0 h-full rounded-xl hover:bg-transparent"
					onClick={() => setShowPassword((prev) => !prev)}
				>
					{showPassword ? (
						<EyeIcon className="size-4" aria-hidden="true" />
					) : (
						<EyeOffIcon className="size-4" aria-hidden="true" />
					)}
					<span className="sr-only">{showPassword ? 'Hide password' : 'Show password'}</span>
				</Button>
			)}

			{/* hides browsers password toggles */}
			<style>{`
					.hide-password-toggle::-ms-reveal,
					.hide-password-toggle::-ms-clear {
						visibility: hidden;
						pointer-events: none;
						display: none;
					}
				`}</style>
		</div>
	)
})
PasswordInput.displayName = 'PasswordInput'

export { PasswordInput }
