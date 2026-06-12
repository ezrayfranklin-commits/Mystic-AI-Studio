"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { Lock, Mail, ShieldCheck, UserPlus } from "lucide-react";

type AuthFormProps = {
  mode: "login" | "register";
  redirectTo?: string;
};

export function AuthForm({ mode, redirectTo = "/account" }: AuthFormProps) {
  const router = useRouter();
  const isRegister = mode === "register";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    if (isRegister && password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch(isRegister ? "/api/auth/register" : "/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });
      const payload = (await response.json()) as { error?: string };

      if (!response.ok || payload.error) {
        throw new Error(payload.error || "Authentication failed.");
      }

      router.push(redirectTo);
      router.refresh();
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : "Authentication failed.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="panel mx-auto max-w-md rounded-lg p-5 sm:p-6" onSubmit={handleSubmit}>
      <div className="grid h-12 w-12 place-items-center rounded-md border border-brass/35 bg-brass/15 text-brass">
        {isRegister ? (
          <UserPlus className="h-5 w-5" aria-hidden="true" />
        ) : (
          <ShieldCheck className="h-5 w-5" aria-hidden="true" />
        )}
      </div>
      <h2 className="mt-5 text-2xl font-semibold text-white">
        {isRegister ? "Create your account" : "Log in to your account"}
      </h2>
      <p className="mt-2 text-sm leading-6 text-stone-400">
        Email-only access is enabled for this template. Phone numbers and social
        sign-in are not available.
      </p>

      <div className="mt-6 grid gap-4">
        <label>
          <span className="mb-2 block text-sm font-medium text-stone-200">Email</span>
          <span className="relative block">
            <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-500" aria-hidden="true" />
            <input
              required
              type="email"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="focus-ring w-full rounded-md border border-white/10 bg-black/25 py-3 pl-10 pr-3 text-sm text-white placeholder:text-stone-500"
              placeholder="you@example.com"
            />
          </span>
        </label>

        <label>
          <span className="mb-2 block text-sm font-medium text-stone-200">Password</span>
          <span className="relative block">
            <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-500" aria-hidden="true" />
            <input
              required
              minLength={8}
              maxLength={128}
              type="password"
              autoComplete={isRegister ? "new-password" : "current-password"}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="focus-ring w-full rounded-md border border-white/10 bg-black/25 py-3 pl-10 pr-3 text-sm text-white placeholder:text-stone-500"
              placeholder="At least 8 characters"
            />
          </span>
        </label>

        {isRegister ? (
          <label>
            <span className="mb-2 block text-sm font-medium text-stone-200">Confirm password</span>
            <span className="relative block">
              <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-500" aria-hidden="true" />
              <input
                required
                minLength={8}
                maxLength={128}
                type="password"
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                className="focus-ring w-full rounded-md border border-white/10 bg-black/25 py-3 pl-10 pr-3 text-sm text-white placeholder:text-stone-500"
                placeholder="Repeat your password"
              />
            </span>
          </label>
        ) : null}
      </div>

      {error ? (
        <p className="mt-5 rounded-md border border-rose-300/25 bg-rose-300/10 p-3 text-sm leading-6 text-rose-100">
          {error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={submitting}
        className="button-primary mt-6 w-full disabled:cursor-not-allowed disabled:opacity-60"
      >
        {submitting
          ? "Please wait..."
          : isRegister
            ? "Register with Email"
            : "Log in with Email"}
      </button>

      <p className="mt-5 text-center text-sm text-stone-400">
        {isRegister ? "Already have an account?" : "Need an account?"}{" "}
        <Link href={isRegister ? "/login" : "/register"} className="font-semibold text-brass hover:text-amber-300">
          {isRegister ? "Log in" : "Register"}
        </Link>
      </p>
    </form>
  );
}
