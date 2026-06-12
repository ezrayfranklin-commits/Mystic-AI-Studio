import { createHmac, randomBytes, scrypt, timingSafeEqual } from "node:crypto";
import { promises as fs } from "node:fs";
import path from "node:path";
import { promisify } from "node:util";

import { cookies } from "next/headers";

export const AUTH_COOKIE_NAME = "mystic_session";

const scryptAsync = promisify(scrypt);
const sessionMaxAgeSeconds = 60 * 60 * 24 * 7;

type UserRole = "admin" | "user";

type StoredAuthUser = {
  id: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
};

type AuthStore = {
  users: StoredAuthUser[];
};

type SessionPayload = {
  userId: string;
  email: string;
  role: UserRole;
  exp: number;
};

export type PublicAuthUser = {
  id: string;
  email: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
};

export class AuthError extends Error {
  status: number;
  code: string;

  constructor(message: string, status = 400, code = "AUTH_ERROR") {
    super(message);
    this.name = "AuthError";
    this.status = status;
    this.code = code;
  }
}

export function normalizeEmail(value: unknown) {
  if (typeof value !== "string") {
    return "";
  }

  return value.trim().toLowerCase();
}

export function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) && value.length <= 254;
}

export function sanitizeRedirectPath(value: unknown, fallback = "/account") {
  if (typeof value !== "string") {
    return fallback;
  }

  if (!value.startsWith("/") || value.startsWith("//") || value.includes("\\")) {
    return fallback;
  }

  return value;
}

export function getSessionCookieOptions(maxAge = sessionMaxAgeSeconds) {
  return {
    httpOnly: true,
    maxAge,
    path: "/",
    sameSite: "lax" as const,
    secure: process.env.AUTH_COOKIE_SECURE === "true"
  };
}

export function getClearSessionCookieOptions() {
  return {
    ...getSessionCookieOptions(0),
    expires: new Date(0)
  };
}

export async function registerUser(emailInput: unknown, passwordInput: unknown) {
  const email = normalizeEmail(emailInput);
  const password = validatePassword(passwordInput);

  if (!isValidEmail(email)) {
    throw new AuthError("Enter a valid email address.");
  }

  const store = await loadAuthStore();
  if (store.users.some((user) => user.email === email)) {
    throw new AuthError("An account with this email already exists.", 409, "EMAIL_EXISTS");
  }

  const now = new Date().toISOString();
  const user: StoredAuthUser = {
    id: createUserId(),
    email,
    passwordHash: await hashPassword(password),
    role: "user",
    createdAt: now,
    updatedAt: now
  };

  store.users.push(user);
  await writeAuthStore(store);

  return toPublicUser(user);
}

export async function authenticateUser(emailInput: unknown, passwordInput: unknown) {
  const email = normalizeEmail(emailInput);
  const password = typeof passwordInput === "string" ? passwordInput : "";

  if (!isValidEmail(email) || !password) {
    throw new AuthError("Invalid email or password.", 401, "INVALID_CREDENTIALS");
  }

  const store = await loadAuthStore();
  const user = store.users.find((storedUser) => storedUser.email === email);
  if (!user || !(await verifyPassword(password, user.passwordHash))) {
    throw new AuthError("Invalid email or password.", 401, "INVALID_CREDENTIALS");
  }

  return toPublicUser(user);
}

export async function getUserFromSessionToken(token: string | undefined) {
  const payload = verifySessionToken(token);
  if (!payload) {
    return null;
  }

  const store = await loadAuthStore();
  const user = store.users.find((storedUser) => storedUser.id === payload.userId);
  return user ? toPublicUser(user) : null;
}

export async function getCurrentUserFromCookies() {
  const cookieStore = await cookies();
  return getUserFromSessionToken(cookieStore.get(AUTH_COOKIE_NAME)?.value);
}

export async function listAuthUsersForAdmin() {
  const store = await loadAuthStore();
  return store.users
    .map(toPublicUser)
    .sort((first, second) => first.email.localeCompare(second.email));
}

export function createSessionToken(user: PublicAuthUser) {
  const payload: SessionPayload = {
    userId: user.id,
    email: user.email,
    role: user.role,
    exp: Math.floor(Date.now() / 1000) + sessionMaxAgeSeconds
  };

  const encoded = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const signature = sign(encoded);
  return `${encoded}.${signature}`;
}

export function getCookieValue(cookieHeader: string | null, name: string) {
  if (!cookieHeader) {
    return undefined;
  }

  const match = cookieHeader
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${name}=`));

  return match ? decodeURIComponent(match.slice(name.length + 1)) : undefined;
}

function validatePassword(value: unknown) {
  if (typeof value !== "string") {
    throw new AuthError("Enter a password.");
  }

  if (value.length < 8) {
    throw new AuthError("Password must be at least 8 characters.");
  }

  if (value.length > 128) {
    throw new AuthError("Password must be 128 characters or fewer.");
  }

  return value;
}

async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("base64url");
  const key = (await scryptAsync(password, salt, 64)) as Buffer;
  return `scrypt$${salt}$${key.toString("base64url")}`;
}

async function verifyPassword(password: string, storedHash: string) {
  const [scheme, salt, hash] = storedHash.split("$");
  if (scheme !== "scrypt" || !salt || !hash) {
    return false;
  }

  const expected = Buffer.from(hash, "base64url");
  const actual = (await scryptAsync(password, salt, 64)) as Buffer;
  return expected.length === actual.length && timingSafeEqual(expected, actual);
}

function createUserId() {
  return randomBytes(18).toString("base64url");
}

function toPublicUser(user: StoredAuthUser): PublicAuthUser {
  return {
    id: user.id,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt
  };
}

function getAuthDataDir() {
  return process.env.AUTH_DATA_DIR || path.join(process.cwd(), ".data");
}

function getAuthFilePath() {
  return path.join(getAuthDataDir(), "auth-users.json");
}

async function loadAuthStore(): Promise<AuthStore> {
  const store = await readAuthStore();
  return ensureAdminAccount(store);
}

async function readAuthStore(): Promise<AuthStore> {
  try {
    const raw = await fs.readFile(getAuthFilePath(), "utf8");
    const parsed: unknown = JSON.parse(raw);
    if (!isAuthStore(parsed)) {
      return { users: [] };
    }

    return {
      users: parsed.users.filter(isStoredAuthUser)
    };
  } catch (error) {
    if (isNodeError(error) && error.code === "ENOENT") {
      return { users: [] };
    }

    throw error;
  }
}

async function writeAuthStore(store: AuthStore) {
  const dataDir = getAuthDataDir();
  await fs.mkdir(dataDir, { recursive: true });
  const filePath = getAuthFilePath();
  const tempPath = `${filePath}.${process.pid}.tmp`;
  await fs.writeFile(tempPath, JSON.stringify(store, null, 2), { mode: 0o600 });
  await fs.rename(tempPath, filePath);
}

async function ensureAdminAccount(store: AuthStore) {
  const configuredAdminEmail = normalizeEmail(process.env.ADMIN_EMAIL || "");
  const configuredAdminPassword = process.env.ADMIN_PASSWORD || "";

  if (!configuredAdminEmail && !configuredAdminPassword) {
    return store;
  }

  if (!isValidEmail(configuredAdminEmail)) {
    throw new AuthError("ADMIN_EMAIL must be a valid email address.", 500, "ADMIN_CONFIG");
  }

  if (configuredAdminPassword.length < 8) {
    throw new AuthError("ADMIN_PASSWORD must be at least 8 characters.", 500, "ADMIN_CONFIG");
  }

  const existing = store.users.find((user) => user.email === configuredAdminEmail);
  const now = new Date().toISOString();
  let changed = false;

  if (!existing) {
    store.users.push({
      id: createUserId(),
      email: configuredAdminEmail,
      passwordHash: await hashPassword(configuredAdminPassword),
      role: "admin",
      createdAt: now,
      updatedAt: now
    });
    changed = true;
  } else {
    if (existing.role !== "admin") {
      existing.role = "admin";
      existing.updatedAt = now;
      changed = true;
    }

    if (!(await verifyPassword(configuredAdminPassword, existing.passwordHash))) {
      existing.passwordHash = await hashPassword(configuredAdminPassword);
      existing.updatedAt = now;
      changed = true;
    }
  }

  if (changed) {
    await writeAuthStore(store);
  }

  return store;
}

function verifySessionToken(token: string | undefined): SessionPayload | null {
  if (!token) {
    return null;
  }

  const [encoded, signature] = token.split(".");
  if (!encoded || !signature || !safeEqual(signature, sign(encoded))) {
    return null;
  }

  try {
    const payload = JSON.parse(Buffer.from(encoded, "base64url").toString("utf8")) as Partial<SessionPayload>;
    if (
      typeof payload.userId !== "string" ||
      typeof payload.email !== "string" ||
      (payload.role !== "admin" && payload.role !== "user") ||
      typeof payload.exp !== "number" ||
      payload.exp < Math.floor(Date.now() / 1000)
    ) {
      return null;
    }

    return payload as SessionPayload;
  } catch {
    return null;
  }
}

function sign(value: string) {
  return createHmac("sha256", getAuthSecret()).update(value).digest("base64url");
}

function getAuthSecret() {
  const secret = process.env.AUTH_SECRET;
  if (secret && secret.length >= 32) {
    return secret;
  }

  if (process.env.NODE_ENV === "production") {
    throw new AuthError("AUTH_SECRET must be at least 32 characters.", 500, "AUTH_CONFIG");
  }

  return "local-development-auth-secret-change-before-production";
}

function safeEqual(first: string, second: string) {
  const firstBuffer = Buffer.from(first);
  const secondBuffer = Buffer.from(second);
  return firstBuffer.length === secondBuffer.length && timingSafeEqual(firstBuffer, secondBuffer);
}

function isAuthStore(value: unknown): value is AuthStore {
  return typeof value === "object" && value !== null && "users" in value && Array.isArray(value.users);
}

function isStoredAuthUser(value: unknown): value is StoredAuthUser {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    return false;
  }

  const user = value as Partial<StoredAuthUser>;
  return (
    typeof user.id === "string" &&
    isValidEmail(user.email || "") &&
    typeof user.passwordHash === "string" &&
    (user.role === "admin" || user.role === "user") &&
    typeof user.createdAt === "string" &&
    typeof user.updatedAt === "string"
  );
}

function isNodeError(error: unknown): error is NodeJS.ErrnoException {
  return error instanceof Error && "code" in error;
}
