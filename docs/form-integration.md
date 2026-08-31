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
2. Choose the day whose leads you need.
3. Enter the `LEADS_ADMIN_TOKEN` Worker secret.
4. Select **Download daily CSV**.

The token is sent only in the download request’s authorization header. It is not stored in the browser, URL, source code, or repository. The export response is private and marked `no-store`.

## Worker secret

Set the token only in the Cloudflare Worker secret store:

```bash
openssl rand -base64 32 | npx wrangler secret put LEADS_ADMIN_TOKEN
```

Keep the resulting token in a password manager. If it is exposed, replace it with a new value using the same command. Do not add it to `.env`, `.env.example`, Git, or any client-side environment variable.

## Data boundaries

The migration creates the `leads` table and an index on `submitted_at`. Use the private CSV screen for daily business exports; do not expose an unauthenticated endpoint that lists leads. Email DNS remains separate from the website deployment and should not be changed for this feature.
