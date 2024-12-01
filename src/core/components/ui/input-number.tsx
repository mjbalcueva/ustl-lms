'use client'

import * as React from 'react'

import { Button } from '@/core/components/ui/button'
import { Input } from '@/core/components/ui/input'
import { ChevronDown, ChevronUp } from '@/core/lib/icons'
import { cn } from '@/core/lib/utils/cn'

type InputNumberProps = Omit<
	React.ComponentProps<typeof Input>,
	'onChange' | 'value' | 'type'
> & {
	value?: number
	onChange?: (value: number | undefined) => void
	min?: number
	max?: number
	step?: number
}

export const InputNumber = React.forwardRef<HTMLInputElement, InputNumberProps>(
	(
		{
			className,
			value,
			onChange,
			min = -Infinity,
			max = Infinity,
			step = 1,
			...props
		},
		ref
	) => {
		const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
			const newValue =
				e.target.value === '' ? undefined : Number(e.target.value)
			onChange?.(newValue)
		}

		const handleIncrement = () => {
			const newValue = value === undefined ? step : Math.min(value + step, max)
			onChange?.(newValue)
		}

		const handleDecrement = () => {
			const newValue = value === undefined ? -step : Math.max(value - step, min)
			onChange?.(newValue)
		}

		return (
			<div className="relative flex items-center">
				<Input
					type="number"
					value={value ?? ''}
					onChange={handleChange}
					className={cn(
						'rounded-r-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none',
						'focus-visible:z-10',
						className
					)}
					min={min}
					max={max}
					step={step}
					ref={ref}
					{...props}
				/>
				<div className="flex flex-col">
					<Button
						type="button"
						aria-label="Increase value"
						// className="h-5 rounded-l-none rounded-br-none border-b-[0.5px] border-l-0 border-input px-2 focus-visible:z-10"
						className={cn(
							'h-5 rounded-l-none rounded-br-none border-b-[0.5px] border-l-0 border-input px-2 focus-visible:z-10',
							className
						)}
						variant="outline"
						onClick={handleIncrement}
						disabled={value === max}
					>
						<ChevronUp className="!size-3.5 opacity-50" />
					</Button>
					<Button
						type="button"
						aria-label="Decrease value"
						className={cn(
							'h-5 rounded-l-none rounded-tr-none border-l-0 border-t-[0.5px] border-input px-2 focus-visible:z-10',
							className
						)}
						variant="outline"
						onClick={handleDecrement}
						disabled={value === min}
					>
						<ChevronDown className="!size-3.5 opacity-50" />
					</Button>
				</div>
			</div>
		)
	}
)

InputNumber.displayName = 'InputNumber'
