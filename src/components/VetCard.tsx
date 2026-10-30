// src/components/VetCard.tsx – vet tile in the grid
import { memo } from "react";
import { Platform, Pressable, StyleSheet, View } from "react-native";
import { Image } from "expo-image";
import type { Vet } from "@/data/types";
import { radius, spacing, useAppTheme } from "@/theme/theme";
import { AppText } from "./AppText";
import { RatingStars } from "./RatingStars";
import { SpeciesIcons } from "./SpeciesIcons";

// A tiny "blurhash" – blurry placeholder visible before the image downloads
const BLURHASH = "L5H2EC=PM+yV0g-mq.wG9c010J}I";

type Props = {
  vet: Vet;
  onPress: (vet: Vet) => void;
  onPressIn?: (vet: Vet) => void;
  onLongPress?: (vet: Vet) => void;
};

function VetCardComponent({ vet, onPress, onPressIn, onLongPress }: Props) {
  const theme = useAppTheme();
  return (
    <Pressable
      onPress={() => onPress(vet)}
      onPressIn={() => onPressIn?.(vet)}
      onLongPress={() => onLongPress?.(vet)}
      delayLongPress={350}
      android_ripple={{ color: "rgba(0,0,0,0.12)", foreground: true }}
      // A function in `style` receives { pressed } – press feedback on iOS
      style={({ pressed }) => [
        styles.card,
        { backgroundColor: theme.colors.surface, borderColor: theme.colors.border },
        pressed && Platform.OS === "ios" && styles.pressed,
      ]}
      accessibilityRole="button"
      accessibilityLabel={`${vet.name}, ${vet.specialty}`}
      accessibilityHint="Opens the vet profile"
    >
      <Image
        source={vet.photoUrl}
        placeholder={{ blurhash: BLURHASH }}
        contentFit="cover"
        transition={250}
        style={styles.photo}
        accessibilityIgnoresInvertColors
      />
      <View style={styles.info}>
        <AppText variant="subtitle" numberOfLines={1}>
          {vet.name}
        </AppText>
        <AppText variant="caption" muted numberOfLines={1}>
          {vet.specialty}
        </AppText>
        <SpeciesIcons species={vet.species} size={14} />
        <RatingStars rating={vet.rating} size={12} />
      </View>
      {vet.isNew && (
        <View style={[styles.ribbon, { backgroundColor: theme.colors.primary }]}>
          <AppText variant="label" color={theme.colors.onPrimary}>
            New
          </AppText>
        </View>
      )}
    </Pressable>
  );
}

// memo: the card re-renders only when its props change
export const VetCard = memo(VetCardComponent);

const styles = StyleSheet.create({
  card: {
    flex: 1,
    borderRadius: radius.lg,
    borderWidth: StyleSheet.hairlineWidth, // the thinnest line on the given screen
    overflow: "hidden", // clips the image and ripple to the rounded corners
    boxShadow: "0 4px 14px rgba(0, 0, 0, 0.10)",
  },
  pressed: { opacity: 0.85, transform: [{ scale: 0.98 }] },
  photo: { width: "100%", aspectRatio: 1 },
  info: { padding: spacing.md, gap: 6 },
  ribbon: {
    position: "absolute",
    top: spacing.sm,
    left: spacing.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: radius.sm,
  },
});
