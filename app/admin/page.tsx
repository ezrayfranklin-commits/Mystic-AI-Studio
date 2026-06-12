import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { LogoutButton } from "@/components/LogoutButton";
import { PageHeader } from "@/components/PageHeader";
import { getCurrentUserFromCookies, listAuthUsersForAdmin } from "@/lib/auth";
import { pageMetadata } from "@/lib/metadata";

export const dynamic = "force-dynamic";

export const metadata: Metadata = pageMetadata({
  title: "Admin",
  description: "Admin account and user list for Mystic AI Studio.",
  path: "/admin"
});

export default async function AdminPage() {
  const user = await getCurrentUserFromCookies();

  if (!user) {
    redirect("/login?next=/admin");
  }

  if (user.role !== "admin") {
    redirect("/account");
  }

  const users = await listAuthUsersForAdmin();

  return (
    <>
      <PageHeader
        eyebrow="Admin"
        title="Admin dashboard"
        description="The administrator account is initialized from ADMIN_EMAIL and ADMIN_PASSWORD. Registered users can only use email and password authentication."
      />
      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
          <aside className="panel h-fit rounded-lg p-6">
            <h2 className="text-xl font-semibold text-white">Current admin</h2>
            <dl className="mt-5 grid gap-4 text-sm">
              <div>
                <dt className="font-semibold text-stone-400">Email</dt>
                <dd className="mt-2 text-white">{user.email}</dd>
              </div>
              <div>
                <dt className="font-semibold text-stone-400">Configured admin email</dt>
                <dd className="mt-2 text-white">{process.env.ADMIN_EMAIL || "Not configured"}</dd>
              </div>
            </dl>
            <p className="mt-5 text-sm leading-6 text-stone-400">
              Change the admin email or password through environment variables,
              then restart the container. The stored admin account will be synced
              on the next authenticated request.
            </p>
            <div className="mt-6">
              <LogoutButton />
            </div>
          </aside>

          <div className="panel overflow-hidden rounded-lg">
            <div className="border-b border-white/10 p-5">
              <h2 className="text-xl font-semibold text-white">Users</h2>
              <p className="mt-2 text-sm text-stone-400">
                {users.length} account{users.length === 1 ? "" : "s"} stored in the local auth volume.
              </p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[620px] text-left text-sm">
                <thead className="border-b border-white/10 text-xs uppercase text-stone-500">
                  <tr>
                    <th className="px-5 py-3">Email</th>
                    <th className="px-5 py-3">Role</th>
                    <th className="px-5 py-3">Credits</th>
                    <th className="px-5 py-3">Created</th>
                    <th className="px-5 py-3">Updated</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {users.map((storedUser) => (
                    <tr key={storedUser.id}>
                      <td className="px-5 py-4 font-medium text-white">{storedUser.email}</td>
                      <td className="px-5 py-4 capitalize text-stone-300">{storedUser.role}</td>
                      <td className="px-5 py-4 font-semibold text-brass">{storedUser.credits}</td>
                      <td className="px-5 py-4 text-stone-300">
                        {new Date(storedUser.createdAt).toLocaleString()}
                      </td>
                      <td className="px-5 py-4 text-stone-300">
                        {new Date(storedUser.updatedAt).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
