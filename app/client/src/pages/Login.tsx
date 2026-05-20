import AuthCard from "../components/auth/AuthCard"
import GlowBackground from "../components/auth/GlowBackground"
import ThemeToggle from "../components/auth/ThemeToggle"
import GoogleButton from "../components/auth/GoogleButton"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"

export default function () {
  return (
    <div
      className="
      min-h-screen
      bg-gradient-to-br
      from-black
      via-zinc-950
      to-zinc-900
      flex
      justify-center
      items-center
      relative
      px-4
      overflow-hidden
    "
    >

      {/* subtle background glows */}
      <div className="absolute w-96 h-96 bg-zinc-700/20 blur-[150px] rounded-full top-10 left-10" />
      <div className="absolute w-96 h-96 bg-white/5 blur-[150px] rounded-full bottom-10 right-10" />

      <GlowBackground />
      <ThemeToggle />

      <div
        className="
        z-10
        w-full
        max-w-md
        bg-white/5
        backdrop-blur-2xl
        border
        border-white/10
        rounded-3xl
        p-8
        shadow-2xl
      "
      >

        <h1
          className="
          text-center
          font-bold
          text-4xl
          text-white
        "
        >
          Welcome Back
        </h1>

        <p className="text-center text-zinc-400 mt-2">
          Sign into Ratees
        </p>

        <div className="mt-6">

          <GoogleButton />

          <div className="my-5 text-center text-zinc-500">
            OR
          </div>

          <div className="space-y-4">

            <Input
              placeholder="Username or Email"
              className="
              bg-zinc-900/50
              border-zinc-700
              text-white
              placeholder:text-zinc-500
              backdrop-blur-sm
            "
            />

            <Input
              type="password"
              placeholder="Password"
              className="
              bg-zinc-900/50
              border-zinc-700
              text-white
              placeholder:text-zinc-500
            "
            />

            <Button
              className="
              w-full
              bg-zinc-100
              text-black
              hover:bg-zinc-300
              rounded-xl
            "
            >
              Login
            </Button>

          </div>

          <p className="mt-4 text-center text-zinc-400">

            No account?

            <Link
              to="/signup"
              className="
              text-white
              ml-2
              hover:text-zinc-300
            "
            >
              Sign up
            </Link>

          </p>

        </div>
      </div>
    </div>
  )
}