// src/components/VetDetailsModal.tsx – vet profile in a modal window
import { useState } from "react";
import { Modal, Pressable, ScrollView, StyleSheet, View } from "react-native";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { findClinic } from "@/data/mockData";
import type { Vet } from "@/data/types";
import { formatYears } from "@/utils/format";
import { fonts, radius, spacing, useAppTheme } from "@/theme/theme";
import { AppText } from "./AppText";
import { RatingStars } from "./RatingStars";
import { SpeciesIcons } from "./SpeciesIcons";

type Props = { vet: Vet | null; onClose: () => void };

export function VetDetailsModal({ vet, onClose }: Props) {
  const theme = useAppTheme();
  const insets = useSafeAreaInsets();
  const [expanded, setExpanded] = useState(false);
  const clinic = vet ? findClinic(vet.clinicId) : undefined;

  return (
    <Modal
      visible={vet !== null}
      animationType="slide"
      presentationStyle="pageSheet" // iOS: a sheet over the screen; Android: full screen
      onRequestClose={onClose} // Android: system "back" button
      onDismiss={() => setExpanded(false)}
    >
      {vet && (
        <View style={[styles.flex, { backgroundColor: theme.colors.background }]}>
          <ScrollView contentContainerStyle={{ paddingBottom: insets.bottom + spacing.xl }}>
            <Image source={vet.coverUrl} style={styles.cover} contentFit="cover" />
            <View style={styles.body}>
              <AppText variant="hero" selectable>
                {vet.name}
              </AppText>
              <AppText variant="subtitle" color={theme.colors.primary}>
                {vet.specialty}
              </AppText>
              <View style={styles.meta}>
                <RatingStars rating={vet.rating} reviews={vet.reviews} />
                <SpeciesIcons species={vet.species} />
              </View>
              <AppText muted>
                {formatYears(vet.experienceYears)} of experience · {clinic?.name}
              </AppText>
              {/* Nested Text inherits the parent style and can override it */}
              <AppText numberOfLines={expanded ? undefined : 3}>
                <AppText style={styles.bold}>About: </AppText>
                {vet.bio}
              </AppText>
              <Pressable onPress={() => setExpanded((v) => !v)} hitSlop={8}>
                <AppText color={theme.colors.primary}>
                  {expanded ? "Show less" : "Read more"}
                </AppText>
              </Pressable>
              <AppText muted>Speaks: {vet.languages.join(", ")}</AppText>
            </View>
          </ScrollView>

          <Pressable
            onPress={onClose}
            style={[styles.close, { backgroundColor: "rgba(0,0,0,0.55)" }]}
            accessibilityRole="button"
            accessibilityLabel="Close"
            hitSlop={10}
          >
            <Ionicons name="close" size={22} color="#FFFFFF" />
          </Pressable>
        </View>
      )}
    </Modal>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  cover: { width: "100%", aspectRatio: 16 / 9 },
  body: { padding: spacing.lg, gap: spacing.md },
  meta: { flexDirection: "row", alignItems: "center", gap: spacing.lg, flexWrap: "wrap" },
  // Custom font: bold via a different family, not fontWeight (Android)
  bold: { fontFamily: fonts.bold },
  close: {
    position: "absolute",
    top: spacing.lg,
    right: spacing.lg,
    width: 36,
    height: 36,
    borderRadius: radius.pill,
    alignItems: "center",
    justifyContent: "center",
  },
});
