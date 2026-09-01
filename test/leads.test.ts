import assert from "node:assert/strict";
import test from "node:test";
import {
  csvCell,
  formatSubmittedAtIndia,
  getIndiaDateBounds,
  hasValidBearerToken,
  leadsToCsv
} from "../lib/leads.ts";

test("neutralizes formula-like values before CSV export", () => {
  assert.equal(csvCell('=HYPERLINK("https://example.com")'), `"'=HYPERLINK(""https://example.com"")"`);
  assert.equal(csvCell("+919876543210"), "'+919876543210");
});

test("quotes CSV punctuation while retaining the lead value", () => {
  assert.equal(csvCell('TAG Agency, "Hubballi"'), '"TAG Agency, ""Hubballi"""');
});

test("creates an Excel-ready daily CSV with all stored lead fields", () => {
  const csv = leadsToCsv([
    {
      id: 1,
      submitted_at: "2026-08-31T05:00:00.000Z",
      full_name: "Swaraj JD",
      business_name: "TAG Agency",
      phone: "9876543210",
      email: "hello@tagagency.in",
      industry: "Real Estate",
      monthly_budget: "Below ₹25,000",
      city: "Bengaluru",
      page_url: "https://www.tagagency.in/?utm_source=meta",
      utm_source: "meta",
      utm_medium: "paid_social",
      utm_campaign: "august",
      utm_content: "creative-a",
      utm_term: "real-estate",
      referrer_url: "https://www.facebook.com/"
    }
  ]);

  assert.match(csv, /^ID,Submitted at,Full name,Business name,Phone,Email,Industry,Monthly advertising budget,Page URL,UTM source,UTM medium,UTM campaign,UTM content,UTM term,Referrer URL,City,Captured at IST\r\n/);
  assert.match(csv, /1,2026-08-31T05:00:00.000Z,Swaraj JD,TAG Agency,9876543210,hello@tagagency.in/);
});

test("uses India midnight for a selected lead date", () => {
  assert.deepEqual(getIndiaDateBounds("2026-09-01"), {
    start: "2026-08-31T18:30:00.000Z",
    end: "2026-09-01T18:30:00.000Z"
  });
});

test("keeps India date bounds valid beyond the four-digit year boundary", () => {
  assert.deepEqual(getIndiaDateBounds("9999-12-31"), {
    start: "9999-12-30T18:30:00.000Z",
    end: "9999-12-31T18:30:00.000Z"
  });
});

test("rejects malformed export dates", () => {
  assert.throws(() => getIndiaDateBounds("31-08-2026"), /YYYY-MM-DD/);
  assert.throws(() => getIndiaDateBounds("2026-02-30"), /valid calendar date/);
});

test("includes city and India capture time in CSV", () => {
  const csv = leadsToCsv([
    {
      id: 1,
      submitted_at: "2026-08-31T18:30:00.000Z",
      full_name: "Swaraj JD",
      business_name: "TAG Agency",
      phone: "9876543210",
      email: "hello@tagagency.in",
      industry: "Real Estate",
      monthly_budget: "Below ₹25,000",
      city: "Bengaluru",
      page_url: "https://www.tagagency.in/",
      utm_source: "",
      utm_medium: "",
      utm_campaign: "",
      utm_content: "",
      utm_term: "",
      referrer_url: ""
    }
  ]);

  assert.match(csv, /City,Captured at IST/);
});

test("formats submitted timestamps in India Standard Time for CSV", () => {
  assert.match(formatSubmittedAtIndia("2026-08-31T18:30:00.000Z"), /1 Sept 2026.*12:00:00 am IST/);
});

test("accepts only the exact administrator bearer token", () => {
  assert.equal(hasValidBearerToken("Bearer private-token", "private-token"), true);
  assert.equal(hasValidBearerToken("Bearer private-token-extra", "private-token"), false);
  assert.equal(hasValidBearerToken("Basic private-token", "private-token"), false);
  assert.equal(hasValidBearerToken(null, "private-token"), false);
});
