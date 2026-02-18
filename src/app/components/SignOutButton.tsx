"use client";

import { useState } from "react";

export function SignOutButton() {
  const [isLoading, setIsLoading] = useState(false);

  async function signOut() {
    setIsLoading(true);
    await fetch("/auth/signout", { method: "POST" });
    // middleware + server components will pick up cleared session on refresh
    window.location.href = "/";
  }

  return (
    <button
      type="button"
      disabled={isLoading}
      onClick={signOut}
      className="inline-flex h-9 items-center justify-center rounded-xl border border-zinc-200 bg-white px-3 text-sm font-medium text-zinc-900 hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {isLoading ? "Signing out…" : "Sign out"}
    </button>
  );
}

