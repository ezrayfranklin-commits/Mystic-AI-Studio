import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const BRAND_NAME =
  process.env.NEXT_PUBLIC_BRAND_NAME || "Mystic AI Studio";

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3008";

export const DISCLAIMER_TEXT =
  "For entertainment and self-reflection purposes only. Not medical, legal, financial, or psychological advice.";

export function absoluteUrl(path = "/") {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${SITE_URL.replace(/\/$/, "")}${normalizedPath}`;
}

export function compactText(value: string, maxLength = 120) {
  const trimmed = value.trim().replace(/\s+/g, " ");
  if (trimmed.length <= maxLength) {
    return trimmed;
  }
  return `${trimmed.slice(0, maxLength - 1).trim()}...`;
}
