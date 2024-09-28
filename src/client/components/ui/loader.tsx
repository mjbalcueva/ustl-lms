import type { SVGProps } from 'react'
import React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { TbLoader, TbLoader2 } from 'react-icons/tb'

import { cn } from '@/client/lib/utils'

const loaderStyles = cva('relative', {
	variants: {
		intent: {
			current: 'text-current',
			primary: 'text-primary',
			secondary: 'text-muted-fg',
			success: 'text-green-400',
			warning: 'text-yellow-400',
			danger: 'text-red-400'
		},
		size: {
			'small': 'size-4',
			'medium': 'size-6',
			'large': 'size-8',
			'extra-large': 'size-10'
		}
	},
	defaultVariants: {
		intent: 'current',
		size: 'small'
	}
})

type LoaderVariantProps = VariantProps<typeof loaderStyles>

const Bars = React.memo(({ className, ...props }: SVGProps<SVGSVGElement>) => (
	<svg
		className={cn('size-4', className)}
		data-slot="icon"
		viewBox="0 0 135 140"
		xmlns="http://www.w3.org/2000/svg"
		fill="currentColor"
		{...props}
	>
		<rect y="10" width="15" height="120" rx="6">
			<animate
				attributeName="height"
				begin="0.5s"
				dur="1s"
				values="120;110;100;90;80;70;60;50;40;140;120"
				calcMode="linear"
				repeatCount="indefinite"
			/>
			<animate
				attributeName="y"
				begin="0.5s"
				dur="1s"
				values="10;15;20;25;30;35;40;45;50;0;10"
				calcMode="linear"
				repeatCount="indefinite"
			/>
		</rect>
		<rect x="30" y="10" width="15" height="120" rx="6">
			<animate
				attributeName="height"
				begin="0.25s"
				dur="1s"
				values="120;110;100;90;80;70;60;50;40;140;120"
				calcMode="linear"
				repeatCount="indefinite"
			/>
			<animate
				attributeName="y"
				begin="0.25s"
				dur="1s"
				values="10;15;20;25;30;35;40;45;50;0;10"
				calcMode="linear"
				repeatCount="indefinite"
			/>
		</rect>
		<rect x="60" width="15" height="140" rx="6">
			<animate
				attributeName="height"
				begin="0s"
				dur="1s"
				values="120;110;100;90;80;70;60;50;40;140;120"
				calcMode="linear"
				repeatCount="indefinite"
			/>
			<animate
				attributeName="y"
				begin="0s"
				dur="1s"
				values="10;15;20;25;30;35;40;45;50;0;10"
				calcMode="linear"
				repeatCount="indefinite"
			/>
		</rect>
		<rect x="90" y="10" width="15" height="120" rx="6">
			<animate
				attributeName="height"
				begin="0.25s"
				dur="1s"
				values="120;110;100;90;80;70;60;50;40;140;120"
				calcMode="linear"
				repeatCount="indefinite"
			/>
			<animate
				attributeName="y"
				begin="0.25s"
				dur="1s"
				values="10;15;20;25;30;35;40;45;50;0;10"
				calcMode="linear"
				repeatCount="indefinite"
			/>
		</rect>
		<rect x="120" y="10" width="15" height="120" rx="6">
			<animate
				attributeName="height"
				begin="0.5s"
				dur="1s"
				values="120;110;100;90;80;70;60;50;40;140;120"
				calcMode="linear"
				repeatCount="indefinite"
			/>
			<animate
				attributeName="y"
				begin="0.5s"
				dur="1s"
				values="10;15;20;25;30;35;40;45;50;0;10"
				calcMode="linear"
				repeatCount="indefinite"
			/>
		</rect>
	</svg>
))
Bars.displayName = 'Bars'

const Dots = React.memo(({ className, ...props }: SVGProps<SVGSVGElement>) => (
	<svg
		className={cn('size-4', className)}
		data-slot="icon"
		viewBox="0 0 120 30"
		xmlns="http://www.w3.org/2000/svg"
		fill="currentColor"
		{...props}
	>
		<circle cx="15" cy="15" r="15">
			<animate
				attributeName="r"
				from="15"
				to="15"
				begin="0s"
				dur="0.8s"
				values="15;9;15"
				calcMode="linear"
				repeatCount="indefinite"
			/>
			<animate
				attributeName="fill-opacity"
				from="1"
				to="1"
				begin="0s"
				dur="0.8s"
				values="1;.5;1"
				calcMode="linear"
				repeatCount="indefinite"
			/>
		</circle>
		<circle cx="60" cy="15" r="9" fillOpacity="0.3">
			<animate
				attributeName="r"
				from="9"
				to="9"
				begin="0s"
				dur="0.8s"
				values="9;15;9"
				calcMode="linear"
				repeatCount="indefinite"
			/>
			<animate
				attributeName="fill-opacity"
				from="0.5"
				to="0.5"
				begin="0s"
				dur="0.8s"
				values=".5;1;.5"
				calcMode="linear"
				repeatCount="indefinite"
			/>
		</circle>
		<circle cx="105" cy="15" r="15">
			<animate
				attributeName="r"
				from="15"
				to="15"
				begin="0s"
				dur="0.8s"
				values="15;9;15"
				calcMode="linear"
				repeatCount="indefinite"
			/>
			<animate
				attributeName="fill-opacity"
				from="1"
				to="1"
				begin="0s"
				dur="0.8s"
				values="1;.5;1"
				calcMode="linear"
				repeatCount="indefinite"
			/>
		</circle>
	</svg>
))
Dots.displayName = 'Dots'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const Ring = React.memo((props: any) => <TbLoader {...props} />)
Ring.displayName = 'Ring'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const Spin = React.memo((props: any) => <TbLoader2 {...props} />)
Spin.displayName = 'Spin'

const Hot = React.memo(({ className, ...props }: SVGProps<SVGSVGElement>) => (
	<svg className={cn('size-4', className)} data-slot="icon" viewBox="0 0 2400 2400" {...props}>
		<g strokeWidth="200" strokeLinecap="round" fill="none">
			<line x1="1200" y1="600" x2="1200" y2="100" />
			<line opacity="0.5" x1="1200" y1="2300" x2="1200" y2="1800" />
			<line opacity="0.917" x1="900" y1="680.4" x2="650" y2="247.4" />
			<line opacity="0.417" x1="1750" y1="2152.6" x2="1500" y2="1719.6" />
			<line opacity="0.833" x1="680.4" y1="900" x2="247.4" y2="650" />
			<line opacity="0.333" x1="2152.6" y1="1750" x2="1719.6" y2="1500" />
			<line opacity="0.75" x1="600" y1="1200" x2="100" y2="1200" />
			<line opacity="0.25" x1="2300" y1="1200" x2="1800" y2="1200" />
			<line opacity="0.667" x1="680.4" y1="1500" x2="247.4" y2="1750" />
			<line opacity="0.167" x1="2152.6" y1="650" x2="1719.6" y2="900" />
			<line opacity="0.583" x1="900" y1="1719.6" x2="650" y2="2152.6" />
			<line opacity="0.083" x1="1750" y1="247.4" x2="1500" y2="680.4" />
			<animateTransform
				attributeName="transform"
				attributeType="XML"
				type="rotate"
				keyTimes="0;0.08333;0.16667;0.25;0.33333;0.41667;0.5;0.58333;0.66667;0.75;0.83333;0.91667"
				values="0 1199 1199;30 1199 1199;60 1199 1199;90 1199 1199;120 1199 1199;150 1199 1199;180 1199 1199;210 1199 1199;240 1199 1199;270 1199 1199;300 1199 1199;330 1199 1199"
				dur="0.83333s"
				begin="0.08333s"
				repeatCount="indefinite"
				calcMode="discrete"
			/>
		</g>
	</svg>
))
Hot.displayName = 'Hot'

const LOADERS = {
	bars: Bars,
	dots: Dots,
	ring: Ring,
	spin: Spin,
	hot: Hot
}

const DEFAULT_SPINNER = 'ring'

export type LoaderProps = Omit<React.ComponentPropsWithoutRef<'svg'>, 'display' | 'opacity' | 'intent'> &
	LoaderVariantProps & {
		variant?: keyof typeof LOADERS
	}

const Loader = React.forwardRef<SVGSVGElement, LoaderProps>((props, ref) => {
	const { className, variant = DEFAULT_SPINNER, intent, size, ...spinnerProps } = props
	const LoaderPrimitive = LOADERS[variant in LOADERS ? variant : DEFAULT_SPINNER]

	return (
		<LoaderPrimitive
			role="presentation"
			className={loaderStyles({
				intent,
				size,
				className: ['spin', 'ring'].includes(variant)
					? 'animate-spin'
					: variant === 'hot'
						? 'stroke-current'
						: className
			})}
			ref={ref}
			{...spinnerProps}
		/>
	)
})

Loader.displayName = 'Loader'

export { Loader }
