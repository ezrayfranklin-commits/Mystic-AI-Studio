"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import { RefreshCcw, WandSparkles } from "lucide-react";

import { LoadingSpinner } from "@/components/LoadingSpinner";
import { ReadingCard } from "@/components/ReadingCard";
import { ResultPanel } from "@/components/ResultPanel";
import { TarotCard } from "@/components/TarotCard";
import { tarotDeck } from "@/data/tarotDeck";
import {
  addHistoryItem,
  createHistoryId,
  readHistory,
  type ReadingHistoryItem
} from "@/lib/history";
import { compactText } from "@/lib/utils";
import type {
  AiResult,
  DrawnTarotCard,
  SpreadType,
  TarotReadingResult
} from "@/types/reading";

const historyKey = "mystic-history-tarot";

const spreadOptions: { value: SpreadType; label: string; cards: number }[] = [
  { value: "one-card", label: "One-card reading", cards: 1 },
  { value: "three-card", label: "Three-card reading", cards: 3 },
  { value: "love", label: "Love reading", cards: 3 },
  { value: "career", label: "Career reading", cards: 3 },
  { value: "yes-no", label: "Yes/No reading", cards: 3 }
];

const positions: Record<SpreadType, string[]> = {
  "one-card": ["Focus"],
  "three-card": ["Past pattern", "Present energy", "Possible path"],
  love: ["You", "The connection", "Reflection"],
  career: ["Current skill", "Work energy", "Useful next step"],
  "yes-no": ["The answer", "Helpful context", "Next step"]
};

function drawCards(spreadType: SpreadType): DrawnTarotCard[] {
  const option = spreadOptions.find((spread) => spread.value === spreadType);
  const count = option?.cards || 1;
  const pool = [...tarotDeck];
  const drawn: DrawnTarotCard[] = [];

  for (let index = 0; index < count; index += 1) {
    const cardIndex = Math.floor(Math.random() * pool.length);
    const [card] = pool.splice(cardIndex, 1);
    drawn.push({
      ...card,
      position: positions[spreadType][index] || `Card ${index + 1}`
    });
  }

  return drawn;
}

export function TarotReadingClient() {
  const [question, setQuestion] = useState("");
  const [spreadType, setSpreadType] = useState<SpreadType>("three-card");
  const [cards, setCards] = useState<DrawnTarotCard[]>([]);
  const [result, setResult] = useState<AiResult<TarotReadingResult> | null>(null);
  const [history, setHistory] = useState<ReadingHistoryItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setHistory(readHistory(historyKey));
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  const selectedSpread = useMemo(
    () => spreadOptions.find((option) => option.value === spreadType),
    [spreadType]
  );

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setResult(null);
    const drawnCards = drawCards(spreadType);
    setCards(drawnCards);
    setLoading(true);

    try {
      const response = await fetch("/api/readings/tarot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question,
          spreadType,
          cards: drawnCards
        })
      });
      const payload = (await response.json()) as
        | AiResult<TarotReadingResult>
        | { error: string };

      if (!response.ok || "error" in payload) {
        throw new Error("error" in payload ? payload.error : "Unable to read cards.");
      }

      setResult(payload);
      setHistory(
        addHistoryItem(historyKey, {
          id: createHistoryId(),
          title: payload.data.title,
          summary: compactText(payload.data.summary, 140),
          createdAt: new Date().toISOString()
        })
      );
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "Something went wrong while generating the reading."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[0.92fr_1.08fr]">
      <div className="grid gap-6">
        <ReadingCard
          title="Ask the cards"
          description="Choose a spread, enter a question, and draw from the local Major Arcana deck."
        >
          <form className="grid gap-4" onSubmit={handleSubmit}>
            <label>
              <span className="mb-2 block text-sm font-medium text-stone-200">
                Spread type
              </span>
              <select
                value={spreadType}
                onChange={(event) => setSpreadType(event.target.value as SpreadType)}
                className="focus-ring w-full rounded-md border border-white/10 bg-black/25 px-3 py-3 text-sm text-white"
              >
                {spreadOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>

            <label>
              <span className="mb-2 block text-sm font-medium text-stone-200">
                Question
              </span>
              <textarea
                value={question}
                onChange={(event) => setQuestion(event.target.value)}
                maxLength={800}
                className="focus-ring min-h-36 w-full resize-y rounded-md border border-white/10 bg-black/25 px-3 py-3 text-sm text-white placeholder:text-stone-500"
                placeholder="What would be useful to reflect on right now?"
              />
            </label>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <button disabled={loading} type="submit" className="button-primary disabled:cursor-not-allowed disabled:opacity-60">
                <WandSparkles className="h-4 w-4" aria-hidden="true" />
                Draw {selectedSpread?.cards || 1} Card{selectedSpread?.cards === 1 ? "" : "s"}
              </button>
              <button
                disabled={loading}
                type="button"
                className="button-secondary disabled:cursor-not-allowed disabled:opacity-60"
                onClick={() => {
                  setCards(drawCards(spreadType));
                  setResult(null);
                  setError("");
                }}
              >
                <RefreshCcw className="h-4 w-4" aria-hidden="true" />
                Shuffle Preview
              </button>
            </div>
            <p className="text-xs leading-5 text-stone-500">
              Entertainment and self-reflection only. If an API key is configured,
              your question is sent to the selected AI provider; recent results
              are saved only in this browser.
            </p>
          </form>
        </ReadingCard>

        {history.length ? (
          <ReadingCard title="Recent tarot readings">
            <ul className="space-y-3">
              {history.slice(0, 3).map((item) => (
                <li key={item.id} className="rounded-lg border border-white/10 bg-black/15 p-3">
                  <p className="text-sm font-semibold text-white">{item.title}</p>
                  <p className="mt-1 text-xs leading-5 text-stone-400">{item.summary}</p>
                </li>
              ))}
            </ul>
          </ReadingCard>
        ) : null}
      </div>

      <div className="grid gap-6">
        {cards.length ? (
          <div className="grid gap-4 sm:grid-cols-3">
            {cards.map((card) => (
              <TarotCard key={`${card.id}-${card.position}`} card={card} />
            ))}
          </div>
        ) : (
          <div className="panel grid min-h-64 place-items-center rounded-lg p-6 text-center">
            <div>
              <p className="text-lg font-semibold text-white">Your spread appears here</p>
              <p className="mt-2 text-sm leading-6 text-stone-400">
                The deck contains the 22 Major Arcana cards.
              </p>
            </div>
          </div>
        )}

        {loading ? <LoadingSpinner /> : null}
        {error ? (
          <p className="rounded-lg border border-rose-300/25 bg-rose-300/10 p-4 text-sm text-rose-100">
            {error}
          </p>
        ) : null}
        {result ? (
          <ResultPanel
            title={result.data.title}
            summary={result.data.summary}
            mode={result.mode}
            warning={result.warning}
            shareText={[
              result.data.title,
              result.data.summary,
              ...result.data.cards.map(
                (card) => `${card.position}: ${card.cardName} - ${card.interpretation}`
              ),
              result.data.practicalReflection,
              result.data.gentleAdvice
            ].join("\n\n")}
            sections={[
              {
                title: "Card-by-card interpretation",
                content: (
                  <div className="grid gap-3">
                    {result.data.cards.map((card) => (
                      <div key={`${card.cardName}-${card.position}`}>
                        <p className="font-semibold text-white">
                          {card.position}: {card.cardName}
                        </p>
                        <p className="mt-1 text-stone-300">{card.interpretation}</p>
                      </div>
                    ))}
                  </div>
                )
              },
              {
                title: "Practical reflection",
                content: result.data.practicalReflection
              },
              {
                title: "Gentle advice",
                content: result.data.gentleAdvice
              }
            ]}
          />
        ) : null}
      </div>
    </div>
  );
}
