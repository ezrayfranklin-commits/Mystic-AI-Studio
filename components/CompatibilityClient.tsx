"use client";

import { useEffect, useState, type FormEvent } from "react";
import { HeartHandshake } from "lucide-react";

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
import type { AiResult, CompatibilityResult } from "@/types/reading";

const historyKey = "mystic-history-compatibility";

const zodiacSigns = [
  "",
  "Aries",
  "Taurus",
  "Gemini",
  "Cancer",
  "Leo",
  "Virgo",
  "Libra",
  "Scorpio",
  "Sagittarius",
  "Capricorn",
  "Aquarius",
  "Pisces"
];

export function CompatibilityClient() {
  const [nameA, setNameA] = useState("");
  const [nameB, setNameB] = useState("");
  const [signA, setSignA] = useState("");
  const [signB, setSignB] = useState("");
  const [birthDateA, setBirthDateA] = useState("");
  const [birthDateB, setBirthDateB] = useState("");
  const [result, setResult] = useState<AiResult<CompatibilityResult> | null>(null);
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
      const response = await fetch("/api/readings/compatibility", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nameA,
          nameB,
          signA,
          signB,
          birthDateA,
          birthDateB
        })
      });
      const payload = (await response.json()) as
        | AiResult<CompatibilityResult>
        | { error: string };

      if (!response.ok || "error" in payload) {
        throw new Error(
          "error" in payload ? payload.error : "Unable to generate compatibility reading."
        );
      }

      const createdAt = new Date().toISOString();
      const signPair = [signA, signB].filter(Boolean).join(" + ");
      const metaParts = [`${nameA} + ${nameB}`];
      if (signPair) {
        metaParts.push(signPair);
      }
      metaParts.push(formatHistoryDate(createdAt));

      setResult(payload);
      setHistory(
        addHistoryItem(historyKey, {
          id: createHistoryId(),
          title: payload.data.title,
          summary: compactText(payload.data.emotionalDynamic, 140),
          createdAt,
          meta: metaParts.join(" · ")
        })
      );
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "Something went wrong while generating compatibility."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
      <div className="grid gap-6">
        <ReadingCard
          title="Compatibility reading"
          description="Names are required. Zodiac signs and birth dates add extra flavor when available."
        >
          <form className="grid gap-4" onSubmit={handleSubmit}>
            <div className="grid gap-4 sm:grid-cols-2">
              <TextField label="Name A" value={nameA} onChange={setNameA} required />
              <TextField label="Name B" value={nameB} onChange={setNameB} required />
              <SignField label="Zodiac A" value={signA} onChange={setSignA} />
              <SignField label="Zodiac B" value={signB} onChange={setSignB} />
              <TextField label="Birth date A" type="date" value={birthDateA} onChange={setBirthDateA} />
              <TextField label="Birth date B" type="date" value={birthDateB} onChange={setBirthDateB} />
            </div>
            <button disabled={loading} type="submit" className="button-primary disabled:cursor-not-allowed disabled:opacity-60">
              <HeartHandshake className="h-4 w-4" aria-hidden="true" />
              Generate Compatibility
            </button>
            <p className="text-xs leading-5 text-stone-500">
              Names, optional signs, and optional birth dates are used only for a
              playful reflective result. Avoid entering sensitive details; scores
              are not judgments or predictions.
            </p>
          </form>
        </ReadingCard>

        {history.length ? (
          <ReadingCard title="Recent compatibility readings">
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
        {loading ? <LoadingSpinner label="Reading the dynamic" /> : null}
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
              `Reflective score: ${result.data.score}/100`,
              result.data.emotionalDynamic,
              `Strengths: ${result.data.strengths.join(", ")}`,
              `Challenges: ${result.data.challenges.join(", ")}`,
              result.data.advice
            ].join("\n\n")}
            sections={[
              {
                title: "Compatibility score",
                content: (
                  <div>
                    <div className="mb-2 flex items-center justify-between text-sm">
                      <span>{result.data.score}/100</span>
                      <span>Reflective score, not a prediction</span>
                    </div>
                    <div className="h-3 overflow-hidden rounded-md bg-white/10">
                      <div
                        className="h-full rounded-md bg-gradient-to-r from-tide via-brass to-ember"
                        style={{ width: `${result.data.score}%` }}
                      />
                    </div>
                  </div>
                )
              },
              { title: "Emotional dynamic", content: result.data.emotionalDynamic },
              { title: "Strengths", items: result.data.strengths },
              { title: "Challenges", items: result.data.challenges },
              { title: "Advice", content: result.data.advice }
            ]}
          />
        ) : (
          <div className="panel rounded-lg p-6 text-sm leading-6 text-stone-300">
            Compatibility scores are playful prompts for conversation, not fixed judgments.
          </div>
        )}
      </div>
    </div>
  );
}

function TextField({
  label,
  value,
  onChange,
  required = false,
  type = "text"
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  type?: string;
}) {
  return (
    <label>
      <span className="mb-2 block text-sm font-medium text-stone-200">{label}</span>
      <input
        required={required}
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="focus-ring w-full rounded-md border border-white/10 bg-black/25 px-3 py-3 text-sm text-white placeholder:text-stone-500"
      />
    </label>
  );
}

function SignField({
  label,
  value,
  onChange
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label>
      <span className="mb-2 block text-sm font-medium text-stone-200">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="focus-ring w-full rounded-md border border-white/10 bg-black/25 px-3 py-3 text-sm text-white"
      >
        {zodiacSigns.map((sign) => (
          <option key={sign || "none"} value={sign}>
            {sign || "Optional"}
          </option>
        ))}
      </select>
    </label>
  );
}
