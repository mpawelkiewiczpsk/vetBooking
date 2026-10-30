// src/screens/vets/FiltersScreen.tsx – a sheet (formSheet) that passes the result back
import { useState } from "react";
import { Pressable, StyleSheet, Switch, View } from "react-native";
import { SPECIALTIES } from "@/data/mockData";
import type { Specialty } from "@/data/types";
import { AppText } from "@/components/AppText";
import { SpecialtyChips } from "@/components/SpecialtyChips";
import type { VetsScreenProps } from "@/navigation/types";
import { radius, spacing, useAppTheme } from "@/theme/theme";

export function FiltersScreen({ navigation, route }: VetsScreenProps<"Filters">) {
  const theme = useAppTheme();
  const [specialties, setSpecialties] = useState<Specialty[]>(route.params?.specialties ?? []);
  const [exoticOnly, setExoticOnly] = useState(route.params?.exoticOnly ?? false);

  const toggle = (s: Specialty) =>
    setSpecialties((prev) => (prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]));

  // popTo + merge: go back to the Vets screen and merge the new params with the current ones
  const apply = () => navigation.popTo("Vets", { specialties, exoticOnly }, { merge: true });

  return (
    <View style={styles.container}>
      <AppText variant="label" muted>
        Specialties
      </AppText>
      <View style={styles.chips}>
        <SpecialtyChips specialties={SPECIALTIES} selected={specialties} onToggle={toggle} />
      </View>
      <View style={styles.row}>
        <AppText>Birds & reptiles only</AppText>
        <Switch value={exoticOnly} onValueChange={setExoticOnly} />
      </View>
      <View style={styles.actions}>
        <Pressable
          style={[styles.button, { borderColor: theme.colors.border }]}
          onPress={() => {
            setSpecialties([]);
            setExoticOnly(false);
          }}
        >
          <AppText>Clear</AppText>
        </Pressable>
        <Pressable
          style={[styles.button, { backgroundColor: theme.colors.primary }]}
          onPress={apply}
        >
          <AppText color={theme.colors.onPrimary}>Apply</AppText>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: spacing.lg, gap: spacing.lg },
  chips: { marginHorizontal: -spacing.lg },
  row: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  actions: { flexDirection: "row", gap: spacing.md },
  button: {
    flex: 1,
    height: 48,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: "transparent",
    alignItems: "center",
    justifyContent: "center",
  },
});
