// src/screens/auth/WelcomeScreen.tsx – welcome screen (signed-out users only)
import { Pressable, StyleSheet, View } from "react-native";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "@/auth/AuthContext";
import { AppText } from "@/components/AppText";
import type { RootStackScreenProps } from "@/navigation/types";
import { radius, spacing, useAppTheme } from "@/theme/theme";

export function WelcomeScreen({ navigation }: RootStackScreenProps<"Welcome">) {
  const theme = useAppTheme();
  const { signIn } = useAuth();

  return (
    <View style={styles.flex}>
      <Image
        source="https://picsum.photos/seed/pawcare-welcome/1200/1800"
        style={StyleSheet.absoluteFill}
        contentFit="cover"
      />
      <LinearGradient colors={["rgba(0,0,0,0.1)", "#000000"]} style={StyleSheet.absoluteFill} />
      <SafeAreaView style={[styles.flex, styles.content]}>
        <AppText variant="label" color={theme.colors.primary}>
          PawCare Clinic
        </AppText>
        <AppText variant="hero" color="#FFFFFF">
          Healthy pets, happy homes
        </AppText>
        <AppText color="#D1D5DB">
          Find a vet, book a visit and keep your pet’s records in one place.
        </AppText>
        <Pressable
          style={[styles.button, { backgroundColor: theme.colors.primary }]}
          onPress={() => navigation.navigate("SignIn")}
        >
          <AppText variant="subtitle" color={theme.colors.onPrimary}>
            Sign in
          </AppText>
        </Pressable>
        {/* Changing the auth state switches the screen set in RootNavigator by itself */}
        <Pressable
          style={[styles.button, styles.ghost]}
          onPress={() => signIn({ name: "Guest", isGuest: true })}
        >
          <AppText variant="subtitle" color="#FFFFFF">
            Continue as guest
          </AppText>
        </Pressable>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  content: { justifyContent: "flex-end", padding: spacing.xl, gap: spacing.md },
  button: { height: 52, borderRadius: radius.md, alignItems: "center", justifyContent: "center" },
  ghost: { borderWidth: 1, borderColor: "rgba(255,255,255,0.4)" },
});
