import { createPagesBrowserClient } from '@supabase/auth-helpers-nextjs'
import { Session, SupabaseClient } from '@supabase/supabase-js'

export const supabase = createPagesBrowserClient()
