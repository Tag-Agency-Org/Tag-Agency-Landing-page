import { getCloudflareContext } from "@opennextjs/cloudflare";
import { getUtcDateBounds, hasValidBearerToken, leadsToCsv, listLeadsForDate } from "@/lib/leads";

export async function GET(request: Request) {
  const { env } = await getCloudflareContext({ async: true });
  const adminToken = (env as CloudflareEnv & { LEADS_ADMIN_TOKEN?: string }).LEADS_ADMIN_TOKEN;

  if (!hasValidBearerToken(request.headers.get("authorization"), adminToken)) {
    return new Response("Unauthorized", {
      status: 401,
      headers: {
        "WWW-Authenticate": 'Bearer realm="TAG Agency Leads"',
        "Cache-Control": "private, no-store"
      }
    });
  }

  const date = new URL(request.url).searchParams.get("date") || "";
  try {
    getUtcDateBounds(date);
  } catch {
    return new Response("Use a valid date in YYYY-MM-DD format", {
      status: 400,
      headers: { "Cache-Control": "private, no-store" }
    });
  }

  try {
    const leads = await listLeadsForDate(env.LEADS_DB, date);
    return new Response(leadsToCsv(leads), {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="tag-agency-leads-${date}.csv"`,
        "Cache-Control": "private, no-store",
        "X-Content-Type-Options": "nosniff"
      }
    });
  } catch (error) {
    console.error("Could not export D1 leads", error);
    return new Response("Could not export leads right now", {
      status: 502,
      headers: { "Cache-Control": "private, no-store" }
    });
  }
}
