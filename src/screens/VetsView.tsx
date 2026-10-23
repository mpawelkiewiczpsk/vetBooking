// src/screens/VetsView.tsx – our vets: carousel + filters + responsive grid
import { useCallback, useMemo, useState } from "react";
import {
  Alert,
  FlatList,
  StyleSheet,
  Switch,
  TextInput,
  View,
  useWindowDimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SPECIALTIES, VETS } from "@/data/mockData";
import type { Specialty, Vet } from "@/data/types";
import { AppText } from "@/components/AppText";
import { EmptyState } from "@/components/EmptyState";
import { FeaturedCarousel } from "@/components/FeaturedCarousel";
import { SpecialtyChips } from "@/components/SpecialtyChips";
import { VetCard } from "@/components/VetCard";
import { fonts, radius, spacing, useAppTheme } from "@/theme/theme";

type Props = { onOpenVet: (vet: Vet) => void };

export function VetsView({ onOpenVet }: Props) {
  const theme = useAppTheme();
  const { width } = useWindowDimensions();
  const [query, setQuery] = useState("");
  const [specialties, setSpecialties] = useState<Specialty[]>([]);
  const [exoticOnly, setExoticOnly] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // The number of columns depends on the window width (phone / rotation / tablet)
  const numColumns = width >= 900 ? 4 : width >= 600 ? 3 : 2;

  // Filtering is recalculated only when its inputs change
  const filtered = useMemo(
    () =>
      VETS.filter((v) => v.name.toLowerCase().includes(query.trim().toLowerCase()))
        .filter((v) => specialties.length === 0 || specialties.includes(v.specialty))
        .filter((v) => !exoticOnly || v.species.some((s) => s === "bird" || s === "reptile")),
    [query, specialties, exoticOnly],
  );

  const toggleSpecialty = (specialty: Specialty) =>
    setSpecialties((prev) =>
      prev.includes(specialty) ? prev.filter((s) => s !== specialty) : [...prev, specialty],
    );

  // Simulated "pull to refresh" (from L06 – real fetch from the API)
  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1200);
  };

  // useCallback: a stable function reference – memo in VetCard makes sense
  const onLongPress = useCallback(
    (vet: Vet) => {
      Alert.alert(vet.name, "What would you like to do?", [
        { text: "Show profile", onPress: () => onOpenVet(vet) },
        { text: "Cancel", style: "cancel" },
      ]);
    },
    [onOpenVet],
  );

  const header = (
    <View style={styles.header}>
      <FeaturedCarousel vets={VETS.filter((v) => v.isNew)} onPress={onOpenVet} />

      <View style={[styles.search, { backgroundColor: theme.colors.surface }]}>
        <Ionicons name="search" size={18} color={theme.colors.textMuted} />
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Search vets..."
          placeholderTextColor={theme.colors.textMuted}
          style={[styles.searchInput, { color: theme.colors.text }]}
          returnKeyType="search"
          clearButtonMode="while-editing" // iOS: clear button
          autoCorrect={false}
        />
      </View>

      <SpecialtyChips specialties={SPECIALTIES} selected={specialties} onToggle={toggleSpecialty} />

      <View style={styles.switchRow}>
        <AppText>Birds & reptiles only</AppText>
        <Switch
          value={exoticOnly}
          onValueChange={setExoticOnly}
          trackColor={{ true: theme.colors.primary, false: theme.colors.border }}
          thumbColor="#FFFFFF"
        />
      </View>
      <AppText variant="label" muted style={styles.count}>
        Vets: {filtered.length}
      </AppText>
    </View>
  );

  return (
    <FlatList
      // Changing numColumns "on the fly" requires a new key – otherwise an error
      key={numColumns}
      data={filtered}
      keyExtractor={(item) => item.id}
      numColumns={numColumns}
      renderItem={({ item }) => (
        <View style={[styles.cell, { maxWidth: `${100 / numColumns}%` }]}>
          <VetCard vet={item} onPress={onOpenVet} onLongPress={onLongPress} />
        </View>
      )}
      ListHeaderComponent={header}
      ListEmptyComponent={
        <EmptyState title="No vets found" message="Change the search or filters." />
      }
      columnWrapperStyle={styles.columns}
      contentContainerStyle={styles.content}
      refreshing={refreshing}
      onRefresh={onRefresh}
      keyboardDismissMode="on-drag" // scrolling the list hides the keyboard
      initialNumToRender={6}
    />
  );
}

const styles = StyleSheet.create({
  header: { gap: spacing.lg, paddingTop: spacing.md, marginBottom: spacing.md },
  search: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    marginHorizontal: spacing.lg,
    paddingHorizontal: spacing.md,
    borderRadius: radius.md,
    height: 44,
  },
  searchInput: { flex: 1, fontFamily: fonts.regular, fontSize: 15 },
  switchRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginHorizontal: spacing.lg,
  },
  count: { marginHorizontal: spacing.lg },
  content: { paddingBottom: spacing.xxl },
  columns: { paddingHorizontal: spacing.lg - spacing.sm / 2 },
  cell: { flex: 1, padding: spacing.sm / 2, paddingBottom: spacing.md },
});
