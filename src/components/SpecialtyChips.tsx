// src/components/SpecialtyChips.tsx – horizontal bar of specialty filters
import { Pressable, ScrollView, StyleSheet } from "react-native";
import type { Specialty } from "@/data/types";
import { radius, spacing, useAppTheme } from "@/theme/theme";
import { AppText } from "./AppText";

type Props = {
  specialties: Specialty[];
  selected: Specialty[];
  onToggle: (specialty: Specialty) => void;
};

export function SpecialtyChips({ specialties, selected, onToggle }: Props) {
  const theme = useAppTheme();
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.row}
      keyboardShouldPersistTaps="handled"
    >
      {specialties.map((specialty) => {
        const active = selected.includes(specialty);
        return (
          <Pressable
            key={specialty}
            onPress={() => onToggle(specialty)}
            hitSlop={6} // touch area bigger than the visible element
            style={[
              styles.chip,
              {
                backgroundColor: active ? theme.colors.primary : theme.colors.surface,
                borderColor: active ? theme.colors.primary : theme.colors.border,
              },
            ]}
            accessibilityRole="checkbox"
            accessibilityState={{ checked: active }}
          >
            <AppText variant="caption" color={active ? theme.colors.onPrimary : theme.colors.text}>
              {specialty}
            </AppText>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: { paddingHorizontal: spacing.lg, gap: spacing.sm },
  chip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.pill,
    borderWidth: 1,
  },
});
