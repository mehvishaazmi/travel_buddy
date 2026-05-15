// lib/supabase-admin.ts

import "server-only";

import {
  createClient,
} from "@supabase/supabase-js";

// ====================================
// ENV VALIDATION
// ====================================

const supabaseUrl =
  process.env
    .NEXT_PUBLIC_SUPABASE_URL;

const serviceRoleKey =
  process.env
    .SUPABASE_SERVICE_ROLE_KEY;

if (
  !supabaseUrl ||
  !serviceRoleKey
) {

  throw new Error(
    "Missing Supabase environment variables",
  );
}

// ====================================
// ADMIN CLIENT
// ====================================
// SERVER-ONLY
//
// Used for:
// - protected APIs
// - admin DB operations
// - payment verification
// - secure inserts/updates
//
// NEVER import this into:
// - client components
// - browser code
// ====================================

export const supabaseAdmin =
  createClient(
    supabaseUrl,
    serviceRoleKey,
    {
      auth: {
        autoRefreshToken:
          false,

        persistSession:
          false,
      },

      global: {
        headers: {
          "x-application-name":
            "travelbuddy",
        },
      },
    },
  );