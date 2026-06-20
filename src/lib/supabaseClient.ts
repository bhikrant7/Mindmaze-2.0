import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
// Accept the project's publishable key under any of the common env names
const SUPABASE_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  if (typeof window !== "undefined") {
    // Log details to client console for easier debugging
    // (these values are inlined at build-time by Next.js)
    // eslint-disable-next-line no-console
    // console.error("Supabase env vars missing", {
    //   NEXT_PUBLIC_SUPABASE_URL: SUPABASE_URL,
    //   NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY:
    //     process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY,
    //   NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY:
    //     process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
    //   NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    // });
  }
  throw new Error(
    "Supabase env vars are missing. Ensure NEXT_PUBLIC_SUPABASE_URL and one of NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY, NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY, or NEXT_PUBLIC_SUPABASE_ANON_KEY are set and restart the dev server.",
  );
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
