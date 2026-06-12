import { AlertTriangle } from "lucide-react";

import { DISCLAIMER_TEXT } from "@/lib/utils";

export function DisclaimerBanner() {
  return (
    <aside className="rounded-lg border border-amber-300/20 bg-amber-300/10 p-4 text-sm leading-6 text-amber-100">
      <div className="flex gap-3">
        <AlertTriangle className="mt-1 h-4 w-4 shrink-0 text-brass" aria-hidden="true" />
        <p>{DISCLAIMER_TEXT}</p>
      </div>
    </aside>
  );
}
