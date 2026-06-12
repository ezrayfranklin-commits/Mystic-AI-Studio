"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Sparkles, X } from "lucide-react";
import { useState } from "react";

import { AuthButtons } from "@/components/AuthButtons";
import { BRAND_NAME, cn } from "@/lib/utils";

const navItems = [
  { href: "/tarot", label: "Tarot" },
  { href: "/horoscope", label: "Horoscope" },
  { href: "/dream", label: "Dream" },
  { href: "/compatibility", label: "Compatibility" },
  { href: "/pricing", label: "Pricing" },
  { href: "/source-code", label: "Source Code" }
];

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-night/86 backdrop-blur-xl">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="focus-ring inline-flex items-center gap-3 rounded-md text-sm font-semibold text-white"
          onClick={() => setOpen(false)}
        >
          <span className="grid h-9 w-9 place-items-center rounded-md border border-brass/40 bg-brass/15 text-brass">
            <Sparkles className="h-4 w-4" aria-hidden="true" />
          </span>
          <span>{BRAND_NAME}</span>
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "button-ghost",
                pathname === item.href && "bg-white/[0.1] text-brass"
              )}
            >
              {item.label}
            </Link>
          ))}
          <div className="ml-2 border-l border-white/10 pl-3">
            <AuthButtons />
          </div>
        </div>

        <button
          type="button"
          className="button-ghost md:hidden"
          aria-label="Toggle navigation"
          aria-expanded={open}
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      {open ? (
        <div className="border-t border-white/10 bg-night/96 px-4 py-3 md:hidden">
          <div className="mx-auto grid max-w-7xl gap-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "button-ghost justify-start",
                  pathname === item.href && "bg-white/[0.1] text-brass"
                )}
                onClick={() => setOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <div className="mt-2 border-t border-white/10 pt-3">
              <AuthButtons mobile onNavigate={() => setOpen(false)} />
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
}
