import Link from "next/link";
import { Github, Mail, Sparkles } from "lucide-react";

import { BRAND_NAME, DISCLAIMER_TEXT } from "@/lib/utils";

const readingLinks = [
  { href: "/tarot", label: "AI Tarot Reading" },
  { href: "/horoscope", label: "Daily Horoscope" },
  { href: "/dream", label: "Dream Interpretation" },
  { href: "/compatibility", label: "Love Compatibility" }
];

const serviceLinks = [
  { href: "/source-code", label: "Free Source Code" },
  { href: "/pricing", label: "Pricing" },
  { href: "/launch-help", label: "Launch Help" }
];

const legalLinks = [
  { href: "/privacy", label: "Privacy" },
  { href: "/terms", label: "Terms" },
  { href: "/disclaimer", label: "Disclaimer" }
];

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-night">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-[1.4fr_1fr_1fr_1fr] lg:px-8">
        <div>
          <Link href="/" className="inline-flex items-center gap-3 text-white">
            <span className="grid h-9 w-9 place-items-center rounded-md border border-brass/40 bg-brass/15 text-brass">
              <Sparkles className="h-4 w-4" aria-hidden="true" />
            </span>
            <span className="font-semibold">{BRAND_NAME}</span>
          </Link>
          <p className="mt-4 max-w-md text-sm leading-6 text-stone-300">
            An open-source style AI divination template for tarot, astrology,
            dreams, and playful self-reflection.
          </p>
          <p className="mt-4 text-xs leading-5 text-stone-500">{DISCLAIMER_TEXT}</p>
        </div>

        <FooterGroup title="Readings" links={readingLinks} />
        <FooterGroup title="Build" links={serviceLinks} />
        <FooterGroup title="Legal" links={legalLinks} />
      </div>

      <div className="border-t border-white/10 px-4 py-5 text-sm text-stone-400">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p>Copyright {new Date().getFullYear()} {BRAND_NAME}. All rights reserved.</p>
          <div className="flex gap-3">
            <Link className="button-ghost" href="/source-code">
              <Github className="h-4 w-4" aria-hidden="true" />
              GitHub
            </Link>
            <Link className="button-ghost" href="/launch-help">
              <Mail className="h-4 w-4" aria-hidden="true" />
              Contact
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterGroup({
  title,
  links
}: {
  title: string;
  links: { href: string; label: string }[];
}) {
  return (
    <div>
      <h2 className="text-sm font-semibold text-white">{title}</h2>
      <ul className="mt-4 space-y-3">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="text-sm text-stone-300 transition hover:text-brass"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
