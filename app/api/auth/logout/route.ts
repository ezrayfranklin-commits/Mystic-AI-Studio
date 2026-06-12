import { AUTH_COOKIE_NAME, getClearSessionCookieOptions } from "@/lib/auth";
import { jsonOk } from "@/lib/api";

export const runtime = "nodejs";

export async function POST() {
  const response = jsonOk({ ok: true });
  response.cookies.set(AUTH_COOKIE_NAME, "", getClearSessionCookieOptions());
  return response;
}
