// src/screens/booking/BookAppointmentScreen.tsx – booking (modal) that guards against leaving
import { useState } from "react";
import { Alert, Pressable, ScrollView, StyleSheet, View } from "react-native";
import { usePreventRemove } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { SCHEDULES, SERVICES, findClinic, findService, findVet } from "@/data/mockData";
import { AppText } from "@/components/AppText";
import { EmptyState } from "@/components/EmptyState";
import { SlotGrid } from "@/components/SlotGrid";
import type { RootStackScreenProps } from "@/navigation/types";
import { useAppointments } from "@/state/AppointmentsContext";
import { formatDayLabel, formatPrice, formatTime } from "@/utils/format";
import { radius, spacing, useAppTheme } from "@/theme/theme";

export function BookAppointmentScreen({
  navigation,
  route,
}: RootStackScreenProps<"BookAppointment">) {
  const theme = useAppTheme();
  const insets = useSafeAreaInsets();
  const { addAppointment } = useAppointments();
  const [serviceId, setServiceId] = useState(SERVICES[0].id);
  const [slot, setSlot] = useState<string | null>(null);

  // Prevent the screen from being closed by accident with an unsaved choice
  usePreventRemove(slot !== null, ({ data }) => {
    // Our own "replace" after booking is let through without asking (state would not update in time)
    if (data.action.type === "REPLACE") {
      navigation.dispatch(data.action);
      return;
    }
    Alert.alert("Discard booking?", "The selected time will not be reserved.", [
      { text: "Stay", style: "cancel" },
      // Perform the navigation action that we blocked earlier
      { text: "Discard", style: "destructive", onPress: () => navigation.dispatch(data.action) },
    ]);
  });

  const schedule = SCHEDULES.find((s) => s.id === route.params.scheduleId);
  const vet = schedule && findVet(schedule.vetId);
  const clinic = schedule && findClinic(schedule.clinicId);
  const service = findService(serviceId);
  if (!schedule || !vet || !clinic || !service) {
    return (
      <EmptyState title="Schedule not found" message="Check the link or choose another day." />
    );
  }

  const confirm = () => {
    if (!slot) return;
    const appointment = addAppointment({
      scheduleId: schedule.id,
      slot,
      serviceId: service.id,
      total: service.price,
    });
    // replace: the booking modal is replaced by the visit – "back" does not return to booking
    navigation.replace("AppointmentDetails", { appointmentId: appointment.id });
  };

  return (
    <View style={styles.flex}>
      <ScrollView contentContainerStyle={styles.content}>
        <AppText variant="title">{vet.name}</AppText>
        <AppText muted>
          {formatDayLabel(schedule.date)} · {clinic.name}
        </AppText>
        <View style={styles.services}>
          {SERVICES.map((s) => {
            const active = s.id === serviceId;
            return (
              <Pressable
                key={s.id}
                onPress={() => setServiceId(s.id)}
                style={[
                  styles.service,
                  {
                    backgroundColor: active ? theme.colors.primary : theme.colors.surface,
                    borderColor: active ? theme.colors.primary : theme.colors.border,
                  },
                ]}
                accessibilityRole="radio"
                accessibilityLabel={`${s.name}, ${formatPrice(s.price)}`}
                accessibilityState={{ selected: active }}
              >
                <AppText
                  variant="caption"
                  color={active ? theme.colors.onPrimary : theme.colors.text}
                >
                  {s.name} · {formatPrice(s.price)}
                </AppText>
              </Pressable>
            );
          })}
        </View>
        <SlotGrid
          slots={schedule.slots}
          taken={schedule.takenSlots}
          selected={slot}
          onSelect={setSlot}
        />
      </ScrollView>
      <View
        style={[
          styles.summary,
          {
            backgroundColor: theme.colors.surface,
            borderTopColor: theme.colors.border,
            paddingBottom: insets.bottom + spacing.md,
          },
        ]}
      >
        <View style={styles.flex}>
          <AppText variant="caption" muted>
            {slot ? `${service.name} at ${formatTime(slot)}` : "Choose a time"}
          </AppText>
          <AppText variant="subtitle">{formatPrice(service.price)}</AppText>
        </View>
        <Pressable
          disabled={slot === null}
          onPress={confirm}
          style={[
            styles.button,
            { backgroundColor: theme.colors.primary },
            slot === null && styles.dim,
          ]}
        >
          <AppText variant="subtitle" color={theme.colors.onPrimary}>
            Book
          </AppText>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  content: { padding: spacing.lg, gap: spacing.md },
  services: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm },
  service: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.pill,
    borderWidth: 1,
  },
  summary: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  button: { paddingHorizontal: spacing.xl, paddingVertical: spacing.md, borderRadius: radius.md },
  dim: { opacity: 0.5 },
});
