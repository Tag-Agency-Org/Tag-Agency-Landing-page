import { getCloudflareContext } from "@opennextjs/cloudflare";
import { NextResponse } from "next/server";
import { findIndianCity } from "@/lib/indian-cities";
import { leadSubmissionSchema } from "@/lib/lead-validation";
import { insertLead, type LeadTracking } from "@/lib/leads";

export async function GET() {
  return NextResponse.json({
    ok: true,
    storage: "d1"
  });
}

export async function POST(request: Request) {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    console.error("Lead submission failed: invalid request body");
    return NextResponse.json({ success: false, message: "Invalid request body" }, { status: 400 });
  }

  const validation = leadSubmissionSchema.safeParse(payload);
  if (!validation.success) {
    const invalidField = validation.error.issues[0]?.path[0] || "submission";
    console.error("Lead submission failed: invalid field", { invalidField });
    return NextResponse.json({ success: false, message: `Invalid field: ${invalidField}` }, { status: 400 });
  }

  const city = findIndianCity(validation.data.city);
  if (!city) {
    console.error("Lead submission failed: invalid field", { invalidField: "city" });
    return NextResponse.json({ success: false, message: "Invalid field: city" }, { status: 400 });
  }

  try {
    const { env } = await getCloudflareContext({ async: true });
    await insertLead(
      env.LEADS_DB,
      { ...validation.data, city: city.name },
      trackingFromPayload(payload)
    );
    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    console.error("Could not store lead in Cloudflare D1", error);
    return NextResponse.json({ success: false, message: "Could not save your enquiry right now" }, { status: 502 });
  }
}

function trackingFromPayload(payload: unknown): LeadTracking {
  const source = typeof payload === "object" && payload !== null ? payload as Record<string, unknown> : {};
  return {
    pageUrl: textValue(source.pageUrl),
    utmSource: textValue(source.utmSource),
    utmMedium: textValue(source.utmMedium),
    utmCampaign: textValue(source.utmCampaign),
    utmContent: textValue(source.utmContent),
    utmTerm: textValue(source.utmTerm),
    referrerUrl: textValue(source.referrerUrl)
  };
}

function textValue(value: unknown) {
  return typeof value === "string" ? value : undefined;
}
