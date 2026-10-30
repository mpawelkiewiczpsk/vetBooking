// src/navigation/VetsStack.tsx – Stack nested inside the "Vets" tab
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { DrawerToggleButton } from "@react-navigation/drawer";
import { useAppTheme } from "@/theme/theme";
import type { VetsStackParamList } from "./types";
import { VetsScreen } from "@/screens/vets/VetsScreen";
import { VetDetailsScreen } from "@/screens/vets/VetDetailsScreen";
import { FiltersScreen } from "@/screens/vets/FiltersScreen";
import { VetHeaderActions } from "@/components/VetHeaderActions";

const Stack = createNativeStackNavigator<VetsStackParamList>();

export function VetsStack() {
  const theme = useAppTheme();
  return (
    <Stack.Navigator
      screenOptions={{
        headerTintColor: theme.colors.primary,
        headerBackButtonDisplayMode: "minimal",
        headerTitleAlign: "center", // Android: centered title (iOS – always)
      }}
    >
      <Stack.Screen
        name="Vets"
        component={VetsScreen}
        options={{
          title: "Our vets",
          headerLargeTitle: true, // iOS: large title that collapses while scrolling
          headerLeft: () => <DrawerToggleButton tintColor={theme.colors.primary} />,
        }}
      />
      <Stack.Screen
        name="VetDetails"
        component={VetDetailsScreen}
        // A unique id: another vet is a new screen, not an update of the parameters
        getId={({ params }) => params.vetId}
        // options as a function – access to the route (screen parameters)
        options={({ route }) => ({
          title: "",
          headerTransparent: true, // the content goes under the header
          headerBlurEffect: "systemChromeMaterial", // iOS: blurred header background
          headerTintColor: "#FFFFFF",
          headerRight: () => <VetHeaderActions vetId={route.params.vetId} />,
        })}
      />
      <Stack.Screen
        name="Filters"
        component={FiltersScreen}
        options={{
          title: "Filters",
          presentation: "formSheet", // a sheet from the bottom
          sheetAllowedDetents: [0.5, 1], // half or full screen
          sheetGrabberVisible: true, // drag handle
          sheetCornerRadius: 24,
        }}
      />
    </Stack.Navigator>
  );
}
