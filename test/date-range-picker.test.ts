import assert from "node:assert/strict";
import test from "node:test";

const pickerLibrary = await import("../lib/date-range-picker.ts").catch(() => ({}));

type PickerLibrary = {
  calendarMonthGrid?: (year: number, month: number) => Array<string | null>;
  rangeForPreset?: (preset: string, today: string) => { fromDate: string; toDate: string };
  selectRangeDate?: (range: { fromDate: string; toDate: string }, selectedDate: string) => { fromDate: string; toDate: string };
};

test("creates an inclusive Last 30 days preset ending today", () => {
  const rangeForPreset = (pickerLibrary as PickerLibrary).rangeForPreset;
  assert.equal(typeof rangeForPreset, "function");
  assert.deepEqual(rangeForPreset?.("last30", "2026-08-31"), {
    fromDate: "2026-08-02",
    toDate: "2026-08-31"
  });
});

test("creates a Maximum preset spanning all dashboard lead history through today", () => {
  const rangeForPreset = (pickerLibrary as PickerLibrary).rangeForPreset;
  assert.equal(typeof rangeForPreset, "function");
  assert.deepEqual(rangeForPreset?.("maximum", "2026-09-01"), {
    fromDate: "2000-01-01",
    toDate: "2026-09-01"
  });
});

test("lays out a calendar month from Sunday through Saturday", () => {
  const calendarMonthGrid = (pickerLibrary as PickerLibrary).calendarMonthGrid;
  assert.equal(typeof calendarMonthGrid, "function");
  assert.deepEqual(calendarMonthGrid?.(2026, 8).slice(0, 7), [null, null, null, null, null, null, "2026-08-01"]);
});

test("starts a new pending range when a complete range receives another calendar selection", () => {
  const selectRangeDate = (pickerLibrary as PickerLibrary).selectRangeDate;
  assert.equal(typeof selectRangeDate, "function");
  assert.deepEqual(selectRangeDate?.({ fromDate: "2026-08-02", toDate: "2026-08-31" }, "2026-09-04"), {
    fromDate: "2026-09-04",
    toDate: ""
  });
});
