// import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { createServerClient } from '@supabase/ssr'

function genEnvVariables() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  // МАЄ БУТИ ANON_KEY для браузера/клієнта
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if(!supabaseUrl || !supabaseAnonKey){
    throw new Error('Missing URL or ANON_KEY');
  }
  return { supabaseUrl, supabaseAnonKey };
}

export async function createServerSupabase() {
  const { supabaseUrl, supabaseAnonKey } = genEnvVariables();
  const cookiesStore = await cookies();

  return createServerClient(supabaseUrl, supabaseAnonKey, {
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