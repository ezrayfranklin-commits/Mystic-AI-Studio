"use client";

export type ReadingHistoryItem = {
  id: string;
  title: string;
  summary: string;
  createdAt: string;
  meta?: string;
};

function isValidHistoryItem(value: unknown): value is ReadingHistoryItem {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    return false;
  }

  const item = value as Partial<ReadingHistoryItem>;
  const hasRequiredStrings =
    typeof item.id === "string" &&
    item.id.trim().length > 0 &&
    typeof item.title === "string" &&
    item.title.trim().length > 0 &&
    typeof item.summary === "string" &&
    typeof item.createdAt === "string" &&
    Number.isFinite(Date.parse(item.createdAt));

  if (!hasRequiredStrings) {
    return false;
  }

  return item.meta === undefined || typeof item.meta === "string";
}

export function createHistoryId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function readHistory(key: string): ReadingHistoryItem[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) {
      return [];
    }
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return [];
    }
    return parsed.filter(isValidHistoryItem);
  } catch {
    return [];
  }
}

export function addHistoryItem(key: string, item: ReadingHistoryItem) {
  if (typeof window === "undefined") {
    return [];
  }

  const next = [item, ...readHistory(key)].slice(0, 6);
  window.localStorage.setItem(key, JSON.stringify(next));
  return next;
}

export function formatHistoryDate(isoDate: string) {
  const date = new Date(isoDate);
  if (!Number.isFinite(date.getTime())) {
    return "";
  }

  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit"
  }).format(date);
}
