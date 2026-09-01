# TAG Agency Lead Dashboard and India Map Design

## Purpose

Replace the current token-entry CSV screen with a secure owner-only dashboard that lets TAG Agency view, filter, map, and download Cloudflare D1 website leads. Capture an Indian city for every new lead so the business can understand geographic demand.

## Scope and decisions

- Keep Cloudflare D1 `tag-agency-leads` as the only storage for new website leads. Existing records are retained unchanged.
- Replace bearer-token entry in the browser with a User ID and Password login. Credentials and a separate session-signing secret live only as Cloudflare Worker secrets.
- Use a signed, HttpOnly, Secure, SameSite=Strict session cookie with an eight-hour expiry. The password is never put in a URL, local storage, or a client-side bundle. Invalid login returns a generic error, and every lead-list/export route checks the session.
- Add a required `city` field to the public strategy-call form and its popup variant. Its autocomplete is backed by a committed, searchable India city directory derived from GeoNames data, with canonical spelling plus latitude/longitude. The browser receives only matching suggestions, not the entire directory.
- Add a D1 migration that makes `city` nullable for historical leads and required by application validation for future submissions. Historical rows display as `City not captured` and have no map pin.
- Treat calendar-day filtering as `Asia/Kolkata`, not UTC. Store immutable capture times in UTC, but use India-midnight bounds for D1 queries and format timestamps in the dashboard as IST date and time.
- Use a client-rendered Leaflet/OpenStreetMap India map with required attribution. It starts on India with all filtered city markers, supports pan and zoom, clusters overlapping city locations, and never sends lead PII to the map-tile provider.

## User flow

1. A visitor enters a name, contact details, business details, and begins typing a City. The form shows matching Indian city choices in real time; selecting one submits its canonical name.
2. The public API validates the city and writes the lead, tracking data, and server capture timestamp to D1.
3. The owner visits `/admin/leads`. Without a valid session, they see a User ID and Password form. A successful login returns to the dashboard; logout clears the cookie.
4. The dashboard defaults to today in India. It shows a lead count, date selector, map, and responsive table.
5. Map markers represent cities for the selected date. Clicking a marker filters/highlights matching table rows. Clicking a table row pans and zooms the map to that city and opens a detail panel containing the lead's captured data and IST timestamp.
6. The Download CSV action downloads the selected date's authorized results. It includes City and the precise capture timestamp alongside all existing lead/tracking fields.

## Components and API boundaries

- `lib/lead-validation.ts` defines and validates the city value shared by form and API.
- `lib/indian-cities.ts` owns city lookup and coordinates; its lookup API returns only safe suggestion data.
- `lib/leads.ts` owns D1 inserts, IST date bounds, list results, and CSV serialization.
- Public `POST /api/leads` remains the sole unauthenticated write path and requires a valid city.
- Admin login/logout/session helpers own credential comparison and cookie signing.
- Admin JSON list and CSV export routes are session-protected; no unauthenticated lead-data endpoint is added.
- The dashboard client owns UI state, selected date, selected lead/city, and the Leaflet map. It never receives administrator secrets.

## Error handling and privacy

- Form submission fails with a clear inline validation message when City is not selected from a valid suggestion.
- The dashboard shows an actionable state for an expired session, failed lead load, or failed CSV request, without exposing underlying database details.
- City-based map data contains only city names, coordinates, and aggregate/selected UI state; PII stays within the authenticated dashboard/API response and is not supplied to external map tiles.
- CSV cells continue to be formula-neutralized before spreadsheet download.

## Verification and release

- Unit tests cover city validation/lookup, India-time date bounds, session validation, D1 city storage/listing, and CSV City/timestamp output.
- A rendered browser check covers city suggestions, valid form submission, login failure/success, dashboard table, map row-to-marker interaction, and CSV download.
- Apply the migration to local and remote D1, set Cloudflare secrets, build, deploy, and cache-bust verify the actual `https://www.tagagency.in` surface. Verify that unauthenticated list/export requests are rejected and clean up any controlled test lead.
