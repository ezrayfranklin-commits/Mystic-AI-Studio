import {
  checkRateLimit,
  cleanLongText,
  isRecord,
  jsonError,
  jsonOk,
  parseJsonBody
} from "@/lib/api";
import { generateDreamReading } from "@/lib/ai";

export async function POST(request: Request) {
  try {
    const limited = checkRateLimit(request, "dream", 16);
    if (limited) {
      return limited;
    }

    const { data: body, error } = await parseJsonBody(request, 8_000);
    if (error) {
      return error;
    }

    const dream = isRecord(body) ? cleanLongText(body.dream, 1800) : "";
    if (!dream) {
      return jsonError("Describe your dream first.");
    }

    if (dream.length < 12) {
      return jsonError("Add a few more details about the dream.");
    }

    const result = await generateDreamReading({ dream });
    return jsonOk(result);
  } catch {
    return jsonError("Unable to interpret dream.", 500, "SERVER_ERROR");
  }
}
