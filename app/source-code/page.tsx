import type { Metadata } from "next";
import Link from "next/link";
import { Github, Rocket } from "lucide-react";

import { CTASection } from "@/components/CTASection";
import { PageHeader } from "@/components/PageHeader";
import { pageMetadata } from "@/lib/metadata";

export const metadata: Metadata = pageMetadata({
  title: "Free Source Code",
  description:
    "Get the free source code for an AI tarot, horoscope, dream, and compatibility web app template.",
  path: "/source-code"
});

const setupSteps = [
  "Clone the repository",
  "Install dependencies with npm install",
  "Copy .env.example to .env.local",
  "Add AI_API_KEY, AI_BASE_URL, and AI_MODEL when you want real AI output",
  "Run npm run dev",
  "Deploy to Vercel"
];

export default function SourceCodePage() {
  const repositoryUrl = process.env.SOURCE_REPO_URL || "";

  return (
    <>
      <PageHeader
        eyebrow="Free Source Code"
        title="Use the template for your own AI divination site"
        description="The code is designed to be easy to rename, restyle, and deploy. It works locally in mock mode before any AI provider is connected."
      />
      <section className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[1fr_0.8fr] lg:px-8">
        <div>
          <h2 className="text-2xl font-semibold text-white">Setup summary</h2>
          <ol className="mt-6 grid gap-3">
            {setupSteps.map((step, index) => (
              <li key={step} className="panel rounded-lg p-4 text-sm text-stone-200">
                <span className="mr-3 font-semibold text-brass">{index + 1}.</span>
                {step}
              </li>
            ))}
          </ol>
        </div>

        <aside className="panel h-fit rounded-lg p-6">
          <h2 className="text-xl font-semibold text-white">Repository</h2>
          {repositoryUrl ? (
            <>
              <p className="mt-3 text-sm leading-6 text-stone-300">
                Open the public repository to fork or download the current
                template source code.
              </p>
              <a
                href={repositoryUrl}
                className="button-primary mt-6"
                target="_blank"
                rel="noreferrer"
              >
                <Github className="h-4 w-4" aria-hidden="true" />
                Open Repository
              </a>
            </>
          ) : (
            <>
              <p className="mt-3 text-sm leading-6 text-stone-300">
                This local build has no public repository URL configured. Set
                <span className="mx-1 rounded bg-black/25 px-1.5 py-0.5 font-mono text-xs text-brass">
                  SOURCE_REPO_URL
                </span>
                before publishing this page, or route visitors to launch help
                until the repo is public.
              </p>
              <Link href="/launch-help" className="button-primary mt-6">
                <Rocket className="h-4 w-4" aria-hidden="true" />
                Request Source Access
              </Link>
            </>
          )}
          <Link href="/launch-help" className="button-secondary mt-3">
            <Rocket className="h-4 w-4" aria-hidden="true" />
            Need Help Launching?
          </Link>
        </aside>
      </section>
      <CTASection
        title="If deployment feels difficult, we can launch it for you."
        description="The paid launch help path covers Vercel deployment, domain setup, API key configuration, and basic branding."
        primaryHref="/launch-help"
        primaryLabel="Need Help Launching?"
        secondaryHref="/pricing"
        secondaryLabel="View Pricing"
      />
    </>
  );
}
