# Mystic AI Studio

Mystic AI Studio is a production-ready AI divination website template built with Next.js App Router, TypeScript, Tailwind CSS, and an OpenAI-compatible API layer.

It includes:

- AI tarot reading
- Daily horoscope
- Dream interpretation
- Love compatibility
- Reference-style homepage reading launcher with modal previews
- Launch services and monetization concept pricing
- Pricing and launch-help service pages
- Free source-code CTA
- Local mock mode when no AI API key is configured
- Browser localStorage reading history
- Email/password registration and login with a local admin account
- Vercel-friendly deployment setup

The default brand name is a neutral placeholder. Rename it freely.

## Tech stack

- Next.js 16 App Router
- TypeScript
- Tailwind CSS
- lucide-react icons
- API routes
- OpenAI-compatible chat completions
- OpenAI and OpenRouter-compatible endpoint support

## Installation

```bash
npm install
```

Copy the environment template:

```bash
cp .env.example .env.local
```

On Windows PowerShell:

```powershell
Copy-Item .env.example .env.local
```

## Environment variables

```env
AI_API_KEY=
AI_BASE_URL=https://api.openai.com/v1
AI_MODEL=gpt-4o-mini
AI_TIMEOUT_MS=25000
AUTH_SECRET=change-this-to-a-random-32-character-string
AUTH_DATA_DIR=/app/.data
AUTH_COOKIE_SECURE=false
ADMIN_EMAIL=admin@mystic.local
ADMIN_PASSWORD=ChangeMe-Admin-2026!
LAUNCH_HELP_WEBHOOK_URL=
LAUNCH_HELP_WEBHOOK_SECRET=
ALLOW_LOCAL_LEAD_LOG=true
SOURCE_REPO_URL=
NEXT_PUBLIC_SITE_URL=http://localhost:3008
NEXT_PUBLIC_BRAND_NAME=Mystic AI Studio
```

If `AI_API_KEY` is empty, the app automatically returns local mock readings.

### Authentication

Registration and login use email and password only. There is no phone, Google,
Apple, or social sign-in provider in this template.

For local Docker, the default administrator is:

```text
admin@mystic.local
ChangeMe-Admin-2026!
```

Change `ADMIN_EMAIL`, `ADMIN_PASSWORD`, and `AUTH_SECRET` before any public
deployment. `AUTH_SECRET` must be at least 32 characters. The admin account is
created or synced from those environment variables at runtime.

User accounts are stored in `AUTH_DATA_DIR` as a small JSON file. In Docker
Compose, this path is backed by the `auth-data` named volume so accounts survive
container rebuilds.

### OpenAI

```env
AI_API_KEY=sk-your-key
AI_BASE_URL=https://api.openai.com/v1
AI_MODEL=gpt-4o-mini
AI_TIMEOUT_MS=25000
```

### OpenRouter

```env
AI_API_KEY=sk-or-your-key
AI_BASE_URL=https://openrouter.ai/api/v1
AI_MODEL=openai/gpt-4o-mini
AI_TIMEOUT_MS=25000
```

## Local development

```bash
npm run dev
```

Open:

```text
http://localhost:3008
```

## Production build

```bash
npm run build
npm run start
```

## Local Docker deployment

Build and run the production container:

```bash
docker compose up --build -d
```

Open:

```text
http://localhost:3008
```

Stop the container:

```bash
docker compose down
```

Optional environment overrides can be provided through a local `.env` file used by Docker Compose:

```env
APP_PORT=3008
AI_API_KEY=
AI_BASE_URL=https://api.openai.com/v1
AI_MODEL=gpt-4o-mini
AI_TIMEOUT_MS=25000
AUTH_SECRET=local-docker-auth-secret-change-before-production-2026
AUTH_DATA_DIR=/app/.data
AUTH_COOKIE_SECURE=false
ADMIN_EMAIL=admin@mystic.local
ADMIN_PASSWORD=ChangeMe-Admin-2026!
NEXT_PUBLIC_SITE_URL=http://localhost:3008
NEXT_PUBLIC_BRAND_NAME=Mystic AI Studio
```

Changing `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_BRAND_NAME`, or `SOURCE_REPO_URL` requires rebuilding the image because those values are used during the static build:

```bash
docker compose up --build -d
```

## Deploy to Vercel

1. Push this project to GitHub.
2. Create a new Vercel project from the repository.
3. Add environment variables in Vercel Project Settings.
4. Set `NEXT_PUBLIC_SITE_URL` to your production domain.
5. Deploy.

The app works without an AI key in mock mode, so you can deploy first and connect AI later.

## Change the brand name

Update:

```env
NEXT_PUBLIC_BRAND_NAME=Your Brand
```

You can also edit defaults in:

- `lib/utils.ts`
- `app/layout.tsx`
- legal pages in `app/privacy`, `app/terms`, and `app/disclaimer`

## Customize prompts

Prompt builders live in:

```text
lib/prompts.ts
```

AI request and mock fallback logic live in:

```text
lib/ai.ts
```

Keep prompts entertainment-focused and avoid medical, legal, financial, or mental-health advice.

## Customize pricing and service pages

Edit:

- `app/pricing/page.tsx`
- `app/source-code/page.tsx`
- `app/launch-help/page.tsx`
- `components/LaunchHelpForm.tsx`

The launch form submits to `app/api/launch-help/route.ts` and includes a mailto fallback. Replace or extend it with Formspree, Resend, Supabase, a database route, or a CRM integration.
The included API route also supports an optional webhook:

```env
LAUNCH_HELP_WEBHOOK_URL=https://your-webhook.example/launch-help
LAUNCH_HELP_WEBHOOK_SECRET=optional-bearer-token
```

If no webhook is configured, it accepts the form and writes a redacted server log for local testing.
For public production, configure a webhook or set your own persistence workflow instead of relying on `ALLOW_LOCAL_LEAD_LOG=true`.

## Add Stripe later

A typical Stripe path:

1. Create Stripe products and prices.
2. Add `STRIPE_SECRET_KEY` and `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`.
3. Create a checkout API route.
4. Replace the pricing CTA links with checkout buttons.
5. Add a webhook route for fulfillment and email notifications.

PayPal, Lemon Squeezy, Gumroad, or manual invoicing can also fit this template.

## Tarot deck data

The MVP includes the 22 Major Arcana cards in:

```text
data/tarotDeck.ts
```

No copyrighted card artwork is used. Cards are abstract UI placeholders with symbols, keywords, meanings, and gradient classes.

## Legal reminder

This template includes starter privacy, terms, and disclaimer pages. They are placeholders, not legal advice. Review all legal text with qualified counsel before launching a commercial site.
