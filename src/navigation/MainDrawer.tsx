// src/navigation/MainDrawer.tsx – side menu with custom content
import { StyleSheet, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
  DrawerContentScrollView,
  DrawerItem,
  DrawerItemList,
  createDrawerNavigator,
  type DrawerContentComponentProps,
} from "@react-navigation/drawer";
import { useAuth } from "@/auth/AuthContext";
import { AppText } from "@/components/AppText";
import { spacing, useAppTheme } from "@/theme/theme";
import { HomeTabs } from "./HomeTabs";
import type { DrawerParamList } from "./types";
import { ClinicsScreen } from "@/screens/drawer/ClinicsScreen";
import { SettingsScreen } from "@/screens/drawer/SettingsScreen";
import { AboutScreen } from "@/screens/drawer/AboutScreen";

const Drawer = createDrawerNavigator<DrawerParamList>();

function DrawerContent(props: DrawerContentComponentProps) {
  const theme = useAppTheme();
  const { user, signOut } = useAuth();
  return (
    <DrawerContentScrollView {...props}>
      <View style={styles.header}>
        <View style={[styles.avatar, { backgroundColor: theme.colors.primary }]}>
          <AppText variant="title" color={theme.colors.onPrimary}>
            {user?.name.charAt(0).toUpperCase() ?? "?"}
          </AppText>
        </View>
        <AppText variant="subtitle">{user?.name}</AppText>
        <AppText variant="caption" muted>
          {user?.isGuest ? "Guest" : user?.email}
        </AppText>
      </View>
      {/* Standard items generated from the navigator's screens */}
      <DrawerItemList {...props} />
      <DrawerItem
        label="Sign out"
        icon={({ size }) => (
          <Ionicons name="log-out-outline" size={size} color={theme.colors.danger} />
        )}
        labelStyle={{ color: theme.colors.danger }}
        onPress={signOut}
      />
    </DrawerContentScrollView>
  );
}

export function MainDrawer() {
  const theme = useAppTheme();
  return (
    <Drawer.Navigator
      drawerContent={(props) => <DrawerContent {...props} />}
      screenOptions={{
        drawerType: "front", // "slide" also moves the screen, "permanent" – fixed menu (tablet)
        drawerActiveTintColor: theme.colors.primary,
        drawerActiveBackgroundColor: theme.dark ? "#123430" : "#E2F5F2",
        swipeEdgeWidth: 40, // area at the edge from which the menu can be swiped open
        headerTintColor: theme.colors.primary,
      }}
    >
      <Drawer.Screen
        name="HomeTabs"
        component={HomeTabs}
        options={{
          title: "Home",
          headerShown: false, // headers come from the tabs and their stacks
          drawerIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="Clinics"
        component={ClinicsScreen}
        options={{
          title: "Our clinics",
          drawerIcon: ({ color, size }) => (
            <Ionicons name="business-outline" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          title: "Settings",
          drawerIcon: ({ color, size }) => (
            <Ionicons name="settings-outline" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="About"
        component={AboutScreen}
        options={{
          title: "About",
          drawerIcon: ({ color, size }) => (
            <Ionicons name="information-circle-outline" size={size} color={color} />
          ),
        }}
      />
    </Drawer.Navigator>
  );
}

const styles = StyleSheet.create({
  header: { padding: spacing.lg, gap: 4 },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.sm,
  },
});
