import { authClient } from '@/lib/auth-client'
import { toast } from "sonner"
import { CircleX } from "lucide-react"
import React from 'react'

type FormSignUp = {
  username: string
  email: string
  password: string
}

type FormSignIn = {
  email: string
  password: string
}

const handleSignUpWithEmail = async (
  form: FormSignUp,
  image: string,
) => {
  await authClient.signUp.email(
    {
      image,
      email: form.email,
      password: form.password,
      name: form.username,
      callbackURL: "http://localhost:5173",
    },
    {
      onSuccess: async () => {
        window.location.href = "http://localhost:5173"
      },
      onError: async (ctx) => {
        toast.error(ctx.error.message, {
          icon: React.createElement(CircleX, { className: 'text-red-500' }),
          position: "top-center",
          duration: 10000,
        })
      },
    }
  )
}

const handleSignInWithEmail = async (
  form: FormSignIn,
) => {
  await authClient.signIn.email(
    {
      email: form.email,
      password: form.password,
      rememberMe: true,
      callbackURL: "http://localhost:5173",
    },
    {
      onError: async (ctx) => {
        toast.error(ctx.error.message, {
          icon: React.createElement(CircleX, { className: 'text-red-500' }),
          position: "top-center",
          duration: 10000,
        })
      },
    }
  )
}

const handleSignUpWithGoogle = async () => {
  await authClient.signIn.social(
    {
      provider: "google",
      callbackURL: "http://localhost:5173",
    },
    {
      onError: async (ctx) => {
        toast.error(ctx.error.message, {
          icon: React.createElement(CircleX, { className: 'text-red-500' }),
          position: "top-center",
          duration: 10000,
        })
      },
    }
  )
}

export { handleSignUpWithEmail, handleSignUpWithGoogle, handleSignInWithEmail }
