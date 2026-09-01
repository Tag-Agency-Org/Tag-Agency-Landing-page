import { getCloudflareContext } from "@opennextjs/cloudflare";
import { NextResponse } from "next/server";
import { isValidAdminSession } from "@/lib/admin-session";
import { cityCoordinates } from "@/lib/indian-cities";
import { getIndiaDateBounds, listLeadsForDate } from "@/lib/leads";

const PRIVATE_HEADERS = { "Cache-Control": "private, no-store" };
const SESSION_COOKIE = "tag_agency_leads_session";

export async function GET(request: Request) {
  const { env } = await getCloudflareContext({ async: true });
  const session = sessionTokenFromRequest(request);

  if (!await isValidAdminSession(session, env.LEADS_ADMIN_SESSION_SECRET, Date.now())) {
    return new Response("Unauthorized", { status: 401, headers: PRIVATE_HEADERS });
  }

  const date = new URL(request.url).searchParams.get("date") ?? "";
  try {
    getIndiaDateBounds(date);
  } catch {
    return new Response("Use a valid date in YYYY-MM-DD format", {
      status: 400,
      headers: PRIVATE_HEADERS
    });
  }

  try {
    const leads = await listLeadsForDate(env.LEADS_DB, date);
    const mappedLeads = leads.map((lead) => {
      const coordinates = lead.city ? cityCoordinates(lead.city) : undefined;
      return coordinates ? { ...lead, coordinates } : lead;
    });

    return NextResponse.json(
      { date, count: mappedLeads.length, leads: mappedLeads },
      { headers: PRIVATE_HEADERS }
    );
  } catch (error) {
    console.error("Could not list D1 leads", error);
    return new Response("Could not load leads right now", {
      status: 502,
      headers: PRIVATE_HEADERS
    });
  }
}

function sessionTokenFromRequest(request: Request) {
  const cookieHeader = request.headers.get("cookie") ?? "";
  for (const part of cookieHeader.split(";")) {
    const [name, ...valueParts] = part.trim().split("=");
    if (name === SESSION_COOKIE) return valueParts.join("=") || null;
  }
  return null;
}
