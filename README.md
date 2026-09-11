# RSN Portfolio

Two implementations of the same dark-tech single-page portfolio, sharing one design system (see `DEVELOPMENT_PLAN.md`).

```
rsn-portfolio/
├── DEVELOPMENT_PLAN.md
├── django/     ← templates, static, forms/views/urls for a Django app
└── react/      ← Vite + React + Tailwind SPA
```

## React (`/react`)

```bash
cd react
npm install
npm run dev        # http://localhost:5173
npm run build       # outputs dist/
```

Set the contact endpoint via an env var before building:

```
# react/.env
VITE_CONTACT_ENDPOINT=https://your-api.example.com/api/contact/
```

If left unset it posts to `/api/contact/` on the same origin.

## Django (`/django`)

1. Copy this folder's contents into a Django app named `portfolio` in your project (e.g. `python manage.py startapp portfolio`, then replace its files with these).
2. Add `"portfolio"` to `INSTALLED_APPS` and `path("", include("portfolio.urls"))` to your project's root `urls.py`.
3. Compile Tailwind:
   ```bash
   cd portfolio   # wherever tailwind.config.js / package.json live
   npm install
   npm run build:css
   ```
4. Add the settings from `settings_snippet.py` to your project's `settings.py`, then set the real environment variables:
   ```
   EMAIL_HOST_USER=hello@yourdomain.com
   EMAIL_HOST_PASSWORD=your-gmail-app-password
   CONTACT_RECIPIENT_EMAIL=hello@yourdomain.com
   ```
5. `python manage.py collectstatic` before deploying.

The `index.html` template and `contact_view` were exercised with Django's test client in development (page render + valid/invalid form submission + email dispatch) before delivery.

## Before you launch (either version)
- Replace the WhatsApp number and `mailto:` address (currently placeholders).
- Swap the three project entries and testimonials for real case studies/quotes.
- Add a real photo in place of the "RSN" hero avatar mark if you want one.
