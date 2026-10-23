// src/components/ScheduleRow.tsx – one vet's working day in the SectionList
import { Pressable, StyleSheet, View } from "react-native";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import type { Clinic, Schedule, Vet } from "@/data/types";
import { formatTime } from "@/utils/format";
import { radius, spacing, useAppTheme } from "@/theme/theme";
import { AppText } from "./AppText";

type Props = {
  schedule: Schedule;
  vet: Vet;
  clinic: Clinic;
  onPress: (schedule: Schedule) => void;
};

export function ScheduleRow({ schedule, vet, clinic, onPress }: Props) {
  const theme = useAppTheme();
  const free = schedule.slots.length - schedule.takenSlots.length;
  const first = schedule.slots[0];
  const last = schedule.slots[schedule.slots.length - 1];

  return (
    <Pressable
      onPress={() => onPress(schedule)}
      android_ripple={{ color: theme.colors.border }}
      style={[styles.row, { backgroundColor: theme.colors.surface }]}
      accessibilityRole="button"
      accessibilityLabel={`${vet.name}, ${clinic.name}, ${free} free slots`}
    >
      <Image source={vet.photoUrl} style={styles.avatar} contentFit="cover" />
      {/* flex: 1 – the middle column takes all the remaining space */}
      <View style={styles.middle}>
        <AppText variant="subtitle" numberOfLines={1}>
          {vet.name}
        </AppText>
        <AppText variant="caption" muted numberOfLines={1}>
          {clinic.name} · {formatTime(first)}–{formatTime(last)}
        </AppText>
        <AppText variant="caption" color={free < 4 ? theme.colors.warning : theme.colors.success}>
          Free slots: {free}
        </AppText>
      </View>
      <Ionicons name="chevron-forward" size={18} color={theme.colors.textMuted} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    padding: spacing.md,
    marginHorizontal: spacing.lg,
    borderRadius: radius.md,
    overflow: "hidden",
  },
  avatar: { width: 48, height: 48, borderRadius: 24 },
  middle: { flex: 1, gap: 2 },
});
