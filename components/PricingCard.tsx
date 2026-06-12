import Link from "next/link";
import { Check, Star } from "lucide-react";

import { cn } from "@/lib/utils";

export function PricingCard({
  name,
  price,
  description,
  features,
  href,
  cta,
  featured = false
}: {
  name: string;
  price: string;
  description: string;
  features: string[];
  href: string;
  cta: string;
  featured?: boolean;
}) {
  return (
    <article
      className={cn(
        "panel flex h-full flex-col rounded-lg p-6",
        featured && "border-brass/45 shadow-glow"
      )}
    >
      {featured ? (
        <p className="mb-4 inline-flex w-fit items-center gap-2 rounded-md border border-brass/30 bg-brass/10 px-3 py-1 text-xs font-semibold text-brass">
          <Star className="h-3.5 w-3.5" aria-hidden="true" />
          Popular
        </p>
      ) : null}
      <h3 className="text-xl font-semibold text-white">{name}</h3>
      <p className="mt-3 text-3xl font-semibold text-brass">{price}</p>
      <p className="mt-3 text-sm leading-6 text-stone-300">{description}</p>
      <ul className="mt-6 flex-1 space-y-3">
        {features.map((feature) => (
          <li key={feature} className="flex gap-3 text-sm leading-6 text-stone-200">
            <Check className="mt-1 h-4 w-4 shrink-0 text-tide" aria-hidden="true" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>
      <Link href={href} className={cn("mt-7", featured ? "button-primary" : "button-secondary")}>
        {cta}
      </Link>
    </article>
  );
}
