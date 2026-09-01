# TAG Agency Lead Storage and Daily Downloads

## How lead capture works

The public form posts to `/api/leads` on the same Cloudflare Worker that hosts the landing page. The Worker validates the lead, records its server-side submission time, and writes the form fields plus UTM/referrer context to the bound Cloudflare D1 database.

The production domains are:

```text
https://tagagency.in
https://www.tagagency.in
```

No Google Apps Script, Gmail forwarding, or Google Sheet is required for new leads. Historical Google Sheet records remain separate unless they are deliberately imported later.

## Daily CSV download

1. Open `https://www.tagagency.in/admin/leads`.
2. Sign in with the owner User ID and Password.
3. Choose the India calendar date whose leads you need.
4. View City locations on the India map.
5. Select **Download CSV**.

Login creates an eight-hour HttpOnly session cookie. The password is never stored in the browser, URL, source code, or repository. The dashboard and export responses are private and marked `no-store`.

## Worker secret

Set the owner login only in the Cloudflare Worker secret store:

```bash
printf '%s' 'tagagency-admin' | npx wrangler secret put LEADS_ADMIN_USERNAME
openssl rand -base64 32 | npx wrangler secret put LEADS_ADMIN_PASSWORD
openssl rand -base64 48 | npx wrangler secret put LEADS_ADMIN_SESSION_SECRET
```

Keep the resulting password and session secret in a password manager. If either is exposed, replace it with a new value using the same command. Do not add them to `.env`, `.env.example`, Git, or any client-side environment variable.

## Data boundaries

The migrations create the `leads` table, capture City for new entries, and index capture time and City. Existing records remain available as City not captured. Selected days use Asia/Kolkata dates and captured timestamps are displayed in IST. The dashboard session lasts eight hours and login attempts are rate-limited. Do not expose an unauthenticated endpoint that lists leads. Email DNS remains separate from the website deployment and should not be changed for this feature.
