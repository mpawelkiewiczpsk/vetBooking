// src/components/FeaturedCarousel.tsx – horizontal carousel "New in our team"
import { useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  View,
  useWindowDimensions,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
} from "react-native";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import type { Vet } from "@/data/types";
import { radius, spacing, useAppTheme } from "@/theme/theme";
import { AppText } from "./AppText";

type Props = { vets: Vet[]; onPress: (vet: Vet) => void };

export function FeaturedCarousel({ vets, onPress }: Props) {
  const theme = useAppTheme();
  const { width } = useWindowDimensions();
  const cardWidth = Math.min(width - spacing.lg * 2, 520); // not too wide on a tablet
  const [index, setIndex] = useState(0);

  // onScroll + scrollEventThrottle: read the position to highlight the active dot
  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const x = e.nativeEvent.contentOffset.x;
    setIndex(Math.round(x / (cardWidth + spacing.md)));
  };

  return (
    <View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToInterval={cardWidth + spacing.md} // "snap" to the next card
        decelerationRate="fast"
        contentContainerStyle={styles.content}
        onScroll={onScroll}
        scrollEventThrottle={16} // ~60 events per second
      >
        {vets.map((vet) => (
          <Pressable
            key={vet.id}
            onPress={() => onPress(vet)}
            style={[styles.card, { width: cardWidth }]}
            accessibilityRole="button"
            accessibilityLabel={`New in our team: ${vet.name}, ${vet.specialty}`}
          >
            <Image source={vet.coverUrl} contentFit="cover" style={StyleSheet.absoluteFill} />
            {/* The gradient darkens the bottom of the photo so the text is readable */}
            <LinearGradient
              colors={["transparent", "rgba(0,0,0,0.85)"]}
              style={StyleSheet.absoluteFill}
            />
            <View style={styles.caption}>
              <AppText variant="label" color={theme.colors.accent}>
                New in our team
              </AppText>
              <AppText variant="title" color="#FFFFFF" numberOfLines={1}>
                {vet.name}
              </AppText>
              <AppText variant="caption" color="#E5E7EB">
                {vet.specialty} · {vet.languages.join(", ")}
              </AppText>
            </View>
          </Pressable>
        ))}
      </ScrollView>

      <View style={styles.dots} accessibilityElementsHidden importantForAccessibility="no">
        {vets.map((v, i) => (
          <View
            key={v.id}
            style={[
              styles.dot,
              { backgroundColor: i === index ? theme.colors.primary : theme.colors.border },
              i === index && styles.dotActive,
            ]}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: spacing.lg, gap: spacing.md },
  card: {
    aspectRatio: 16 / 9,
    borderRadius: radius.lg,
    overflow: "hidden",
    justifyContent: "flex-end",
  },
  caption: { padding: spacing.lg, gap: 2 },
  dots: { flexDirection: "row", justifyContent: "center", gap: 6, marginTop: spacing.sm },
  dot: { width: 6, height: 6, borderRadius: 3 },
  dotActive: { width: 18 },
});
