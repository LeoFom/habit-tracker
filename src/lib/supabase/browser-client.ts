"use client"
import {createBrowserClient} from '@supabase/ssr'
import type {SupabaseClient} from "@supabase/supabase-js";

type SupabaseSchema = Record<string, never>;

const client: SupabaseClient<SupabaseSchema> | null = null

export async function getSupabaseBrowserClient() {
  if (client) {
    return client;
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if(!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      'Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY'
    )
  }

  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}