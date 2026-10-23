// src/screens/ScheduleView.tsx – vets' working days grouped by date (SectionList)
import { useMemo } from "react";
import { SectionList, StyleSheet, View } from "react-native";
import { SCHEDULES, findClinic, findVet } from "@/data/mockData";
import type { Schedule } from "@/data/types";
import { AppText } from "@/components/AppText";
import { EmptyState } from "@/components/EmptyState";
import { ScheduleRow } from "@/components/ScheduleRow";
import { formatDayLabel } from "@/utils/format";
import { spacing, useAppTheme } from "@/theme/theme";

type Section = { title: string; data: Schedule[] };

type Props = { onSelectSchedule: (schedule: Schedule) => void };

export function ScheduleView({ onSelectSchedule }: Props) {
  const theme = useAppTheme();

  // Group schedules by day (date is already the start of the day)
  const sections = useMemo<Section[]>(() => {
    const byDay = new Map<string, Schedule[]>();
    for (const s of SCHEDULES)
      byDay.set(s.date, [...(byDay.get(s.date) ?? []), s]);
    return [...byDay.entries()]
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, data]) => ({ title: formatDayLabel(date), data }));
  }, []);

  return (
    <SectionList
      sections={sections}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => {
        const vet = findVet(item.vetId);
        const clinic = findClinic(item.clinicId);
        if (!vet || !clinic) return null;
        return (
          <ScheduleRow
            schedule={item}
            vet={vet}
            clinic={clinic}
            onPress={onSelectSchedule}
          />
        );
      }}
      renderSectionHeader={({ section }) => (
        <View
          style={[styles.header, { backgroundColor: theme.colors.background }]}
        >
          <AppText variant="title">{section.title}</AppText>
          <AppText variant="caption" muted>
            Vets on duty: {section.data.length}
          </AppText>
        </View>
      )}
      stickySectionHeadersEnabled // the day header "sticks" while scrolling
      ItemSeparatorComponent={() => <View style={styles.separator} />}
      SectionSeparatorComponent={() => <View style={styles.sectionGap} />}
      ListEmptyComponent={
        <EmptyState icon="calendar-outline" title="No schedules" />
      }
      ListFooterComponent={
        <AppText variant="caption" muted style={styles.footer}>
          Emergencies are handled 24/7 at vetBooking 24/7.
        </AppText>
      }
      contentContainerStyle={styles.content}
    />
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "baseline",
    justifyContent: "space-between",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },
  separator: { height: spacing.sm },
  sectionGap: { height: spacing.sm },
  footer: { textAlign: "center", marginTop: spacing.xl },
  content: { paddingBottom: spacing.xxl },
});
