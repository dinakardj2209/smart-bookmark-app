// Use static property access so Next.js can inline NEXT_PUBLIC_* at build time.
// Dynamic access (e.g. process.env[name]) is NOT inlined in client bundles.
function requireEnv(value: string | undefined, name: string): string {
  if (!value) {
    throw new Error(
      `Missing required environment variable: ${name}. ` +
        (typeof window !== "undefined"
          ? "If deploying on Vercel, add this in Project Settings → Environment Variables and redeploy."
          : "Add it to .env locally, or to Vercel Environment Variables for production.")
    );
  }
  return value;
}

export const env = {
  supabaseUrl: () =>
    requireEnv(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      "NEXT_PUBLIC_SUPABASE_URL"
    ),
  supabaseAnonKey: () =>
    requireEnv(
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      "NEXT_PUBLIC_SUPABASE_ANON_KEY"
    ),
};

