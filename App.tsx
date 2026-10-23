// App.tsx – stage L02: one screen, views switched with state (navigation comes in L03)
import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import * as SplashScreen from "expo-splash-screen";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  Inter_900Black,
  useFonts,
} from "@expo-google-fonts/inter";
import type { Schedule, Vet } from "@/data/types";
import { AppText } from "@/components/AppText";
import { SegmentedControl } from "@/components/SegmentedControl";
import { VetDetailsModal } from "@/components/VetDetailsModal";
import { BookingView } from "@/screens/BookingView";
import { ScheduleView } from "@/screens/ScheduleView";
import { VetsView } from "@/screens/VetsView";
import { spacing, useAppTheme } from "@/theme/theme";

// The splash screen stays until the fonts are loaded
SplashScreen.preventAutoHideAsync();

type Tab = "vets" | "schedule" | "booking";

export default function App() {
  const [fontsLoaded, fontError] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    Inter_900Black,
  });

  useEffect(() => {
    if (fontsLoaded || fontError) SplashScreen.hideAsync();
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) return null;

  return (
    <SafeAreaProvider>
      <Main />
    </SafeAreaProvider>
  );
}

function Main() {
  const theme = useAppTheme();
  const [tab, setTab] = useState<Tab>("vets");
  const [vet, setVet] = useState<Vet | null>(null);
  const [schedule, setSchedule] = useState<Schedule | null>(null);

  const openSchedule = (s: Schedule) => {
    setSchedule(s);
    setTab("booking");
  };

  return (
    // The bottom edge is handled by the summary bar in BookingView – here only top and sides
    <SafeAreaView
      style={[styles.flex, { backgroundColor: theme.colors.background }]}
      edges={["top", "left", "right"]}
    >
      {/* "auto": dark icons in the light theme, light icons in the dark one */}
      <StatusBar style="auto" />
      <View style={styles.header}>
        <AppText variant="label" color={theme.colors.primary}>
          vetBooking Clinic
        </AppText>
        <AppText variant="hero">Who needs a check-up?</AppText>
      </View>
      <SegmentedControl<Tab>
        options={[
          { value: "vets", label: "Our vets" },
          { value: "schedule", label: "Schedule" },
          { value: "booking", label: "Book" },
        ]}
        value={tab}
        onChange={setTab}
      />
      <View style={styles.flex}>
        {tab === "vets" && <VetsView onOpenVet={setVet} />}
        {tab === "schedule" && <ScheduleView onSelectSchedule={openSchedule} />}
        {/* key: a new schedule = a fresh component (selected slot is reset) */}
        {tab === "booking" && (
          <BookingView key={schedule?.id} schedule={schedule} />
        )}
      </View>
      <VetDetailsModal vet={vet} onClose={() => setVet(null)} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  header: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    gap: 2,
  },
});
