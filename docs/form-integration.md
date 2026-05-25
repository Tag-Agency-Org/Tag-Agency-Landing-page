# TAG Agency Lead Form Integration

## Google Sheet

Create a Google Sheet named `Website Leads`, then open `Extensions > Apps Script` and paste the contents of `docs/google-apps-script.js`.

## Deployment

1. In Apps Script, click `Deploy > New deployment`.
2. Select `Web app`.
3. Execute as: `Me`.
4. Who has access: `Anyone`.
5. Deploy and copy the Web App URL.
6. Add it to the website environment:

```bash
NEXT_PUBLIC_GOOGLE_SCRIPT_URL=https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec
```

## Browser Note

The frontend submits JSON as `text/plain` to avoid a CORS preflight request. If a browser, privacy extension, or deployment policy blocks direct Google Apps Script responses, add a same-origin Next.js API proxy that forwards the payload to the Apps Script URL from a server-side environment variable.
