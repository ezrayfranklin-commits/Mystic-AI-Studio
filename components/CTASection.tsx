import Link from "next/link";
import { ArrowRight, Code2, Rocket } from "lucide-react";

export function CTASection({
  title = "Launch your own AI divination site",
  description = "Use the free source code, connect any OpenAI-compatible API, and customize the brand, prompts, and service pages.",
  primaryHref = "/source-code",
  primaryLabel = "Get Free Source Code",
  secondaryHref = "/launch-help",
  secondaryLabel = "Need Help Launching?"
}: {
  title?: string;
  description?: string;
  primaryHref?: string;
  primaryLabel?: string;
  secondaryHref?: string;
  secondaryLabel?: string;
}) {
  return (
    <section className="border-y border-white/10 bg-white/[0.035]">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-12 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <div className="max-w-2xl">
          <h2 className="text-2xl font-semibold text-white sm:text-3xl">{title}</h2>
          <p className="mt-3 text-sm leading-6 text-stone-300 sm:text-base">
            {description}
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Link href={primaryHref} className="button-primary">
            <Code2 className="h-4 w-4" aria-hidden="true" />
            {primaryLabel}
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
          <Link href={secondaryHref} className="button-secondary">
            <Rocket className="h-4 w-4" aria-hidden="true" />
            {secondaryLabel}
          </Link>
        </div>
      </div>
    </section>
  );
}
