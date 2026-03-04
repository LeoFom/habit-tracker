// import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { createServerClient } from '@supabase/ssr'

function genEnvVariables() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnnonKey =  process.env.SUPABASE_SERVICE_ROLE_KEY

  if(!supabaseUrl || !supabaseAnnonKey){
    throw new Error(
      'Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY'
    )
  }

  return { supabaseUrl, supabaseAnnonKey }
}

export async function createServerSupabase() {
  const { supabaseUrl, supabaseAnnonKey } = genEnvVariables();
  const cookiesStore = await cookies();

  return createServerClient(supabaseUrl, supabaseAnnonKey, {
    cookies: {
      getAll() {
        return cookiesStore.getAll()
      },
      setAll(cookieToSet) {
        try {
          cookieToSet.forEach(({ name, value, options })=>
            cookiesStore.set(name, value, options)
          )
        } catch (error) {
          console.log(error)
        }
      }
    }
  })

  // return createClient(
  //   process.env.NEXT_PUBLIC_SUPABASE_URL!,
  //   process.env.SUPABASE_SERVICE_ROLE_KEY!
  // );
}