// src/components/RatingStars.tsx – 0–5 rating as stars + number of reviews
import { StyleSheet, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAppTheme } from "@/theme/theme";
import { AppText } from "./AppText";

type Props = { rating: number; reviews?: number; size?: number };

export function RatingStars({ rating, reviews, size = 14 }: Props) {
  const theme = useAppTheme();
  return (
    <View
      style={styles.row}
      accessible // the whole row is ONE element for a screen reader
      accessibilityLabel={`Rated ${rating} out of 5${reviews ? `, ${reviews} reviews` : ""}`}
    >
      {[0, 1, 2, 3, 4].map((i) => {
        const name = rating >= i + 1 ? "star" : rating >= i + 0.5 ? "star-half" : "star-outline";
        return <Ionicons key={i} name={name} size={size} color={theme.colors.accent} />;
      })}
      <AppText variant="caption" muted style={styles.value}>
        {rating.toFixed(1)}
        {reviews !== undefined ? ` (${reviews})` : ""}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center", gap: 2 },
  value: { marginLeft: 4 },
});
