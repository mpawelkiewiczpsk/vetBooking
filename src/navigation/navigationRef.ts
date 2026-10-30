// src/navigation/navigationRef.ts – navigation from outside components (e.g. notifications in L07)
import { createNavigationContainerRef } from "@react-navigation/native";
import type { RootStackParamList } from "./types";

export const navigationRef = createNavigationContainerRef<RootStackParamList>();

// Safe call: the navigator might not be ready yet
export function navigateToAppointment(appointmentId: string) {
  if (navigationRef.isReady()) {
    navigationRef.navigate("AppointmentDetails", { appointmentId });
  }
}
