// src/screens/drawer/ClinicsScreen.tsx – the list of clinics (a side-menu screen)
import { FlatList, StyleSheet, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { CLINICS } from "@/data/mockData";
import { AppText } from "@/components/AppText";
import { radius, spacing, useAppTheme } from "@/theme/theme";

export function ClinicsScreen() {
  const theme = useAppTheme();
  return (
    <FlatList
      data={CLINICS}
      keyExtractor={(c) => c.id}
      contentContainerStyle={styles.content}
      ItemSeparatorComponent={() => <View style={styles.separator} />}
      renderItem={({ item }) => (
        <View style={[styles.card, { backgroundColor: theme.colors.surface }]}>
          <Ionicons
            name={item.isEmergency ? "medical" : "business"}
            size={32}
            color={item.isEmergency ? theme.colors.danger : theme.colors.primary}
          />
          <View style={styles.flex}>
            <AppText variant="subtitle">{item.name}</AppText>
            <AppText variant="caption" muted>
              {item.address} · {item.rooms} rooms{item.isEmergency ? " · open 24/7" : ""}
            </AppText>
          </View>
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  content: { padding: spacing.lg },
  separator: { height: spacing.sm },
  card: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    padding: spacing.lg,
    borderRadius: radius.md,
  },
});
