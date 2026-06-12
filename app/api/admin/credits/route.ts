import { isRecord, jsonError, jsonOk, parseJsonBody } from "@/lib/api";
import { addCredits, AuthError, requireAuthenticatedUser } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const admin = await requireAuthenticatedUser(request);
    if (admin.role !== "admin") {
      return jsonError("Admin access required.", 403, "UNAUTHORIZED");
    }

    const { data: body, error } = await parseJsonBody(request);
    if (error) return error;
    if (!isRecord(body)) return jsonError("Invalid request body.");

    const targetUserId = typeof body.userId === "string" ? body.userId.trim() : "";
    const amount = typeof body.amount === "number" ? body.amount : 0;

    if (!targetUserId) return jsonError("userId is required.");
    if (!Number.isFinite(amount) || amount <= 0) {
      return jsonError("amount must be a positive number.");
    }

    const newBalance = await addCredits(targetUserId, Math.floor(amount));
    return jsonOk({ ok: true, userId: targetUserId, credits: newBalance });
  } catch (err) {
    if (err instanceof AuthError) {
      return jsonError(err.message, err.status, err.code as "UNAUTHORIZED");
    }
    return jsonError("Failed to add credits.", 500, "SERVER_ERROR");
  }
}
