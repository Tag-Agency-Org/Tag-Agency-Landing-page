# Cloudflare D1 Lead Storage Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Store TAG Agency form submissions in the deployed Cloudflare Worker’s D1 database and let the owner download a selected day’s leads as a protected CSV file.

**Architecture:** The public `POST /api/leads` route keeps the shared Zod validation and inserts a validated lead plus UTM/referrer context into D1 via the OpenNext Cloudflare context. An unlinked `/admin/leads` page accepts an administrator token only in browser memory and uses it for a server-side CSV export route; the export route checks a Cloudflare Worker secret before querying D1.

**Tech Stack:** Next.js 15 App Router, React 19, TypeScript, Zod, OpenNext for Cloudflare Workers, Cloudflare D1, Wrangler 4.

**Spec:** User request in this conversation: replace Google Apps Script/Gmail/Google Sheets lead delivery with Cloudflare-hosted storage and daily downloadable leads; user authorized implementation and deployment in the TAG Agency Cloudflare account.

## Global Constraints

- Store only the form values accepted by `leadSubmissionSchema` and the existing UTM/referrer context.
- Use prepared D1 statements; never interpolate visitor input into SQL.
- Do not expose lead rows from an unauthenticated route or cache CSV responses.
- Protect the CSV route with the `LEADS_ADMIN_TOKEN` Worker secret; never commit the token.
- Preserve the thank-you redirect only after a successful D1 insert.
- Do not migrate or delete historical Google Sheet leads in this change.
- Remove the Google Apps Script runtime dependency after D1 insert and CSV download are validated.
- Treat code push, Worker deployment, and cache-busted public-domain verification as separate release gates.

---

### Task 1: Create the D1 schema and Worker binding

**Files:**
- Create: `migrations/0001_create_leads.sql`
- Modify: `wrangler.jsonc`
- Create: `cloudflare-env.d.ts`

**Interfaces:**
- Produces: `CloudflareEnv.LEADS_DB: D1Database` for the Worker binding.
- Produces: a `leads` table indexed by immutable submission time.

- [ ] **Step 1: Add a migration contract check**

Run `test -f migrations/0001_create_leads.sql` and confirm it fails because the migration is absent.

- [ ] **Step 2: Create and bind the D1 database**

Run `npx wrangler d1 create tag-agency-leads`. Add the returned UUID to the `LEADS_DB` binding in `wrangler.jsonc` with `migrations_dir: "migrations"`.

- [ ] **Step 3: Add and apply the schema migration**

```sql
CREATE TABLE IF NOT EXISTS leads (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  submitted_at TEXT NOT NULL,
  full_name TEXT NOT NULL,
  business_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  industry TEXT NOT NULL,
  monthly_budget TEXT NOT NULL,
  page_url TEXT NOT NULL,
  utm_source TEXT NOT NULL DEFAULT '',
  utm_medium TEXT NOT NULL DEFAULT '',
  utm_campaign TEXT NOT NULL DEFAULT '',
  utm_content TEXT NOT NULL DEFAULT '',
  utm_term TEXT NOT NULL DEFAULT '',
  referrer_url TEXT NOT NULL DEFAULT ''
);
CREATE INDEX IF NOT EXISTS idx_leads_submitted_at ON leads(submitted_at DESC);
```

Run `npx wrangler d1 migrations apply tag-agency-leads --local`, `npx wrangler d1 migrations apply tag-agency-leads --remote`, and `npm run cf-typegen`.

### Task 2: Replace Google forwarding with a D1 insert

**Files:**
- Create: `lib/leads.ts`
- Modify: `app/api/leads/route.ts`, `.env.example`, and `docs/form-integration.md`
- Test: `test/leads.test.ts`

**Interfaces:**
- Consumes: `leadSubmissionSchema`, `CloudflareEnv.LEADS_DB`, and request tracking fields.
- Produces: `insertLead(db, lead, tracking): Promise<void>` and HTTP `201 { success: true }` after a durable insert.

- [ ] **Step 1: Write a failing test**

```ts
test("escapes formula-like lead values before CSV export", () => {
  assert.equal(csvCell("=HYPERLINK(\"https://example.com\")"), "'=HYPERLINK(\"https://example.com\")");
});
```

Run `node --experimental-strip-types --test test/leads.test.ts` and confirm it fails because `csvCell` is absent.

- [ ] **Step 2: Implement lead persistence**

Use `db.prepare("INSERT INTO leads (...) VALUES (?, ...)").bind(...values).run()` in `lib/leads.ts`; then replace the Apps Script configuration check and `fetch` with `getCloudflareContext({ async: true }).env.LEADS_DB` and `insertLead`.

- [ ] **Step 3: Verify the route’s shared contract**

Run `node --experimental-strip-types --test test/leads.test.ts test/lead-validation.test.ts` and confirm all tests pass.

### Task 3: Build the protected daily CSV download

**Files:**
- Create: `app/api/admin/leads/export/route.ts`, `app/admin/leads/page.tsx`, and `components/LeadExportForm.tsx`
- Modify: `lib/leads.ts`
- Test: `test/leads.test.ts`

**Interfaces:**
- Consumes: `LEADS_DB` and the `LEADS_ADMIN_TOKEN` Worker secret.
- Produces: `GET /api/admin/leads/export?date=YYYY-MM-DD` as a no-store CSV attachment for authorized requests only.

- [ ] **Step 1: Write a failing CSV test**

```ts
test("creates an Excel-ready daily CSV", () => {
  const csv = leadsToCsv([{ id: 1, submitted_at: "2026-08-31T05:00:00.000Z", full_name: "Swaraj JD" }]);
  assert.match(csv, /Submitted at,Full name/);
  assert.match(csv, /Swaraj JD/);
});
```

Run `node --experimental-strip-types --test test/leads.test.ts` and confirm it fails because `leadsToCsv` is absent.

- [ ] **Step 2: Implement CSV and the export endpoint**

CSV cells must quote commas, quotes, and newlines and prefix values beginning `=`, `+`, `-`, or `@` with an apostrophe. The endpoint must verify `Authorization: Bearer <LEADS_ADMIN_TOKEN>`, query only the selected UTC date range with a prepared statement, and return `Content-Disposition: attachment` plus `Cache-Control: private, no-store`.

- [ ] **Step 3: Implement the unlinked admin download page**

Default the date field to today, collect the token with a password input, send it only as the authorization header, and download the returned CSV Blob. Do not use local storage, cookies, or query parameters for the token.

- [ ] **Step 4: Verify behavior**

Run `node --experimental-strip-types --test test/leads.test.ts test/lead-validation.test.ts` and confirm all tests pass.

### Task 4: Configure, release, and prove the live behavior

**Files:**
- Modify: `.env.example` and `docs/form-integration.md`

**Interfaces:**
- Consumes: the deployed `LEADS_ADMIN_TOKEN` Worker secret.
- Produces: a deployed Worker where public submissions write to D1 and daily CSV download requires the secret.

- [ ] **Step 1: Set the Worker secret**

Run `openssl rand -base64 32 | npx wrangler secret put LEADS_ADMIN_TOKEN`. Record the generated token for the owner; do not commit it.

- [ ] **Step 2: Run complete validation**

Run `npm run build`, `npx opennextjs-cloudflare build`, `npx wrangler deploy --dry-run`, and `git diff --check`. Each must exit 0.

- [ ] **Step 3: Commit, push, deploy, and verify**

Commit only the D1 lead-storage files, push the committed branch, deploy with `npx wrangler deploy`, and cache-bust `https://www.tagagency.in`. Verify no removed field marker is served, the unauthenticated export returns HTTP 401, one controlled valid form submission creates exactly one D1 row, and the authorized admin page downloads that row as CSV.

## Plan review

- **Spec coverage:** Tasks 1–2 create durable storage and replace Google forwarding; Task 3 supplies the secure daily CSV download; Task 4 protects, releases, and verifies the feature on the public domain.
- **No placeholders:** The table, binding, prepared insert requirement, authorization scheme, CSV safety rules, secret name, and release checks are explicit.
- **Type consistency:** `CloudflareEnv.LEADS_DB`, `insertLead`, `csvCell`, and `leadsToCsv` have one responsibility and are introduced before their consumers.
