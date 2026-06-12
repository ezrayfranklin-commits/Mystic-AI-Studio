"use client";

import { useMemo, useState, type ReactNode } from "react";
import { Check, Copy, Share2, Sparkles } from "lucide-react";

import type { AiMode } from "@/types/reading";

export type ResultSection = {
  title: string;
  content?: ReactNode;
  items?: string[];
};

export function ResultPanel({
  title,
  summary,
  sections,
  mode,
  warning,
  shareText
}: {
  title: string;
  summary?: string;
  sections: ResultSection[];
  mode?: AiMode;
  warning?: string;
  shareText?: string;
}) {
  const [actionStatus, setActionStatus] = useState("");
  const fallbackShareText = useMemo(
    () => [title, summary].filter(Boolean).join("\n\n"),
    [summary, title]
  );
  const textToShare = shareText || fallbackShareText;

  const copyResult = async () => {
    try {
      await navigator.clipboard.writeText(textToShare);
      setActionStatus("Result copied.");
    } catch {
      setActionStatus("Copy failed. Select the result text and copy it manually.");
    }
  };

  const shareResult = async () => {
    if ("share" in navigator) {
      try {
        await navigator.share({
          title,
          text: textToShare,
          url: window.location.href
        });
        setActionStatus("Share sheet opened.");
        return;
      } catch {
        setActionStatus("Share was canceled.");
        return;
      }
    }

    await copyResult();
  };

  return (
    <section className="panel rounded-lg p-5 sm:p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="inline-flex items-center gap-2 text-sm font-semibold text-brass">
            <Sparkles className="h-4 w-4" aria-hidden="true" />
            Reading Result
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-white">{title}</h2>
        </div>
        {mode ? (
          <span className="w-fit rounded-md border border-white/10 bg-white/[0.07] px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-stone-300">
            {mode === "ai" ? "AI" : "Mock"} mode
          </span>
        ) : null}
      </div>

      {summary ? <p className="mt-4 text-sm leading-6 text-stone-200">{summary}</p> : null}
      {warning ? (
        <p className="mt-4 rounded-md border border-amber-300/20 bg-amber-300/10 p-3 text-sm leading-6 text-amber-100">
          {warning}
        </p>
      ) : null}

      <div className="mt-5 flex flex-col gap-3 sm:flex-row">
        <button type="button" className="button-secondary" onClick={copyResult}>
          <Copy className="h-4 w-4" aria-hidden="true" />
          Copy Result
        </button>
        <button type="button" className="button-secondary" onClick={shareResult}>
          <Share2 className="h-4 w-4" aria-hidden="true" />
          Share Result
        </button>
      </div>
      {actionStatus ? (
        <p className="mt-3 inline-flex items-center gap-2 rounded-md border border-tide/25 bg-tide/10 px-3 py-2 text-sm text-teal-100">
          <Check className="h-4 w-4" aria-hidden="true" />
          {actionStatus}
        </p>
      ) : null}

      <div className="mt-6 grid gap-4">
        {sections.map((section) => (
          <section
            key={section.title}
            className="rounded-lg border border-white/10 bg-black/15 p-4"
          >
            <h3 className="text-sm font-semibold uppercase tracking-[0.16em] text-brass">
              {section.title}
            </h3>
            {section.content ? (
              <div className="mt-3 text-sm leading-6 text-stone-200">{section.content}</div>
            ) : null}
            {section.items ? (
              <ul className="mt-3 space-y-2 text-sm leading-6 text-stone-200">
                {section.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            ) : null}
          </section>
        ))}
      </div>
    </section>
  );
}
