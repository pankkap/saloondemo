export function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(" ");
}

export function formatDateString(dateStr: string): string {
  if (!dateStr) return "";
  try {
    const [year, month, day] = dateStr.split("-").map(Number);
    const date = new Date(year, month - 1, day);
    return date.toLocaleDateString("en-GB", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
}

export function generateAvailableTimeSlots(): string[] {
  // Returns sensible luxury salon appointment slots
  return [
    "09:30",
    "10:45",
    "12:00",
    "13:30",
    "15:00",
    "16:15",
    "17:30",
    "18:45",
  ];
}
