import {
  AUTH_COOKIE_NAME,
  getCookieValue,
  getUserFromSessionToken
} from "@/lib/auth";
import { jsonOk } from "@/lib/api";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const token = getCookieValue(request.headers.get("cookie"), AUTH_COOKIE_NAME);
  const user = await getUserFromSessionToken(token);

  if (!user) {
    return jsonOk({ authenticated: false, user: null });
  }

  return jsonOk({ authenticated: true, user });
}
