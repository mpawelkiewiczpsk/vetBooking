// src/screens/vets/VetDetailsScreen.tsx – vet profile + upcoming working days
import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { SCHEDULES, findClinic, findVet } from "@/data/mockData";
import { AppText } from "@/components/AppText";
import { EmptyState } from "@/components/EmptyState";
import { RatingStars } from "@/components/RatingStars";
import { ScheduleRow } from "@/components/ScheduleRow";
import { SpeciesIcons } from "@/components/SpeciesIcons";
import type { VetsScreenProps } from "@/navigation/types";
import { formatDayLabel, formatYears } from "@/utils/format";
import { radius, spacing, useAppTheme } from "@/theme/theme";

export function VetDetailsScreen({ navigation, route }: VetsScreenProps<"VetDetails">) {
  const theme = useAppTheme();
  const vet = findVet(route.params.vetId);

  if (!vet) {
    return <EmptyState title="Vet not found" message="The vet may no longer work with us." />;
  }

  const schedules = SCHEDULES.filter((s) => s.vetId === vet.id);
  const clinic = findClinic(vet.clinicId);

  return (
    <ScrollView contentContainerStyle={styles.content}>
      <View>
        <Image source={vet.coverUrl} style={styles.cover} contentFit="cover" />
        <LinearGradient
          colors={["rgba(0,0,0,0.6)", "transparent", theme.colors.background]}
          style={StyleSheet.absoluteFill}
        />
      </View>
      <View style={styles.body}>
        <AppText variant="hero">{vet.name}</AppText>
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
        <AppText>{vet.bio}</AppText>

        <Pressable
          // The VetVideo screen lives in the root Stack – navigate "looks" in parent navigators
          onPress={() => navigation.navigate("VetVideo", { vetId: vet.id })}
          style={[styles.video, { borderColor: theme.colors.primary }]}
        >
          <Ionicons name="play-circle" size={22} color={theme.colors.primary} />
          <AppText variant="subtitle" color={theme.colors.primary}>
            Meet {vet.name.split(" ")[1]}
          </AppText>
        </Pressable>

        <AppText variant="title">Working days</AppText>
      </View>
      {schedules.map((s) =>
        clinic ? (
          <View key={s.id} style={styles.schedule}>
            <AppText variant="label" muted style={styles.day}>
              {formatDayLabel(s.date)}
            </AppText>
            <ScheduleRow
              schedule={s}
              vet={vet}
              clinic={clinic}
              onPress={() => navigation.navigate("BookAppointment", { scheduleId: s.id })}
            />
          </View>
        ) : null,
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: { paddingBottom: spacing.xxl },
  cover: { width: "100%", aspectRatio: 4 / 3 },
  body: { padding: spacing.lg, gap: spacing.md },
  meta: { flexDirection: "row", alignItems: "center", gap: spacing.lg, flexWrap: "wrap" },
  video: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderWidth: 1.5,
    borderRadius: radius.pill,
  },
  schedule: { marginBottom: spacing.sm },
  day: { marginHorizontal: spacing.lg, marginBottom: spacing.sm },
});
