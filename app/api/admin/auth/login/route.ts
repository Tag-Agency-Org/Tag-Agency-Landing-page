import { getCloudflareContext } from "@opennextjs/cloudflare";
import { NextResponse } from "next/server";
import {
  adminSessionCookie,
  createAdminSession,
  hasValidAdminCredentials
} from "@/lib/admin-session";

const PRIVATE_HEADERS = { "Cache-Control": "private, no-store" };

export async function POST(request: Request) {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return invalidCredentialsResponse();
  }

  if (!isLoginPayload(payload)) return invalidCredentialsResponse();

  const { env } = await getCloudflareContext({ async: true });
  const sessionSecret = env.LEADS_ADMIN_SESSION_SECRET;
  if (!sessionSecret || !hasValidAdminCredentials(payload.userId, payload.password, env)) {
    return invalidCredentialsResponse();
  }

  const session = await createAdminSession(Date.now(), sessionSecret);
  return NextResponse.json(
    { success: true },
    {
      headers: {
        ...PRIVATE_HEADERS,
        "Set-Cookie": adminSessionCookie(session)
      }
    }
  );
}

function isLoginPayload(payload: unknown): payload is { userId: string; password: string } {
  if (typeof payload !== "object" || payload === null || Array.isArray(payload)) return false;
  const record = payload as Record<string, unknown>;
  return typeof record.userId === "string" && typeof record.password === "string";
}

function invalidCredentialsResponse() {
  return NextResponse.json(
    { success: false, message: "Invalid User ID or Password" },
    { status: 401, headers: PRIVATE_HEADERS }
  );
}
