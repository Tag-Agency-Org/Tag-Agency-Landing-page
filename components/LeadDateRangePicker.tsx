"use client";

import { CalendarDays, ChevronDown, ChevronLeft, ChevronRight, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import {
  calendarMonthGrid,
  dateRangePresets,
  isDateInRange,
  monthForDate,
  rangeForPreset,
  selectRangeDate,
  shiftMonth,
  type DateRange
} from "@/lib/date-range-picker";

type Month = { year: number; month: number };

type LeadDateRangePickerProps = {
  fromDate: string;
  toDate: string;
  onUpdate(range: DateRange): void;
};

const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function indiaToday() {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Kolkata" }).format(new Date());
}

function displayDate(date: string) {
  if (!date) return "Select date";
  return new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" }).format(new Date(`${date}T00:00:00Z`));
}

function displayRange(range: DateRange) {
  return range.fromDate === range.toDate ? displayDate(range.fromDate) : `${displayDate(range.fromDate)} – ${displayDate(range.toDate)}`;
}

function displayMonth(month: Month) {
  return new Intl.DateTimeFormat("en-IN", { month: "long", year: "numeric", timeZone: "UTC" }).format(new Date(Date.UTC(month.year, month.month - 1, 1)));
}

export function LeadDateRangePicker({ fromDate, toDate, onUpdate }: LeadDateRangePickerProps) {
  const [open, setOpen] = useState(false);
  const [draftRange, setDraftRange] = useState<DateRange>({ fromDate, toDate });
  const [firstMonth, setFirstMonth] = useState<Month>(() => monthForDate(fromDate));
  const pickerRef = useRef<HTMLDivElement>(null);
  const today = indiaToday();
  const secondMonth = shiftMonth(firstMonth, 1);
  const isComplete = Boolean(draftRange.fromDate && draftRange.toDate && draftRange.fromDate <= draftRange.toDate);

  useEffect(() => {
    if (!open) return;
    const closeOnOutsideClick = (event: MouseEvent) => {
      if (!pickerRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", closeOnOutsideClick);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("mousedown", closeOnOutsideClick);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [open]);

  function openPicker() {
    setDraftRange({ fromDate, toDate });
    setFirstMonth(monthForDate(fromDate));
    setOpen(true);
  }

  function applyPreset(preset: string) {
    const nextRange = rangeForPreset(preset, today);
    setDraftRange(nextRange);
    setFirstMonth(monthForDate(nextRange.fromDate));
  }

  function updateRange() {
    if (!isComplete) return;
    onUpdate(draftRange);
    setOpen(false);
  }

  return (
    <div className="relative" ref={pickerRef}>
      <button type="button" className="flex min-h-12 items-center gap-2 rounded-md border border-white/20 bg-white/5 px-4 text-left text-sm font-bold text-[#F7F5F0] transition hover:border-[#D6A64F]/70" onClick={openPicker} aria-expanded={open} aria-haspopup="dialog">
        <CalendarDays size={18} aria-hidden="true" />
        <span>{displayRange({ fromDate, toDate })}</span>
        <ChevronDown size={16} aria-hidden="true" />
      </button>
      {open ? (
        <div className="fixed inset-0 z-[1200] flex items-start justify-center overflow-y-auto bg-[#09111A]/45 p-3 backdrop-blur-[1px] md:items-center md:p-8" role="presentation">
          <section className="w-full max-w-5xl overflow-hidden rounded-lg border border-[#B8C3CF] bg-[#F8FAFC] text-[#14202B] shadow-2xl" role="dialog" aria-modal="true" aria-label="Select lead date range">
            <div className="flex items-center justify-between border-b border-[#D7DEE6] px-5 py-3 md:hidden"><p className="font-extrabold">Select date range</p><button className="rounded p-1 hover:bg-[#E7EDF3]" onClick={() => setOpen(false)} aria-label="Close date range picker"><X size={20} /></button></div>
            <div className="grid lg:grid-cols-[196px_minmax(0,1fr)]">
              <aside className="border-b border-[#D7DEE6] bg-white px-4 py-4 lg:border-b-0 lg:border-r">
                <p className="mb-3 text-xs font-extrabold uppercase tracking-[0.08em] text-[#536273]">Recently used</p>
                <div className="grid gap-1 sm:grid-cols-2 lg:grid-cols-1">
                  {dateRangePresets.map((preset) => {
                    const activeRange = rangeForPreset(preset.id, today);
                    const isActive = activeRange.fromDate === draftRange.fromDate && activeRange.toDate === draftRange.toDate;
                    return <button key={preset.id} type="button" className={`rounded-md px-3 py-2 text-left text-sm font-semibold transition ${isActive ? "bg-[#DCEEFF] text-[#087CC1]" : "hover:bg-[#EEF3F8]"}`} onClick={() => applyPreset(preset.id)}>{preset.label}</button>;
                  })}
                </div>
              </aside>
              <div className="p-4 md:p-6">
                <div className="mb-5 flex items-center justify-between">
                  <button type="button" className="rounded p-2 transition hover:bg-[#E7EDF3]" aria-label="Previous month" onClick={() => setFirstMonth(shiftMonth(firstMonth, -1))}><ChevronLeft size={20} /></button>
                  <button type="button" className="rounded p-2 transition hover:bg-[#E7EDF3]" aria-label="Next month" onClick={() => setFirstMonth(shiftMonth(firstMonth, 1))}><ChevronRight size={20} /></button>
                </div>
                <div className="grid gap-6 md:grid-cols-2">
                  <CalendarMonth month={firstMonth} range={draftRange} onSelect={(date) => setDraftRange(selectRangeDate(draftRange, date))} />
                  <CalendarMonth month={secondMonth} range={draftRange} onSelect={(date) => setDraftRange(selectRangeDate(draftRange, date))} />
                </div>
                <div className="mt-6 grid gap-3 border-t border-[#D7DEE6] pt-5 md:grid-cols-[1fr_1fr_auto_auto] md:items-end">
                  <label className="grid gap-1 text-xs font-bold text-[#536273]"><span>Start date</span><input className="min-h-10 rounded border border-[#B8C3CF] bg-white px-3 text-sm text-[#14202B]" type="date" value={draftRange.fromDate} onChange={(event) => setDraftRange((range) => ({ ...range, fromDate: event.target.value }))} /></label>
                  <label className="grid gap-1 text-xs font-bold text-[#536273]"><span>End date</span><input className="min-h-10 rounded border border-[#B8C3CF] bg-white px-3 text-sm text-[#14202B]" type="date" value={draftRange.toDate} onChange={(event) => setDraftRange((range) => ({ ...range, toDate: event.target.value }))} /></label>
                  <button type="button" className="min-h-10 rounded border border-[#AEBCCB] bg-white px-4 text-sm font-bold hover:bg-[#EEF3F8]" onClick={() => setOpen(false)}>Cancel</button>
                  <button type="button" className="min-h-10 rounded bg-[#087CC1] px-5 text-sm font-bold text-white transition hover:bg-[#0569A5] disabled:cursor-not-allowed disabled:bg-[#9AA9B7]" disabled={!isComplete} onClick={updateRange}>Update</button>
                </div>
                {!isComplete ? <p className="mt-2 text-xs font-semibold text-[#B24A3E]">Select an end date that is the same as or after the start date.</p> : <p className="mt-2 text-xs text-[#647386]">Dates are shown in Asia/Kolkata.</p>}
              </div>
            </div>
          </section>
        </div>
      ) : null}
    </div>
  );
}

function CalendarMonth({ month, range, onSelect }: { month: Month; range: DateRange; onSelect(date: string): void }) {
  const cells = calendarMonthGrid(month.year, month.month);
  return (
    <section aria-label={displayMonth(month)}>
      <h3 className="mb-3 text-center text-sm font-extrabold">{displayMonth(month)}</h3>
      <div className="grid grid-cols-7 gap-y-1 text-center text-xs text-[#647386]">{weekdays.map((day) => <span key={day}>{day}</span>)}</div>
      <div className="mt-2 grid grid-cols-7 gap-y-1">
        {cells.map((date, index) => {
          if (!date) return <span key={`blank-${index}`} className="h-9" aria-hidden="true" />;
          const isBoundary = date === range.fromDate || date === range.toDate;
          const selected = isDateInRange(date, range);
          return <button key={date} type="button" className={`h-9 text-sm font-semibold transition ${isBoundary ? "rounded bg-[#087CC1] text-white" : selected ? "bg-[#DCEEFF] text-[#14202B]" : "rounded hover:bg-[#E7EDF3]"}`} onClick={() => onSelect(date)}>{Number(date.slice(-2))}</button>;
        })}
      </div>
    </section>
  );
}
