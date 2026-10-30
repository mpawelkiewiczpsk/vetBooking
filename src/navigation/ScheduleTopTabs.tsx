// src/navigation/ScheduleTopTabs.tsx – top tabs (swipeable) with days
import { ActivityIndicator } from "react-native";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { fonts, useAppTheme } from "@/theme/theme";
import type { ScheduleTopTabParamList } from "./types";
import { ScheduleDayScreen } from "@/screens/schedule/ScheduleDayScreen";

const TopTab = createMaterialTopTabNavigator<ScheduleTopTabParamList>();

export function ScheduleTopTabs() {
  const theme = useAppTheme();
  return (
    <TopTab.Navigator
      screenOptions={{
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textMuted,
        tabBarIndicatorStyle: { backgroundColor: theme.colors.primary, height: 3 },
        tabBarLabelStyle: { fontFamily: fonts.semibold, textTransform: "none" },
        swipeEnabled: true, // switch tabs with a swipe
        lazy: true, // a screen is created only when first visited
        lazyPlaceholder: () => <ActivityIndicator style={{ marginTop: 32 }} />,
      }}
    >
      <TopTab.Screen
        name="Today"
        component={ScheduleDayScreen}
        initialParams={{ dayOffset: 0 }} // the initial parameter of the screen
        options={{ title: "Today" }}
      />
      <TopTab.Screen
        name="Tomorrow"
        component={ScheduleDayScreen}
        initialParams={{ dayOffset: 1 }}
        options={{ title: "Tomorrow" }}
      />
      <TopTab.Screen
        name="DayAfter"
        component={ScheduleDayScreen}
        initialParams={{ dayOffset: 2 }}
        options={{ title: "Day after" }}
      />
    </TopTab.Navigator>
  );
}
