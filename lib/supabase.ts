import { createBrowserClient } from '@supabase/ssr';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  if (typeof window !== 'undefined') {
    console.warn(
      '⚠️ Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY in environment variables. Please check .env.local.'
    );
  }
}

/**
 * Client-side Supabase instance for browser execution (Client Components).
 * Re-uses an internal singleton client when rendered on the browser.
 */
export const supabase = createBrowserClient<Database>(
  supabaseUrl || 'https://placeholder-url.supabase.co',
  supabaseAnonKey || 'placeholder-key'
);

/**
 * Creates a browser-side Supabase client with full Database type safety.
 */
export function createClient() {
  return createBrowserClient<Database>(
    supabaseUrl || 'https://placeholder-url.supabase.co',
    supabaseAnonKey || 'placeholder-key'
  );
}

/**
 * Server-side Supabase client helper for Server Components, Server Actions,
 * and Route Handlers using next/headers cookie store.
 */
export async function createServerClient() {
  const { cookies } = await import('next/headers');
  const cookieStore = await cookies();

  return createSupabaseClient<Database>(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: false,
    },
    global: {
      headers: {
        Cookie: cookieStore.toString(),
      },
    },
  });
}

/**
 * Service Role Admin client (Node.js/Server-side ONLY).
 * Bypasses RLS for administrative verification, dispute settlement, and system audit logs.
 */
export function createAdminClient() {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!serviceRoleKey) {
    throw new Error(
      'SUPABASE_SERVICE_ROLE_KEY is required for admin server client operations.'
    );
  }

  return createSupabaseClient<Database>(supabaseUrl, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

export default supabase;
