import type { Metadata } from "next";
import type { ReactNode } from "react";

import { PageHeader } from "@/components/PageHeader";
import { pageMetadata } from "@/lib/metadata";
import { BRAND_NAME } from "@/lib/utils";

export const metadata: Metadata = pageMetadata({
  title: "Privacy Policy",
  description: "Privacy policy for the Mystic AI Studio template.",
  path: "/privacy"
});

export default function PrivacyPage() {
  return (
    <>
      <PageHeader
        eyebrow="Privacy"
        title="Privacy Policy"
        description="A starter privacy page for this open-source style template. Review it with qualified counsel before commercial use."
      />
      <LegalContent>
        <h2>Information you provide</h2>
        <p>
          {BRAND_NAME} may process the information you enter into reading tools,
          including questions, dream descriptions, names, zodiac signs, optional
          birth dates, and launch-help form details. The default template does
          not include a paid database, but your deployment may add one.
        </p>
        <h2>Local history</h2>
        <p>
          Reading history is stored in the visitor browser using localStorage.
          It is not synced to a server by default. Visitors can clear it by
          clearing site data in their browser.
        </p>
        <h2>Account data</h2>
        <p>
          If registration is enabled, this template stores email addresses,
          password hashes, roles, and account timestamps in the configured local
          auth data store. Passwords are not stored in plain text. Update this
          section if you connect an external database or identity provider.
        </p>
        <h2>AI providers</h2>
        <p>
          If an API key is configured, reading prompts may be sent to your chosen
          OpenAI-compatible provider. Review the provider terms and privacy
          practices before launch, and disclose the provider you use.
        </p>
        <h2>Launch-help requests</h2>
        <p>
          Launch-help form submissions are sent to this template API route. If
          you configure a webhook, those details may be sent to your email, CRM,
          automation tool, or database provider.
        </p>
        <h2>Retention and deletion</h2>
        <p>
          Set your own retention period before launch. If you store form
          submissions or reading histories on a server, provide a way for users
          to request access or deletion.
        </p>
        <h2>International transfers</h2>
        <p>
          AI providers, hosting platforms, and webhook tools may process data in
          the United States or other countries. Update this section with your
          actual vendors and regions.
        </p>
        <h2>Contact</h2>
        <p>
          Replace this placeholder with your support email, company address, and
          required regional disclosures.
        </p>
      </LegalContent>
    </>
  );
}

function LegalContent({ children }: { children: ReactNode }) {
  return (
    <section className="mx-auto max-w-3xl px-4 py-12 text-sm leading-7 text-stone-300 sm:px-6 lg:px-8">
      <div className="space-y-7 [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-white">
        {children}
      </div>
    </section>
  );
}
