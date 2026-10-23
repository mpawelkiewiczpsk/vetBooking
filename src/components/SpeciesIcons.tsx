// src/components/SpeciesIcons.tsx – small icons of the animals a vet treats
import { StyleSheet, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import type { Species } from "@/data/types";
import { useAppTheme } from "@/theme/theme";

// Record<Species, …> – TypeScript reports an error if we forget any species
export const SPECIES_ICON: Record<Species, keyof typeof MaterialCommunityIcons.glyphMap> = {
  dog: "dog",
  cat: "cat",
  rabbit: "rabbit",
  bird: "bird",
  reptile: "turtle",
};

type Props = { species: Species[]; size?: number };

export function SpeciesIcons({ species, size = 16 }: Props) {
  const theme = useAppTheme();
  return (
    <View style={styles.row} accessible accessibilityLabel={`Treats: ${species.join(", ")}`}>
      {species.map((s) => (
        <MaterialCommunityIcons
          key={s}
          name={SPECIES_ICON[s]}
          size={size}
          color={theme.colors.primary}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({ row: { flexDirection: "row", gap: 4 } });
