// src/navigation/types.ts – the whole navigation map of the app, as types
import type { CompositeScreenProps, NavigatorScreenParams } from "@react-navigation/native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import type { DrawerScreenProps } from "@react-navigation/drawer";
import type { MaterialTopTabScreenProps } from "@react-navigation/material-top-tabs";
import type { Specialty } from "@/data/types";

// ── Level 1: root Stack ──────────────────────────────────────────────
export type RootStackParamList = {
  Welcome: undefined;
  SignIn: { email?: string } | undefined;
  Main: NavigatorScreenParams<DrawerParamList> | undefined;
  BookAppointment: { scheduleId: string };
  AppointmentDetails: { appointmentId: string };
  VetVideo: { vetId: string };
  NotFound: undefined;
};

// ── Level 2: Drawer (side menu) ──────────────────────────────────────
export type DrawerParamList = {
  HomeTabs: NavigatorScreenParams<TabParamList> | undefined;
  Clinics: undefined;
  Settings: undefined;
  About: undefined;
};

// ── Level 3: bottom tabs ─────────────────────────────────────────────
export type TabParamList = {
  VetsTab: NavigatorScreenParams<VetsStackParamList> | undefined;
  ScheduleTab: NavigatorScreenParams<ScheduleTopTabParamList> | undefined;
  AppointmentsTab: undefined;
  ProfileTab: undefined;
};

// ── Level 4a: Stack inside the "Vets" tab ────────────────────────────
export type VetFilters = { specialties?: Specialty[]; exoticOnly?: boolean };

export type VetsStackParamList = {
  Vets: VetFilters | undefined;
  VetDetails: { vetId: string };
  Filters: VetFilters | undefined;
};

// ── Level 4b: top tabs inside "Schedule" ─────────────────────────────
export type ScheduleTopTabParamList = {
  Today: { dayOffset: number };
  Tomorrow: { dayOffset: number };
  DayAfter: { dayOffset: number };
};

// ── Screen prop types (combine navigators from the bottom up) ────────
export type RootStackScreenProps<T extends keyof RootStackParamList> = NativeStackScreenProps<
  RootStackParamList,
  T
>;

export type DrawerScreenPropsOf<T extends keyof DrawerParamList> = CompositeScreenProps<
  DrawerScreenProps<DrawerParamList, T>,
  RootStackScreenProps<keyof RootStackParamList>
>;

export type TabScreenProps<T extends keyof TabParamList> = CompositeScreenProps<
  BottomTabScreenProps<TabParamList, T>,
  DrawerScreenPropsOf<keyof DrawerParamList>
>;

export type VetsScreenProps<T extends keyof VetsStackParamList> = CompositeScreenProps<
  NativeStackScreenProps<VetsStackParamList, T>,
  TabScreenProps<keyof TabParamList>
>;

export type ScheduleTopTabScreenProps<T extends keyof ScheduleTopTabParamList> =
  CompositeScreenProps<
    MaterialTopTabScreenProps<ScheduleTopTabParamList, T>,
    TabScreenProps<keyof TabParamList>
  >;

// Default type for useNavigation() without a generic
declare global {
  namespace ReactNavigation {
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    interface RootParamList extends RootStackParamList {}
  }
}
