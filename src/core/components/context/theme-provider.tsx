import { ThemeProvider as NextThemesProvider } from 'next-themes'
import { type ThemeProviderProps } from 'next-themes/dist/types'

export const ThemeProvider = ({ children, ...props }: ThemeProviderProps) => {
	return (
		<NextThemesProvider
			defaultTheme="dark-default"
			disableTransitionOnChange
			enableColorScheme
			enableSystem={false}
			themes={[
				'dark-default',
				'dark-ayu',
				'dark-rose',
				'dark-grass',
				'light-default',
				'light-ayu',
				'light-rose',
				'light-grass'
			]}
			{...props}
		>
			{children}
		</NextThemesProvider>
	)
}
