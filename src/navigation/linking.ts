// src/navigation/linking.ts – deep links: URL -> screen (with parameters)
import * as Linking from "expo-linking";
import type { LinkingOptions } from "@react-navigation/native";
import type { RootStackParamList } from "./types";

export const linking: LinkingOptions<RootStackParamList> = {
  // createURL("/") returns exp://IP:8081/--/ in Expo Go and pawcare:// in a build
  prefixes: [Linking.createURL("/"), "pawcare://", "https://pawcare.example.com"],
  config: {
    // The structure mirrors how the navigators are nested
    screens: {
      Welcome: "welcome",
      SignIn: "login",
      Main: {
        screens: {
          HomeTabs: {
            screens: {
              VetsTab: {
                screens: {
                  Vets: "vets",
                  VetDetails: "vet/:vetId",
                  Filters: "filters",
                },
              },
              ScheduleTab: {
                screens: {
                  Today: "schedule/today",
                  Tomorrow: "schedule/tomorrow",
                  DayAfter: "schedule/day-after",
                },
              },
              AppointmentsTab: "appointments",
              ProfileTab: "profile",
            },
          },
          Clinics: "clinics",
          Settings: "settings",
          About: "about",
        },
      },
      BookAppointment: "book/:scheduleId",
      AppointmentDetails: "appointment/:appointmentId",
      VetVideo: "video/:vetId",
      NotFound: "*", // any unknown address
    },
  },
};
