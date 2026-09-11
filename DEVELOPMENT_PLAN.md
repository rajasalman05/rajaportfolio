# RSN Portfolio — Development Plan

Dark-tech single-page portfolio for Raja Salman Nadeem (RSN). Delivered as two parallel builds sharing one design system: a **React/Vite** reference implementation and a **Django** version ready to drop into `egccenter.site`-style projects.

## Design system (locked in before any code)
- **Colors:** `#05070a` ink base, `#0d1219` surface, teal `#2dd4c4` → cyan `#22d3ee` primary gradient, magenta `#e23fd1` as a sparing secondary accent.
- **Type:** Space Grotesk for headings/wordmark, Inter for body, JetBrains Mono for small labels (skill chips, tags, process numbers) — ties the "tech" feel to real content instead of decoration.
- **Layout:** asymmetric hero (copy + rotating glow ring), one featured service card among four, alternating project rows instead of identical cards, a real 4-step process sequence, single-quote testimonial spotlight instead of a 3-card grid.

## Phase 1 — Static foundation (Tailwind + vanilla JS)
1. Build the full markup for all seven sections against the token system above.
2. Layer in `custom.css`: glow orbs, hero ring, floating tech badges, hover/lift states, focus rings.
3. Build `main.js`: scroll-progress bar, sticky-navbar shrink, mobile menu, offset-aware smooth scroll, IntersectionObserver reveal system (`data-reveal` + stagger delay), typing effect, animated counters, testimonial carousel.
4. Respect `prefers-reduced-motion` everywhere motion is added.

## Phase 2 — Sticky components & form logic (the two flagged requirements)
1. **Sticky WhatsApp button** — fixed `bottom/right`, pulsing ring, `wa.me` deep link with a pre-filled message, `z-50` so it clears every section.
2. **Contact form dropdown** — native `<select>` with the five service options; value is captured on submit alongside name/email/message and posted as JSON so any backend (Django, serverless function, CRM webhook) can branch on `service`.

## Phase 3 — Django integration
1. Drop `templates/portfolio/index.html`, `static/portfolio/`, `forms.py`, `views.py`, `urls.py` into a `portfolio` app.
2. Compile Tailwind with the provided `tailwind.config.js` (`npm run build:css`) — do **not** ship the Play CDN build to production.
3. Wire `forms.ContactForm` (server-side validation mirrors the frontend) to `views.contact_view`, which emails the submission via `EmailMessage` with `reply_to` set to the visitor's address.
4. Add email settings from `settings_snippet.py`, reading credentials from environment variables — never commit a Gmail App Password or SMTP secret to the repo.
5. `python manage.py collectstatic` before deploy.

## Phase 4 — React port
1. Scaffold with Vite (`npm create vite@latest` → react template) and Tailwind.
2. Port each section to a component; reuse the same class names so `index.css` matches the Django `custom.css` 1:1.
3. `useReveal` hook replaces the vanilla IntersectionObserver logic; `<Reveal>` wraps any section/element that should fade or slide in.
4. `ContactForm.jsx` is a controlled component — dropdown value lives in state and is sent as `service` in the POST body to `VITE_CONTACT_ENDPOINT`.
5. `npm run build` before deploy; verified in this session (`vite build` completed with no errors).

## Phase 5 — Content pass (before launch)
- Replace the three placeholder project entries with real screenshots/links.
- Replace the WhatsApp number (`10000000000` placeholder) and contact email.
- Replace testimonial placeholders with real client quotes once available.
- Swap the `RSN` initial-badge hero visual for an actual photo if desired.

## Phase 6 — QA
- Keyboard tab through nav, form, and dropdown; confirm visible focus rings.
- Test with reduced motion enabled (macOS/Windows setting) — reveals should still appear, just without the slide/fade.
- Run Lighthouse (mobile) — target 90+ on Performance/Accessibility; compress any real project screenshots before adding them.
- Confirm the dropdown's selected `service` value actually appears in the received email / network payload (checked in this session's smoke test).

## Phase 7 — Deploy
- **Django:** set `EMAIL_HOST_USER`/`EMAIL_HOST_PASSWORD`/`CONTACT_RECIPIENT_EMAIL` as environment variables on the host (Render, etc.); run `collectstatic`.
- **React:** `npm run build` → deploy the `dist/` folder to any static host, or embed as a standalone microsite alongside the Django project.
