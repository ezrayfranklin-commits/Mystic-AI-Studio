import { tarotDeck } from "@/data/tarotDeck";
import {
  checkRateLimit,
  cleanLongText,
  cleanString,
  isRecord,
  jsonError,
  jsonOk,
  parseJsonBody
} from "@/lib/api";
import { generateTarotReading } from "@/lib/ai";
import { AuthError, deductCredit, requireAuthenticatedUser } from "@/lib/auth";
import type { DrawnTarotCard, SpreadType } from "@/types/reading";

const spreadTypes: SpreadType[] = [
  "one-card",
  "three-card",
  "love",
  "career",
  "yes-no"
];

const spreadCardCounts: Record<SpreadType, number> = {
  "one-card": 1,
  "three-card": 3,
  love: 3,
  career: 3,
  "yes-no": 3
};

export async function POST(request: Request) {
  try {
    const limited = checkRateLimit(request, "tarot", 18);
    if (limited) {
      return limited;
    }

    const { data: body, error } = await parseJsonBody(request);
    if (error) {
      return error;
    }

    if (!isRecord(body)) {
      return jsonError("Invalid request body.");
    }

    const spreadType = cleanString(body.spreadType, 40) as SpreadType;
    if (!spreadTypes.includes(spreadType)) {
      return jsonError("Invalid spread type.");
    }

    const rawCards = Array.isArray(body.cards) ? body.cards : [];
    const cards = rawCards
      .map((rawCard, index): DrawnTarotCard | null => {
        if (!isRecord(rawCard)) {
          return null;
        }
        const deckCard = tarotDeck.find((card) => card.id === rawCard.id);
        if (!deckCard) {
          return null;
        }
        return {
          ...deckCard,
          position: cleanString(rawCard.position, 40) || `Card ${index + 1}`
        };
      })
      .filter((card): card is DrawnTarotCard => card !== null);

    if (cards.length !== spreadCardCounts[spreadType]) {
      return jsonError("The selected spread received the wrong number of cards.");
    }

    const user = await requireAuthenticatedUser(request);

    const result = await generateTarotReading({
      question: cleanLongText(body.question, 800),
      spreadType,
      cards
    });

    if (result.mode === "ai") {
      await deductCredit(user.id, 1);
    }

    return jsonOk({ ...result, credits: result.mode === "ai" ? user.credits - 1 : user.credits });
  } catch (err) {
    if (err instanceof AuthError) {
      return jsonError(err.message, err.status, err.code as "UNAUTHORIZED");
    }
    return jsonError("Unable to generate tarot reading.", 500, "SERVER_ERROR");
  }
}
