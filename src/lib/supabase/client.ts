import { createPagesBrowserClient } from '@supabase/auth-helpers-nextjs'
import { createServerClient } from '@supabase/ssr'
import { Session, SupabaseClient } from '@supabase/supabase-js'
import { Database } from './database.types'

// Client-side Supabase client
export const supabase = createPagesBrowserClient<Database>()

// Server-side Supabase client (for Server Components and Server Actions)
export function createServerSupabaseClient() {
  // This function should only be called in server components
  // We'll dynamically import cookies from next/headers
  const { cookies } = require('next/headers')
  const cookieStore = cookies()
  
  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: any) {
          try {
            cookieStore.set({ name, value, ...options })
          } catch (error) {
            console.error('Error setting cookie:', error)
          }
        },
        remove(name: string, options: any) {
          try {
            cookieStore.delete({ name, ...options })
          } catch (error) {
            console.error('Error removing cookie:', error)
          }
        },
      },
    }
  )
}
