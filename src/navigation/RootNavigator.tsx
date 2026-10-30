// src/navigation/RootNavigator.tsx – navigation container + root Stack with route guards
import { useRef } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { ActivityIndicator } from "react-native";
import { useAuth } from "@/auth/AuthContext";
import { useAppTheme } from "@/theme/theme";
import { linking } from "./linking";
import { navigationRef } from "./navigationRef";
import { toNavigationTheme } from "./navTheme";
import { MainDrawer } from "./MainDrawer";
import type { RootStackParamList } from "./types";
import { WelcomeScreen } from "@/screens/auth/WelcomeScreen";
import { SignInScreen } from "@/screens/auth/SignInScreen";
import { BookAppointmentScreen } from "@/screens/booking/BookAppointmentScreen";
import { AppointmentDetailsScreen } from "@/screens/appointments/AppointmentDetailsScreen";
import { VetVideoScreen } from "@/screens/vets/VetVideoScreen";
import { NotFoundScreen } from "@/screens/NotFoundScreen";

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator() {
  const theme = useAppTheme();
  const { user } = useAuth();
  const routeNameRef = useRef<string | undefined>(undefined);

  return (
    <NavigationContainer
      ref={navigationRef}
      theme={toNavigationTheme(theme)}
      linking={linking}
      fallback={<ActivityIndicator style={{ flex: 1 }} />} // while a deep link is resolved
      onReady={() => {
        routeNameRef.current = navigationRef.getCurrentRoute()?.name;
      }}
      // Screen tracking – the base of analytics (extended in L09)
      onStateChange={() => {
        const current = navigationRef.getCurrentRoute()?.name;
        if (current && current !== routeNameRef.current) {
          console.log(`[navigation] ${routeNameRef.current} -> ${current}`);
        }
        routeNameRef.current = current;
      }}
    >
      <Stack.Navigator
        screenOptions={{
          headerTintColor: theme.colors.primary,
          headerBackButtonDisplayMode: "minimal", // iOS: arrow only, no text
          contentStyle: { backgroundColor: theme.colors.background },
        }}
      >
        {user === null ? (
          // Signed out: only the sign-in screens exist (a guard via conditional rendering)
          <Stack.Group screenOptions={{ headerShown: false, animation: "fade" }}>
            <Stack.Screen name="Welcome" component={WelcomeScreen} />
            <Stack.Screen
              name="SignIn"
              component={SignInScreen}
              options={{ headerShown: true, title: "Sign in", animation: "slide_from_right" }}
            />
          </Stack.Group>
        ) : (
          <>
            <Stack.Screen name="Main" component={MainDrawer} options={{ headerShown: false }} />
            {/* Modal group: the screen slides up from the bottom */}
            <Stack.Group screenOptions={{ presentation: "modal" }}>
              <Stack.Screen
                name="BookAppointment"
                component={BookAppointmentScreen}
                options={{ title: "Book a visit", gestureEnabled: false }}
              />
            </Stack.Group>
            <Stack.Screen
              name="AppointmentDetails"
              component={AppointmentDetailsScreen}
              // A title that depends on a route parameter
              options={({ route }) => ({ title: `Visit ${route.params.appointmentId}` })}
            />
            {/* Transparent modal: the previous screen is visible underneath */}
            <Stack.Screen
              name="VetVideo"
              component={VetVideoScreen}
              options={{ presentation: "transparentModal", animation: "fade", headerShown: false }}
            />
          </>
        )}
        <Stack.Screen name="NotFound" component={NotFoundScreen} options={{ title: "Not found" }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
