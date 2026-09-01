"use client";

import { FormEvent, useState } from "react";

export function AdminLoginForm({ onLogin }: { onLogin(): void }) {
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setMessage("");
    try {
      const response = await fetch("/api/admin/auth/login", {
        method: "POST",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, password })
      });
      setPassword("");
      if (!response.ok) {
        setMessage("Invalid User ID or Password");
        return;
      }
      onLogin();
    } catch {
      setMessage("Unable to sign in right now.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="mt-8 grid gap-5" noValidate onSubmit={submit}>
      <label className="grid gap-2 text-sm font-bold">
        <span>User ID</span>
        <input className="form-input border-white/15 bg-white/5 text-[#F7F5F0]" autoComplete="username" value={userId} onChange={(event) => setUserId(event.target.value)} required />
      </label>
      <label className="grid gap-2 text-sm font-bold">
        <span>Password</span>
        <input className="form-input border-white/15 bg-white/5 text-[#F7F5F0]" autoComplete="current-password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} required />
      </label>
      <button className="button button-primary w-full" disabled={isSubmitting} type="submit">
        {isSubmitting ? "Signing in..." : "Sign in to leads"}
      </button>
      <p className="min-h-6 text-center text-sm font-semibold text-[#AFBAC7]" aria-live="polite">{message}</p>
    </form>
  );
}
