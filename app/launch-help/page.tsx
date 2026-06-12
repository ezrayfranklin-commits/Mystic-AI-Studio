import type { Metadata } from "next";
import { CheckCircle2 } from "lucide-react";

import { LaunchHelpForm } from "@/components/LaunchHelpForm";
import { PageHeader } from "@/components/PageHeader";
import { pageMetadata } from "@/lib/metadata";

export const metadata: Metadata = pageMetadata({
  title: "Launch Help",
  description:
    "Request paid deployment and customization help for your AI tarot, horoscope, dream, and compatibility website.",
  path: "/launch-help"
});

const included = [
  "Vercel deployment",
  "Domain connection guidance",
  "OpenAI or OpenRouter API setup",
  "Basic brand name and copy updates",
  "A short handoff note for future edits"
];

export default function LaunchHelpPage() {
  return (
    <>
      <PageHeader
        eyebrow="Launch Help"
        title="Get the template online with guided setup"
        description="Use this MVP form as a placeholder for Formspree, Resend, a CRM, or your own database-backed intake flow."
      />
      <section className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[0.78fr_1.22fr] lg:px-8">
        <aside className="panel h-fit rounded-lg p-6">
          <h2 className="text-xl font-semibold text-white">Included in launch help</h2>
          <ul className="mt-5 space-y-3">
            {included.map((item) => (
              <li key={item} className="flex gap-3 text-sm leading-6 text-stone-200">
                <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-tide" aria-hidden="true" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </aside>
        <LaunchHelpForm />
      </section>
    </>
  );
}
