// src/theme/theme.ts – single source of colors, spacing and typography
import { useColorScheme } from "react-native";

const brand = {
  primary: "#0E9F8E", // calm "clinic" teal
  primaryDark: "#0B7F72",
  accent: "#F59E0B", // highlights and rating stars
  success: "#16A34A",
  warning: "#F59E0B",
  danger: "#DC2626",
  info: "#2563EB",
};

export const lightTheme = {
  dark: false,
  colors: {
    ...brand,
    background: "#F4F7F6",
    surface: "#FFFFFF",
    surfaceAlt: "#E8EFED",
    border: "#D9E3E0",
    text: "#10201D",
    textMuted: "#55635F",
    onPrimary: "#FFFFFF",
    slotFree: "#E3F4F1",
    slotTaken: "#C9D1CF",
  },
};

export const darkTheme: AppTheme = {
  dark: true,
  colors: {
    ...brand,
    background: "#0C1312",
    surface: "#16201E",
    surfaceAlt: "#1F2B29",
    border: "#2A3835",
    text: "#EEF5F3",
    textMuted: "#9DB0AB",
    onPrimary: "#FFFFFF",
    slotFree: "#173B36",
    slotTaken: "#2C3533",
  },
};

export type AppTheme = typeof lightTheme;

// Spacing scale – instead of "magic numbers" in styles
export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
} as const;
export const radius = { sm: 8, md: 12, lg: 16, pill: 999 } as const;

// Every font weight is a separate family (fontWeight does not work with custom fonts on Android)
export const fonts = {
  regular: "Inter_400Regular",
  medium: "Inter_500Medium",
  semibold: "Inter_600SemiBold",
  bold: "Inter_700Bold",
  black: "Inter_900Black",
} as const;

// Theme follows the system setting (light / dark)
export function useAppTheme(): AppTheme {
  const scheme = useColorScheme();
  return scheme === "dark" ? darkTheme : lightTheme;
}
