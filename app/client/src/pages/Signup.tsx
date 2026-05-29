import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import { handelSignUpWithFiled } from "@/functions/auth.function";

import AuthNavbar from "@/components/navbar/AuthNavbar";
import GlowBackground from "@/components/background/GlowBackground";

import FormStep, { FormState } from "@/components/auth/FormStep";
import AvatarStep from "@/components/auth/AvatarStep";
import VerificationStep from "@/components/auth/VerificationStep";

export type FlowStep = "FORM" | "AVATAR" | "VERIFY";

export default function Signup() {
  const [currentStep, setCurrentStep] =
    useState<FlowStep>("FORM");

  const [selectedAvatar, setSelectedAvatar] =
    useState<string | null>(null);

  const [form, setForm] = useState<FormState>({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFinalSubmit = async () => {
    await handelSignUpWithFiled(
      form,
      selectedAvatar!,
      setCurrentStep
    );

    await new Promise((resolve) =>
      setTimeout(resolve, 1200)
    );
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#030303] text-zinc-100 antialiased selection:bg-violet-500/30 selection:text-white">
      {/* Background */}
      <GlowBackground
        style="cinema"
        intensity="medium"
        animated={true}
      />

      {/* Ambient Lighting */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden z-0">
        {/* violet glow */}
        <div className="absolute top-[-20%] left-[-10%] h-[600px] w-[600px] rounded-full bg-violet-600/15 blur-[160px] mix-blend-screen" />

        {/* cyan glow */}
        <div className="absolute bottom-[-20%] right-[-10%] h-[700px] w-[700px] rounded-full bg-cyan-500/10 blur-[180px] mix-blend-screen" />

        {/* cinematic small center glow */}
        <div className="absolute top-[35%] left-[40%] h-[300px] w-[300px] rounded-full bg-fuchsia-500/5 blur-[120px]" />

        {/* premium grid */}
        <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.015)_1px,transparent_1px)] [background-size:24px_24px]" />

        {/* vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0),#030303_85%)]" />
      </div>

      <AuthNavbar />

      <section className="relative z-10 flex min-h-screen items-center justify-center px-4 py-20 sm:px-6 lg:px-8">
        <div className="grid w-full max-w-[1240px] overflow-hidden rounded-[30px] border border-white/[0.06] bg-[#0A0A0A]/40 shadow-[0_40px_100px_-30px_rgba(0,0,0,0.9)] backdrop-blur-3xl lg:min-h-[740px] lg:grid-cols-12">
          
          {/* LEFT SIDE */}
          <div className="relative hidden overflow-hidden border-r border-white/[0.06] bg-gradient-to-b from-white/[0.02] to-transparent p-16 lg:col-span-5 lg:flex lg:flex-col lg:justify-between">
            
            {/* glossy overlay */}
            <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.03),transparent_60%)]" />

            <div className="relative z-10">
              {/* badge */}
              <div className="mb-12 inline-flex items-center gap-2.5 rounded-full border border-white/[0.08] bg-white/[0.03] px-4 py-2 backdrop-blur-md shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-violet-400 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-violet-500" />
                </span>

                <span className="text-[11px] font-bold uppercase tracking-[0.22em] text-zinc-400">
                  Welcome to Ratees
                </span>
              </div>

              {/* Heading */}
              <div className="space-y-3">
                <h1 className="text-5xl xl:text-6xl font-bold tracking-tight leading-[0.95] text-white">
                  Movies feel better
                  <br />
                  when shared.
                </h1>

                <p className="max-w-md pt-4 text-[16px] leading-8 text-zinc-400">
                  Track what you watch, discover new films,
                  and connect with people who love cinema as
                  much as you do.
                </p>
              </div>
            </div>

            {/* bottom section */}
            <div className="relative z-10 grid grid-cols-3 gap-6 border-t border-white/[0.05] pt-8">
              <div>
                <h2 className="text-2xl xl:text-3xl font-bold tracking-tight text-white">
                  Watch
                </h2>

                <p className="mt-2 text-[11px] uppercase tracking-[0.18em] text-zinc-500 font-semibold">
                  Track movies
                </p>
              </div>

              <div>
                <h2 className="text-2xl xl:text-3xl font-bold tracking-tight text-white">
                  Share
                </h2>

                <p className="mt-2 text-[11px] uppercase tracking-[0.18em] text-zinc-500 font-semibold">
                  Reviews & lists
                </p>
              </div>

              <div>
                <h2 className="text-2xl xl:text-3xl font-bold tracking-tight text-white">
                  Discover
                </h2>

                <p className="mt-2 text-[11px] uppercase tracking-[0.18em] text-zinc-500 font-semibold">
                  Hidden gems
                </p>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="relative flex items-center justify-center bg-[#060606]/10 p-6 sm:p-12 lg:col-span-7">
            
            {/* ambient glow */}
            <div className="pointer-events-none absolute top-0 right-0 h-72 w-72 rounded-full bg-violet-500/5 blur-[120px]" />

            <div className="w-full max-w-[460px] py-6">
              <AnimatePresence
                mode="wait"
                initial={false}
              >
                <motion.div
                  key={currentStep}
                  initial={{
                    opacity: 0,
                    y: 18,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  exit={{
                    opacity: 0,
                    y: -18,
                  }}
                  transition={{
                    duration: 0.32,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0C0C0C]/50 p-7 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.85)] backdrop-blur-3xl sm:p-9"
                >
                  {/* premium light */}
                  <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-b from-white/[0.03] to-transparent" />

                  {/* glossy edge */}
                  <div className="pointer-events-none absolute inset-0 rounded-2xl bg-[linear-gradient(135deg,rgba(255,255,255,0.10),transparent_40%,transparent)]" />

                  <div className="relative z-10">
                    {/* Header */}
                    <div className="mb-10">
                      <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.03] px-3 py-1 text-xs text-zinc-400">
                        <div className="h-2 w-2 rounded-full bg-violet-400" />

                        Start your journey
                      </div>

                      <h2 className="text-4xl font-bold tracking-tight text-white leading-tight">
                        Create your account
                      </h2>

                      <p className="mt-4 max-w-sm text-[15px] leading-7 text-zinc-400">
                        Join a global community built for
                        movie lovers.
                      </p>
                    </div>

                    {/* Steps */}
                    {currentStep === "FORM" && (
                      <FormStep
                        form={form}
                        onChange={handleInputChange}
                        onNext={() =>
                          setCurrentStep("AVATAR")
                        }
                      />
                    )}

                    {currentStep === "AVATAR" && (
                      <AvatarStep
                        selectedAvatar={selectedAvatar}
                        onSelectAvatar={setSelectedAvatar}
                        onBack={() =>
                          setCurrentStep("FORM")
                        }
                        onSubmit={handleFinalSubmit}
                      />
                    )}

                    {currentStep === "VERIFY" && (
                      <VerificationStep
                        email={form.email}
                      />
                    )}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}