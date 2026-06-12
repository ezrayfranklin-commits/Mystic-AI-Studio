"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { LogOut, ShieldCheck, UserRound } from "lucide-react";

import { cn } from "@/lib/utils";

type AuthUser = {
  email: string;
  role: "admin" | "user";
};

export function AuthButtons({
  mobile = false,
  onNavigate
}: {
  mobile?: boolean;
  onNavigate?: () => void;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let mounted = true;
    fetch("/api/auth/me", { cache: "no-store" })
      .then((response) => response.json())
      .then((payload: { authenticated?: boolean; user?: AuthUser | null }) => {
        if (mounted) {
          setUser(payload.authenticated ? payload.user ?? null : null);
        }
      })
      .catch(() => {
        if (mounted) {
          setUser(null);
        }
      })
      .finally(() => {
        if (mounted) {
          setLoaded(true);
        }
      });

    return () => {
      mounted = false;
    };
  }, []);

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    onNavigate?.();
    router.push("/");
    router.refresh();
  };

  const baseClass = mobile ? "justify-start" : "";

  if (!loaded) {
    return <div className={mobile ? "h-10" : "h-10 w-36"} aria-hidden="true" />;
  }

  if (!user) {
    return (
      <div className={cn("flex gap-2", mobile && "grid")}>
        <Link
          href="/login"
          className={cn("button-ghost", baseClass, pathname === "/login" && "bg-white/[0.1] text-brass")}
          onClick={onNavigate}
        >
          Log in
        </Link>
        <Link
          href="/register"
          className={cn("button-secondary", baseClass, pathname === "/register" && "border-brass/50 text-brass")}
          onClick={onNavigate}
        >
          Register
        </Link>
      </div>
    );
  }

  const accountHref = user.role === "admin" ? "/admin" : "/account";

  return (
    <div className={cn("flex gap-2", mobile && "grid")}>
      <Link
        href={accountHref}
        className={cn("button-secondary", baseClass)}
        onClick={onNavigate}
      >
        {user.role === "admin" ? (
          <ShieldCheck className="h-4 w-4" aria-hidden="true" />
        ) : (
          <UserRound className="h-4 w-4" aria-hidden="true" />
        )}
        {user.role === "admin" ? "Admin" : "Account"}
      </Link>
      <button type="button" className={cn("button-ghost", baseClass)} onClick={logout}>
        <LogOut className="h-4 w-4" aria-hidden="true" />
        Log out
      </button>
    </div>
  );
}
