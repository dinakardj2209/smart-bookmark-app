import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

import { env } from "@/lib/env";

// Server Components: read cookies, don't attempt to set.
export async function createSupabaseServerClient() {
  const cookieStore = await cookies() as any;

  return createServerClient(env.supabaseUrl(), env.supabaseAnonKey(), {
    cookies: {
      getAll() {
        return cookieStore.getAll ? cookieStore.getAll() : []
      },
      setAll() {},
    },
  });
}

// Route Handlers / Server Actions: read + set cookies.
export async function createSupabaseRouteHandlerClient() {
  const cookieStore = await cookies() as any;

  return createServerClient(env.supabaseUrl(), env.supabaseAnonKey(), {
    cookies: {
      getAll() {
        return cookieStore.getAll ? cookieStore.getAll() : []
      },
      setAll(cookiesToSet: { name: string; value: string; options?: Record<string, unknown> }[]) {
        for (const { name, value, options } of cookiesToSet) {
          cookieStore.set(name, value, options);
        }
      },
    },
  });
}
