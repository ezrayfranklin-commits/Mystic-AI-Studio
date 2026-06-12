import {
  AUTH_COOKIE_NAME,
  AuthError,
  authenticateUser,
  createSessionToken,
  getSessionCookieOptions
} from "@/lib/auth";
import { checkRateLimit, isRecord, jsonError, jsonOk, parseJsonBody } from "@/lib/api";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const limited = checkRateLimit(request, "auth-login", 12);
    if (limited) {
      return limited;
    }

    const { data: body, error } = await parseJsonBody(request, 4_000);
    if (error) {
      return error;
    }

    if (!isRecord(body)) {
      return jsonError("Invalid request body.");
    }

    const user = await authenticateUser(body.email, body.password);
    const response = jsonOk({ ok: true, user });
    response.cookies.set(AUTH_COOKIE_NAME, createSessionToken(user), getSessionCookieOptions());
    return response;
  } catch (error) {
    if (error instanceof AuthError) {
      return jsonError(error.message, error.status, authErrorCode(error.status));
    }

    return jsonError("Unable to log in.", 500, "SERVER_ERROR");
  }
}

function authErrorCode(status: number) {
  if (status === 401) {
    return "UNAUTHORIZED";
  }

  if (status === 409) {
    return "CONFLICT";
  }

  if (status >= 500) {
    return "SERVER_ERROR";
  }

  return "BAD_REQUEST";
}
