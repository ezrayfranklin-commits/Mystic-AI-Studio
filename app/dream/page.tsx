import type { Metadata } from "next";

import { DisclaimerBanner } from "@/components/DisclaimerBanner";
import { DreamReadingClient } from "@/components/DreamReadingClient";
import { PageHeader } from "@/components/PageHeader";
import { pageMetadata } from "@/lib/metadata";

export const metadata: Metadata = pageMetadata({
  title: "AI Dream Interpreter",
  description:
    "Describe a dream and receive a symbolic AI interpretation with key symbols, emotional theme, possible meaning, and reflection question.",
  path: "/dream"
});

export default function DreamPage() {
  return (
    <>
      <PageHeader
        eyebrow="AI Dream Interpreter"
        title="Explore the symbols in a dream"
        description="Enter the remembered details, mood, and images. The interpretation stays symbolic, gentle, and entertainment-focused."
      />
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <DreamReadingClient />
        <div className="mt-8">
          <DisclaimerBanner />
        </div>
      </section>
    </>
  );
}
