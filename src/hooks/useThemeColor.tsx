import { useTheme } from '@siga/context/themeProvider';
import type { ThemeMode, ThemeColorValues } from '@siga/constants/Colors';

export function useThemeColor(
  props: Partial<Record<ThemeMode, string>>, // { light?: string, dark?: string }
  colorName: keyof ThemeColorValues
): string {
  const { theme, colors } = useTheme(); // theme: 'light' | 'dark', colors: ThemeColorValues
  const overrideColor = props[theme];

  return overrideColor ?? colors[colorName];
}

// example use
//useThemeColor({ light: 'red', dark: 'blue' }, 'primary')
//const textColor = useThemeColor({}, 'onBackground')
