import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

import { env } from "@/lib/env";

// Server Components: read cookies, don't attempt to set.
export function createSupabaseServerClient() {
  const cookieStore = cookies();

  return createServerClient(env.supabaseUrl(), env.supabasePublishableKey(), {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      // In Server Components we should not mutate cookies.
      setAll() {},
    },
  });
}

// Route Handlers / Server Actions: read + set cookies.
export function createSupabaseRouteHandlerClient() {
  const cookieStore = cookies();

  return createServerClient(env.supabaseUrl(), env.supabasePublishableKey(), {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        for (const { name, value, options } of cookiesToSet) {
          cookieStore.set(name, value, options);
        }
      },
    },
  });
}

