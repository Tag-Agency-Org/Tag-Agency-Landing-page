import { NextResponse } from "next/server";
import { clearAdminSessionCookie } from "@/lib/admin-session";

export async function POST() {
  return NextResponse.json(
    { success: true },
    {
      headers: {
        "Cache-Control": "private, no-store",
        "Set-Cookie": clearAdminSessionCookie()
      }
    }
  );
}
