import { NextResponse } from "next/server";

export type ApiErrorCode =
  | "BAD_JSON"
  | "BAD_REQUEST"
  | "CONFLICT"
  | "PAYLOAD_TOO_LARGE"
  | "RATE_LIMITED"
  | "SERVER_ERROR"
  | "UNAUTHORIZED";

type RateBucket = {
  count: number;
  resetAt: number;
};

const buckets = new Map<string, RateBucket>();

export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function cleanString(value: unknown, maxLength: number) {
  if (typeof value !== "string") {
    return "";
  }
  return value.trim().replace(/\s+/g, " ").slice(0, maxLength);
}

export function cleanLongText(value: unknown, maxLength: number) {
  if (typeof value !== "string") {
    return "";
  }
  return value.trim().slice(0, maxLength);
}

export function normalizeOptionalIsoDate(value: string) {
  if (!value) {
    return undefined;
  }

  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return null;
  }

  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  const now = new Date();

  if (
    year < 1900 ||
    date > now ||
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() !== month - 1 ||
    date.getUTCDate() !== day
  ) {
    return null;
  }

  return value;
}

export function jsonOk<T>(data: T, init?: ResponseInit) {
  return NextResponse.json(data, {
    ...init,
    headers: {
      "Cache-Control": "no-store",
      ...init?.headers
    }
  });
}

export function jsonError(
  message: string,
  status = 400,
  code: ApiErrorCode = "BAD_REQUEST"
) {
  return jsonOk({ error: message, code }, { status });
}

export async function parseJsonBody(request: Request, maxBytes = 16_000) {
  const contentLength = Number(request.headers.get("content-length") || 0);
  if (Number.isFinite(contentLength) && contentLength > maxBytes) {
    return {
      data: null,
      error: jsonError("Request body is too large.", 413, "PAYLOAD_TOO_LARGE")
    };
  }

  const raw = await request.text();
  if (new TextEncoder().encode(raw).byteLength > maxBytes) {
    return {
      data: null,
      error: jsonError("Request body is too large.", 413, "PAYLOAD_TOO_LARGE")
    };
  }

  try {
    return { data: JSON.parse(raw) as unknown, error: null };
  } catch {
    return { data: null, error: jsonError("Invalid JSON request body.", 400, "BAD_JSON") };
  }
}

export function checkRateLimit(
  request: Request,
  key: string,
  limit = 20,
  windowMs = 60_000
) {
  const forwardedFor = request.headers.get("x-forwarded-for") || "";
  const ip =
    forwardedFor.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "local";
  const now = Date.now();
  const bucketKey = `${key}:${ip}`;
  const current = buckets.get(bucketKey);

  if (!current || current.resetAt < now) {
    buckets.set(bucketKey, { count: 1, resetAt: now + windowMs });
    return null;
  }

  if (current.count >= limit) {
    const response = jsonError(
      "Too many requests. Please wait a moment and try again.",
      429,
      "RATE_LIMITED"
    );
    response.headers.set("Retry-After", Math.ceil((current.resetAt - now) / 1000).toString());
    return response;
  }

  current.count += 1;
  return null;
}

export function isLikelyEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}
