"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

export function LogoutButton() {
  const router = useRouter();

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
    router.refresh();
  };

  return (
    <button type="button" className="button-secondary" onClick={logout}>
      <LogOut className="h-4 w-4" aria-hidden="true" />
      Log out
    </button>
  );
}
