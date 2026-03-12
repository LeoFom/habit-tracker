'use client'

import {useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { getSupabaseBrowserClient } from "@/lib/supabase/browser-client";

export default function UpdatePasswordPage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [password, setPassword] = useState("")
  const [message, setMessage] = useState("")
  const [isAuth, setIsAuth] = useState(false)

  useEffect(() => {
    const handleAuth = async () => {
      const supabase = await getSupabaseBrowserClient()
      const code = searchParams.get("code")

      if (!code) {
        if(isAuth){
          setIsAuth(false)
        }
        router.push("/")
        return
      }

      const { error } = await supabase.auth.exchangeCodeForSession(code)

      if (error) {
        console.error(error)
        if(isAuth){
          setIsAuth(false)
        }
        router.push("/auth/error")
        return
      }

      setIsAuth(true)
      router.push("/auth/update-password")
    }

    handleAuth()
  }, [])

  const updatePassword = async () => {


    const supabase = await getSupabaseBrowserClient()

    const { error } = await supabase.auth.updateUser({
      password
    })

    if (error) {
      setMessage(error.message)
      return
    }

    setMessage("Password updated successfully")
  }

  if(!isAuth) return <>Авторизация...</>

  return (
    <div style={{padding:40}}>

      <h2>Update password</h2>

      <input
        type="password"
        placeholder="New password"
        value={password}
        onChange={(e)=>setPassword(e.target.value)}
      />

      <button onClick={updatePassword}>
        Update password
      </button>

      <p>{message}</p>

    </div>
  )
}