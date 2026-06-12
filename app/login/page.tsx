import type { Metadata } from "next";

import { AuthForm } from "@/components/AuthForm";
import { PageHeader } from "@/components/PageHeader";
import { pageMetadata } from "@/lib/metadata";
import { sanitizeRedirectPath } from "@/lib/auth";

export const metadata: Metadata = pageMetadata({
  title: "Log In",
  description: "Log in to Mystic AI Studio with an email address and password.",
  path: "/login"
});

type LoginPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = searchParams ? await searchParams : {};
  const nextValue = Array.isArray(params.next) ? params.next[0] : params.next;

  return (
    <>
      <PageHeader
        eyebrow="Account"
        title="Log in with email"
        description="Use your email address and password. This template does not include phone, Google, Apple, or social sign-in."
      />
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <AuthForm mode="login" redirectTo={sanitizeRedirectPath(nextValue)} />
      </section>
    </>
  );
}
