import {
  checkRateLimit,
  cleanString,
  isRecord,
  jsonError,
  jsonOk,
  normalizeOptionalIsoDate,
  parseJsonBody
} from "@/lib/api";
import { generateCompatibilityReading } from "@/lib/ai";
import { normalizeZodiacSign } from "@/lib/zodiac";

export async function POST(request: Request) {
  try {
    const limited = checkRateLimit(request, "compatibility", 18);
    if (limited) {
      return limited;
    }

    const { data: body, error } = await parseJsonBody(request, 8_000);
    if (error) {
      return error;
    }

    if (!isRecord(body)) {
      return jsonError("Invalid request body.");
    }

    const nameA = cleanString(body.nameA, 80);
    const nameB = cleanString(body.nameB, 80);

    if (!nameA || !nameB) {
      return jsonError("Enter both names to create a reading.");
    }

    const requestedSignA = cleanString(body.signA, 40);
    const requestedSignB = cleanString(body.signB, 40);
    const signA = requestedSignA ? normalizeZodiacSign(requestedSignA) : undefined;
    const signB = requestedSignB ? normalizeZodiacSign(requestedSignB) : undefined;

    if (requestedSignA && !signA) {
      return jsonError("Invalid first zodiac sign.");
    }

    if (requestedSignB && !signB) {
      return jsonError("Invalid second zodiac sign.");
    }

    const requestedBirthDateA = cleanString(body.birthDateA, 20);
    const requestedBirthDateB = cleanString(body.birthDateB, 20);
    const birthDateA = normalizeOptionalIsoDate(requestedBirthDateA);
    const birthDateB = normalizeOptionalIsoDate(requestedBirthDateB);

    if (birthDateA === null) {
      return jsonError("Invalid first birth date.");
    }

    if (birthDateB === null) {
      return jsonError("Invalid second birth date.");
    }

    const result = await generateCompatibilityReading({
      nameA,
      nameB,
      signA: signA || undefined,
      signB: signB || undefined,
      birthDateA,
      birthDateB
    });

    return jsonOk(result);
  } catch {
    return jsonError("Unable to generate compatibility reading.", 500, "SERVER_ERROR");
  }
}
