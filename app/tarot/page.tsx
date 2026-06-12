import type { Metadata } from "next";

import { DisclaimerBanner } from "@/components/DisclaimerBanner";
import { PageHeader } from "@/components/PageHeader";
import { TarotReadingClient } from "@/components/TarotReadingClient";
import { pageMetadata } from "@/lib/metadata";

export const metadata: Metadata = pageMetadata({
  title: "AI Tarot Reading",
  description:
    "Ask a question, draw local Major Arcana cards, and generate a structured AI tarot reading with mock fallback.",
  path: "/tarot"
});

export default function TarotPage() {
  return (
    <>
      <PageHeader
        eyebrow="AI Tarot Reading"
        title="Draw a spread for reflective insight"
        description="Choose a one-card, three-card, love, career, or yes/no spread. The app draws from a local Major Arcana deck and generates an interpretation."
      />
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <TarotReadingClient />
        <div className="mt-8">
          <DisclaimerBanner />
        </div>
      </section>
    </>
  );
}
