// src/components/VetHeaderActions.tsx – buttons in the vet profile header
import { useState } from "react";
import { Share, StyleSheet, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { HeaderButton } from "@react-navigation/elements";
import { findVet } from "@/data/mockData";

// The component is passed in the navigator `options` (not via setOptions from the screen),
// so it also works with navigation.preload() – a preloaded screen cannot call setOptions.
export function VetHeaderActions({ vetId }: { vetId: string }) {
  const vet = findVet(vetId);
  const [favorite, setFavorite] = useState(false); // moved to a global store in L04

  return (
    <View style={styles.row}>
      <HeaderButton
        accessibilityLabel="Share"
        onPress={() =>
          vet && Share.share({ message: `${vet.name} at PawCare: pawcare://vet/${vet.id}` })
        }
      >
        <Ionicons name="share-outline" size={22} color="#FFFFFF" />
      </HeaderButton>
      <HeaderButton
        accessibilityLabel={favorite ? "Remove from favorites" : "Add to favorites"}
        onPress={() => setFavorite((f) => !f)}
      >
        <Ionicons name={favorite ? "heart" : "heart-outline"} size={22} color="#FFFFFF" />
      </HeaderButton>
    </View>
  );
}

const styles = StyleSheet.create({ row: { flexDirection: "row" } });
