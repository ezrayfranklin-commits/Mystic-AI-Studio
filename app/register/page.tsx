import type { Metadata } from "next";

import { AuthForm } from "@/components/AuthForm";
import { PageHeader } from "@/components/PageHeader";
import { pageMetadata } from "@/lib/metadata";

export const metadata: Metadata = pageMetadata({
  title: "Register",
  description: "Create a Mystic AI Studio account with an email address and password.",
  path: "/register"
});

export default function RegisterPage() {
  return (
    <>
      <PageHeader
        eyebrow="Account"
        title="Create an email account"
        description="Register with email and password only. No phone numbers or social login providers are enabled."
      />
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <AuthForm mode="register" />
      </section>
    </>
  );
}
