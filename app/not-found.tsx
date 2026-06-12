import Link from "next/link";
import { Compass, Home, Sparkles } from "lucide-react";

export default function NotFound() {
  return (
    <section className="mx-auto grid min-h-[70svh] max-w-3xl place-items-center px-4 py-16 text-center sm:px-6 lg:px-8">
      <div>
        <div className="mx-auto grid h-14 w-14 place-items-center rounded-md border border-brass/35 bg-brass/15 text-brass">
          <Compass className="h-7 w-7" aria-hidden="true" />
        </div>
        <h1 className="mt-6 text-4xl font-semibold text-white">Page not found</h1>
        <p className="mt-4 text-sm leading-6 text-stone-300">
          This path is not part of the current template. Return home or start a
          reading from the main studio.
        </p>
        <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
          <Link href="/" className="button-primary">
            <Home className="h-4 w-4" aria-hidden="true" />
            Go Home
          </Link>
          <Link href="/tarot" className="button-secondary">
            <Sparkles className="h-4 w-4" aria-hidden="true" />
            Try Tarot
          </Link>
        </div>
      </div>
    </section>
  );
}
