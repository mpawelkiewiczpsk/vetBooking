// src/screens/schedule/ScheduleDayScreen.tsx – vets on duty on one day (top tab)
import { useMemo } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import { useIsFocused } from "@react-navigation/native";
import { SCHEDULES, findClinic, findVet } from "@/data/mockData";
import { AppText } from "@/components/AppText";
import { EmptyState } from "@/components/EmptyState";
import { ScheduleRow } from "@/components/ScheduleRow";
import type { ScheduleTopTabParamList, ScheduleTopTabScreenProps } from "@/navigation/types";
import { formatDayLabel, startOfDay } from "@/utils/format";
import { spacing } from "@/theme/theme";

type Props = ScheduleTopTabScreenProps<keyof ScheduleTopTabParamList>;

export function ScheduleDayScreen({ navigation, route }: Props) {
  const { dayOffset } = route.params;
  const isFocused = useIsFocused(); // is this tab currently visible

  const day = useMemo(() => {
    const d = startOfDay(new Date());
    d.setDate(d.getDate() + dayOffset);
    return d;
  }, [dayOffset]);

  const schedules = useMemo(
    () => SCHEDULES.filter((s) => new Date(s.date).getTime() === day.getTime()),
    [day],
  );

  return (
    <FlatList
      data={schedules}
      keyExtractor={(s) => s.id}
      renderItem={({ item }) => {
        const vet = findVet(item.vetId);
        const clinic = findClinic(item.clinicId);
        return vet && clinic ? (
          <ScheduleRow
            schedule={item}
            vet={vet}
            clinic={clinic}
            onPress={() => navigation.navigate("BookAppointment", { scheduleId: item.id })}
          />
        ) : null;
      }}
      ListHeaderComponent={
        <View style={styles.header}>
          <AppText variant="title">{formatDayLabel(day.toISOString())}</AppText>
          {isFocused && (
            <AppText variant="caption" muted>
              Swipe sideways to change the day
            </AppText>
          )}
        </View>
      }
      ItemSeparatorComponent={() => <View style={styles.separator} />}
      ListEmptyComponent={<EmptyState icon="calendar-outline" title="No vets on duty" />}
      contentContainerStyle={styles.content}
    />
  );
}

const styles = StyleSheet.create({
  header: { padding: spacing.lg, gap: 2 },
  separator: { height: spacing.sm },
  content: { paddingBottom: spacing.xxl },
});
