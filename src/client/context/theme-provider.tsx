import { ThemeProvider as NextThemesProvider } from 'next-themes'
import { type ThemeProviderProps } from 'next-themes/dist/types'

export const ThemeProvider = ({ children, ...props }: ThemeProviderProps) => {
	return (
		<NextThemesProvider
			defaultTheme="dark-zinc"
			disableTransitionOnChange
			enableColorScheme
			enableSystem={false}
			themes={['light-ayu', 'dark-ayu', 'light-zinc', 'dark-zinc', 'light-grass', 'dark-grass']}
			{...props}
		>
			{children}
		</NextThemesProvider>
	)
}

// export { ThemeProvider }
