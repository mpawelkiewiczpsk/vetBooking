// src/screens/BookingView.tsx – pick a service and a time slot + sticky summary bar
import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { SERVICES, findClinic, findService, findVet } from "@/data/mockData";
import type { Schedule } from "@/data/types";
import { AppText } from "@/components/AppText";
import { EmptyState } from "@/components/EmptyState";
import { SlotGrid } from "@/components/SlotGrid";
import { formatDayLabel, formatPrice, formatTime } from "@/utils/format";
import { radius, spacing, useAppTheme } from "@/theme/theme";

type Props = { schedule: Schedule | null };

export function BookingView({ schedule }: Props) {
  const theme = useAppTheme();
  const insets = useSafeAreaInsets();
  const [serviceId, setServiceId] = useState(SERVICES[0].id);
  const [slot, setSlot] = useState<string | null>(null);

  if (!schedule) {
    return (
      <EmptyState
        icon="calendar-outline"
        title="Choose a vet"
        message="Go to the “Schedule” tab and tap a vet's working day."
      />
    );
  }

  const vet = findVet(schedule.vetId);
  const clinic = findClinic(schedule.clinicId);
  const service = findService(serviceId);
  if (!vet || !clinic || !service) return null;

  return (
    <View style={styles.flex}>
      <ScrollView contentContainerStyle={styles.content}>
        <AppText variant="title">{vet.name}</AppText>
        <AppText muted>
          {formatDayLabel(schedule.date)} · {clinic.name}, {clinic.address}
        </AppText>

        <AppText variant="label" muted style={styles.section}>
          Service
        </AppText>
        {/* A horizontal ScrollView – all services fit even on a small phone */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.services}
        >
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
                accessibilityLabel={`${s.name}, ${s.durationMin} minutes, ${formatPrice(s.price)}`}
                accessibilityState={{ selected: active }}
              >
                <AppText
                  variant="subtitle"
                  color={active ? theme.colors.onPrimary : theme.colors.text}
                >
                  {s.name}
                </AppText>
                <AppText
                  variant="caption"
                  color={active ? theme.colors.onPrimary : theme.colors.textMuted}
                >
                  {s.durationMin} min · {formatPrice(s.price)}
                </AppText>
              </Pressable>
            );
          })}
        </ScrollView>

        <AppText variant="label" muted style={styles.section}>
          Time
        </AppText>
        <SlotGrid
          slots={schedule.slots}
          taken={schedule.takenSlots}
          selected={slot}
          onSelect={setSlot}
        />
      </ScrollView>

      {/* A bar stuck to the bottom, with space above the system gesture bar */}
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
            {slot ? `${service.name} at ${formatTime(slot)}` : "No time selected"}
          </AppText>
          <AppText variant="subtitle">{formatPrice(service.price)}</AppText>
        </View>
        <Pressable
          disabled={slot === null}
          onPress={() => setSlot(null)}
          style={({ pressed }) => [
            styles.button,
            { backgroundColor: theme.colors.primary },
            (pressed || slot === null) && styles.buttonDim,
          ]}
          accessibilityRole="button"
        >
          <AppText variant="subtitle" color={theme.colors.onPrimary}>
            Clear
          </AppText>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  content: { padding: spacing.lg, gap: spacing.sm },
  section: { marginTop: spacing.md },
  services: { gap: spacing.sm },
  service: {
    padding: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1,
    minWidth: 140,
    gap: 2,
  },
  summary: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  button: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: radius.md,
  },
  buttonDim: { opacity: 0.5 },
});
