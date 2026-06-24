import { motion } from "framer-motion";
import InputField from "../input/InputField";
import GoogleButton from "../buttons/GoogleButton";
import { Button } from "@/components/ui/shadcn/button";

export default function AuthCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }} // Custom premium cubic-bezier ease-out
      className="
        w-full
        max-w-[420px]
        p-8
        rounded-2xl
        backdrop-blur-xl
        bg-zinc-950/40
        border
        border-white/[0.06]
        shadow-[0_24px_60px_-15px_rgba(0,0,0,0.8)]
        z-10
        relative
        overflow-hidden
      "
    >
      {/* Subtle top inner linear sheen edge */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none" />

      {/* Header Section */}
      <div className="text-center space-y-1.5">
        <p className="text-xs font-semibold tracking-[0.08em] uppercase bg-gradient-to-r from-orange-400 to-amber-200 bg-clip-text text-transparent">
          Join Ratees
        </p>
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-100">
          Your next favorite movie starts here
        </h1>
      </div>

      {/* Auth Content */}
      <div className="mt-8">
        <GoogleButton />

        {/* Premium Divider Line */}
        <div className="my-6 flex items-center gap-4">
          <div className="h-px bg-gradient-to-r from-transparent to-zinc-800/80 flex-1" />
          <span className="text-[10px] font-bold tracking-[0.12em] text-zinc-600 uppercase select-none">
            Or continue with
          </span>
          <div className="h-px bg-gradient-to-l from-transparent to-zinc-800/80 flex-1" />
        </div>

        {/* Input Form Fields Wrapper */}
        <div className="space-y-3.5">
          <InputField placeholder="Username" />
          <InputField placeholder="Email" type="email" />
          <InputField placeholder="Password" type="password" />

          <Button
            className="
              w-full
              h-11
              mt-2
              rounded-lg
              bg-zinc-100
              text-zinc-950
              font-medium
              text-sm
              hover:bg-white
              active:scale-[0.98]
              shadow-[0_1px_2px_rgba(0,0,0,0.1)]
              transition-all
              duration-200
            "
          >
            Create account
          </Button>
        </div>
      </div>

      {/* Bottom Footer Actions */}
      <p className="text-center text-xs text-zinc-500 mt-6 tracking-wide">
        Already have an account?
        <span className="text-zinc-300 hover:text-white ml-1.5 font-medium transition-colors duration-200 cursor-pointer underline-offset-4 hover:underline">
          Log in
        </span>
      </p>
    </motion.div>
  );
}