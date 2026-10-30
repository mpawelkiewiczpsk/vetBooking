// src/navigation/HomeTabs.tsx – bottom tabs
import { Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { DrawerToggleButton } from "@react-navigation/drawer";
import { useAppointments } from "@/state/AppointmentsContext";
import { useAppTheme } from "@/theme/theme";
import { VetsStack } from "./VetsStack";
import { ScheduleTopTabs } from "./ScheduleTopTabs";
import type { TabParamList } from "./types";
import { AppointmentsScreen } from "@/screens/appointments/AppointmentsScreen";
import { ProfileScreen } from "@/screens/profile/ProfileScreen";

const Tab = createBottomTabNavigator<TabParamList>();

type IconName = keyof typeof Ionicons.glyphMap;
const ICONS: Record<keyof TabParamList, [IconName, IconName]> = {
  VetsTab: ["medkit", "medkit-outline"],
  ScheduleTab: ["calendar", "calendar-outline"],
  AppointmentsTab: ["paw", "paw-outline"],
  ProfileTab: ["person-circle", "person-circle-outline"],
};

export function HomeTabs() {
  const theme = useAppTheme();
  const { appointments } = useAppointments();

  return (
    <Tab.Navigator
      backBehavior="history" // "back" returns to the previously visited tab
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          const [active, inactive] = ICONS[route.name];
          return <Ionicons name={focused ? active : inactive} size={size} color={color} />;
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textMuted,
        tabBarHideOnKeyboard: true, // Android: the bar hides when the keyboard appears
        animation: "shift", // animation when switching tabs
        headerLeft: () => <DrawerToggleButton tintColor={theme.colors.primary} />,
      })}
      // Listening to events of all tabs
      screenListeners={{
        tabPress: (e) => console.log("[tab]", e.target),
      }}
    >
      <Tab.Screen
        name="VetsTab"
        component={VetsStack}
        options={{
          title: "Vets",
          headerShown: false, // the header comes from the nested Stack
          popToTopOnBlur: true, // leaving the tab returns it to the vet list
        }}
      />
      <Tab.Screen name="ScheduleTab" component={ScheduleTopTabs} options={{ title: "Schedule" }} />
      <Tab.Screen
        name="AppointmentsTab"
        component={AppointmentsScreen}
        options={{
          title: "Visits",
          tabBarBadge: appointments.length > 0 ? appointments.length : undefined,
        }}
        // An event for this tab only – it can be cancelled
        listeners={{
          tabPress: (e) => {
            if (appointments.length === 0) {
              e.preventDefault();
              Alert.alert("No visits yet", "Book your first visit in the Schedule tab.");
            }
          },
        }}
      />
      <Tab.Screen name="ProfileTab" component={ProfileScreen} options={{ title: "Profile" }} />
    </Tab.Navigator>
  );
}
