import { NextResponse } from "next/server";

const requiredFields = ["fullName", "phone", "email", "consent"] as const;

export async function GET() {
  return NextResponse.json({
    ok: true,
    googleScriptConfigured: Boolean(getGoogleScriptUrl())
  });
}

export async function POST(request: Request) {
  // Keep the Apps Script endpoint on the server so it is not exposed in browser bundles.
  const googleScriptUrl = getGoogleScriptUrl();

  if (!googleScriptUrl) {
    console.error("GOOGLE_APPS_SCRIPT_WEB_APP_URL is missing");
    return NextResponse.json({ success: false, message: "Lead capture endpoint is not configured" }, { status: 500 });
  }

  let payload: Record<string, unknown>;
  try {
    payload = await request.json();
  } catch {
    console.error("Lead submission failed: invalid request body");
    return NextResponse.json({ success: false, message: "Invalid request body" }, { status: 400 });
  }

  const missingField = requiredFields.find((field) => !String(payload[field] || "").trim());
  if (missingField) {
    console.error("Lead submission failed: missing required field", { missingField });
    return NextResponse.json({ success: false, message: `Missing required field: ${missingField}` }, { status: 400 });
  }

  try {
    const response = await fetch(googleScriptUrl, {
      method: "POST",
      headers: {
        "Content-Type": "text/plain;charset=utf-8"
      },
      body: JSON.stringify(payload)
    });

    const responseText = await response.text();
    const data = responseText ? parseJsonResponse(responseText) : null;

    if (!response.ok || data?.success === false) {
      console.error("Google Apps Script rejected the lead", {
        status: response.status,
        responseText: safeLogText(responseText || response.statusText)
      });
      return NextResponse.json(
        { success: false, message: "Google Apps Script rejected the lead" },
        { status: 502 }
      );
    }

    console.info("Lead forwarded to Google Apps Script", { status: response.status });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Could not forward lead to Google Apps Script", error);
    return NextResponse.json({ success: false, message: "Could not forward lead to Google Apps Script" }, { status: 502 });
  }
}

function getGoogleScriptUrl() {
  const rawValue = process.env.GOOGLE_APPS_SCRIPT_WEB_APP_URL || process.env.GOOGLE_SCRIPT_URL;
  if (!rawValue) return "";

  let value = rawValue.trim();
  const assignmentPrefix = /^(?:GOOGLE_APPS_SCRIPT_WEB_APP_URL|GOOGLE_SCRIPT_URL)\s*=\s*/;
  value = value.replace(assignmentPrefix, "").trim();

  if (
    (value.startsWith('"') && value.endsWith('"')) ||
    (value.startsWith("'") && value.endsWith("'"))
  ) {
    value = value.slice(1, -1).trim();
  }

  try {
    const url = new URL(value);
    if (url.protocol !== "https:" || url.hostname !== "script.google.com" || !url.pathname.endsWith("/exec")) {
      console.error("Google Apps Script URL has an invalid origin or path");
      return "";
    }

    return url.toString();
  } catch {
    console.error("Google Apps Script URL is invalid");
    return "";
  }
}

function parseJsonResponse(responseText: string) {
  try {
    return JSON.parse(responseText) as { success?: boolean };
  } catch {
    return null;
  }
}

function safeLogText(value: string) {
  return value.replace(/[\u0000-\u001F\u007F]/g, " ").trim().slice(0, 500);
}
