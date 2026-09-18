"use server"

import { createClient, isSupabaseConfigured } from "@/lib/supabase/server"
import { createAdminClient, isSupabaseAdminConfigured } from "@/lib/supabase/admin"
import { redirect } from "next/navigation"

export async function signIn(prevState: any, formData: FormData) {
  if (!isSupabaseConfigured) {
    return { error: "Authentication service is not configured. Please contact support." }
  }

  if (!formData) {
    return { error: "Form data is missing" }
  }

  const email = formData.get("email")
  const password = formData.get("password")

  if (!email || !password) {
    return { error: "Email and password are required" }
  }

  const supabase = createClient()

  try {
    const { error } = await supabase.auth.signInWithPassword({
      email: email.toString(),
      password: password.toString(),
    })

    if (error) {
      return { error: error.message }
    }

    return { success: true }
  } catch (error) {
    console.error("Login error:", error)
    return { error: "Unable to connect to authentication service. Please try again later." }
  }
}

export async function signUp(prevState: any, formData: FormData) {
  if (!isSupabaseConfigured) {
    return { error: "Authentication service is not configured. Please contact support." }
  }

  if (!formData) {
    return { error: "Form data is missing" }
  }

  const email = formData.get("email")
  const password = formData.get("password")

  if (!email || !password) {
    return { error: "Email and password are required" }
  }

  try {
    if (isSupabaseAdminConfigured) {
      // Create user as confirmed using the service role key
      const admin = createAdminClient()
      const { data, error } = await admin.auth.admin.createUser({
        email: email.toString(),
        password: password.toString(),
        email_confirm: true,
      })

      if (error) {
        return { error: error.message }
      }

      // Optionally sign the user in immediately after creation
      const supabase = createClient()
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: email.toString(),
        password: password.toString(),
      })
      if (signInError) {
        return { error: signInError.message }
      }

      return { success: true }
    } else {
      const supabase = createClient()
      const { error } = await supabase.auth.signUp({
        email: email.toString(),
        password: password.toString(),
        options: {
          emailRedirectTo:
            process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL ||
            `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/dashboard`,
        },
      })

      if (error) {
        return { error: error.message }
      }
      return { success: "Check your email to confirm your account and get started with OrbitEdge Global!" }
    }
  } catch (error) {
    console.error("Sign up error:", error)
    return { error: "Unable to connect to authentication service. Please try again later." }
  }
}

export async function signOut() {
  if (!isSupabaseConfigured) {
    redirect("/")
    return
  }

  try {
    const supabase = createClient()
    await supabase.auth.signOut()
  } catch (error) {
    console.error("Sign out error:", error)
  }
  redirect("/")
}
