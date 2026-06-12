import type { Metadata } from "next";

import { DisclaimerBanner } from "@/components/DisclaimerBanner";
import { PageHeader } from "@/components/PageHeader";
import { pageMetadata } from "@/lib/metadata";
import { DISCLAIMER_TEXT } from "@/lib/utils";

export const metadata: Metadata = pageMetadata({
  title: "Disclaimer",
  description:
    "Entertainment and self-reflection disclaimer for the AI divination template.",
  path: "/disclaimer"
});

export default function DisclaimerPage() {
  return (
    <>
      <PageHeader
        eyebrow="Disclaimer"
        title="Readings are symbolic, not professional advice"
        description="This page makes the entertainment scope clear for tarot, horoscope, dream, and compatibility outputs."
      />
      <section className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
        <DisclaimerBanner />
        <div className="mt-8 space-y-6 text-sm leading-7 text-stone-300">
          <p>{DISCLAIMER_TEXT}</p>
          <p>
            AI-generated readings can be inaccurate, incomplete, or emotionally
            resonant without being factually true. Treat them as creative prompts
            for reflection.
          </p>
          <p>
            If you need help with health, safety, law, finances, relationships,
            or mental health, contact a qualified professional or local emergency
            service.
          </p>
        </div>
      </section>
    </>
  );
}
