"use client";

import { useState } from "react";
import { AdminLoginForm } from "./AdminLoginForm";
import { LeadDashboard } from "./LeadDashboard";

export function LeadAdminArea() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  return isLoggedIn ? <LeadDashboard onLogout={() => setIsLoggedIn(false)} /> : <AdminLoginForm onLogin={() => setIsLoggedIn(true)} />;
}
