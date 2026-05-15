// lib/supabase.ts

import {
  createClient,
} from "@supabase/supabase-js";

// ====================================
// CLIENT-SIDE SUPABASE INSTANCE
// ====================================
// SAFE FOR:
// - browser/client components
// - realtime subscriptions
// - public anon access
//
// NEVER use service role key here.
// ====================================

export const supabase =
  createClient(
    process.env
      .NEXT_PUBLIC_SUPABASE_URL!,

    process.env
      .NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );