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
  const [currentStep, setCurrentStep] = useState<FlowStep>("FORM");

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
      setTimeout(resolve, 1500)
    );
  };

  return (
    <main className="relative min-h-screen overflow-x-hidden bg-[#030303] text-zinc-100 antialiased selection:bg-violet-500/30 selection:text-white">
      {/* Background Ambience Engine */}
      <GlowBackground style="cinema" intensity="medium" animated={true} />

      {/* Massive cinematic ambient lighting */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-20%] left-[-10%] h-[600px] w-[600px] rounded-full bg-violet-600/15 blur-[160px] mix-blend-screen" />
        <div className="absolute bottom-[-20%] right-[-10%] h-[700px] w-[700px] rounded-full bg-cyan-500/10 blur-[180px] mix-blend-screen" />
        <div className="absolute top-[25%] left-[35%] h-[400px] w-[400px] rounded-full bg-fuchsia-500/5 blur-[140px]" />
        
        {/* Elite Cyber Dot Grid overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.015)_1px,transparent_1px)] [background-size:24px_24px]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0),#030303_85%)]" />
      </div>

      <AuthNavbar />

      <section className="relative z-10 flex min-h-screen items-center justify-center px-4 py-20 sm:px-6 lg:px-8">
        {/* Main Glass Deck Container - Uses min-h on desktop instead of a rigid hard height */}
        <div className="grid w-full max-w-[1240px] grid-cols-1 overflow-hidden rounded-[32px] border border-white/[0.06] bg-[#0A0A0A]/40 shadow-[0_0_80px_-15px_rgba(0,0,0,0.8)] backdrop-blur-3xl lg:grid-cols-12 lg:min-h-[720px]">

          {/* LEFT HERO DECK (Cinematic Branding) */}
          <div className="relative hidden overflow-hidden p-16 lg:flex lg:col-span-5 flex-col justify-between border-r border-white/[0.06] bg-gradient-to-b from-white/[0.02] to-transparent">
            <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.03),transparent_50%)] pointer-events-none" />

            <div className="relative z-10">
              {/* Premium Live Badge */}
              <div className="mb-12 inline-flex items-center gap-2.5 rounded-full border border-white/[0.08] bg-white/[0.03] px-4 py-1.5 backdrop-blur-md shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-violet-500"></span>
                </span>
                <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-zinc-300">
                  Nebula Network
                </span>
              </div>

              {/* High-Impact Anti-Crack Typography */}
              <div className="space-y-1">
                <h1 className="text-4xl xl:text-5xl font-light tracking-tight text-zinc-300">
                  Discover films.
                </h1>
                <h1 className="text-4xl xl:text-5xl font-light tracking-tight text-zinc-300">
                  Share moments.
                </h1>
                <h1 className="text-4xl xl:text-5xl font-bold tracking-tight text-white">
                  Live cinema together.
                </h1>
              </div>

              <p className="mt-8 max-w-sm text-[15px] leading-relaxed text-zinc-400 font-normal">
                An ecosystem engineered exclusively for cinephiles. Curate your tracking history, engage in synchronized global watch parties, and deeply analyze your digital media shadow.
              </p>
            </div>

            {/* Symmetrical High-Contrast Stats */}
            <div className="relative z-10 grid grid-cols-3 gap-4 pt-8 border-t border-white/[0.05]">
              <div>
                <h2 className="text-3xl font-bold tracking-tight text-white">10K+</h2>
                <p className="mt-1 text-[11px] uppercase tracking-widest text-zinc-500 font-bold whitespace-nowrap">
                  Active Minds
                </p>
              </div>

              <div>
                <h2 className="text-3xl font-bold tracking-tight text-white">4K+</h2>
                <p className="mt-1 text-[11px] uppercase tracking-widest text-zinc-500 font-bold whitespace-nowrap">
                  Titles Logged
                </p>
              </div>

              <div>
                <h2 className="text-3xl font-bold tracking-tight text-white">Instant</h2>
                <p className="mt-1 text-[11px] uppercase tracking-widest text-zinc-500 font-bold whitespace-nowrap">
                  History Sync
                </p>
              </div>
            </div>
          </div>

          {/* RIGHT INTERACTIVE DECK (Form Engine) */}
          <div className="relative flex items-center justify-center p-6 sm:p-12 lg:col-span-7 bg-[#060606]/20">
            <div className="absolute top-0 right-0 h-64 w-64 rounded-full bg-violet-500/5 blur-[100px] pointer-events-none" />

            {/* Clean, static wrapping envelope */}
            <div className="w-full max-w-[440px] py-6">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, y: 8, scale: 0.995 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.995 }}
                  layout="position"
                  transition={{ 
                    duration: 0.22, 
                    ease: [0.25, 1, 0.5, 1],
                    layout: { duration: 0.20, ease: "easeInOut" } 
                  }}
                  className="relative rounded-2xl border border-white/[0.08] bg-[#0C0C0C]/60 p-8 shadow-[0_24px_50px_-12px_rgba(0,0,0,0.7)] backdrop-blur-2xl will-change-transform overflow-hidden"
                >
                  {/* Fine-Border Glow Edge */}
                  <div className="absolute inset-0 rounded-2xl p-[1px] pointer-events-none">
                    <div className="absolute inset-0 rounded-2xl bg-[linear-gradient(135deg,rgba(255,255,255,0.12),transparent_40%,transparent)]" />
                  </div>

                  <div className="relative z-10">
                    {/* Balanced Header Group */}
                    <div className="mb-8">
                      <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white [text-wrap:balance]">
                        Get Started
                      </h2>
                      <p className="mt-3 text-[15px] text-zinc-400 font-medium leading-relaxed">
                        Create your profile to access the universal community ecosystem.
                      </p>
                    </div>

                    {/* Step Orchestration */}
                    {currentStep === "FORM" && (
                      <FormStep
                        form={form}
                        onChange={handleInputChange}
                        onNext={() => setCurrentStep("AVATAR")}
                      />
                    )}

                    {currentStep === "AVATAR" && (
                      <AvatarStep
                        selectedAvatar={selectedAvatar}
                        onSelectAvatar={setSelectedAvatar}
                        onBack={() => setCurrentStep("FORM")}
                        onSubmit={handleFinalSubmit}
                      />
                    )}

                    {currentStep === "VERIFY" && (
                      <VerificationStep email={form.email} />
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