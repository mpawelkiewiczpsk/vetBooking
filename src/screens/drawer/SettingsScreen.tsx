// src/screens/drawer/SettingsScreen.tsx – settings (working options come in L04)
import { useState } from "react";
import { ScrollView, StyleSheet, Switch, View } from "react-native";
import { AppText } from "@/components/AppText";
import { radius, spacing, useAppTheme } from "@/theme/theme";

export function SettingsScreen() {
  const theme = useAppTheme();
  const [reminders, setReminders] = useState(true);
  const [tips, setTips] = useState(false);

  return (
    <ScrollView contentContainerStyle={styles.content}>
      <View style={[styles.card, { backgroundColor: theme.colors.surface }]}>
        <Row label="Visit reminders" value={reminders} onChange={setReminders} />
        <Row label="Pet care tips by email" value={tips} onChange={setTips} />
      </View>
      <AppText variant="caption" muted>
        Theme, favorites and persisted settings come in L04.
      </AppText>
    </ScrollView>
  );
}

function Row({
  label,
  value,
  onChange,
}: {
  label: string;
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <View style={styles.row}>
      <AppText style={styles.flex}>{label}</AppText>
      <Switch value={value} onValueChange={onChange} />
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  content: { padding: spacing.lg, gap: spacing.md },
  card: { borderRadius: radius.md, paddingHorizontal: spacing.lg },
  row: { flexDirection: "row", alignItems: "center", minHeight: 56, gap: spacing.md },
});
