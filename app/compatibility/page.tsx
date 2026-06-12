import type { Metadata } from "next";

import { CompatibilityClient } from "@/components/CompatibilityClient";
import { DisclaimerBanner } from "@/components/DisclaimerBanner";
import { PageHeader } from "@/components/PageHeader";
import { pageMetadata } from "@/lib/metadata";

export const metadata: Metadata = pageMetadata({
  title: "AI Love Compatibility",
  description:
    "Generate a playful AI compatibility reading with a score, emotional dynamic, strengths, challenges, and advice.",
  path: "/compatibility"
});

export default function CompatibilityPage() {
  return (
    <>
      <PageHeader
        eyebrow="AI Love Compatibility"
        title="Read the emotional dynamic"
        description="Add two names, optional zodiac signs, and optional birth dates to generate a compatibility reading."
      />
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <CompatibilityClient />
        <div className="mt-8">
          <DisclaimerBanner />
        </div>
      </section>
    </>
  );
}
