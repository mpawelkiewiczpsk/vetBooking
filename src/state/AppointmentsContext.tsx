// src/state/AppointmentsContext.tsx – visits booked during the session (L04 replaces it)
import { createContext, useContext, useMemo, useState, type ReactNode } from "react";

export type Appointment = {
  id: string;
  scheduleId: string;
  slot: string; // ISO start time
  serviceId: string;
  total: number;
  createdAt: string;
};

type AppointmentsContextValue = {
  appointments: Appointment[];
  addAppointment: (data: Omit<Appointment, "id" | "createdAt">) => Appointment;
};

const AppointmentsContext = createContext<AppointmentsContextValue | null>(null);

export function AppointmentsProvider({ children }: { children: ReactNode }) {
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  const value = useMemo<AppointmentsContextValue>(
    () => ({
      appointments,
      addAppointment: (data) => {
        const appointment: Appointment = {
          ...data,
          id: `A${Date.now().toString(36).toUpperCase()}`,
          createdAt: new Date().toISOString(),
        };
        setAppointments((prev) => [appointment, ...prev]);
        return appointment;
      },
    }),
    [appointments],
  );

  return <AppointmentsContext.Provider value={value}>{children}</AppointmentsContext.Provider>;
}

export function useAppointments() {
  const ctx = useContext(AppointmentsContext);
  if (!ctx) throw new Error("useAppointments must be used inside <AppointmentsProvider>");
  return ctx;
}
