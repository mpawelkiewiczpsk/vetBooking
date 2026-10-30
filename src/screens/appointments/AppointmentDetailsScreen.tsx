// src/screens/appointments/AppointmentDetailsScreen.tsx – visit details + nested navigation
import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import { CommonActions } from "@react-navigation/native";
import { SCHEDULES, findClinic, findService, findVet } from "@/data/mockData";
import { AppText } from "@/components/AppText";
import { EmptyState } from "@/components/EmptyState";
import type { RootStackScreenProps } from "@/navigation/types";
import { useAppointments } from "@/state/AppointmentsContext";
import { formatDayLabel, formatPrice, formatTime } from "@/utils/format";
import { radius, spacing, useAppTheme } from "@/theme/theme";

export function AppointmentDetailsScreen({
  navigation,
  route,
}: RootStackScreenProps<"AppointmentDetails">) {
  const theme = useAppTheme();
  const { appointments } = useAppointments();
  const appointment = appointments.find((a) => a.id === route.params.appointmentId);
  const schedule = appointment && SCHEDULES.find((s) => s.id === appointment.scheduleId);
  const vet = schedule && findVet(schedule.vetId);
  const clinic = schedule && findClinic(schedule.clinicId);
  const service = appointment && findService(appointment.serviceId);

  if (!appointment || !vet || !clinic || !service) {
    return <EmptyState icon="paw-outline" title="Visit not found" />;
  }

  // A full path to a screen in a deeply nested navigator
  const openVet = () =>
    navigation.navigate("Main", {
      screen: "HomeTabs",
      params: { screen: "VetsTab", params: { screen: "VetDetails", params: { vetId: vet.id } } },
    });

  // reset: a new history – the visit list as the only screen underneath
  const goToVisits = () =>
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [
          { name: "Main", params: { screen: "HomeTabs", params: { screen: "AppointmentsTab" } } },
        ],
      }),
    );

  return (
    <ScrollView contentContainerStyle={styles.content}>
      <View style={[styles.card, { backgroundColor: theme.colors.surface }]}>
        <AppText variant="label" color={theme.colors.primary}>
          Visit {appointment.id}
        </AppText>
        <AppText variant="hero">{service.name}</AppText>
        <Row
          label="When"
          value={`${formatDayLabel(appointment.slot)}, ${formatTime(appointment.slot)}`}
        />
        <Row label="Vet" value={vet.name} />
        <Row label="Clinic" value={`${clinic.name}, ${clinic.address}`} />
        <Row label="Price" value={formatPrice(appointment.total)} />
        <AppText variant="caption" muted>
          A check-in QR code is added in L07.
        </AppText>
      </View>
      <Pressable style={[styles.button, { borderColor: theme.colors.primary }]} onPress={openVet}>
        <AppText color={theme.colors.primary}>Vet profile</AppText>
      </Pressable>
      <Pressable
        style={[styles.button, { backgroundColor: theme.colors.primary }]}
        onPress={goToVisits}
      >
        <AppText color={theme.colors.onPrimary}>My visits</AppText>
      </Pressable>
    </ScrollView>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.row}>
      <AppText muted>{label}</AppText>
      <AppText variant="subtitle" style={styles.value}>
        {value}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  content: { padding: spacing.lg, gap: spacing.md },
  card: { padding: spacing.xl, borderRadius: radius.lg, gap: spacing.md },
  row: { flexDirection: "row", justifyContent: "space-between", gap: spacing.md },
  value: { flexShrink: 1, textAlign: "right" },
  button: {
    height: 50,
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderColor: "transparent",
    alignItems: "center",
    justifyContent: "center",
  },
});
