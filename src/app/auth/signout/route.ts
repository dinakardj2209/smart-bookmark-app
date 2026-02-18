import { NextResponse } from "next/server";

import { createSupabaseRouteHandlerClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const requestUrl = new URL(request.url);
  const supabase = createSupabaseRouteHandlerClient();
  await supabase.auth.signOut();
  return NextResponse.redirect(new URL("/", requestUrl.origin), { status: 303 });
}

