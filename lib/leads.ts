import type { LeadFormValues } from "./lead-validation";

export type LeadTracking = {
  pageUrl?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmContent?: string;
  utmTerm?: string;
  referrerUrl?: string;
};

export type LeadRecord = {
  id: number;
  submitted_at: string;
  full_name: string;
  business_name: string;
  phone: string;
  email: string;
  industry: string;
  monthly_budget: string;
  city: string | null;
  page_url: string;
  utm_source: string;
  utm_medium: string;
  utm_campaign: string;
  utm_content: string;
  utm_term: string;
  referrer_url: string;
};

const leadColumns = [
  ["ID", "id"],
  ["Submitted at", "submitted_at"],
  ["Full name", "full_name"],
  ["Business name", "business_name"],
  ["Phone", "phone"],
  ["Email", "email"],
  ["Industry", "industry"],
  ["Monthly advertising budget", "monthly_budget"],
  ["Page URL", "page_url"],
  ["UTM source", "utm_source"],
  ["UTM medium", "utm_medium"],
  ["UTM campaign", "utm_campaign"],
  ["UTM content", "utm_content"],
  ["UTM term", "utm_term"],
  ["Referrer URL", "referrer_url"],
  ["City", "city"]
] as const satisfies ReadonlyArray<readonly [string, keyof LeadRecord]>;

const insertLeadStatement = `
  INSERT INTO leads (
    submitted_at,
    full_name,
    business_name,
    phone,
    email,
    industry,
    monthly_budget,
    city,
    page_url,
    utm_source,
    utm_medium,
    utm_campaign,
    utm_content,
    utm_term,
    referrer_url
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`;

const selectLeadsForDateStatement = `
  SELECT
    id,
    submitted_at,
    full_name,
    business_name,
    phone,
    email,
    industry,
    monthly_budget,
    city,
    page_url,
    utm_source,
    utm_medium,
    utm_campaign,
    utm_content,
    utm_term,
    referrer_url
  FROM leads
  WHERE submitted_at >= ? AND submitted_at < ?
  ORDER BY submitted_at DESC, id DESC
`;

export async function insertLead(db: D1Database, lead: LeadFormValues, tracking: LeadTracking) {
  const result = await db
    .prepare(insertLeadStatement)
    .bind(
      new Date().toISOString(),
      lead.fullName,
      lead.businessName,
      lead.phone,
      lead.email,
      lead.industry,
      lead.monthlyBudget,
      lead.city,
      trackingValue(tracking.pageUrl),
      trackingValue(tracking.utmSource),
      trackingValue(tracking.utmMedium),
      trackingValue(tracking.utmCampaign),
      trackingValue(tracking.utmContent),
      trackingValue(tracking.utmTerm),
      trackingValue(tracking.referrerUrl)
    )
    .run();

  if (!result.success) {
    throw new Error("D1 did not confirm the lead insert");
  }
}

export async function listLeadsForDate(db: D1Database, date: string) {
  const { start, end } = getIndiaDateBounds(date);
  const result = await db.prepare(selectLeadsForDateStatement).bind(start, end).all<LeadRecord>();

  if (!result.success) {
    throw new Error("D1 did not return the requested leads");
  }

  return result.results;
}

export function getIndiaDateBounds(date: string) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(date);
  if (!match) throw new Error("Date must use YYYY-MM-DD");

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const startDate = new Date(Date.UTC(year, month - 1, day));

  if (
    startDate.getUTCFullYear() !== year ||
    startDate.getUTCMonth() !== month - 1 ||
    startDate.getUTCDate() !== day
  ) {
    throw new Error("Date must be a valid calendar date");
  }

  const nextDate = new Date(Date.UTC(year, month - 1, day + 1)).toISOString().slice(0, 10);
  return {
    start: new Date(`${date}T00:00:00+05:30`).toISOString(),
    end: new Date(`${nextDate}T00:00:00+05:30`).toISOString()
  };
}

export function getUtcDateBounds(date: string) {
  return getIndiaDateBounds(date);
}

export function formatSubmittedAtIndia(utcTimestamp: string) {
  const dateTime = new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "medium",
    timeZone: "Asia/Kolkata"
  }).format(new Date(utcTimestamp));
  const timeZoneName = new Intl.DateTimeFormat("en-IN", {
    timeZone: "Asia/Kolkata",
    timeZoneName: "short"
  })
    .formatToParts(new Date(utcTimestamp))
    .find((part) => part.type === "timeZoneName")?.value;

  return timeZoneName ? `${dateTime} ${timeZoneName}` : dateTime;
}

export function csvCell(value: unknown) {
  const text = String(value ?? "");
  const neutralized = /^[=+\-@]/.test(text) ? `'${text}` : text;
  return /[",\r\n]/.test(neutralized) ? `"${neutralized.replace(/"/g, '""')}"` : neutralized;
}

export function leadsToCsv(leads: LeadRecord[]) {
  const header = [...leadColumns.map(([label]) => csvCell(label)), "Captured at IST"].join(",");
  const rows = leads.map((lead) => [
    ...leadColumns.map(([, key]) => csvCell(lead[key])),
    csvCell(formatSubmittedAtIndia(lead.submitted_at))
  ].join(","));
  return [header, ...rows].join("\r\n") + "\r\n";
}

export function hasValidBearerToken(authorizationHeader: string | null, expectedToken: string | undefined) {
  if (!expectedToken) return false;

  const match = /^Bearer (.+)$/.exec(authorizationHeader || "");
  if (!match || match[1].length !== expectedToken.length) return false;

  let difference = 0;
  for (let index = 0; index < expectedToken.length; index += 1) {
    difference |= match[1].charCodeAt(index) ^ expectedToken.charCodeAt(index);
  }

  return difference === 0;
}

function trackingValue(value: string | undefined) {
  return typeof value === "string" ? value.replace(/[\u0000-\u001F\u007F]/g, "").trim().slice(0, 2_000) : "";
}
