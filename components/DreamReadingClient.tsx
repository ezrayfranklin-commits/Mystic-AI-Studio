"use client";

import { useEffect, useState, type FormEvent } from "react";
import { Moon } from "lucide-react";

import { LoadingSpinner } from "@/components/LoadingSpinner";
import { ReadingCard } from "@/components/ReadingCard";
import { ResultPanel } from "@/components/ResultPanel";
import {
  addHistoryItem,
  createHistoryId,
  formatHistoryDate,
  readHistory,
  type ReadingHistoryItem
} from "@/lib/history";
import { compactText } from "@/lib/utils";
import type { AiResult, DreamReadingResult } from "@/types/reading";

const historyKey = "mystic-history-dream";

export function DreamReadingClient() {
  const [dream, setDream] = useState("");
  const [result, setResult] = useState<AiResult<DreamReadingResult> | null>(null);
  const [history, setHistory] = useState<ReadingHistoryItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setHistory(readHistory(historyKey));
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const response = await fetch("/api/readings/dream", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dream })
      });
      const payload = (await response.json()) as
        | AiResult<DreamReadingResult>
        | { error: string };

      if (!response.ok || "error" in payload) {
        throw new Error("error" in payload ? payload.error : "Unable to interpret dream.");
      }

      const createdAt = new Date().toISOString();
      const dreamExcerpt = compactText(dream, 72);

      setResult(payload);
      setHistory(
        addHistoryItem(historyKey, {
          id: createHistoryId(),
          title: payload.data.title,
          summary: compactText(payload.data.possibleMeaning, 140),
          createdAt,
          meta: `${dreamExcerpt} · ${formatHistoryDate(createdAt)}`
        })
      );
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "Something went wrong while interpreting the dream."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[0.88fr_1.12fr]">
      <div className="grid gap-6">
        <ReadingCard
          title="Dream interpreter"
          description="Describe the scene, mood, symbols, and the feeling that lingered after waking."
        >
          <form className="grid gap-4" onSubmit={handleSubmit}>
            <label>
              <span className="mb-2 block text-sm font-medium text-stone-200">
                Dream description
              </span>
              <textarea
                required
                value={dream}
                maxLength={1800}
                onChange={(event) => setDream(event.target.value)}
                className="focus-ring min-h-52 w-full resize-y rounded-md border border-white/10 bg-black/25 px-3 py-3 text-sm text-white placeholder:text-stone-500"
                placeholder="I was walking through a quiet house and found..."
              />
            </label>
            <button disabled={loading} type="submit" className="button-primary disabled:cursor-not-allowed disabled:opacity-60">
              <Moon className="h-4 w-4" aria-hidden="true" />
              Interpret Dream
            </button>
            <p className="text-xs leading-5 text-stone-500">
              Avoid entering secrets or identifying details. If an API key is
              configured, dream text may be sent to your selected AI provider;
              recent results stay in this browser.
            </p>
          </form>
        </ReadingCard>

        {history.length ? (
          <ReadingCard title="Recent dreams">
            <ul className="space-y-3">
              {history.slice(0, 3).map((item) => (
                <li key={item.id} className="rounded-lg border border-white/10 bg-black/15 p-3">
                  <p className="text-sm font-semibold text-white">{item.title}</p>
                  {item.meta ? (
                    <p className="mt-1 text-xs text-brass">{item.meta}</p>
                  ) : null}
                  <p className="mt-1 text-xs leading-5 text-stone-400">{item.summary}</p>
                </li>
              ))}
            </ul>
          </ReadingCard>
        ) : null}
      </div>

      <div className="grid gap-4 content-start">
        {loading ? <LoadingSpinner label="Interpreting symbols" /> : null}
        {error ? (
          <p className="rounded-lg border border-rose-300/25 bg-rose-300/10 p-4 text-sm text-rose-100">
            {error}
          </p>
        ) : null}
        {result ? (
          <ResultPanel
            title={result.data.title}
            mode={result.mode}
            warning={result.warning}
            shareText={[
              result.data.title,
              `Symbols: ${result.data.keySymbols.join(", ")}`,
              result.data.emotionalTheme,
              result.data.possibleMeaning,
              result.data.reflectionQuestion
            ].join("\n\n")}
            sections={[
              { title: "Key symbols", items: result.data.keySymbols },
              { title: "Emotional theme", content: result.data.emotionalTheme },
              { title: "Possible meaning", content: result.data.possibleMeaning },
              { title: "Reflection question", content: result.data.reflectionQuestion }
            ]}
          />
        ) : (
          <div className="panel rounded-lg p-6 text-sm leading-6 text-stone-300">
            Dream readings stay symbolic and reflective, with no clinical claims or diagnosis.
          </div>
        )}
      </div>
    </div>
  );
}
