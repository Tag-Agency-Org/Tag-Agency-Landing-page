import { NextResponse } from "next/server";

const requiredFields = ["fullName", "phone", "email", "consent"] as const;

export async function POST(request: Request) {
  // Keep the Apps Script endpoint on the server so it is not exposed in browser bundles.
  const googleScriptUrl = process.env.GOOGLE_APPS_SCRIPT_WEB_APP_URL || process.env.GOOGLE_SCRIPT_URL;

  if (!googleScriptUrl) {
    return NextResponse.json({ success: false, message: "Lead capture endpoint is not configured" }, { status: 500 });
  }

  let payload: Record<string, unknown>;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ success: false, message: "Invalid request body" }, { status: 400 });
  }

  const missingField = requiredFields.find((field) => !String(payload[field] || "").trim());
  if (missingField) {
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
      console.error("Lead submission failed:", data || responseText || response.statusText);
      return NextResponse.json(
        { success: false, message: "Google Apps Script rejected the lead", detail: data },
        { status: 502 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Lead submission failed:", error);
    return NextResponse.json({ success: false, message: "Could not forward lead to Google Apps Script" }, { status: 502 });
  }
}

function parseJsonResponse(responseText: string) {
  try {
    return JSON.parse(responseText) as { success?: boolean };
  } catch {
    return null;
  }
}
