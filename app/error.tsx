"use client";

import { RotateCcw, Sparkles } from "lucide-react";

export default function Error({
  reset
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <section className="mx-auto grid min-h-[70svh] max-w-3xl place-items-center px-4 py-16 text-center sm:px-6 lg:px-8">
      <div>
        <div className="mx-auto grid h-14 w-14 place-items-center rounded-md border border-brass/35 bg-brass/15 text-brass">
          <Sparkles className="h-7 w-7" aria-hidden="true" />
        </div>
        <h1 className="mt-6 text-4xl font-semibold text-white">Something paused the reading</h1>
        <p className="mt-4 text-sm leading-6 text-stone-300">
          The app hit an unexpected error. You can retry without losing the
          template code or Docker deployment.
        </p>
        <button type="button" className="button-primary mt-7" onClick={reset}>
          <RotateCcw className="h-4 w-4" aria-hidden="true" />
          Try Again
        </button>
      </div>
    </section>
  );
}
