// src/screens/profile/ProfileScreen.tsx – profile + examples of navigating between navigators
import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { DrawerActions } from "@react-navigation/native";
import { useAuth } from "@/auth/AuthContext";
import { AppText } from "@/components/AppText";
import type { TabScreenProps } from "@/navigation/types";
import { useAppointments } from "@/state/AppointmentsContext";
import { radius, spacing, useAppTheme } from "@/theme/theme";

type IconName = keyof typeof Ionicons.glyphMap;

export function ProfileScreen({ navigation }: TabScreenProps<"ProfileTab">) {
  const theme = useAppTheme();
  const { user, signOut } = useAuth();
  const { appointments } = useAppointments();

  const items: { icon: IconName; label: string; onPress: () => void }[] = [
    // Another tab of the same navigator
    {
      icon: "paw-outline",
      label: `My visits (${appointments.length})`,
      onPress: () => navigation.navigate("AppointmentsTab"),
    },
    // A screen of the parent navigator (Drawer) – navigate goes up the tree
    { icon: "settings-outline", label: "Settings", onPress: () => navigation.navigate("Settings") },
    // An action of the parent navigator sent with dispatch
    {
      icon: "menu-outline",
      label: "Open menu",
      onPress: () => navigation.dispatch(DrawerActions.openDrawer()),
    },
    // A nested screen in another tab
    {
      icon: "calendar-outline",
      label: "Tomorrow's schedule",
      onPress: () =>
        navigation.navigate("ScheduleTab", { screen: "Tomorrow", params: { dayOffset: 1 } }),
    },
  ];

  return (
    <ScrollView contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <View style={[styles.avatar, { backgroundColor: theme.colors.primary }]}>
          <AppText variant="hero" color={theme.colors.onPrimary}>
            {user?.name.charAt(0).toUpperCase()}
          </AppText>
        </View>
        <AppText variant="title">{user?.name}</AppText>
        <AppText muted>{user?.isGuest ? "Guest account" : user?.email}</AppText>
      </View>
      {items.map((item) => (
        <Pressable
          key={item.label}
          onPress={item.onPress}
          style={[styles.item, { backgroundColor: theme.colors.surface }]}
        >
          <Ionicons name={item.icon} size={22} color={theme.colors.primary} />
          <AppText style={styles.flex}>{item.label}</AppText>
          <Ionicons name="chevron-forward" size={18} color={theme.colors.textMuted} />
        </Pressable>
      ))}
      {/* Signing out changes the state -> RootNavigator removes the app screens */}
      <Pressable onPress={signOut} style={[styles.item, { backgroundColor: theme.colors.surface }]}>
        <Ionicons name="log-out-outline" size={22} color={theme.colors.danger} />
        <AppText color={theme.colors.danger}>Sign out</AppText>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  content: { padding: spacing.lg, gap: spacing.sm },
  header: { alignItems: "center", gap: 4, marginBottom: spacing.lg },
  avatar: {
    width: 88,
    height: 88,
    borderRadius: 44,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.sm,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    padding: spacing.lg,
    borderRadius: radius.md,
  },
});
