import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { Bookmark } from "@/lib/types";

import { BookmarksClient } from "@/app/components/BookmarksClient";
import { SignInWithGoogleButton } from "@/app/components/SignInWithGoogleButton";
import { SignOutButton } from "@/app/components/SignOutButton";

export default function Home() {
  return <HomePage />;
}

async function HomePage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <div className="mx-auto flex min-h-screen max-w-5xl flex-col justify-center px-6 py-16">
        <div className="grid gap-10 rounded-3xl border border-zinc-200 bg-white p-10 shadow-sm md:grid-cols-2">
          <div>
            <h1 className="text-balance text-4xl font-semibold tracking-tight text-zinc-900">
              Smart Bookmark App
            </h1>
            <p className="mt-4 text-pretty text-base leading-7 text-zinc-600">
              A private bookmark manager with Google sign-in and real-time
              updates across tabs.
            </p>
            <ul className="mt-6 space-y-2 text-sm text-zinc-600">
              <li>• Private per-user bookmarks (RLS enforced)</li>
              <li>• Add + delete bookmarks</li>
              <li>• Realtime sync without refresh</li>
            </ul>
          </div>

          <div className="flex flex-col justify-center">
            <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-6">
              <p className="text-sm font-medium text-zinc-900">Get started</p>
              <p className="mt-1 text-sm text-zinc-600">
                Sign in with Google to manage your bookmarks.
              </p>
              <div className="mt-5">
                <SignInWithGoogleButton />
              </div>
              <p className="mt-4 text-xs leading-5 text-zinc-500">
                No email/password — Google OAuth only.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const { data } = await supabase
    .from("bookmarks")
    .select("id,user_id,url,title,created_at")
    .order("created_at", { ascending: false });

  const initialBookmarks = (data ?? []) as Bookmark[];

  return (
    <div className="mx-auto min-h-screen max-w-5xl px-6 py-10">
      <header className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-zinc-900">Smart Bookmark App</p>
          <p className="mt-1 text-sm text-zinc-600">
            Signed in as{" "}
            <span className="font-medium text-zinc-900">
              {user.user_metadata?.name ?? user.email ?? "User"}
            </span>
          </p>
        </div>
        <SignOutButton />
      </header>

      <main className="mt-8">
        <BookmarksClient userId={user.id} initialBookmarks={initialBookmarks} />
      </main>
    </div>
  );
}
