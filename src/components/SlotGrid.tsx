// src/components/SlotGrid.tsx – time slots of one day, split into morning and afternoon
import { Pressable, StyleSheet, View } from "react-native";
import { formatTime } from "@/utils/format";
import { radius, spacing, useAppTheme } from "@/theme/theme";
import { AppText } from "./AppText";

type Props = {
  slots: string[];
  taken: string[];
  selected: string | null;
  onSelect: (slot: string) => void;
};

export function SlotGrid({ slots, taken, selected, onSelect }: Props) {
  const theme = useAppTheme();
  const morning = slots.filter((s) => new Date(s).getHours() < 12);
  const afternoon = slots.filter((s) => new Date(s).getHours() >= 12);

  const renderSlot = (slot: string) => {
    const isTaken = taken.includes(slot);
    const isSelected = slot === selected;
    return (
      <Pressable
        key={slot}
        disabled={isTaken}
        onPress={() => onSelect(slot)}
        style={[
          styles.slot,
          {
            backgroundColor: isSelected
              ? theme.colors.primary
              : isTaken
                ? theme.colors.slotTaken
                : theme.colors.slotFree,
          },
        ]}
        accessibilityRole="radio"
        accessibilityLabel={formatTime(slot)}
        accessibilityState={{ selected: isSelected, disabled: isTaken }}
      >
        <AppText
          variant="caption"
          color={isSelected ? theme.colors.onPrimary : theme.colors.text}
          style={isTaken && styles.takenText}
        >
          {formatTime(slot)}
        </AppText>
      </Pressable>
    );
  };

  return (
    <View style={styles.container}>
      {morning.length > 0 && (
        <>
          <AppText variant="label" muted>
            Morning
          </AppText>
          {/* flexWrap: "wrap" – slots flow to the next line like words in a sentence */}
          <View style={styles.grid}>{morning.map(renderSlot)}</View>
        </>
      )}
      {afternoon.length > 0 && (
        <>
          <AppText variant="label" muted>
            Afternoon
          </AppText>
          <View style={styles.grid}>{afternoon.map(renderSlot)}</View>
        </>
      )}
      <View style={styles.legend}>
        <Legend color={theme.colors.slotFree} label="Free" />
        <Legend color={theme.colors.primary} label="Selected" />
        <Legend color={theme.colors.slotTaken} label="Booked" />
      </View>
    </View>
  );
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <View style={styles.legendItem}>
      <View style={[styles.legendDot, { backgroundColor: color }]} />
      <AppText variant="caption" muted>
        {label}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: spacing.sm },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm },
  slot: {
    width: 84,
    paddingVertical: spacing.sm,
    alignItems: "center",
    borderRadius: radius.sm,
  },
  takenText: { textDecorationLine: "line-through", opacity: 0.6 },
  legend: { flexDirection: "row", gap: spacing.lg, marginTop: spacing.md },
  legendItem: { flexDirection: "row", alignItems: "center", gap: 6 },
  legendDot: { width: 12, height: 12, borderRadius: 3 },
});
