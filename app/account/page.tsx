import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { LogoutButton } from "@/components/LogoutButton";
import { PageHeader } from "@/components/PageHeader";
import { getCurrentUserFromCookies } from "@/lib/auth";
import { pageMetadata } from "@/lib/metadata";

export const dynamic = "force-dynamic";

export const metadata: Metadata = pageMetadata({
  title: "Account",
  description: "View your Mystic AI Studio account status.",
  path: "/account"
});

export default async function AccountPage() {
  const user = await getCurrentUserFromCookies();

  if (!user) {
    redirect("/login?next=/account");
  }

  return (
    <>
      <PageHeader
        eyebrow="Account"
        title="Your account"
        description="Email-only authentication is active. Account history is local to this lightweight template unless you connect a database workflow later."
      />
      <section className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="panel rounded-lg p-6">
          <dl className="grid gap-5 text-sm sm:grid-cols-2">
            <div>
              <dt className="font-semibold text-stone-400">Email</dt>
              <dd className="mt-2 text-white">{user.email}</dd>
            </div>
            <div>
              <dt className="font-semibold text-stone-400">Role</dt>
              <dd className="mt-2 capitalize text-white">{user.role}</dd>
            </div>
            <div>
              <dt className="font-semibold text-stone-400">Created</dt>
              <dd className="mt-2 text-white">{new Date(user.createdAt).toLocaleString()}</dd>
            </div>
            <div>
              <dt className="font-semibold text-stone-400">Updated</dt>
              <dd className="mt-2 text-white">{new Date(user.updatedAt).toLocaleString()}</dd>
            </div>
          </dl>
          <div className="mt-7">
            <LogoutButton />
          </div>
        </div>
      </section>
    </>
  );
}
