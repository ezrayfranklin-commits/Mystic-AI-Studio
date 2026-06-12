import {
  buildCompatibilityPrompt,
  buildDreamPrompt,
  buildHoroscopePrompt,
  buildTarotPrompt,
  readingSystemPrompt
} from "@/lib/prompts";
import { BRAND_NAME, SITE_URL } from "@/lib/utils";
import type {
  AiResult,
  CompatibilityInput,
  CompatibilityResult,
  DreamReadingInput,
  DreamReadingResult,
  HoroscopeInput,
  HoroscopeResult,
  TarotReadingInput,
  TarotReadingResult
} from "@/types/reading";

type JsonRecord = Record<string, unknown>;

type ChatCompletionResponse = {
  choices?: {
    message?: {
      content?: string;
    };
  }[];
};

const fallbackWarning =
  "AI service was unavailable, so this result used local mock mode.";

function isRecord(value: unknown): value is JsonRecord {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function asString(value: unknown, fallback: string, maxLength = 900) {
  if (typeof value !== "string" || !value.trim()) {
    return fallback;
  }
  return value.trim().slice(0, maxLength);
}

function asStringArray(value: unknown, fallback: string[], maxItems = 6, maxItemLength = 220) {
  if (!Array.isArray(value)) {
    return fallback;
  }
  const strings = value.filter(
    (item): item is string => typeof item === "string" && item.trim().length > 0
  ).slice(0, maxItems).map((item) => item.trim().slice(0, maxItemLength));
  return strings.length ? strings : fallback;
}

function asNumber(value: unknown, fallback: number, min = 0, max = 100) {
  const number = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(number)) {
    return fallback;
  }
  return Math.max(min, Math.min(max, Math.round(number)));
}

function parseJsonFromText(text: string): JsonRecord | null {
  try {
    const parsed: unknown = JSON.parse(text);
    return isRecord(parsed) ? parsed : null;
  } catch {
    const match = text.match(/\{[\s\S]*\}/);
    if (!match) {
      return null;
    }
    try {
      const parsed: unknown = JSON.parse(match[0]);
      return isRecord(parsed) ? parsed : null;
    } catch {
      return null;
    }
  }
}

async function requestJson(prompt: string) {
  const apiKey = process.env.AI_API_KEY;
  if (!apiKey) {
    return null;
  }

  const baseUrl = (process.env.AI_BASE_URL || "https://api.openai.com/v1")
    .replace(/\/$/, "");
  const model = process.env.AI_MODEL || "gpt-4o-mini";
  const configuredTimeout = Number(process.env.AI_TIMEOUT_MS || 25_000);
  const timeoutMs = Number.isFinite(configuredTimeout)
    ? Math.max(3_000, Math.min(60_000, configuredTimeout))
    : 25_000;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  const response = await fetch(`${baseUrl}/chat/completions`, {
    method: "POST",
    signal: controller.signal,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
      "HTTP-Referer": SITE_URL,
      "X-Title": BRAND_NAME
    },
    body: JSON.stringify({
      model,
      max_tokens: 900,
      temperature: 0.78,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: readingSystemPrompt },
        { role: "user", content: prompt }
      ]
    })
  }).finally(() => clearTimeout(timeout));

  if (!response.ok) {
    throw new Error(`AI request failed with status ${response.status}`);
  }

  const payload = (await response.json()) as ChatCompletionResponse;
  const content = payload.choices?.[0]?.message?.content;
  if (!content) {
    throw new Error("AI response did not include message content");
  }

  return parseJsonFromText(content);
}

async function generateWithFallback<T>(
  prompt: string,
  mockFactory: () => T,
  normalize: (value: JsonRecord) => T
): Promise<AiResult<T>> {
  if (!process.env.AI_API_KEY) {
    return { mode: "mock", data: mockFactory() };
  }

  try {
    const json = await requestJson(prompt);
    if (!json) {
      throw new Error("AI response was not valid JSON");
    }
    return { mode: "ai", data: normalize(json) };
  } catch (caughtError) {
    console.error("AI generation failed; using fallback", {
      hasApiKey: Boolean(process.env.AI_API_KEY),
      error:
        caughtError instanceof Error
          ? { name: caughtError.name, message: caughtError.message }
          : { name: "UnknownError" }
    });
    return {
      mode: "mock",
      data: mockFactory(),
      warning: fallbackWarning
    };
  }
}

function spreadLabel(spreadType: TarotReadingInput["spreadType"]) {
  const labels: Record<TarotReadingInput["spreadType"], string> = {
    "one-card": "One-card reading",
    "three-card": "Three-card reading",
    love: "Love reading",
    career: "Career reading",
    "yes-no": "Yes or no reading"
  };
  return labels[spreadType];
}

function mockTarotReading(input: TarotReadingInput): TarotReadingResult {
  const subject = input.question.trim() || "your current question";
  return {
    title: `${spreadLabel(input.spreadType)} for gentle clarity`,
    summary: `This reading treats "${subject}" as a symbolic mirror. The cards point toward noticing your real options, not predicting a fixed outcome.`,
    cards: input.cards.map((card) => ({
      cardName: card.name,
      position: card.position,
      interpretation: `${card.name} brings ${card.keywords.join(", ")} into the ${card.position.toLowerCase()} position. ${card.uprightMeaning}`
    })),
    practicalReflection:
      "Write down the part of the reading that felt useful, then name one small action that would make the situation feel more honest or spacious.",
    gentleAdvice:
      "Move slowly enough to hear your own instincts. This is entertainment and self-reflection, so let the insight support your judgment rather than replace it."
  };
}

function normalizeTarotReading(
  value: JsonRecord,
  input: TarotReadingInput
): TarotReadingResult {
  const cardsValue = Array.isArray(value.cards) ? value.cards : [];
  return {
    title: asString(value.title, `${spreadLabel(input.spreadType)} result`, 120),
    summary: asString(
      value.summary,
      "The reading offers a symbolic reflection on the question you brought.",
      600
    ),
    cards: input.cards.map((card, index) => {
      const item = isRecord(cardsValue[index]) ? cardsValue[index] : {};
      return {
        cardName: asString(item.cardName, card.name, 80),
        position: asString(item.position, card.position, 60),
        interpretation: asString(
          item.interpretation,
          `${card.name} suggests ${card.uprightMeaning}`,
          500
        )
      };
    }),
    practicalReflection: asString(
      value.practicalReflection,
      "Notice which part of the reading feels most alive, then turn it into one grounded reflection question.",
      500
    ),
    gentleAdvice: asString(
      value.gentleAdvice,
      "Use this as a reflective prompt, not as advice that overrides your own judgment.",
      500
    )
  };
}

function signSeed(sign: string) {
  return sign
    .split("")
    .reduce((total, letter) => total + letter.charCodeAt(0), 0);
}

function mockHoroscope(input: HoroscopeInput): HoroscopeResult {
  const seed = signSeed(input.sign);
  const colors = ["Gold", "Sea green", "Rose", "Ivory", "Blue", "Copper"];
  return {
    title: `${input.sign} daily horoscope`,
    overallEnergy:
      "Today favors measured attention. A small signal may be more useful than a dramatic sign.",
    love:
      "Connection benefits from plain language and a little softness around expectations.",
    career:
      "Choose one useful priority and give it your best hour before scattering your focus.",
    money:
      "Treat money choices as a moment for clarity, not pressure. Pause before acting on urgency.",
    luckyColor: colors[seed % colors.length],
    luckyNumber: (seed % 9) + 1
  };
}

function normalizeHoroscope(value: JsonRecord, input: HoroscopeInput): HoroscopeResult {
  const mock = mockHoroscope(input);
  return {
    title: asString(value.title, mock.title, 120),
    overallEnergy: asString(value.overallEnergy, mock.overallEnergy, 500),
    love: asString(value.love, mock.love, 400),
    career: asString(value.career, mock.career, 400),
    money: asString(value.money, mock.money, 400),
    luckyColor: asString(value.luckyColor, mock.luckyColor, 60),
    luckyNumber: asNumber(value.luckyNumber, mock.luckyNumber, 1, 99)
  };
}

function extractSymbols(dream: string) {
  const stopWords = new Set([
    "about",
    "after",
    "again",
    "there",
    "where",
    "which",
    "while",
    "would",
    "could",
    "dream",
    "really"
  ]);
  const words = dream
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((word) => word.length > 4 && !stopWords.has(word));
  return Array.from(new Set(words)).slice(0, 5);
}

function mockDreamReading(input: DreamReadingInput): DreamReadingResult {
  const symbols = extractSymbols(input.dream);
  return {
    title: "Dream symbol reading",
    keySymbols: symbols.length ? symbols : ["threshold", "motion", "unknown place"],
    emotionalTheme:
      "The dream seems to orbit transition, unfinished feeling, or the wish to understand something indirectly.",
    possibleMeaning:
      "As a symbolic reflection, this dream may be asking what part of your waking life feels hard to name directly. The details can be treated as metaphors rather than messages.",
    reflectionQuestion:
      "What feeling from the dream stayed with you longest, and where does that feeling appear in ordinary life?"
  };
}

function normalizeDreamReading(
  value: JsonRecord,
  input: DreamReadingInput
): DreamReadingResult {
  const mock = mockDreamReading(input);
  return {
    title: asString(value.title, mock.title, 120),
    keySymbols: asStringArray(value.keySymbols, mock.keySymbols),
    emotionalTheme: asString(value.emotionalTheme, mock.emotionalTheme, 500),
    possibleMeaning: asString(value.possibleMeaning, mock.possibleMeaning, 700),
    reflectionQuestion: asString(
      value.reflectionQuestion,
      mock.reflectionQuestion,
      300
    )
  };
}

function compatibilityScore(input: CompatibilityInput) {
  const seed = `${input.nameA}${input.nameB}${input.signA || ""}${input.signB || ""}`
    .split("")
    .reduce((total, letter) => total + letter.charCodeAt(0), 0);
  return 62 + (seed % 33);
}

function mockCompatibility(input: CompatibilityInput): CompatibilityResult {
  const score = compatibilityScore(input);
  return {
    title: `${input.nameA} and ${input.nameB} compatibility`,
    score,
    emotionalDynamic:
      "This pairing reads as a mix of curiosity and calibration. The bond may feel strongest when both people can be direct without losing warmth.",
    strengths: [
      "Room for playful honesty",
      "Different perspectives that can widen the conversation",
      "Potential for steady trust when expectations are named"
    ],
    challenges: [
      "Assumptions may build if timing is unclear",
      "One person may need more reassurance than the other"
    ],
    advice:
      "Treat the score as a conversation starter. Ask what each person needs to feel seen, and let the answer matter more than the number."
  };
}

function normalizeCompatibility(
  value: JsonRecord,
  input: CompatibilityInput
): CompatibilityResult {
  const mock = mockCompatibility(input);
  return {
    title: asString(value.title, mock.title, 120),
    score: asNumber(value.score, mock.score, 1, 100),
    emotionalDynamic: asString(value.emotionalDynamic, mock.emotionalDynamic, 600),
    strengths: asStringArray(value.strengths, mock.strengths),
    challenges: asStringArray(value.challenges, mock.challenges),
    advice: asString(value.advice, mock.advice, 500)
  };
}

export async function generateTarotReading(input: TarotReadingInput) {
  return generateWithFallback(
    buildTarotPrompt(input),
    () => mockTarotReading(input),
    (value) => normalizeTarotReading(value, input)
  );
}

export async function generateHoroscope(input: HoroscopeInput) {
  return generateWithFallback(
    buildHoroscopePrompt(input),
    () => mockHoroscope(input),
    (value) => normalizeHoroscope(value, input)
  );
}

export async function generateDreamReading(input: DreamReadingInput) {
  return generateWithFallback(
    buildDreamPrompt(input),
    () => mockDreamReading(input),
    (value) => normalizeDreamReading(value, input)
  );
}

export async function generateCompatibilityReading(input: CompatibilityInput) {
  return generateWithFallback(
    buildCompatibilityPrompt(input),
    () => mockCompatibility(input),
    (value) => normalizeCompatibility(value, input)
  );
}
