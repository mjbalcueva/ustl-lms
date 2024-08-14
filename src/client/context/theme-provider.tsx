import { ThemeProvider as NextThemesProvider } from 'next-themes'
import { type ThemeProviderProps } from 'next-themes/dist/types'

export const ThemeProvider = ({ children, ...props }: ThemeProviderProps) => {
	return (
		<NextThemesProvider
			defaultTheme="dark-default"
			disableTransitionOnChange
			enableColorScheme
			enableSystem={false}
			themes={['light-default', 'dark-default', 'light-ayu', 'dark-ayu', 'light-grass', 'dark-grass']}
			{...props}
		>
			{children}
		</NextThemesProvider>
	)
}
