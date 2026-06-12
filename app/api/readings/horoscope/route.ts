import {
  checkRateLimit,
  cleanString,
  isRecord,
  jsonError,
  jsonOk,
  parseJsonBody
} from "@/lib/api";
import { generateHoroscope } from "@/lib/ai";
import { AuthError, deductCredit, requireAuthenticatedUser } from "@/lib/auth";
import { normalizeZodiacSign } from "@/lib/zodiac";

export async function POST(request: Request) {
  try {
    const limited = checkRateLimit(request, "horoscope", 30);
    if (limited) {
      return limited;
    }

    const { data: body, error } = await parseJsonBody(request, 4_000);
    if (error) {
      return error;
    }

    const requestedSign = isRecord(body) ? cleanString(body.sign, 40) : "";
    if (!requestedSign) {
      return jsonError("Choose a zodiac sign.");
    }

    const sign = normalizeZodiacSign(requestedSign);

    if (!sign) {
      return jsonError("Invalid zodiac sign.");
    }

    const user = await requireAuthenticatedUser(request);

    const result = await generateHoroscope({ sign });

    if (result.mode === "ai") {
      await deductCredit(user.id, 1);
    }

    return jsonOk({ ...result, credits: result.mode === "ai" ? user.credits - 1 : user.credits });
  } catch (err) {
    if (err instanceof AuthError) {
      return jsonError(err.message, err.status, err.code as "UNAUTHORIZED");
    }
    return jsonError("Unable to generate horoscope.", 500, "SERVER_ERROR");
  }
}
