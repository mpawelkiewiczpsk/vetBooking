// src/screens/NotFoundScreen.tsx – unknown deep link
import { Pressable, StyleSheet, View } from "react-native";
import { useAuth } from "@/auth/AuthContext";
import { AppText } from "@/components/AppText";
import { EmptyState } from "@/components/EmptyState";
import type { RootStackScreenProps } from "@/navigation/types";
import { spacing, useAppTheme } from "@/theme/theme";

export function NotFoundScreen({ navigation }: RootStackScreenProps<"NotFound">) {
  const theme = useAppTheme();
  const { user } = useAuth();
  // The available screens depend on the auth state (guard in RootNavigator)
  const goHome = () => (user ? navigation.navigate("Main") : navigation.navigate("Welcome"));
  return (
    <View style={styles.container}>
      <EmptyState
        icon="help-circle-outline"
        title="Page not found"
        message="The link is invalid."
      />
      <Pressable onPress={() => (navigation.canGoBack() ? navigation.goBack() : goHome())}>
        <AppText color={theme.colors.primary}>Go back</AppText>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center", gap: spacing.lg },
});
