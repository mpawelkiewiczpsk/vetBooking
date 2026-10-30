// src/screens/vets/VetVideoScreen.tsx – transparent modal over the previous screen
import { Pressable, StyleSheet, View } from "react-native";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import { findVet } from "@/data/mockData";
import { AppText } from "@/components/AppText";
import type { RootStackScreenProps } from "@/navigation/types";
import { radius, spacing } from "@/theme/theme";

export function VetVideoScreen({ navigation, route }: RootStackScreenProps<"VetVideo">) {
  const vet = findVet(route.params.vetId);

  return (
    <View style={styles.overlay}>
      {/* Tapping the background closes the modal */}
      <Pressable style={StyleSheet.absoluteFill} onPress={() => navigation.goBack()} />
      <View style={styles.card}>
        <Image source={vet?.coverUrl} style={styles.video} contentFit="cover" />
        <View style={styles.play}>
          <Ionicons name="play" size={36} color="#FFFFFF" />
        </View>
        <AppText variant="subtitle" color="#FFFFFF" style={styles.title}>
          {vet ? `Meet ${vet.name}` : "Video"}
        </AppText>
        <AppText variant="caption" color="#D1D5DB" style={styles.title}>
          The video player comes in L07 – for now we show a modal presentation.
        </AppText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "center",
    padding: spacing.lg,
  },
  card: {
    backgroundColor: "#0F1716",
    borderRadius: radius.lg,
    overflow: "hidden",
    paddingBottom: spacing.md,
  },
  video: { width: "100%", aspectRatio: 16 / 9 },
  play: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    aspectRatio: 16 / 9,
    alignItems: "center",
    justifyContent: "center",
  },
  title: { paddingHorizontal: spacing.lg, paddingTop: spacing.md },
});
