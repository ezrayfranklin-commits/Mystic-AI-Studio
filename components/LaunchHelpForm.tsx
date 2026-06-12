"use client";

import { useMemo, useState, type ReactNode } from "react";
import { Send } from "lucide-react";

type FormState = {
  name: string;
  email: string;
  websiteName: string;
  domainStatus: string;
  apiKeyStatus: string;
  budget: string;
  notes: string;
  company: string;
  consent: boolean;
};

const initialState: FormState = {
  name: "",
  email: "",
  websiteName: "",
  domainStatus: "Need a domain",
  apiKeyStatus: "Need help choosing",
  budget: "Launch Help ($99-$299)",
  notes: "",
  company: "",
  consent: false
};

export function LaunchHelpForm() {
  const [form, setForm] = useState<FormState>(initialState);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const mailtoHref = useMemo(() => {
    const subject = encodeURIComponent(`Launch help request: ${form.websiteName || form.name}`);
    const body = encodeURIComponent(
      [
        `Name: ${form.name}`,
        `Email: ${form.email}`,
        `Desired website name: ${form.websiteName}`,
        `Domain status: ${form.domainStatus}`,
        `API key status: ${form.apiKeyStatus}`,
        `Budget: ${form.budget}`,
        `Notes: ${form.notes}`
      ].join("\n")
    );
    return `mailto:hello@example.com?subject=${subject}&body=${body}`;
  }, [form]);

  const updateField = <T extends keyof FormState>(field: T, value: FormState[T]) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  return (
    <form
      className="panel rounded-lg p-5 sm:p-6"
      onSubmit={async (event) => {
        event.preventDefault();
        setSubmitting(true);
        setSubmitted(false);
        setError("");

        try {
          const response = await fetch("/api/launch-help", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(form)
          });
          const payload = (await response.json()) as {
            ok?: boolean;
            message?: string;
            error?: string;
          };

          if (!response.ok || !payload.ok) {
            throw new Error(payload.error || "Unable to submit request.");
          }

          setSubmitted(true);
          setForm(initialState);
        } catch (caughtError) {
          setError(
            caughtError instanceof Error
              ? caughtError.message
              : "Unable to submit request."
          );
        } finally {
          setSubmitting(false);
        }
      }}
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Name">
          <input
            required
            value={form.name}
            onChange={(event) => updateField("name", event.target.value)}
            className="focus-ring w-full rounded-md border border-white/10 bg-black/25 px-3 py-3 text-sm text-white placeholder:text-stone-500"
            placeholder="Your name"
          />
        </Field>
        <Field label="Email">
          <input
            required
            type="email"
            value={form.email}
            onChange={(event) => updateField("email", event.target.value)}
            className="focus-ring w-full rounded-md border border-white/10 bg-black/25 px-3 py-3 text-sm text-white placeholder:text-stone-500"
            placeholder="you@example.com"
          />
        </Field>
        <Field label="Desired website name">
          <input
            value={form.websiteName}
            onChange={(event) => updateField("websiteName", event.target.value)}
            className="focus-ring w-full rounded-md border border-white/10 bg-black/25 px-3 py-3 text-sm text-white placeholder:text-stone-500"
            placeholder="Mystic AI Studio"
          />
        </Field>
        <Field label="Domain status">
          <select
            value={form.domainStatus}
            onChange={(event) => updateField("domainStatus", event.target.value)}
            className="focus-ring w-full rounded-md border border-white/10 bg-black/25 px-3 py-3 text-sm text-white"
          >
            <option>Need a domain</option>
            <option>Already own a domain</option>
            <option>Using a Vercel domain first</option>
          </select>
        </Field>
        <Field label="API key status">
          <select
            value={form.apiKeyStatus}
            onChange={(event) => updateField("apiKeyStatus", event.target.value)}
            className="focus-ring w-full rounded-md border border-white/10 bg-black/25 px-3 py-3 text-sm text-white"
          >
            <option>Need help choosing</option>
            <option>Have OpenAI key</option>
            <option>Have OpenRouter key</option>
            <option>Will use mock mode first</option>
          </select>
        </Field>
        <Field label="Budget range">
          <select
            value={form.budget}
            onChange={(event) => updateField("budget", event.target.value)}
            className="focus-ring w-full rounded-md border border-white/10 bg-black/25 px-3 py-3 text-sm text-white"
          >
            <option>Launch Help ($99-$299)</option>
            <option>Custom Pro Setup ($499+)</option>
            <option>Not sure yet</option>
          </select>
        </Field>
        <Field label="Notes" wide>
          <textarea
            value={form.notes}
            onChange={(event) => updateField("notes", event.target.value)}
            className="focus-ring min-h-32 w-full resize-y rounded-md border border-white/10 bg-black/25 px-3 py-3 text-sm text-white placeholder:text-stone-500"
            placeholder="Branding, deadline, pages, payment setup, or anything else"
          />
        </Field>
        <input
          aria-hidden="true"
          tabIndex={-1}
          autoComplete="off"
          value={form.company}
          onChange={(event) => updateField("company", event.target.value)}
          className="hidden"
          name="company"
        />
        <label className="flex gap-3 text-sm leading-6 text-stone-300 sm:col-span-2">
          <input
            required
            type="checkbox"
            checked={form.consent}
            onChange={(event) => updateField("consent", event.target.checked)}
            className="mt-1 h-4 w-4 rounded border-white/20 bg-black/25 text-brass"
          />
          <span>
            I agree to be contacted about this launch request. No payment is
            collected by this form.
          </span>
        </label>
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <button type="submit" disabled={submitting} className="button-primary disabled:cursor-not-allowed disabled:opacity-60">
          <Send className="h-4 w-4" aria-hidden="true" />
          {submitting ? "Submitting" : "Submit Request"}
        </button>
        <a href={mailtoHref} className="button-secondary">
          Send by Email
        </a>
      </div>

      {error ? (
        <p className="mt-4 rounded-md border border-rose-300/25 bg-rose-300/10 p-3 text-sm leading-6 text-rose-100">
          {error}
        </p>
      ) : null}

      {submitted ? (
        <p className="mt-4 rounded-md border border-tide/25 bg-tide/10 p-3 text-sm leading-6 text-teal-100">
          Request received. The API route is ready to replace with Resend,
          Formspree, a CRM, or a database workflow.
        </p>
      ) : null}
    </form>
  );
}

function Field({
  label,
  wide = false,
  children
}: {
  label: string;
  wide?: boolean;
  children: ReactNode;
}) {
  return (
    <label className={wide ? "sm:col-span-2" : undefined}>
      <span className="mb-2 block text-sm font-medium text-stone-200">{label}</span>
      {children}
    </label>
  );
}
