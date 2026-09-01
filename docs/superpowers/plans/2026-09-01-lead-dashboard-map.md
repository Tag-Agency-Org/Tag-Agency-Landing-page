# Lead Dashboard and India Map Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox syntax for tracking.

**Goal:** Replace the token-entry lead download page with a secure, India-time lead dashboard that displays and exports D1 leads, captures a validated Indian city, and maps selected lead locations.

**Architecture:** A public city-suggestion route reads a committed GeoNames-derived India city directory; the lead API validates the selected canonical city and writes it to D1. A signed HttpOnly session cookie protects owner login, list, and CSV routes. The client dashboard fetches authorized lead data for an India-calendar date and renders a dynamic Leaflet/OpenStreetMap map alongside its table.

**Tech Stack:** Next.js 15 App Router, React 19, TypeScript, React Hook Form, Zod, Cloudflare Workers/D1/Web Crypto, react-leaflet, Leaflet, OpenStreetMap tiles, Node test runner.

**Spec:** docs/superpowers/specs/2026-09-01-lead-dashboard-map-design.md

## Global Constraints

- Store all new website leads only in Cloudflare D1 database tag-agency-leads; do not modify or import historical Google Sheet data.
- Keep historic D1 lead rows readable; their City value must render as City not captured and must not create a map pin.
- Require City for all new form API submissions and accept only a canonical entry from the committed India city directory.
- Use Asia/Kolkata calendar bounds for all selected-date lead lists and CSV exports; retain the immutable UTC submitted_at database value.
- Store LEADS_ADMIN_USERNAME, LEADS_ADMIN_PASSWORD, and LEADS_ADMIN_SESSION_SECRET only as Cloudflare Worker secrets. Never expose them in client code, URLs, local storage, source control, or logs.
- Use an eight-hour signed, HttpOnly, Secure, SameSite=Strict session cookie. Every endpoint returning lead data must reject absent, expired, malformed, or forged sessions with 401 and Cache-Control: private, no-store.
- Use Leaflet CircleMarkers, not image icons; render the map client-only; include OpenStreetMap attribution; never send lead PII in tile requests.
- Preserve CSV formula neutralization, add City and the exact IST capture time, and use attachment/no-store response headers.
- Preserve the simplified public form: do not restore Qualified enquiry, Primary Requirement, Message / Current Challenge, or consent-checkbox fields.

---

## File Structure

- data/indian-cities.json — committed GeoNames-derived city catalogue with canonical city name, state, latitude, and longitude.
- lib/indian-cities.ts — read-only city search, canonical lookup, and coordinate lookup functions.
- lib/lead-validation.ts — shared lead-field shape and City syntax validation.
- lib/leads.ts — D1 inserts/listing, India-time bounds, IST formatting, and CSV construction.
- lib/admin-session.ts — constant-time credential comparison, HMAC session signing/verification, and cookie helpers.
- migrations/0002_add_lead_city.sql — additive nullable City D1 migration.
- app/api/cities/route.ts — public limited city-autocomplete response.
- app/api/admin/auth/login/route.ts and logout/route.ts — session creation and invalidation.
- app/api/admin/leads/route.ts — session-protected JSON lead list for the dashboard.
- app/api/admin/leads/export/route.ts — session-protected selected-date CSV download.
- components/CityAutocomplete.tsx — accessible city input, real-time suggestions, and selected canonical value.
- components/LeadDashboard.tsx and components/IndiaLeadMap.tsx — authenticated table and map interaction.
- components/AdminLoginForm.tsx — credential form and generic error state.
- app/admin/leads/page.tsx — private page composition.

### Task 1: Build the Indian city directory and lookup boundary

**Files:**
- Create: data/indian-cities.json
- Create: lib/indian-cities.ts
- Create: test/indian-cities.test.ts

**Interfaces:**
- Produces IndianCity with name, state, latitude, and longitude.
- Produces searchIndianCities(query, limit), findIndianCity(name), and cityCoordinates(name).
- Consumed by the city API, public lead route, and dashboard mapping transform.

- [ ] **Step 1: Write the failing city-lookup tests**

~~~ts
import assert from "node:assert/strict";
import test from "node:test";
import { findIndianCity, searchIndianCities } from "../lib/indian-cities.ts";

test("returns canonical city suggestions without case-sensitive matching", () => {
  const suggestions = searchIndianCities("beng", 8);
  assert.equal(suggestions[0]?.name, "Bengaluru");
  assert.deepEqual(findIndianCity("bengaluru"), suggestions[0]);
});

test("does not resolve unlisted city text", () => {
  assert.equal(findIndianCity("Not A City"), undefined);
  assert.deepEqual(searchIndianCities("xqzz", 8), []);
});
~~~

- [ ] **Step 2: Run the test to verify it fails**

Run: node --experimental-strip-types --test test/indian-cities.test.ts

Expected: FAIL because lib/indian-cities.ts does not exist.

- [ ] **Step 3: Create the committed India-only catalogue and lookup implementation**

Download official GeoNames cities15000 data during development, retain country-code IN rows, map Unicode city name, admin-1 state code, latitude, and longitude, then de-duplicate normalized names and commit the generated JSON. Do not fetch the source at site runtime.

~~~ts
import cities from "@/data/indian-cities.json";

export type IndianCity = { name: string; state: string; latitude: number; longitude: number };
const normalize = (value: string) =>
  value.normalize("NFKC").trim().replace(/\s+/g, " ").toLocaleLowerCase("en-IN");
const byName = new Map(cities.map((city) => [normalize(city.name), city]));

export function findIndianCity(name: string) {
  return byName.get(normalize(name));
}

export function searchIndianCities(query: string, limit = 8) {
  const needle = normalize(query);
  return needle.length < 2 ? [] : cities.filter((city) => normalize(city.name).startsWith(needle)).slice(0, limit);
}

export function cityCoordinates(name: string) {
  const city = findIndianCity(name);
  return city ? { latitude: city.latitude, longitude: city.longitude } : undefined;
}
~~~

- [ ] **Step 4: Run city tests to verify they pass**

Run: node --experimental-strip-types --test test/indian-cities.test.ts

Expected: PASS.

- [ ] **Step 5: Commit**

~~~bash
git add data/indian-cities.json lib/indian-cities.ts test/indian-cities.test.ts
git commit -m "feat: add Indian city lookup"
~~~

### Task 2: Validate and persist City with India-time lead data

**Files:**
- Create: migrations/0002_add_lead_city.sql
- Modify: lib/lead-validation.ts
- Modify: lib/leads.ts
- Modify: test/lead-validation.test.ts
- Modify: test/leads.test.ts

**Interfaces:**
- Produces LeadFormValues.city, LeadRecord.city, getIndiaDateBounds(date), and formatSubmittedAtIndia(utcTimestamp).
- insertLead writes lead.city; listLeadsForDate uses India-time bounds.

- [ ] **Step 1: Write failing schema, time-boundary, and CSV tests**

~~~ts
test("requires a city in every new lead", () => {
  assert.equal(leadFormSchema.safeParse(validLead).success, false);
  assert.equal(leadFormSchema.safeParse({ ...validLead, city: "Bengaluru" }).success, true);
});

test("uses India midnight for a selected lead date", () => {
  assert.deepEqual(getIndiaDateBounds("2026-09-01"), {
    start: "2026-08-31T18:30:00.000Z",
    end: "2026-09-01T18:30:00.000Z"
  });
});

test("includes city and India capture time in CSV", () => {
  const csv = leadsToCsv([{ ...exampleLead, city: "Bengaluru" }]);
  assert.match(csv, /City,Captured at IST/);
});
~~~

- [ ] **Step 2: Run tests to verify they fail**

Run: node --experimental-strip-types --test test/lead-validation.test.ts test/leads.test.ts

Expected: FAIL because City, India date bounds, and the CSV columns do not exist.

- [ ] **Step 3: Add migration and minimal data implementation**

~~~sql
ALTER TABLE leads ADD COLUMN city TEXT;
CREATE INDEX IF NOT EXISTS idx_leads_city_submitted_at ON leads(city, submitted_at DESC);
~~~

Add a trimmed 2–100 character City schema to leadFormSchema. Add city to D1 record type, insert column/bind values, select SQL, and CSV list. Use this India midnight implementation after strict YYYY-MM-DD calendar validation:

~~~ts
export function getIndiaDateBounds(date: string) {
  assertValidDate(date);
  const [year, month, day] = date.split("-").map(Number);
  const nextDate = new Date(Date.UTC(year, month - 1, day + 1)).toISOString().slice(0, 10);
  return {
    start: new Date(date + "T00:00:00+05:30").toISOString(),
    end: new Date(nextDate + "T00:00:00+05:30").toISOString()
  };
}
~~~

Use Intl.DateTimeFormat with locale en-IN, timeZone Asia/Kolkata, dateStyle medium, timeStyle medium, and timeZoneName short for the CSV capture-time field.

- [ ] **Step 4: Apply locally and run tests**

Run: npx wrangler d1 migrations apply tag-agency-leads --local

Run: node --experimental-strip-types --test test/lead-validation.test.ts test/leads.test.ts

Expected: local migration applies 0002_add_lead_city.sql and tests PASS.

- [ ] **Step 5: Commit**

~~~bash
git add migrations/0002_add_lead_city.sql lib/lead-validation.ts lib/leads.ts test/lead-validation.test.ts test/leads.test.ts
git commit -m "feat: store lead cities in India time"
~~~

### Task 3: Add secure owner sessions

**Files:**
- Create: lib/admin-session.ts
- Create: test/admin-session.test.ts
- Modify: cloudflare-env.d.ts
- Modify: .env.example

**Interfaces:**
- Produces AdminSecrets with optional LEADS_ADMIN_USERNAME, LEADS_ADMIN_PASSWORD, and LEADS_ADMIN_SESSION_SECRET.
- Produces createAdminSession(expiresAt, secret), isValidAdminSession(token, secret, now), hasValidAdminCredentials(userId, password, secrets), adminSessionCookie(token), and clearAdminSessionCookie().

- [ ] **Step 1: Write failing authentication/session tests**

~~~ts
test("accepts only exact owner credentials", () => {
  const secrets = { LEADS_ADMIN_USERNAME: "tagagency-admin", LEADS_ADMIN_PASSWORD: "correct" };
  assert.equal(hasValidAdminCredentials("tagagency-admin", "correct", secrets), true);
  assert.equal(hasValidAdminCredentials("tagagency-admin", "wrong", secrets), false);
});

test("rejects session tampering and expiry", async () => {
  const token = await createAdminSession(1_800_000_000_000, "signing-secret");
  assert.equal(await isValidAdminSession(token, "signing-secret", 1_799_000_000_000), true);
  assert.equal(await isValidAdminSession(token + "x", "signing-secret", 1_799_000_000_000), false);
  assert.equal(await isValidAdminSession(token, "signing-secret", 1_800_000_000_001), false);
});
~~~

- [ ] **Step 2: Run test to verify it fails**

Run: node --experimental-strip-types --test test/admin-session.test.ts

Expected: FAIL because lib/admin-session.ts does not exist.

- [ ] **Step 3: Implement HMAC signing, verification, and cookie helpers**

Encode payload { v: 1, exp: number } as URL-safe base64 and sign it with HMAC-SHA-256 through crypto.subtle. Verify signature with crypto.subtle.verify and reject malformed/expired sessions. Use same-length XOR accumulation or crypto.subtle.timingSafeEqual for secret comparisons. Never log credentials.

~~~ts
export const ADMIN_SESSION_SECONDS = 8 * 60 * 60;
const SESSION_COOKIE = "tag_agency_leads_session";

export function adminSessionCookie(token: string) {
  return SESSION_COOKIE + "=" + token + "; Path=/; Max-Age=" + ADMIN_SESSION_SECONDS +
    "; HttpOnly; Secure; SameSite=Strict";
}

export function clearAdminSessionCookie() {
  return SESSION_COOKIE + "=; Path=/; Max-Age=0; HttpOnly; Secure; SameSite=Strict";
}
~~~

Add the three optional secrets to CloudflareEnv and replace old bearer-token configuration in .env.example.

- [ ] **Step 4: Run session tests and build**

Run: node --experimental-strip-types --test test/admin-session.test.ts

Run: npm run build

Expected: all session tests PASS and the build succeeds.

- [ ] **Step 5: Commit**

~~~bash
git add lib/admin-session.ts test/admin-session.test.ts cloudflare-env.d.ts .env.example
git commit -m "feat: add secure admin sessions"
~~~

### Task 4: Add city, login, list, and protected export routes

**Files:**
- Create: app/api/cities/route.ts
- Create: app/api/admin/auth/login/route.ts
- Create: app/api/admin/auth/logout/route.ts
- Create: app/api/admin/leads/route.ts
- Modify: app/api/leads/route.ts
- Modify: app/api/admin/leads/export/route.ts

**Interfaces:**
- Public GET /api/cities?q= returns only city name/state suggestions.
- Public POST /api/leads rejects City values missing from findIndianCity.
- Admin POST login and logout establish/clear cookie.
- Admin GET list/export require valid cookie. List returns date, count, leads, and optional coordinates.

- [ ] **Step 1: Add failing route-contract tests**

~~~ts
const cityRoutePath = path.join(root, "../app/api/cities/route.ts");
const listRoutePath = path.join(root, "../app/api/admin/leads/route.ts");

test("creates the public city route and protected lead-list route", () => {
  assert.equal(fs.existsSync(cityRoutePath), true);
  assert.equal(fs.existsSync(listRoutePath), true);
});

test("lead-list route verifies a signed admin session", () => {
  const source = fs.readFileSync(listRoutePath, "utf8");
  assert.equal(source.includes("isValidAdminSession"), true);
});
~~~

- [ ] **Step 2: Run test suite to verify the incomplete contract**

Run: node --experimental-strip-types --test test/indian-cities.test.ts test/leads.test.ts

Expected: FAIL because the city and lead-list route files do not exist.

- [ ] **Step 3: Implement precise route behavior**

City route trims q, returns no values below two characters, calls searchIndianCities(q, 8), and sends only name/state with Cache-Control: public, max-age=300. The public lead route must reject an unknown City before D1 insertion using status 400 and message Invalid field: city.

Login reads JSON object userId/password, returns generic Invalid User ID or Password with 401 on all invalid attempts, and sets the signed session cookie after success. Logout is POST-only and returns the clearing cookie.

List and export parse the cookie, verify it, validate date with getIndiaDateBounds, then query D1. Both return 401 plus Cache-Control: private, no-store for invalid sessions. List maps known city names to optional coordinates and never returns secrets. Export retains CSV attachment and no-store headers.

- [ ] **Step 4: Run all unit tests and search for obsolete bearer auth**

Run: node --experimental-strip-types --test test/indian-cities.test.ts test/admin-session.test.ts test/lead-validation.test.ts test/leads.test.ts

Run: rg -n "LEADS_ADMIN_TOKEN|Authorization:.*Bearer|Admin download token" app components lib .env.example docs/form-integration.md

Expected: tests PASS and no executable code requires bearer-token entry.

- [ ] **Step 5: Commit**

~~~bash
git add app/api/cities/route.ts app/api/leads/route.ts app/api/admin/auth app/api/admin/leads app/api/admin/leads/export/route.ts
git commit -m "feat: protect lead APIs with owner login"
~~~

### Task 5: Add real-time City autocomplete to the public form

**Files:**
- Create: components/CityAutocomplete.tsx
- Modify: components/StrategyCallForm.tsx
- Modify: test/lead-validation.test.ts

**Interfaces:**
- Consumes React Hook Form value/onChange/onBlur/error and GET /api/cities.
- Produces only a canonical selected City in LeadFormValues.

- [ ] **Step 1: Add failing form-source test**

~~~ts
test("renders City autocomplete while preserving removed-field exclusions", () => {
  assert.equal(formSource.includes('register("city")'), true);
  assert.equal(formSource.includes("CityAutocomplete"), true);
  assert.equal(formSource.includes("Primary Requirement"), false);
});
~~~

- [ ] **Step 2: Run it to verify it fails**

Run: node --experimental-strip-types --test test/lead-validation.test.ts

Expected: FAIL because current form has no City field.

- [ ] **Step 3: Implement accessible suggestion behavior**

Debounce 150 ms, abort stale requests, show role=listbox after two typed characters, support click and Enter selection, and clear selection when input changes. On submit show Select a city from the suggestions if no canonical option is selected. Include autoComplete=address-level2, maxLength=100, and aria-live error text. Place City between Business Name and Phone Number through existing Field wrapper. Existing payload spreading sends the selected city.

- [ ] **Step 4: Run focused and full tests**

Run: node --experimental-strip-types --test test/lead-validation.test.ts

Run: node --experimental-strip-types --test test/indian-cities.test.ts test/admin-session.test.ts test/lead-validation.test.ts test/leads.test.ts

Expected: every test PASS; all removed fields remain absent.

- [ ] **Step 5: Commit**

~~~bash
git add components/CityAutocomplete.tsx components/StrategyCallForm.tsx test/lead-validation.test.ts
git commit -m "feat: add city autocomplete to lead form"
~~~

### Task 6: Build the login and lead dashboard UI

**Files:**
- Create: components/AdminLoginForm.tsx
- Create: components/LeadDashboard.tsx
- Modify: app/admin/leads/page.tsx
- Delete: components/LeadExportForm.tsx
- Modify: test/leads.test.ts

**Interfaces:**
- Dashboard consumes date/count/leads JSON from Task 4, including City and optional coordinates.
- It renders the selected lead for Task 7 map focus.

- [ ] **Step 1: Add failing dashboard source contract test**

~~~ts
test("dashboard has IST data, logout, and CSV controls", () => {
  for (const text of ["Captured (IST)", "Download CSV", "Logout", "/api/admin/leads?date="]) {
    assert.equal(dashboardSource.includes(text), true);
  }
});
~~~

- [ ] **Step 2: Run test to verify it fails**

Run: node --experimental-strip-types --test test/leads.test.ts

Expected: FAIL because LeadDashboard.tsx does not exist.

- [ ] **Step 3: Implement login/dashboard/page composition**

AdminLoginForm uses credentials: same-origin, clears password after every response, and displays only the generic route message. Dashboard defaults date with Intl.DateTimeFormat en-CA in Asia/Kolkata, loads with no-store and same-origin credentials, returns UI to login after 401, and formats timestamp using Intl en-IN Asia/Kolkata dateStyle/timeStyle medium.

Render responsive table columns: Captured (IST), Name, Business, City, Phone, Email, Industry, Budget, Source, Campaign. Render null City as City not captured. Clicking a row sets selected lead. Download CSV calls authenticated export route and downloads tag-agency-leads-date.csv. Logout posts logout and clears state. Replace old token page copy/component without changing robots noindex metadata.

- [ ] **Step 4: Run test suite and build**

Run: node --experimental-strip-types --test test/indian-cities.test.ts test/admin-session.test.ts test/lead-validation.test.ts test/leads.test.ts

Run: npm run build

Expected: all tests PASS and build succeeds.

- [ ] **Step 5: Commit**

~~~bash
git add app/admin/leads/page.tsx components/AdminLoginForm.tsx components/LeadDashboard.tsx components/LeadExportForm.tsx test/leads.test.ts
git commit -m "feat: add lead management dashboard"
~~~

### Task 7: Add interactive India map and table-to-map behavior

**Files:**
- Create: components/IndiaLeadMap.tsx
- Modify: components/LeadDashboard.tsx
- Modify: app/globals.css
- Modify: package.json
- Modify: package-lock.json
- Modify: test/leads.test.ts

**Interfaces:**
- Map consumes leads, selected lead ID, and onSelectCity(city).
- It produces grouped markers, row-selected city focus, and marker-selected table filtering.

- [ ] **Step 1: Add failing map source contract test**

~~~ts
test("dashboard connects rows to a dynamic India map", () => {
  assert.equal(dashboardSource.includes("IndiaLeadMap"), true);
  const mapSource = fs.readFileSync(path.join(root, "../components/IndiaLeadMap.tsx"), "utf8");
  for (const text of ["MapContainer", "TileLayer", "CircleMarker", "selectedLead"]) {
    assert.equal(mapSource.includes(text), true);
  }
});
~~~

- [ ] **Step 2: Run test to verify it fails**

Run: node --experimental-strip-types --test test/leads.test.ts

Expected: FAIL because IndiaLeadMap.tsx does not exist.

- [ ] **Step 3: Install and implement the client-only map**

Run: npm install leaflet@^1.9.4 react-leaflet@^5.0.0

Create a use-client map using MapContainer, TileLayer, CircleMarker, Popup, and useMap. Import Leaflet CSS once in globals. Group displayable leads by City as city/latitude/longitude/count/leadIds. Default [22.5937, 78.9629], zoom 4, minZoom 4, maxZoom 18. On row selection, a SelectedLeadFocus effect calls map.flyTo([latitude, longitude], 11, { duration: 0.5 }). Marker popup shows city/count; marker click calls onSelectCity. Use public OSM tiles and attribution:

~~~tsx
attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
~~~

Use next/dynamic with ssr false in LeadDashboard. Keep selected City filter after marker click, visibly highlight matching rows, and offer Clear city selection. A selected historical lead displays details but does not move map.

- [ ] **Step 4: Run tests and build**

Run: node --experimental-strip-types --test test/leads.test.ts

Run: npm run build

Run: rg -n "OpenStreetMap|MapContainer|CircleMarker|City not captured" components app

Expected: test PASS, build succeeds, and expected rendering/privacy labels are present.

- [ ] **Step 5: Commit**

~~~bash
git add components/IndiaLeadMap.tsx components/LeadDashboard.tsx app/globals.css package.json package-lock.json test/leads.test.ts
git commit -m "feat: map leads across India"
~~~

### Task 8: Document, deploy, and verify the live route

**Files:**
- Modify: docs/form-integration.md
- Modify: PROJECT_CONTEXT.md
- Modify: .env.example

**Interfaces:**
- Produces the live User ID/password dashboard at https://www.tagagency.in/admin/leads.

- [ ] **Step 1: Update owner operating documentation**

Replace bearer-token instructions with these commands:

~~~bash
printf '%s' 'tagagency-admin' | npx wrangler secret put LEADS_ADMIN_USERNAME
openssl rand -base64 32 | npx wrangler secret put LEADS_ADMIN_PASSWORD
openssl rand -base64 48 | npx wrangler secret put LEADS_ADMIN_SESSION_SECRET
~~~

Document dashboard sign-in, map/table/date behavior, CSV download, eight-hour session, IST dates, and D1 console only as break-glass inspection. State old LEADS_ADMIN_TOKEN is unused and will be removed only after verification.

- [ ] **Step 2: Run final local checks**

Run: node --experimental-strip-types --test test/indian-cities.test.ts test/admin-session.test.ts test/lead-validation.test.ts test/leads.test.ts

Run: npm run build

Run: npx opennextjs-cloudflare build && npx wrangler deploy --dry-run

Run: git diff --check && git status --short

Expected: tests/build/dry run PASS, clean diff, expected source/docs/lock changes only.

- [ ] **Step 3: Commit documentation and push**

~~~bash
git add docs/form-integration.md PROJECT_CONTEXT.md .env.example
git commit -m "docs: explain lead dashboard access"
git push origin codex/install-google-tag
~~~

- [ ] **Step 4: Apply migration and configure remote secrets**

Run: npx wrangler d1 migrations apply tag-agency-leads --remote

Run the three secret commands from Step 1. Record generated password only for the owner and never in source control. Confirm remote 0002 migration succeeds. Cloudflare captures a backup before applying and rolls back a failed migration. [Cloudflare D1 migration reference](https://developers.cloudflare.com/d1/reference/migrations/)

- [ ] **Step 5: Deploy and verify actual public behavior**

Run: npx wrangler deploy

Verify cache-busted public URLs:

~~~bash
curl -i 'https://www.tagagency.in/admin/leads?verify=lead-dashboard-map'
curl -i 'https://www.tagagency.in/api/admin/leads?date=2026-09-01'
curl -i 'https://www.tagagency.in/api/admin/leads/export?date=2026-09-01'
~~~

Expected: admin page 200; unauthenticated list/export 401; no public-cache headers. In a rendered browser, verify City suggestions, submit one controlled valid lead, log in, see its City/pin/IST time, click row and marker in both directions, download CSV, then delete only the controlled D1 test row using exact email and business-name predicates. After this passes, run npx wrangler secret delete LEADS_ADMIN_TOKEN and confirm password login/export remains valid.

- [ ] **Step 6: Commit release record and report**

~~~bash
git status --short
git log --oneline -6
git push origin codex/install-google-tag
~~~

Report deployed Worker version, verified www result, dashboard URL, User ID and private password delivery status, migration outcome, test/build results, and controlled-test cleanup.
