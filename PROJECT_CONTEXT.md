# Project Context

## 1. Project Name

TAG Agency Landing Page

## 2. What This Project Does

This is a marketing landing page for TAG Agency that promotes Meta Ads, Google Ads, and lead-generation services. Visitors can request a free ad account audit through a lead form.

## 3. Tech Stack

- Frontend: Next.js 15, React 19, TypeScript, Tailwind CSS 4, Framer Motion
- Backend: Next.js API route
- Database: None
- Hosting: Cloudflare Workers using OpenNext
- APIs: Google Apps Script, Google tag, WhatsApp
- Other tools: React Hook Form, Zod, Lucide React

## 4. Current Folder Structure

```text
app/
  api/leads/route.ts
  thank-you/page.tsx
  globals.css
  layout.tsx
  manifest.ts
  page.tsx
components/
docs/
lib/
public/
  assets/tag-agency/
  client-logos/
  favicons/
Creative assets/
package.json
next.config.ts
.env.example
```

## 5. Important Files

- `app/page.tsx` - Homepage composition
- `app/layout.tsx` - SEO, favicon, Google tag, and schema
- `app/api/leads/route.ts` - Lead forwarding API
- `components/StrategyCallForm.tsx` - Form validation and submission
- `components/StrategyCallPopup.tsx` - Scroll-triggered audit popup
- `app/thank-you/page.tsx` - Successful submission page
- `app/globals.css` - Styling and CTA animation
- `lib/site-data.ts` - URLs, phone number, assets, and Pixel ID
- `docs/form-integration.md` - Google Apps Script setup
- `.env.example` - Required server environment variable

## 6. Current Features

- Responsive agency landing page
- Animated hero and content sections
- Client logo strip and industry sections
- Free ad account audit CTAs
- Popup triggered after scrolling past the hero
- Mobile sticky CTA and WhatsApp widget
- Zod-validated lead form
- UTM and referrer capture
- Server-side Google Apps Script forwarding
- `/thank-you` redirect after successful submission
- Meta Pixel and Google tag installed globally; Google Ads conversion fires on `/thank-you`
- SEO metadata, organization schema, sitemap, robots, manifest, and favicon

## 7. Current Problems

- Open Graph, Twitter card, sitemap, robots, canonical URLs, and organization schema use `https://tagagency.in`.
- Several planned assets remain missing and use alternative layouts or placeholders.
- `docs/completion-report.md` contains outdated form-integration information.
- Cloudflare/OpenNext configuration exists only on the separate `cloudflare/workers-autoconfig` branch, not `main`.
- The Cloudflare branch is behind the current application changes.
- Some case-study claims, logos, contact details, and permissions still require business verification.
- `npm run build` produced a fresh build artifact but exceeded the command timeout before returning its final status.
- `npx tsc --noEmit` passes.

## 8. Recent Changes

- June 10, 2026: Normalized the Apps Script environment-variable value.
- June 10, 2026: Conversion tracking now fires only after successful submission.
- June 9, 2026: Strengthened the CTA zoom animation.
- June 8, 2026: Updated audit CTA copy and popup behavior.
- June 8, 2026: Added the complete favicon set.
- August 25, 2026: Removed the remaining Google tag and Google Ads conversion event.
- August 25, 2026: Installed Meta Pixel `4739448402950382` globally.
- August 25, 2026: Installed the Google tag for `AW-18159720115` globally and the Submit lead form conversion event (`AW-18159720115/VG4ICPnOteccELOtndND`) on `/thank-you`.

## 9. Deployment Details

- Production site: <https://tagagency.in>
- Production www site: <https://www.tagagency.in>
- Previous Workers preview URL: no longer canonical
- GitHub: <https://github.com/Tag-Agency-Org/Tag-Agency-Landing-page>
- Current branch: `main`
- Git status when this document was created: clean and synchronized with `origin/main`
- Lead endpoint: live and reports Google Apps Script as configured
- Canonical domain: <https://tagagency.in>
- Email DNS remains separate and must not be changed by landing-page deployment updates.

## 10. What ChatGPT Should Help With

- Fix the missing Open Graph image.
- Move updated Cloudflare configuration onto `main`.
- Keep the Cloudflare deployment synchronized.
- Update outdated documentation.
- Test the complete live form submission.
- Improve the UI while preserving the existing design.
- Verify tracking, SEO, assets, and production behavior after changes.
