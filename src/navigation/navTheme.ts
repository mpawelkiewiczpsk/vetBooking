// src/navigation/navTheme.ts – React Navigation theme built from the app theme
import { DarkTheme, DefaultTheme, type Theme } from "@react-navigation/native";
import { fonts, type AppTheme } from "@/theme/theme";

export function toNavigationTheme(theme: AppTheme): Theme {
  const base = theme.dark ? DarkTheme : DefaultTheme;
  return {
    ...base,
    colors: {
      ...base.colors,
      primary: theme.colors.primary, // active elements (e.g. the selected tab)
      background: theme.colors.background, // screen background
      card: theme.colors.surface, // headers, tab bar, drawer
      text: theme.colors.text,
      border: theme.colors.border,
      notification: theme.colors.danger, // badge color
    },
    // In v7 the theme also contains the fonts used by headers and tabs
    fonts: {
      regular: { fontFamily: fonts.regular, fontWeight: "400" },
      medium: { fontFamily: fonts.medium, fontWeight: "500" },
      bold: { fontFamily: fonts.bold, fontWeight: "700" },
      heavy: { fontFamily: fonts.black, fontWeight: "900" },
    },
  };
}
