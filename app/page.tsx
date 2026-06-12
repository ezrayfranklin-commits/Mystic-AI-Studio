import type { Metadata } from "next";
import {
  BadgeDollarSign,
  Code2,
  Sparkles
} from "lucide-react";

import { CTASection } from "@/components/CTASection";
import { DisclaimerBanner } from "@/components/DisclaimerBanner";
import { Hero } from "@/components/Hero";
import { HomeReadingStudio } from "@/components/HomeReadingStudio";
import { pageMetadata } from "@/lib/metadata";
import { absoluteUrl, BRAND_NAME, DISCLAIMER_TEXT } from "@/lib/utils";

export const metadata: Metadata = pageMetadata({
  title: "AI Tarot, Horoscope, Dreams",
  description:
    "Try AI tarot, daily horoscope, dream interpretation, and compatibility readings in a free open-source style website template.",
  path: "/"
});

const steps = [
  "Choose a reading",
  "Enter your question or details",
  "Receive AI-generated insight",
  "Copy results or save recent history in this browser"
];

export default function HomePage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: BRAND_NAME,
    applicationCategory: "EntertainmentApplication",
    operatingSystem: "Any",
    url: absoluteUrl("/"),
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD"
    },
    description:
      "AI tarot, horoscope, dream interpretation, and compatibility website template with mock mode.",
    disclaimer: DISCLAIMER_TEXT
  };

  return (
    <>
      <Hero />

      <HomeReadingStudio />

      <section className="border-y border-white/10 bg-white/[0.035]">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase text-brass">
                Builder model
              </p>
              <h2 className="mt-3 text-3xl font-semibold text-white">
                Free template plus launch support
              </h2>
            </div>
            <div className="flex gap-3">
              <a href="/source-code" className="button-secondary">
                <Code2 className="h-4 w-4" aria-hidden="true" />
                Free Source Code
              </a>
              <a href="/pricing" className="button-secondary">
                <BadgeDollarSign className="h-4 w-4" aria-hidden="true" />
                Services
              </a>
            </div>
          </div>

          <p className="text-sm font-semibold uppercase text-brass">
            Flow
          </p>
          <h2 className="mt-3 text-3xl font-semibold text-white">How it works</h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((step, index) => (
              <article key={step} className="panel rounded-lg p-5">
                <p className="text-sm font-semibold text-brass">
                  Step {index + 1}
                </p>
                <h3 className="mt-3 text-lg font-semibold text-white">{step}</h3>
              </article>
            ))}
          </div>
          <div className="mt-8">
            <DisclaimerBanner />
          </div>
        </div>
      </section>

      <section className="overflow-hidden py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="text-sm font-semibold uppercase text-brass">
            Template Cues
          </p>
          <h2 className="mt-3 text-3xl font-semibold text-white">
            Example quality checks for this template
          </h2>
        </div>
        <div className="mt-8 flex animate-marquee gap-4 whitespace-nowrap">
          {[
            "Tarot preview should feel grounded and practical",
            "Dream symbols should become a useful journal prompt",
            "The horoscope page should work without an API key",
            "Compatibility readings should stay playful, not deterministic",
            "The template should run on Vercel or Docker"
          ]
            .concat([
              "Tarot preview should feel grounded and practical",
              "Dream symbols should become a useful journal prompt",
              "The horoscope page should work without an API key",
              "Compatibility readings should stay playful, not deterministic",
              "The template should run on Vercel or Docker"
            ])
            .map((quote, index) => (
              <div
                key={`${quote}-${index}`}
                className="panel inline-flex min-w-80 rounded-lg px-5 py-4 text-sm text-stone-200"
              >
                <Sparkles className="mr-3 h-4 w-4 shrink-0 text-brass" aria-hidden="true" />
                {quote}
              </div>
            ))}
        </div>
      </section>

      <CTASection />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </>
  );
}
