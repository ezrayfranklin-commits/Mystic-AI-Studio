import Link from "next/link";
import { ArrowRight, Code2, Rocket, WandSparkles } from "lucide-react";

import { MysticBackdrop } from "@/components/MysticBackdrop";
import { BRAND_NAME } from "@/lib/utils";

export function Hero() {
  return (
    <section className="relative isolate min-h-[76svh] overflow-hidden border-b border-white/10">
      <MysticBackdrop />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,9,19,0.2)_0%,rgba(8,9,19,0.72)_74%,rgba(8,9,19,0.96)_100%)]" />

      <div className="relative mx-auto flex min-h-[76svh] max-w-7xl items-center px-4 py-20 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <p className="animate-fade-up mb-5 inline-flex rounded-md border border-brass/35 bg-black/20 px-3 py-2 text-sm font-medium text-brass backdrop-blur">
            Free source code for an AI divination web app
          </p>
          <h1 className="animate-fade-up max-w-4xl text-5xl font-semibold tracking-normal text-white sm:text-6xl lg:text-7xl [animation-delay:90ms]">
            {BRAND_NAME}
          </h1>
          <p className="animate-fade-up mt-6 max-w-2xl text-lg leading-8 text-stone-200 sm:text-xl [animation-delay:180ms]">
            AI tarot, daily horoscope, dream interpretation, and love
            compatibility in a clean template that runs locally, deploys to
            Vercel, and works in mock mode without an API key.
          </p>

          <div className="animate-fade-up mt-9 flex flex-col gap-3 sm:flex-row [animation-delay:270ms]">
            <Link href="/tarot" className="button-primary animate-pulse-glow">
              <WandSparkles className="h-4 w-4" aria-hidden="true" />
              Try Free Reading
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <Link href="/source-code" className="button-secondary">
              <Code2 className="h-4 w-4" aria-hidden="true" />
              Get Free Source Code
            </Link>
            <Link href="/launch-help" className="button-secondary">
              <Rocket className="h-4 w-4" aria-hidden="true" />
              Need Help Launching?
            </Link>
          </div>

          <div className="animate-fade-up mt-10 grid max-w-xl grid-cols-3 gap-3 [animation-delay:360ms]">
            {[
              ["4", "Live tools"],
              ["5", "Demo modules"],
              ["0", "Database needed"],
              ["3", "Local credits"]
            ].map(([value, label]) => (
              <div key={label} className="rounded-lg border border-white/10 bg-black/20 p-4 backdrop-blur">
                <p className="text-2xl font-semibold text-brass">{value}</p>
                <p className="mt-1 text-xs text-stone-400">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
