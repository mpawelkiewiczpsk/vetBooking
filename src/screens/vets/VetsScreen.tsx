// src/screens/vets/VetsScreen.tsx – vets: search in the header, filters in a sheet
import { useCallback, useLayoutEffect, useMemo, useRef, useState } from "react";
import { FlatList, Pressable, StyleSheet, View, useWindowDimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useScrollToTop } from "@react-navigation/native";
import { VETS } from "@/data/mockData";
import type { Vet } from "@/data/types";
import { AppText } from "@/components/AppText";
import { EmptyState } from "@/components/EmptyState";
import { FeaturedCarousel } from "@/components/FeaturedCarousel";
import { VetCard } from "@/components/VetCard";
import type { VetsScreenProps } from "@/navigation/types";
import { spacing, useAppTheme } from "@/theme/theme";

export function VetsScreen({ navigation, route }: VetsScreenProps<"Vets">) {
  const theme = useAppTheme();
  const { width } = useWindowDimensions();
  const [query, setQuery] = useState("");
  const listRef = useRef<FlatList<Vet>>(null);

  // Tapping the active tab again scrolls the list to the top
  useScrollToTop(listRef);

  // Filters live in the route params – the Filters screen sets them
  // useMemo: without it "?? []" would create a new array on every render
  const specialties = useMemo(() => route.params?.specialties ?? [], [route.params?.specialties]);
  const exoticOnly = route.params?.exoticOnly ?? false;
  const activeFilters = specialties.length + (exoticOnly ? 1 : 0);

  // Header options that depend on the screen state are set with setOptions
  useLayoutEffect(() => {
    navigation.setOptions({
      headerSearchBarOptions: {
        placeholder: "Search vets",
        onChangeText: (e) => setQuery(e.nativeEvent.text),
        hideWhenScrolling: true,
      },
      headerRight: () => (
        <Pressable
          onPress={() => navigation.navigate("Filters", { specialties, exoticOnly })}
          hitSlop={10}
          accessibilityRole="button"
          accessibilityLabel={`Filters, active: ${activeFilters}`}
          style={styles.filterButton}
        >
          <Ionicons name="options-outline" size={22} color={theme.colors.primary} />
          {activeFilters > 0 && (
            <View style={[styles.badge, { backgroundColor: theme.colors.primary }]}>
              <AppText variant="caption" color={theme.colors.onPrimary}>
                {activeFilters}
              </AppText>
            </View>
          )}
        </Pressable>
      ),
    });
  }, [navigation, specialties, exoticOnly, activeFilters, theme]);

  const numColumns = width >= 900 ? 4 : width >= 600 ? 3 : 2;
  const filtered = useMemo(
    () =>
      VETS.filter((v) => v.name.toLowerCase().includes(query.trim().toLowerCase()))
        .filter((v) => specialties.length === 0 || specialties.includes(v.specialty))
        .filter((v) => !exoticOnly || v.species.some((s) => s === "bird" || s === "reptile")),
    [query, specialties, exoticOnly],
  );

  const openVet = useCallback(
    (vet: Vet) => navigation.navigate("VetDetails", { vetId: vet.id }),
    [navigation],
  );
  // preload (v7): the details screen renders in the background as soon as the card is touched
  const preloadVet = useCallback(
    (vet: Vet) => navigation.preload("VetDetails", { vetId: vet.id }),
    [navigation],
  );

  return (
    <FlatList
      ref={listRef}
      key={numColumns}
      data={filtered}
      keyExtractor={(item) => item.id}
      numColumns={numColumns}
      // iOS: the list cooperates with the large title and the search bar
      contentInsetAdjustmentBehavior="automatic"
      renderItem={({ item }) => (
        <View style={[styles.cell, { maxWidth: `${100 / numColumns}%` }]}>
          <VetCard vet={item} onPress={openVet} onPressIn={preloadVet} />
        </View>
      )}
      ListHeaderComponent={
        query === "" ? (
          <View style={styles.header}>
            <FeaturedCarousel vets={VETS.filter((v) => v.isNew)} onPress={openVet} />
            <AppText variant="label" muted style={styles.count}>
              Vets: {filtered.length}
            </AppText>
          </View>
        ) : undefined
      }
      ListEmptyComponent={
        <EmptyState title="No vets found" message="Change the search or filters." />
      }
      columnWrapperStyle={styles.columns}
      contentContainerStyle={styles.content}
      keyboardDismissMode="on-drag"
    />
  );
}

const styles = StyleSheet.create({
  header: { gap: spacing.md, paddingTop: spacing.md, marginBottom: spacing.md },
  count: { marginHorizontal: spacing.lg },
  content: { paddingBottom: spacing.xxl },
  columns: { paddingHorizontal: spacing.lg - spacing.sm / 2 },
  cell: { flex: 1, padding: spacing.sm / 2, paddingBottom: spacing.md },
  filterButton: { padding: 4 },
  badge: {
    position: "absolute",
    top: -4,
    right: -6,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 4,
  },
});
