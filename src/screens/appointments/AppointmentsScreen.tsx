// src/screens/appointments/AppointmentsScreen.tsx – the list of booked visits
import { useState } from "react";
import { FlatList, Pressable, StyleSheet, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SCHEDULES, findService, findVet } from "@/data/mockData";
import { AppText } from "@/components/AppText";
import { EmptyState } from "@/components/EmptyState";
import { SegmentedControl } from "@/components/SegmentedControl";
import type { TabScreenProps } from "@/navigation/types";
import { useAppointments } from "@/state/AppointmentsContext";
import { formatDayLabel, formatPrice, formatTime } from "@/utils/format";
import { radius, spacing, useAppTheme } from "@/theme/theme";

type Filter = "upcoming" | "past";

export function AppointmentsScreen({ navigation }: TabScreenProps<"AppointmentsTab">) {
  const theme = useAppTheme();
  const { appointments } = useAppointments();
  const [filter, setFilter] = useState<Filter>("upcoming");

  // Read the time once (lazy initializer) – rendering must be "pure"
  const [now] = useState(() => Date.now());
  const visible = appointments.filter((a) => {
    const isPast = new Date(a.slot).getTime() < now;
    return filter === "past" ? isPast : !isPast;
  });

  return (
    <View style={styles.flex}>
      <View style={styles.segmented}>
        <SegmentedControl<Filter>
          options={[
            { value: "upcoming", label: "Upcoming" },
            { value: "past", label: "Past" },
          ]}
          value={filter}
          onChange={setFilter}
        />
      </View>
      <FlatList
        data={visible}
        keyExtractor={(a) => a.id}
        contentContainerStyle={styles.content}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListEmptyComponent={<EmptyState icon="paw-outline" title="No visits" />}
        renderItem={({ item }) => {
          const schedule = SCHEDULES.find((s) => s.id === item.scheduleId);
          const vet = schedule && findVet(schedule.vetId);
          const service = findService(item.serviceId);
          return (
            <Pressable
              onPress={() => navigation.navigate("AppointmentDetails", { appointmentId: item.id })}
              style={[styles.card, { backgroundColor: theme.colors.surface }]}
            >
              <Ionicons name="paw" size={28} color={theme.colors.primary} />
              <View style={styles.flex}>
                <AppText variant="subtitle">{service?.name}</AppText>
                <AppText variant="caption" muted>
                  {formatDayLabel(item.slot)}, {formatTime(item.slot)} · {vet?.name}
                </AppText>
              </View>
              <AppText variant="subtitle">{formatPrice(item.total)}</AppText>
            </Pressable>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  segmented: { paddingVertical: spacing.md },
  content: { paddingHorizontal: spacing.lg, paddingBottom: spacing.xxl },
  separator: { height: spacing.sm },
  card: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    padding: spacing.lg,
    borderRadius: radius.md,
  },
});
