import animatePlugin from 'tailwindcss-animate'
import { fontFamily } from 'tailwindcss/defaultTheme'

import { type Config } from 'tailwindcss'

/* eslint-disable */
const {
	default: flattenColorPalette
} = require('tailwindcss/lib/util/flattenColorPalette')
const svgToDataUri = require('mini-svg-data-uri')

const addBackgroundUtilities = ({ matchUtilities, theme }: any) => {
	matchUtilities(
		{
			'bg-grid-lg': (value: any) => ({
				backgroundImage: `url("${svgToDataUri(
					`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="64" height="64" fill="none" stroke="${value}"><path d="M0 .5H31.5V32"/></svg>`
				)}")`
			}),
			'bg-grid': (value: any) => ({
				backgroundImage: `url("${svgToDataUri(
					`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="24" height="24" fill="none" stroke="${value}"><path d="M0 .5H31.5V32"/></svg>`
				)}")`
			}),
			'bg-grid-small': (value: any) => ({
				backgroundImage: `url("${svgToDataUri(
					`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="8" height="8" fill="none" stroke="${value}"><path d="M0 .5H31.5V32"/></svg>`
				)}")`
			}),
			'bg-dot': (value: any) => ({
				backgroundImage: `url("${svgToDataUri(
					`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="16" height="16" fill="none"><circle fill="${value}" id="pattern-circle" cx="10" cy="10" r="1.6257413380501518"></circle></svg>`
				)}")`
			})
		},
		{ values: flattenColorPalette(theme('backgroundColor')), type: 'color' }
	)
}

const addVariablesForColors = ({ addBase, theme }: any) => {
	const allColors = flattenColorPalette(theme('colors'))
	const newVars = Object.fromEntries(
		Object.entries(allColors).map(([key, val]) => [`--${key}`, val])
	)
	addBase({ ':root': newVars })
}

const config = {
	darkMode: ['class', '[data-theme^="dark-"]'],
	content: ['./src/**/*.{ts,tsx}'],
	prefix: '',
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: { '2xl': '1400px' }
		},
		extend: {
			fontFamily: {
				sans: ['var(--font-geist-sans)', ...fontFamily.sans]
			},
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				chart: {
					'1': 'hsl(var(--chart-1))',
					'2': 'hsl(var(--chart-2))',
					'3': 'hsl(var(--chart-3))',
					'4': 'hsl(var(--chart-4))',
					'5': 'hsl(var(--chart-5))'
				},
				shiki: {
					'light': 'var(--shiki-light)',
					'light-bg': 'var(--shiki-light-bg)',
					'dark': 'var(--shiki-dark)',
					'dark-bg': 'var(--shiki-dark-bg)'
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: { height: '0' },
					to: { height: 'var(--radix-accordion-content-height)' }
				},
				'accordion-up': {
					from: { height: 'var(--radix-accordion-content-height)' },
					to: { height: '0' }
				},
				'caret-blink': {
					'0%,70%,100%': { opacity: '1' },
					'20%,50%': { opacity: '0' }
				},
				'shine': {
					from: { backgroundPosition: '200% 0' },
					to: { backgroundPosition: '-200% 0' }
				},
				'typing-dot-bounce': {
					'0%,40%': { transform: 'translateY(0)' },
					'20%': { transform: 'translateY(-0.25rem)' }
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'caret-blink': 'caret-blink 1.25s ease-out infinite',
				'shine': 'shine 6s ease-in-out infinite',
				'typing-dot-bounce': 'typing-dot-bounce 1.4s infinite'
			}
		}
	},
	plugins: [addBackgroundUtilities, addVariablesForColors, animatePlugin]
} satisfies Config

export default config
