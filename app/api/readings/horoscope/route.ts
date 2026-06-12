import {
  checkRateLimit,
  cleanString,
  isRecord,
  jsonError,
  jsonOk,
  parseJsonBody
} from "@/lib/api";
import { generateHoroscope } from "@/lib/ai";
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

    const result = await generateHoroscope({ sign });
    return jsonOk(result);
  } catch {
    return jsonError("Unable to generate horoscope.", 500, "SERVER_ERROR");
  }
}
