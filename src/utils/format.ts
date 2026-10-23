// src/utils/format.ts – formatting with the built-in Intl API (no extra libraries)
const timeFmt = new Intl.DateTimeFormat("en-US", { hour: "numeric", minute: "2-digit" });
const dayFmt = new Intl.DateTimeFormat("en-US", { weekday: "long", month: "long", day: "numeric" });
const priceFmt = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });

export const formatTime = (iso: string) => timeFmt.format(new Date(iso));
export const formatPrice = (value: number) => priceFmt.format(value);

// "Today", "Tomorrow" or the full date
export function formatDayLabel(iso: string) {
  const date = new Date(iso);
  const diffDays = Math.round(
    (startOfDay(date).getTime() - startOfDay(new Date()).getTime()) / 86_400_000,
  );
  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Tomorrow";
  return dayFmt.format(date);
}

export function startOfDay(date: Date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

export const formatYears = (years: number) => `${years} ${years === 1 ? "year" : "years"}`;
