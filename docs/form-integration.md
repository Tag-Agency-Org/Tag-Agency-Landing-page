# TAG Agency Lead Form Integration

## Gmail Inbox

Create a Google Apps Script project and paste the contents of `docs/google-apps-script-email.js`.
Set `RECIPIENT_EMAIL` in that script to the Gmail inbox that should receive website leads.

## Deployment

1. In Apps Script, click `Deploy > New deployment`.
2. Select `Web app`.
3. Execute as: `Me`.
4. Who has access: `Anyone`.
5. Deploy and copy the Web App URL.
6. Add it to the website hosting environment:

```bash
GOOGLE_APPS_SCRIPT_WEB_APP_URL=https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec
```

## How the Live Site Works

The public form submits to `/api/leads` on the same website domain. That server route forwards the lead to Google Apps Script using `GOOGLE_APPS_SCRIPT_WEB_APP_URL`.

This keeps the Google Apps Script URL out of the browser, avoids CORS issues, and works after hosting as long as the hosting provider has the `GOOGLE_APPS_SCRIPT_WEB_APP_URL` environment variable configured.

For local testing, create `.env.local` with the same variable and restart the dev server.
