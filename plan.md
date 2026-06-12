You are a senior full-stack engineer. Build a complete production-ready AI divination / tarot / astrology web app.

Important:
Do not copy any existing brand name, logo, text, images, icons, or proprietary assets from any existing website. The product should only be inspired by the general structure of modern AI tarot / astrology websites. Use a new neutral placeholder brand name such as “Mystic AI Studio”, and make it easy to rename.

Project goal:
Create an open-source style AI divination website template that users can run locally, deploy to Vercel, and customize. The business model is: users get the source code for free; if they cannot deploy it themselves, they can pay for deployment/customization service. Therefore the site must include a “Free Source Code” call-to-action and a “Need help launching?” upsell section.

Tech stack:

* Next.js 14+ App Router
* TypeScript
* Tailwind CSS
* shadcn/ui or clean custom components
* Responsive mobile-first design
* Server Actions or API routes
* OpenAI-compatible API support via environment variables
* Support OpenAI and OpenRouter-compatible endpoints
* Optional local mock AI mode when no API key is present
* No paid database required for MVP
* Use simple local JSON / in-memory / localStorage for free version history
* Provide clean README deployment instructions

Core pages:

1. `/`

   * Hero section
   * Main headline for AI tarot / astrology / dream interpretation
   * Short explanation
   * CTA buttons:

     * “Try Free Reading”
     * “Get Free Source Code”
     * “Need Help Launching?”
   * Feature cards:

     * AI Tarot Reading
     * Daily Horoscope
     * Dream Interpretation
     * Love Compatibility
     * Palm Reading placeholder
     * Numerology placeholder
   * How it works section:

     * Choose a reading
     * Enter your question or details
     * Receive AI-generated insight
     * Share or save the result
   * Disclaimer:
     “For entertainment and self-reflection purposes only. Not medical, legal, financial, or psychological advice.”

2. `/tarot`

   * AI tarot reading page
   * User can input a question
   * User can choose spread type:

     * One-card reading
     * Three-card reading
     * Love reading
     * Career reading
     * Yes/No reading
   * Randomly draw tarot cards from a local deck JSON
   * Show selected cards with simple elegant card UI
   * Generate AI interpretation
   * Result sections:

     * Title
     * Summary
     * Card-by-card interpretation
     * Practical reflection
     * Gentle advice
   * Include loading state, error state, and mock response fallback

3. `/horoscope`

   * Select zodiac sign
   * Generate daily horoscope
   * Sections:

     * Overall energy
     * Love
     * Career
     * Money
     * Lucky color
     * Lucky number
   * Use AI if API key exists, otherwise use mock response

4. `/dream`

   * Textarea for dream description
   * Generate dream interpretation
   * Sections:

     * Key symbols
     * Emotional theme
     * Possible meaning
     * Reflection question

5. `/compatibility`

   * Inputs:

     * Name A
     * Name B
     * Optional zodiac signs
     * Optional birth dates
   * Generate compatibility reading
   * Show compatibility score, emotional dynamic, strengths, challenges, advice

6. `/pricing`

   * Pricing should focus on this business model:

     * Free Source Code: $0

       * Download / fork source code
       * Run locally
       * Deploy yourself
     * Launch Help: $99-$299

       * We help deploy to Vercel
       * Configure domain
       * Configure API key
       * Basic branding
     * Custom Pro Setup: $499+

       * Custom design
       * Stripe/PayPal integration
       * SEO pages
       * Multilingual setup
       * Analytics
   * Add “Book Launch Help” CTA button
   * Do not implement real payment yet; create placeholder contact/checkout CTA

7. `/source-code`

   * Explain that the source code is free
   * Add GitHub placeholder button
   * Add setup instructions summary:

     * Clone repo
     * Install dependencies
     * Add environment variables
     * Run locally
     * Deploy to Vercel
   * Add upsell:
     “If deployment feels difficult, we can launch it for you.”

8. `/launch-help`

   * Landing page for paid deployment service
   * Include form fields:

     * Name
     * Email
     * Desired website name
     * Domain status
     * API key status
     * Notes
   * For MVP, form can submit to console/log or mailto link
   * Make form easy to replace with Formspree, Resend, or database later

9. `/privacy`

10. `/terms`

11. `/disclaimer`

Design direction:

* Modern mystical but clean
* Dark gradient background
* Purple / indigo / gold accent colors
* Card-based layout
* Soft glow effects
* Mobile-friendly
* No copyrighted images
* Use CSS gradients, emoji, simple SVG icons, or lucide-react icons
* Do not use real tarot card artwork unless generated as simple abstract placeholders

Components:

* Navbar
* Footer
* Hero
* FeatureCard
* ReadingCard
* TarotCard
* PricingCard
* DisclaimerBanner
* CTASection
* LoadingSpinner
* ResultPanel
* LaunchHelpForm

AI integration:
Create a reusable AI client:

File: `lib/ai.ts`

Requirements:

* Read env vars:

  * `AI_API_KEY`
  * `AI_BASE_URL`
  * `AI_MODEL`
* Default model can be `gpt-4o-mini` or any OpenAI-compatible model
* If no API key exists, return mock content
* Function examples:

  * `generateTarotReading(input)`
  * `generateHoroscope(input)`
  * `generateDreamReading(input)`
  * `generateCompatibilityReading(input)`

Prompt requirements:

* Responses should be warm, reflective, emotionally intelligent, and entertaining
* Avoid deterministic claims like “this will happen”
* Avoid medical, legal, financial, or mental health advice
* Always include disclaimer-friendly wording
* Prefer structured JSON output when possible

Tarot deck:
Create local file:
`data/tarotDeck.ts`

Include at least 22 Major Arcana cards for MVP:

* The Fool
* The Magician
* The High Priestess
* The Empress
* The Emperor
* The Hierophant
* The Lovers
* The Chariot
* Strength
* The Hermit
* Wheel of Fortune
* Justice
* The Hanged Man
* Death
* Temperance
* The Devil
* The Tower
* The Star
* The Moon
* The Sun
* Judgement
* The World

Each card should include:

* name
* keywords
* upright meaning
* simple visual symbol or emoji
* color gradient class

Environment variables:
Create `.env.example`:

AI_API_KEY=
AI_BASE_URL=https://api.openai.com/v1
AI_MODEL=gpt-4o-mini
NEXT_PUBLIC_SITE_URL=http://localhost:3008
NEXT_PUBLIC_BRAND_NAME=Mystic AI Studio

SEO:

* Add metadata for every page
* Use generic SEO titles:

  * AI Tarot Reading
  * Free AI Horoscope
  * AI Dream Interpreter
  * AI Love Compatibility
* Add Open Graph metadata
* Add JSON-LD structured data for WebApplication on homepage

Important implementation requirements:

* Generate a complete working project
* Do not leave pseudo-code
* Do not omit files
* Use clean folder structure
* Use TypeScript types
* Use reusable components
* Make it deployable to Vercel with one click
* Include README with:

  * Project introduction
  * Installation
  * Environment variables
  * Local development
  * Deployment to Vercel
  * How to change brand name
  * How to connect OpenAI/OpenRouter
  * How to customize prompts
  * How to add Stripe later
  * Legal disclaimer reminder

Folder structure suggestion:

app/
page.tsx
tarot/page.tsx
horoscope/page.tsx
dream/page.tsx
compatibility/page.tsx
pricing/page.tsx
source-code/page.tsx
launch-help/page.tsx
privacy/page.tsx
terms/page.tsx
disclaimer/page.tsx
components/
Navbar.tsx
Footer.tsx
Hero.tsx
FeatureCard.tsx
PricingCard.tsx
TarotCard.tsx
ResultPanel.tsx
DisclaimerBanner.tsx
CTASection.tsx
LaunchHelpForm.tsx
lib/
ai.ts
prompts.ts
utils.ts
data/
tarotDeck.ts
types/
reading.ts

Final output:

1. Generate the full codebase.
2. Then explain how to run it locally.
3. Then explain how to deploy it to Vercel.
4. Then explain where to modify prompts, brand name, pricing, and service pages.
5. Make sure the app works even without an AI API key by using mock mode.
