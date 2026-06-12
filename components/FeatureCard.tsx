import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowRight } from "lucide-react";

export function FeatureCard({
  icon,
  title,
  description,
  href,
  label = "Open"
}: {
  icon: ReactNode;
  title: string;
  description: string;
  href?: string;
  label?: string;
}) {
  return (
    <article className="panel flex h-full flex-col rounded-lg p-5">
      <div className="grid h-11 w-11 place-items-center rounded-md border border-brass/30 bg-brass/10 text-brass">
        {icon}
      </div>
      <h3 className="mt-5 text-lg font-semibold text-white">{title}</h3>
      <p className="mt-3 flex-1 text-sm leading-6 text-stone-300">{description}</p>
      {href ? (
        <Link href={href} className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-brass">
          {label}
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      ) : (
        <p className="mt-5 text-sm font-medium text-stone-500">{label}</p>
      )}
    </article>
  );
}
