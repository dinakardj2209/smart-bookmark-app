"use client";

import { useEffect, useMemo, useState } from "react";

import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import type { Bookmark } from "@/lib/types";

type Props = {
  userId: string;
  initialBookmarks: Bookmark[];
};

function normalizeUrl(input: string): string {
  const trimmed = input.trim();
  const withScheme =
    trimmed.startsWith("http://") || trimmed.startsWith("https://")
      ? trimmed
      : `https://${trimmed}`;

  return new URL(withScheme).toString();
}

export function BookmarksClient({ userId, initialBookmarks }: Props) {
  const supabase = useMemo(() => createSupabaseBrowserClient(), []);

  const [bookmarks, setBookmarks] = useState<Bookmark[]>(initialBookmarks);
  const [url, setUrl] = useState("");
  const [title, setTitle] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Keep local state in sync if the server sends a new initial list (rare).
    setBookmarks(initialBookmarks);
  }, [initialBookmarks]);

  useEffect(() => {
    const channel = supabase
      .channel(`bookmarks:${userId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "bookmarks",
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          setBookmarks((current) => {
            const eventType = payload.eventType;
            if (eventType === "INSERT") {
              const inserted = payload.new as Bookmark;
              const deduped = [inserted, ...current].filter(
                (b, idx, arr) => arr.findIndex((x) => x.id === b.id) === idx,
              );
              deduped.sort(
                (a, b) =>
                  new Date(b.created_at).getTime() -
                  new Date(a.created_at).getTime(),
              );
              return deduped;
            }

            if (eventType === "DELETE") {
              const deleted = payload.old as { id: string };
              return current.filter((b) => b.id !== deleted.id);
            }

            if (eventType === "UPDATE") {
              const updated = payload.new as Bookmark;
              return current.map((b) => (b.id === updated.id ? updated : b));
            }

            return current;
          });
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, userId]);

  async function addBookmark(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!url.trim() || !title.trim()) {
      setError("Please provide both a URL and a title.");
      return;
    }

    let normalizedUrl: string;
    try {
      normalizedUrl = normalizeUrl(url);
    } catch {
      setError("Please enter a valid URL.");
      return;
    }

    setIsSaving(true);
    const { data, error } = await supabase
      .from("bookmarks")
      .insert({ url: normalizedUrl, title: title.trim() })
      .select("id,user_id,url,title,created_at")
      .single();
    setIsSaving(false);

    if (error) {
      setError(error.message);
      return;
    }

    const inserted = data as Bookmark;
    setBookmarks((current) => {
      const next = [inserted, ...current].filter(
        (b, idx, arr) => arr.findIndex((x) => x.id === b.id) === idx,
      );
      next.sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
      );
      return next;
    });

    setUrl("");
    setTitle("");
  }

  async function deleteBookmark(id: string) {
    setError(null);
    const { error } = await supabase.from("bookmarks").delete().eq("id", id);
    if (error) {
      setError(error.message);
      return;
    }
    setBookmarks((current) => current.filter((b) => b.id !== id));
  }

  return (
    <div className="grid gap-8">
      <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
        <h2 className="text-base font-semibold text-zinc-900">Add bookmark</h2>
        <p className="mt-1 text-sm text-zinc-600">
          Saved privately to your account.
        </p>

        <form onSubmit={addBookmark} className="mt-5 grid gap-3">
          <div className="grid gap-2 md:grid-cols-2">
            <label className="grid gap-1 text-sm">
              <span className="font-medium text-zinc-900">URL</span>
              <input
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com"
                className="h-11 rounded-xl border border-zinc-200 bg-white px-3 text-sm text-zinc-900 shadow-sm outline-none ring-0 placeholder:text-zinc-400 focus:border-zinc-400"
              />
            </label>
            <label className="grid gap-1 text-sm">
              <span className="font-medium text-zinc-900">Title</span>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Example"
                className="h-11 rounded-xl border border-zinc-200 bg-white px-3 text-sm text-zinc-900 shadow-sm outline-none ring-0 placeholder:text-zinc-400 focus:border-zinc-400"
              />
            </label>
          </div>

          <div className="flex items-center justify-between gap-3">
            <button
              type="submit"
              disabled={isSaving}
              className="inline-flex h-10 items-center justify-center rounded-xl bg-zinc-900 px-4 text-sm font-medium text-white hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSaving ? "Saving…" : "Save"}
            </button>
            {error ? <p className="text-sm text-red-600">{error}</p> : null}
          </div>
        </form>
      </section>

      <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
        <div className="flex items-baseline justify-between gap-4">
          <h2 className="text-base font-semibold text-zinc-900">Your bookmarks</h2>
          <p className="text-sm text-zinc-600">{bookmarks.length} total</p>
        </div>

        {bookmarks.length === 0 ? (
          <p className="mt-4 text-sm text-zinc-600">
            No bookmarks yet. Add one above.
          </p>
        ) : (
          <ul className="mt-4 divide-y divide-zinc-100">
            {bookmarks.map((b) => (
              <li key={b.id} className="flex items-start justify-between gap-4 py-4">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-zinc-900">
                    {b.title}
                  </p>
                  <a
                    href={b.url}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-1 block truncate text-sm text-zinc-600 hover:underline"
                  >
                    {b.url}
                  </a>
                  <p className="mt-1 text-xs text-zinc-500">
                    {new Date(b.created_at).toLocaleString()}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => deleteBookmark(b.id)}
                  className="shrink-0 rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm font-medium text-zinc-900 hover:bg-zinc-50"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

