"use client";

import { Download } from "lucide-react";
import { FormEvent, useState } from "react";

function localToday() {
  const now = new Date();
  const local = new Date(now.getTime() - now.getTimezoneOffset() * 60_000);
  return local.toISOString().slice(0, 10);
}

export function LeadExportForm() {
  const [date, setDate] = useState(localToday);
  const [token, setToken] = useState("");
  const [message, setMessage] = useState("");
  const [isDownloading, setIsDownloading] = useState(false);

  async function downloadLeads(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");

    if (!token) {
      setMessage("Enter the admin download token.");
      return;
    }

    setIsDownloading(true);
    try {
      const response = await fetch(`/api/admin/leads/export?date=${encodeURIComponent(date)}`, {
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store"
      });

      if (!response.ok) {
        setMessage(response.status === 401 ? "The admin token is not valid." : "The lead file could not be downloaded right now.");
        return;
      }

      const file = await response.blob();
      const downloadUrl = URL.createObjectURL(file);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = `tag-agency-leads-${date}.csv`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(downloadUrl);
      setMessage("Your CSV download has started.");
    } catch {
      setMessage("The lead file could not be downloaded right now.");
    } finally {
      setIsDownloading(false);
    }
  }

  return (
    <form className="mt-8 grid gap-5" onSubmit={downloadLeads} noValidate>
      <label className="grid gap-2 text-sm font-bold">
        <span>Date</span>
        <input
          className="form-input border-white/15 bg-white/5 text-[#F7F5F0] [color-scheme:dark]"
          type="date"
          value={date}
          onChange={(event) => setDate(event.target.value)}
          required
        />
      </label>
      <label className="grid gap-2 text-sm font-bold">
        <span>Admin download token</span>
        <input
          className="form-input border-white/15 bg-white/5 text-[#F7F5F0]"
          type="password"
          value={token}
          onChange={(event) => setToken(event.target.value)}
          autoComplete="current-password"
          required
        />
      </label>
      <button type="submit" className="button button-primary w-full" disabled={isDownloading}>
        {isDownloading ? "Preparing download..." : "Download daily CSV"} <Download size={18} />
      </button>
      <p className="min-h-6 text-center text-sm font-semibold text-[#AFBAC7]" aria-live="polite">
        {message}
      </p>
    </form>
  );
}
