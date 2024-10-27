import { type ColorPalette } from '@/core/components/tiptap-editor/color-picker'
import { useUserTheme } from '@/core/lib/hooks/use-user-theme'
import { Colors } from '@/core/lib/tiptap-editor/colors'

export function usePalettes(): ColorPalette[] {
	const { mode } = useUserTheme()
	const colorSet = mode === 'dark' ? Colors.dark : Colors.light

	return [
		{
			label: 'Palette 1',
			inverse: 'hsl(var(--background))',
			colors: [
				{ cssVar: 'hsl(var(--foreground))', label: 'Default' },
				{ cssVar: colorSet.AccentBoldBlue, label: 'Bold blue' },
				{ cssVar: colorSet.AccentBoldTeal, label: 'Bold teal' },
				{ cssVar: colorSet.AccentBoldGreen, label: 'Bold green' },
				{ cssVar: colorSet.AccentBoldOrange, label: 'Bold orange' },
				{ cssVar: colorSet.AccentBoldRed, label: 'Bold red' },
				{ cssVar: colorSet.AccentBoldPurple, label: 'Bold purple' }
			]
		},
		{
			label: 'Palette 2',
			inverse: 'hsl(var(--background))',
			colors: [
				{ cssVar: colorSet.Black, label: 'Black' },
				{ cssVar: colorSet.AccentBlue, label: 'Blue' },
				{ cssVar: colorSet.AccentTeal, label: 'Teal' },
				{ cssVar: colorSet.AccentGreen, label: 'Green' },
				{ cssVar: colorSet.AccentOrange, label: 'Orange' },
				{ cssVar: colorSet.AccentRed, label: 'Red' },
				{ cssVar: colorSet.AccentPurple, label: 'Purple' }
			]
		},
		{
			label: 'Palette 3',
			inverse: 'hsl(var(--foreground))',
			colors: [
				{ cssVar: colorSet.White, label: 'White' },
				{ cssVar: colorSet.AccentBlueSubtler, label: 'Blue subtle' },
				{ cssVar: colorSet.AccentTealSubtler, label: 'Teal subtle' },
				{ cssVar: colorSet.AccentGreenSubtler, label: 'Green subtle' },
				{ cssVar: colorSet.AccentYellowSubtler, label: 'Yellow subtle' },
				{ cssVar: colorSet.AccentRedSubtler, label: 'Red subtle' },
				{ cssVar: colorSet.AccentPurpleSubtler, label: 'Purple subtle' }
			]
		}
	]
}
