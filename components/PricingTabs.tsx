"use client";

import { useState, type KeyboardEvent } from "react";
import { Check, Coins, Crown, Rocket, Sparkles } from "lucide-react";

import { cn } from "@/lib/utils";

const servicePlans = [
  {
    icon: <Sparkles className="h-6 w-6" aria-hidden="true" />,
    name: "Free Source Code",
    price: "$0",
    period: "self-host",
    badge: "Open template",
    cta: "Get Source Code",
    href: "/source-code",
    features: [
      "Run locally or in Docker",
      "Mock AI mode included",
      "Customize brand and prompts",
      "Deploy yourself to Vercel"
    ]
  },
  {
    icon: <Rocket className="h-6 w-6" aria-hidden="true" />,
    name: "Launch Help",
    price: "$99-$299",
    period: "one-time",
    badge: "Popular service",
    cta: "Book Launch Help",
    href: "/launch-help",
    featured: true,
    features: [
      "Vercel deployment",
      "Domain connection",
      "API key configuration",
      "Basic branding updates"
    ]
  },
  {
    icon: <Crown className="h-6 w-6" aria-hidden="true" />,
    name: "Custom Pro Setup",
    price: "$499+",
    period: "project",
    badge: "Custom build",
    cta: "Request Setup",
    href: "/launch-help",
    features: [
      "Custom design",
      "Payment integration",
      "SEO page expansion",
      "Analytics and multilingual setup"
    ]
  }
];

const consumerPlans = [
  {
    icon: <Crown className="h-6 w-6" aria-hidden="true" />,
    name: "Membership Concept",
    price: "Example",
    period: "monthly access",
    badge: "Planning only",
    cta: "Plan Payment Setup",
    href: "/launch-help",
    featured: true,
    features: [
      "Potential monthly reading allowance",
      "Potential saved account history",
      "Requires authentication and billing",
      "Not active in this template"
    ]
  },
  {
    icon: <Sparkles className="h-6 w-6" aria-hidden="true" />,
    name: "Annual Concept",
    price: "Example",
    period: "annual access",
    badge: "Planning only",
    cta: "Plan Payment Setup",
    href: "/launch-help",
    features: [
      "Potential yearly package",
      "Potential annual forecast bonus",
      "Requires entitlement logic",
      "No checkout is wired yet"
    ]
  },
  {
    icon: <Coins className="h-6 w-6" aria-hidden="true" />,
    name: "Credit Pack Concept",
    price: "Example",
    period: "pay as you go",
    badge: "Planning only",
    cta: "Plan Payment Setup",
    href: "/launch-help",
    features: [
      "Potential per-reading credit model",
      "Requires fraud and refund handling",
      "Requires payment webhooks",
      "Not sold by this MVP"
    ]
  }
];

export function PricingTabs() {
  const [mode, setMode] = useState<"services" | "consumer">("services");
  const plans = mode === "services" ? servicePlans : consumerPlans;
  const panelId = "pricing-panel";
  const selectedTabId = mode === "services" ? "pricing-tab-services" : "pricing-tab-consumer";

  const handleTabKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") {
      return;
    }

    event.preventDefault();
    setMode((currentMode) => (currentMode === "services" ? "consumer" : "services"));
  };

  return (
    <div>
      <div
        role="tablist"
        aria-label="Pricing views"
        className="mx-auto flex w-full max-w-md rounded-lg border border-white/10 bg-black/20 p-1"
      >
        <button
          id="pricing-tab-services"
          role="tab"
          type="button"
          aria-selected={mode === "services"}
          aria-controls={panelId}
          tabIndex={mode === "services" ? 0 : -1}
          className={cn(
            "focus-ring flex-1 rounded-md px-4 py-3 text-sm font-semibold transition",
            mode === "services"
              ? "bg-brass text-night shadow-glow"
              : "text-stone-300 hover:bg-white/[0.08] hover:text-white"
          )}
          onClick={() => setMode("services")}
          onKeyDown={handleTabKeyDown}
        >
          Launch Services
        </button>
        <button
          id="pricing-tab-consumer"
          role="tab"
          type="button"
          aria-selected={mode === "consumer"}
          aria-controls={panelId}
          tabIndex={mode === "consumer" ? 0 : -1}
          className={cn(
            "focus-ring flex-1 rounded-md px-4 py-3 text-sm font-semibold transition",
            mode === "consumer"
              ? "bg-brass text-night shadow-glow"
              : "text-stone-300 hover:bg-white/[0.08] hover:text-white"
          )}
          onClick={() => setMode("consumer")}
          onKeyDown={handleTabKeyDown}
        >
          Monetization Ideas
        </button>
      </div>

      <section
        id={panelId}
        role="tabpanel"
        aria-labelledby={selectedTabId}
        tabIndex={0}
        className="focus:outline-none"
      >
        {mode === "consumer" ? (
          <div className="mt-6 rounded-lg border border-amber-300/20 bg-amber-300/10 p-4 text-sm leading-6 text-amber-100">
            These are implementation ideas for site owners, not live plans for
            visitors. No membership, credit balance, checkout, or paid entitlement
            exists until you add a payment backend.
          </div>
        ) : null}

        <div className="mt-8 grid gap-4 lg:grid-cols-3">
          {plans.map((plan, index) => (
            <article
              key={plan.name}
              className={cn(
                "panel animate-fade-up flex h-full flex-col overflow-hidden rounded-lg p-6 transition duration-300 hover:-translate-y-1",
                plan.featured && "border-brass/45 shadow-glow"
              )}
              style={{ animationDelay: `${index * 80}ms` }}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="grid h-12 w-12 place-items-center rounded-md border border-brass/30 bg-brass/10 text-brass">
                  {plan.icon}
                </div>
                <span className="rounded-md border border-white/10 bg-white/[0.07] px-3 py-1 text-xs font-semibold text-brass">
                  {plan.badge}
                </span>
              </div>
              <h3 className="mt-5 text-xl font-semibold text-white">{plan.name}</h3>
              <div className="mt-3 flex items-end gap-2">
                <p className="text-3xl font-semibold text-brass">{plan.price}</p>
                <p className="pb-1 text-sm text-stone-400">{plan.period}</p>
              </div>
              <ul className="mt-6 flex-1 space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex gap-3 text-sm leading-6 text-stone-200">
                    <Check className="mt-1 h-4 w-4 shrink-0 text-tide" aria-hidden="true" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <a href={plan.href} className={cn("mt-7", plan.featured ? "button-primary" : "button-secondary")}>
                {plan.cta}
              </a>
            </article>
          ))}
        </div>
      </section>

      <p className="mt-6 text-sm leading-6 text-stone-400">
        Payment checkout, entitlement logic, refunds, invoices, and webhooks are
        intentionally outside this MVP.
      </p>
    </div>
  );
}
