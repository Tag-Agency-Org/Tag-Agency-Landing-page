# TAG Agency UI Guidelines

Last updated: 2026-06-23

Use this guide whenever adding, redesigning, or reviewing a page in the TAG Agency landing-page repo. The goal is to keep every new section aligned with the existing performance-marketing brand: focused, credible, conversion-led, and visually consistent.

## 1. Brand Direction

TAG Agency should feel like a sharp performance-marketing partner, not a generic creative studio or a playful SaaS brand.

- Lead with clarity, proof, and business outcomes.
- Keep the tone confident, direct, and practical.
- Prefer campaign, funnel, lead quality, conversion, tracking, audit, and performance language.
- Avoid vague hype, inflated guarantees, and decorative copy that does not help a visitor decide.
- Keep the site visually premium but operational: structured sections, scan-friendly cards, strong CTAs, and measured motion.

## 2. Design Tokens

Core colors are defined in `app/globals.css` and should be reused before adding new colors.

| Token | Hex | Use |
| --- | --- | --- |
| `--bg-primary` | `#09111A` | Main dark page background, hero, primary sections |
| `--bg-secondary` | `#101B27` | Secondary dark bands and logo/trust strips |
| `--bg-warm` | `#F7F5F0` | Light sections, forms, warm contrast panels |
| `--text-dark` | `#14202B` | Primary text on light backgrounds |
| `--text-light` | `#F5F3EE` | Primary text on dark backgrounds |
| `--text-muted` | `#AFBAC7` | Muted text on dark backgrounds |
| `--gold` | `#D6A64F` | Primary CTA, emphasis, dividers, focus outline |
| `--blue` | `#3E86F5` | Data signal, secondary emphasis, active states |
| `--success` | `#269B71` | Positive icons and validation support |
| `--error` | `#C35A4A` | Error states and failed submission text |

Color rules:

- Use dark backgrounds for high-impact sections and conversion moments.
- Use warm light backgrounds for diagnostic, about, form, footer, and explanation-heavy content.
- Use gold sparingly for primary action, key dividers, focus, and high-value emphasis.
- Use blue as a signal/data color, not as the dominant brand color.
- Keep text contrast high. Muted text on dark sections should usually use `#AFBAC7`; muted text on light sections should use `#465464`.
- Do not introduce new gradients unless they support the existing signal-line/radial-highlight language.

## 3. Typography

The app uses Inter for body text and Manrope for headlines.

- Body font: `var(--font-inter)`
- Heading font: `font-[var(--font-manrope)]`
- Headings should be bold or extra-bold.
- Eyebrows use `.eyebrow`: uppercase, gold, small, heavy, and widely tracked.
- Keep headline line-height tight: about `leading-tight` or `leading-[1.05]`.
- Body copy should stay readable: `text-base` or `text-lg` with `leading-7` or `leading-8`.
- Do not scale text with viewport width. Use Tailwind breakpoints instead.

Recommended type scale:

| Element | Mobile | Desktop |
| --- | --- | --- |
| Hero H1 | `text-4xl` | `md:text-7xl` |
| Section H2 | `text-3xl` or `text-4xl` | `md:text-5xl` |
| Card H3 | `text-xl` or `text-2xl` | Usually unchanged |
| Body | `text-base` | `md:text-lg` when important |
| Eyebrow | `text-xs` or `.eyebrow` | Same |

## 4. Layout System

Use the shared layout classes before creating custom wrappers.

- `.container`: page width wrapper, currently `min(100% - 32px, 1280px)`.
- `.section`: vertical page rhythm, currently `96px 0`, reduced to `72px 0` on mobile.
- Use responsive grid layouts for section composition.
- Prefer `gap-5`, `gap-8`, `gap-10`, or `gap-12` depending on density.
- Keep page sections full-width. Do not place a whole section inside a decorative card.
- Use cards only for repeated items, forms, feature blocks, metric blocks, modals, and framed tools.
- Do not nest cards inside other cards unless there is a clear form or modal need.

Common layout patterns:

- Hero: dark section, two-column desktop grid, copy first, strong visual second.
- Proof/results: dark section with metric cards and subtle blue/gold signal accents.
- Diagnostic/explanation: warm light section with text plus structured cards.
- Services: dark section with `.panel` cards and capability lists.
- Contact: dark background with a dark info panel and warm form.
- Footer: warm light background, compact links and contact details.

## 5. Components And Reusable Classes

Use the existing shared styles in `app/globals.css` where possible.

### Buttons

Base class: `.button`

- Primary CTA: `.button.button-primary`
- Secondary dark-section CTA: `.button.button-secondary`
- Dark CTA on light backgrounds: `.button.button-dark`
- Keep CTA height at least 46-48px.
- Include a Lucide icon for clear forward actions when it helps, usually `ArrowRight` or `Send`.
- Primary conversion copy should stay consistent with the existing offer: "Get a Free Ad account Audit".
- On mobile, buttons are full width by default through `.button`.

### Panels

Dark cards: `.panel`

- Use on dark backgrounds.
- Keep border subtle: white at low opacity.
- Use `rounded-lg` or `rounded-md`.
- Use `p-5`, `p-6`, or `md:p-8`.
- Hover may lift slightly, but should not feel playful.

Light cards: `.light-panel`

- Use on warm backgrounds.
- Keep borders in dark low-opacity values.
- Use blue/gold accents to connect them back to the brand.

### Forms

Input class: `.form-input`

- Inputs should be 48px tall or taller.
- Use clear labels above fields.
- Keep validation messages short and specific.
- Preserve the consent checkbox for lead forms.
- Lead forms should post through `/api/leads`, not directly to third-party scripts from the browser.

### Motion

Shared reveal component: `components/ScrollReveal.tsx`

- Use `ScrollReveal` for simple section and card reveals.
- Use Framer Motion for staggered diagnostic/process flows.
- Keep animation durations near 180-550ms for UI interactions and reveals.
- Keep continuous animations subtle: signal lines, logo marquee, CTA pulse.
- Respect `prefers-reduced-motion`; existing CSS already reduces global animation and transition duration.

## 6. Imagery And Assets

Image choices should show the actual brand, work, team, industries, clients, or campaign context.

- Store web-ready images under `public/assets/tag-agency/` or the appropriate public asset folder.
- Use `next/image` for important content images when possible.
- Keep meaningful alt text for content images.
- Use empty alt text only for decorative social or visual-only assets.
- Do not use generic stock photos when real TAG Agency assets are available.
- Avoid dark, blurred, or purely atmospheric images when the visitor needs to understand the service or proof.
- If an asset is missing, use the existing placeholder pattern rather than breaking layout.

## 7. Section Composition Checklist

Every new page section should answer these questions:

- What visitor decision does this section help?
- Is the section dark or light according to the surrounding page rhythm?
- Does it use `.container` and `.section` unless there is a specific reason not to?
- Does it have a clear eyebrow, headline, and useful supporting copy?
- Is there one obvious next action when the section is conversion-oriented?
- Are cards using `.panel` or `.light-panel` consistently?
- Are icons from `lucide-react` when icons are needed?
- Does it work as one column on mobile without overlapping text, buttons, or images?
- Does it avoid unsupported business claims?

## 8. Copy Guidelines

Write like a performance strategist, not like a generic agency brochure.

Good patterns:

- "Generate qualified leads"
- "Improve enquiry quality"
- "Review targeting, creative, tracking and funnel logic"
- "Connect ads, landing experience and follow-up"
- "Performance conversations with context"
- "Focused audit"

Avoid:

- Guaranteed revenue claims unless formally verified.
- Generic claims like "world-class", "revolutionary", or "best in class".
- Long paragraphs in cards.
- Multiple competing CTAs in one section.
- Copy that promises platform outcomes outside TAG Agency control.

## 9. Accessibility And Interaction

- Preserve visible focus states. The global focus outline uses gold.
- Buttons and links need accessible names.
- Do not rely on color alone to communicate errors or success.
- Keep mobile menu labels clear and tappable.
- Maintain `aria-live` for async form errors.
- Use semantic sections, headings, lists, forms, and addresses.
- Pause or reduce motion where already supported.
- Verify text does not overflow on small screens.

## 10. Responsive Rules

- Design mobile first, then enhance at `md` and `lg`.
- Avoid fixed widths that can overflow the viewport.
- Cards should stack on mobile.
- Buttons should become full width on mobile unless they are icon-only controls.
- Do not let sticky CTA, WhatsApp widget, popups, or forms cover critical content.
- Test at narrow mobile, tablet, and desktop widths before shipping.

## 11. Implementation Rules

- Keep page composition in `app/page.tsx` or route-specific page files.
- Put reusable UI sections in `components/`.
- Put reusable content, URLs, phones, and asset lists in `lib/site-data.ts` or nearby data files.
- Use `lucide-react` for icons.
- Use existing Tailwind and global classes before creating new CSS.
- Keep new CSS in `app/globals.css` only when a style is shared or cannot be expressed cleanly with utilities.
- Keep tracking, lead submission, and environment behavior aligned with existing files:
  - `components/StrategyCallForm.tsx`
  - `app/api/leads/route.ts`
  - `.env.example`
  - `docs/form-integration.md`

## 12. Pre-Ship Review

Before committing a UI change:

- Run TypeScript validation: `npx tsc --noEmit`
- Check the page visually on mobile and desktop.
- Confirm CTAs point to the intended phone, WhatsApp, anchor, or route.
- Confirm lead forms still submit through `/api/leads`.
- Confirm no secrets or private config values are committed.
- Confirm new claims, metrics, logos, addresses, and contact details are business-approved.
- Confirm images load and have appropriate alt text.
- Confirm the new UI still feels like TAG Agency: focused, credible, conversion-led, and visually consistent.
