'use client'

import { createBrowserClient } from '@supabase/ssr'
import type { Database } from '@/types/database'

function getSupabaseConfig() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !key || url === 'your_supabase_url' || key === 'your_supabase_anon_key') {
    return null
  }
  return { url, key }
}

export function isSupabaseConfigured() {
  return getSupabaseConfig() !== null
}

export function createClient() {
  const config = getSupabaseConfig()
  if (!config) {
    throw new Error('Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local')
  }
  return createBrowserClient<Database>(config.url, config.key)
}

export function createSafeClient() {
  const config = getSupabaseConfig()
  if (!config) return null
  return createBrowserClient<Database>(config.url, config.key)
}
