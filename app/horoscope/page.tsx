import type { Metadata } from "next";

import { DisclaimerBanner } from "@/components/DisclaimerBanner";
import { HoroscopeClient } from "@/components/HoroscopeClient";
import { PageHeader } from "@/components/PageHeader";
import { pageMetadata } from "@/lib/metadata";

export const metadata: Metadata = pageMetadata({
  title: "Free AI Horoscope",
  description:
    "Generate a daily AI horoscope with overall energy, love, career, money, lucky color, and lucky number.",
  path: "/horoscope"
});

export default function HoroscopePage() {
  return (
    <>
      <PageHeader
        eyebrow="Free AI Horoscope"
        title="Daily zodiac reflections"
        description="Select a sign and receive a structured daily horoscope. Mock mode keeps the page working before any API key is configured."
      />
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <HoroscopeClient />
        <div className="mt-8">
          <DisclaimerBanner />
        </div>
      </section>
    </>
  );
}
