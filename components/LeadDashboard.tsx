"use client";

import dynamic from "next/dynamic";
import { Download, LogOut, MapPin, RefreshCw } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

export type DashboardLead = {
  id: number;
  submitted_at: string;
  full_name: string;
  business_name: string;
  phone: string;
  email: string;
  industry: string;
  monthly_budget: string;
  city: string | null;
  utm_source: string;
  utm_campaign: string;
  coordinates?: { latitude: number; longitude: number };
};

const IndiaLeadMap = dynamic(() => import("./IndiaLeadMap"), { ssr: false });

function indiaToday() {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Kolkata" }).format(new Date());
}

function capturedAt(value: string) {
  return new Intl.DateTimeFormat("en-IN", { timeZone: "Asia/Kolkata", dateStyle: "medium", timeStyle: "medium" }).format(new Date(value));
}

export function LeadDashboard({ onLogout }: { onLogout(): void }) {
  const [fromDate, setFromDate] = useState(indiaToday);
  const [toDate, setToDate] = useState(indiaToday);
  const [leads, setLeads] = useState<DashboardLead[]>([]);
  const [count, setCount] = useState(0);
  const [message, setMessage] = useState("Loading leads...");
  const [selectedLead, setSelectedLead] = useState<DashboardLead | null>(null);
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const hasInvalidDateRange = fromDate > toDate;

  async function load() {
    if (hasInvalidDateRange) {
      setLeads([]);
      setCount(0);
      setSelectedLead(null);
      setSelectedCity(null);
      setMessage("To date must be the same as or after From date.");
      return;
    }

    setMessage("Loading leads...");
    const searchParams = new URLSearchParams({ from: fromDate, to: toDate });
    const response = await fetch("/api/admin/leads?" + searchParams, { cache: "no-store", credentials: "same-origin" });
    if (response.status === 401) {
      onLogout();
      return;
    }
    if (!response.ok) {
      setMessage("Could not load leads right now.");
      return;
    }
    const result = await response.json() as { count: number; leads: DashboardLead[] };
    setLeads(result.leads);
    setCount(result.count);
    setMessage(result.count ? "" : "No leads captured for this India date range.");
    setSelectedLead(null);
    setSelectedCity(null);
  }

  useEffect(() => { void load(); }, [fromDate, toDate]);

  const visibleLeads = useMemo(() => selectedCity ? leads.filter((lead) => lead.city === selectedCity) : leads, [leads, selectedCity]);

  async function download() {
    if (hasInvalidDateRange) return setMessage("To date must be the same as or after From date.");
    const searchParams = new URLSearchParams({ from: fromDate, to: toDate });
    const response = await fetch("/api/admin/leads/export?" + searchParams, { credentials: "same-origin", cache: "no-store" });
    if (response.status === 401) return onLogout();
    if (!response.ok) return setMessage("Could not download leads right now.");
    const url = URL.createObjectURL(await response.blob());
    const link = document.createElement("a");
    link.href = url;
    link.download = "tag-agency-leads-" + fromDate + "-to-" + toDate + ".csv";
    link.click();
    URL.revokeObjectURL(url);
  }

  async function logout() {
    await fetch("/api/admin/auth/logout", { method: "POST", credentials: "same-origin" });
    onLogout();
  }

  return (
    <div className="mt-8 grid gap-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="flex flex-wrap gap-4">
          <label className="grid gap-2 text-sm font-bold"><span>From date (India time)</span><input className="form-input border-white/15 bg-white/5 text-[#F7F5F0] [color-scheme:dark]" type="date" value={fromDate} onChange={(event) => setFromDate(event.target.value)} /></label>
          <label className="grid gap-2 text-sm font-bold"><span>To date (India time)</span><input className="form-input border-white/15 bg-white/5 text-[#F7F5F0] [color-scheme:dark]" type="date" value={toDate} onChange={(event) => setToDate(event.target.value)} /></label>
        </div>
        <div className="flex flex-wrap gap-3">
          <button className="button button-primary" onClick={download}><Download size={16} /> Download CSV</button>
          <button className="button border border-white/15 px-4 py-3 text-sm" onClick={logout}><LogOut size={16} /> Logout</button>
        </div>
      </div>
      <div className="rounded-xl border border-white/10 bg-white/[0.035] p-5"><p className="text-sm text-[#AFBAC7]">Captured leads</p><p className="mt-1 text-3xl font-extrabold">{count}</p></div>
      <IndiaLeadMap leads={leads} selectedLead={selectedLead} onSelectCity={setSelectedCity} />
      {selectedCity ? <button className="text-left text-sm font-bold text-[#72A7FF]" onClick={() => setSelectedCity(null)}>Clear city filter: {selectedCity}</button> : null}
      <div className="overflow-x-auto rounded-xl border border-white/10">
        <table className="w-full min-w-[950px] text-left text-sm"><thead className="bg-white/[0.06] text-[#AFBAC7]"><tr><th className="p-3">Captured (IST)</th><th className="p-3">Name</th><th className="p-3">Business</th><th className="p-3">City</th><th className="p-3">Phone</th><th className="p-3">Email</th><th className="p-3">Industry</th><th className="p-3">Budget</th><th className="p-3">Source</th><th className="p-3">Campaign</th></tr></thead>
          <tbody>{visibleLeads.map((lead) => <tr key={lead.id} className="cursor-pointer border-t border-white/10 hover:bg-white/[0.06]" onClick={() => setSelectedLead(lead)}><td className="p-3">{capturedAt(lead.submitted_at)}</td><td className="p-3 font-bold">{lead.full_name}</td><td className="p-3">{lead.business_name}</td><td className="p-3">{lead.city || "City not captured"}{lead.coordinates ? <MapPin className="ml-1 inline h-3.5 w-3.5 text-[#72A7FF]" /> : null}</td><td className="p-3">{lead.phone}</td><td className="p-3">{lead.email}</td><td className="p-3">{lead.industry}</td><td className="p-3">{lead.monthly_budget}</td><td className="p-3">{lead.utm_source || "—"}</td><td className="p-3">{lead.utm_campaign || "—"}</td></tr>)}</tbody>
        </table>
      </div>
      <p className="min-h-6 text-sm font-semibold text-[#AFBAC7]" aria-live="polite">{message}</p>
    </div>
  );
}
