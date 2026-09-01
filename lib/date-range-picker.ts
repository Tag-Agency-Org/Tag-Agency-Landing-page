export type DateRange = { fromDate: string; toDate: string };

const maximumLeadHistoryStart = "2000-01-01";

export const dateRangePresets = [
  { id: "today", label: "Today" },
  { id: "yesterday", label: "Yesterday" },
  { id: "maximum", label: "Maximum" },
  { id: "last7", label: "Last 7 days" },
  { id: "last14", label: "Last 14 days" },
  { id: "last28", label: "Last 28 days" },
  { id: "last30", label: "Last 30 days" },
  { id: "thisWeek", label: "This week" },
  { id: "lastWeek", label: "Last week" },
  { id: "thisMonth", label: "This month" },
  { id: "lastMonth", label: "Last month" }
] as const;

export function rangeForPreset(preset: string, today: string): DateRange {
  switch (preset) {
    case "today":
      return { fromDate: today, toDate: today };
    case "yesterday": {
      const yesterday = addDays(today, -1);
      return { fromDate: yesterday, toDate: yesterday };
    }
    case "maximum":
      return { fromDate: maximumLeadHistoryStart, toDate: today };
    case "last7":
      return { fromDate: addDays(today, -6), toDate: today };
    case "last14":
      return { fromDate: addDays(today, -13), toDate: today };
    case "last28":
      return { fromDate: addDays(today, -27), toDate: today };
    case "last30":
      return { fromDate: addDays(today, -29), toDate: today };
    case "thisWeek": {
      const start = addDays(today, -dateFromIso(today).getUTCDay());
      return { fromDate: start, toDate: addDays(start, 6) };
    }
    case "lastWeek": {
      const start = addDays(today, -dateFromIso(today).getUTCDay() - 7);
      return { fromDate: start, toDate: addDays(start, 6) };
    }
    case "thisMonth":
      return monthRange(monthForDate(today));
    case "lastMonth": {
      const currentMonth = monthForDate(today);
      return monthRange(shiftMonth(currentMonth, -1));
    }
    default:
      throw new Error("Unknown date range preset");
  }
}

export function calendarMonthGrid(year: number, month: number) {
  const firstDay = new Date(Date.UTC(year, month - 1, 1));
  const daysInMonth = new Date(Date.UTC(year, month, 0)).getUTCDate();
  const cells: Array<string | null> = Array.from({ length: 42 }, () => null);

  for (let day = 1; day <= daysInMonth; day += 1) {
    cells[firstDay.getUTCDay() + day - 1] = isoDate(year, month, day);
  }

  return cells;
}

export function selectRangeDate(range: DateRange, selectedDate: string): DateRange {
  if (!range.fromDate || range.toDate) return { fromDate: selectedDate, toDate: "" };
  return selectedDate < range.fromDate
    ? { fromDate: selectedDate, toDate: range.fromDate }
    : { fromDate: range.fromDate, toDate: selectedDate };
}

export function monthForDate(date: string) {
  const parsed = dateFromIso(date);
  return { year: parsed.getUTCFullYear(), month: parsed.getUTCMonth() + 1 };
}

export function shiftMonth({ year, month }: { year: number; month: number }, offset: number) {
  const shifted = new Date(Date.UTC(year, month - 1 + offset, 1));
  return { year: shifted.getUTCFullYear(), month: shifted.getUTCMonth() + 1 };
}

export function isDateInRange(date: string, range: DateRange) {
  return Boolean(range.fromDate && range.toDate && date >= range.fromDate && date <= range.toDate);
}

function monthRange(month: { year: number; month: number }): DateRange {
  const first = isoDate(month.year, month.month, 1);
  const last = new Date(Date.UTC(month.year, month.month, 0));
  return { fromDate: first, toDate: isoDate(last.getUTCFullYear(), last.getUTCMonth() + 1, last.getUTCDate()) };
}

function addDays(date: string, amount: number) {
  const value = dateFromIso(date);
  value.setUTCDate(value.getUTCDate() + amount);
  return isoDate(value.getUTCFullYear(), value.getUTCMonth() + 1, value.getUTCDate());
}

function dateFromIso(date: string) {
  const [year, month, day] = date.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day));
}

function isoDate(year: number, month: number, day: number) {
  return `${year.toString().padStart(4, "0")}-${month.toString().padStart(2, "0")}-${day.toString().padStart(2, "0")}`;
}
