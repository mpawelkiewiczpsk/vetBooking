// src/screens/drawer/AboutScreen.tsx – info + outgoing links (Linking)
import { Alert, Linking, Pressable, ScrollView, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as ExpoLinking from "expo-linking";
import { AppText } from "@/components/AppText";
import { radius, spacing, useAppTheme } from "@/theme/theme";

type IconName = keyof typeof Ionicons.glyphMap;

export function AboutScreen() {
  const theme = useAppTheme();

  // Linking.openURL – open another app (browser, phone, email)
  const open = async (url: string) => {
    const supported = await Linking.canOpenURL(url);
    if (supported) await Linking.openURL(url);
    else Alert.alert("Cannot open", url);
  };

  const links: { icon: IconName; label: string; url: string }[] = [
    { icon: "globe-outline", label: "Website", url: "https://example.com" },
    { icon: "call-outline", label: "Call reception", url: "tel:+15551234567" },
    { icon: "mail-outline", label: "Email us", url: "mailto:hello@example.com" },
  ];

  return (
    <ScrollView contentContainerStyle={styles.content}>
      <AppText variant="title">PawCare Clinic</AppText>
      <AppText muted>A sample app for the “Mobile Applications” lecture.</AppText>
      {links.map((l) => (
        <Pressable
          key={l.url}
          onPress={() => open(l.url)}
          style={[styles.item, { backgroundColor: theme.colors.surface }]}
        >
          <Ionicons name={l.icon} size={22} color={theme.colors.primary} />
          <AppText>{l.label}</AppText>
        </Pressable>
      ))}
      <AppText variant="caption" muted selectable>
        Deep link to this screen: {ExpoLinking.createURL("about")}
      </AppText>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: { padding: spacing.lg, gap: spacing.md },
  item: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    padding: spacing.lg,
    borderRadius: radius.md,
  },
});
