import type { Metadata } from "next";

import { CTASection } from "@/components/CTASection";
import { PageHeader } from "@/components/PageHeader";
import { PricingTabs } from "@/components/PricingTabs";
import { pageMetadata } from "@/lib/metadata";

export const metadata: Metadata = pageMetadata({
  title: "Pricing",
  description:
    "Free source code plus optional launch help and custom pro setup services for your AI divination website.",
  path: "/pricing"
});

export default function PricingPage() {
  return (
    <>
      <PageHeader
        eyebrow="Pricing"
        title="Free code, optional launch support"
        description="The template is free. Paid services are for deployment, branding, integrations, and custom launch work."
      />
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <PricingTabs />
      </section>
      <CTASection
        title="Want the site live without doing the setup?"
        description="Send the launch form with your domain and API status. The MVP form logs locally and includes a mailto fallback."
        primaryHref="/launch-help"
        primaryLabel="Book Launch Help"
        secondaryHref="/source-code"
        secondaryLabel="Review Source Code"
      />
    </>
  );
}
