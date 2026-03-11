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
      getAll() {5fba51e0b304481b.js:37 Uncaught (in promise) Error: Missing required environment variable: NEXT_PUBLIC_SUPABASE_URL
        at rj (5fba51e0b304481b.js:37:54730)
        at rx (5fba51e0b304481b.js:41:4713)
        at o (5fba51e0b304481b.js:41:9607)
        at sY (f2f58a7e93290fbb.js:1:161798)
        at f2f58a7e93290fbb.js:1:167686
        at tD (f2f58a7e93290fbb.js:1:30293)
        at s3 (f2f58a7e93290fbb.js:1:163031)
        at fC (f2f58a7e93290fbb.js:1:198997)
        at fP (f2f58a7e93290fbb.js:1:198819)
    rj @ 5fba51e0b304481b.js:37
    rx @ 5fba51e0b304481b.js:41
    o @ 5fba51e0b304481b.js:41
    sY @ f2f58a7e93290fbb.js:1
    (anonymous) @ f2f58a7e93290fbb.js:1
    tD @ f2f58a7e93290fbb.js:1
    s3 @ f2f58a7e93290fbb.js:1
    fC @ f2f58a7e93290fbb.js:1
    fP @ f2f58a7e93290fbb.js:1
    
      setAll(cookiesToSet: { name: string; value: string; options?: Record<string, unknown> }[]) {
        for (const { name, value, options } of cookiesToSet) {
          cookieStore.set(name, value, options);
        }
      },
    },
  });
}
