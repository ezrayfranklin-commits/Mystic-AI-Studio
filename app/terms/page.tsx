import type { Metadata } from "next";

import { PageHeader } from "@/components/PageHeader";
import { pageMetadata } from "@/lib/metadata";
import { BRAND_NAME } from "@/lib/utils";

export const metadata: Metadata = pageMetadata({
  title: "Terms of Use",
  description: "Terms of use placeholder for the Mystic AI Studio template.",
  path: "/terms"
});

export default function TermsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Terms"
        title="Terms of Use"
        description="Starter terms for the template. Replace this page with legal text suitable for your jurisdiction and business."
      />
      <section className="mx-auto max-w-3xl px-4 py-12 text-sm leading-7 text-stone-300 sm:px-6 lg:px-8">
        <div className="space-y-7 [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-white">
          <h2>Entertainment use</h2>
          <p>
            {BRAND_NAME} provides AI-generated readings for entertainment and
            self-reflection. Readings are not professional advice.
          </p>
          <h2>User responsibility</h2>
          <p>
            You are responsible for how you interpret and act on generated
            content. Do not rely on readings for medical, legal, financial,
            psychological, emergency, or safety decisions.
          </p>
          <h2>Template customization</h2>
          <p>
            The source code is intended as a customizable starting point. Update
            branding, legal text, payment flows, analytics, and provider settings
            before public launch.
          </p>
          <h2>Service placeholders</h2>
          <p>
            Pricing and launch-help pages are placeholders until you connect a
            real payment, intake, or service agreement workflow.
          </p>
        </div>
      </section>
    </>
  );
}
