import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { cache } from 'react'
import type { Database } from './database.types'

type CookieOptions = {
  name: string;
  value: string;
  maxAge?: number;
  domain?: string;
  path?: string;
  expires?: Date;
  httpOnly?: boolean;
  secure?: boolean;
  sameSite?: 'lax' | 'strict' | 'none';
};

// Check if Supabase environment variables are available
export const isSupabaseConfigured =
  typeof process.env.NEXT_PUBLIC_SUPABASE_URL === 'string' &&
  process.env.NEXT_PUBLIC_SUPABASE_URL.length > 0 &&
  typeof process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY === 'string' &&
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.length > 0

// Create a cached version of the Supabase client for Server Components
export const createClient = cache(() => {
  const cookieStore = cookies()
  const cookieStoreObj = cookieStore as unknown as {
    get: (name: string) => { value: string } | undefined;
    set: (options: CookieOptions) => void;
  };

  if (!isSupabaseConfigured) {
    console.warn('Supabase environment variables are not set. Using dummy client.')
    return {
      auth: {
        getUser: () => Promise.resolve({ data: { user: null }, error: null }),
        getSession: () => Promise.resolve({ data: { session: null }, error: null }),
      },
    } as any
  }

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStoreObj.get(name)?.value
        },
        set(name: string, value: string, options: any) {
          try {
            cookieStoreObj.set({ name, value, ...options })
          } catch (error) {
            // Handle the error if needed
          }
        },
        remove(name: string, options: any) {
          try {
            cookieStoreObj.set({ name, value: '', ...options, maxAge: 0 })
          } catch (error) {
            // Handle the error if needed
          }
        },
      },
    }
  )
})
