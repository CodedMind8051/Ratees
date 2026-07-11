import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { handleSignUpWithEmail } from "@/functions/auth.function";
import AuthNavbar from "@/components/ui/layout/AuthNavbar";
import GlowBackground from "@/components/ui/common/GlowBackground";
import { Users, Sparkles, Film } from "lucide-react";
import FormStep, { FormState } from "@/components/ui/auth/FormStep";
import AvatarStep from "@/components/ui/auth/AvatarStep";

export type FlowStep = "FORM" | "AVATAR";

const STEP_CONFIG = {
  FORM: { number: 1, label: "Account details" },
  AVATAR: { number: 2, label: "Choose avatar" },
};

export default function Signup() {
  const [currentStep, setCurrentStep] = useState<FlowStep>("FORM");
  const [selectedAvatar, setSelectedAvatar] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFinalSubmit = async () => {
    await handleSignUpWithEmail(form, selectedAvatar!);
    await new Promise((resolve) => setTimeout(resolve, 1200));
  };

  const stepHeadings: Record<FlowStep, { title: string; subtitle: string }> = {
    FORM: {
      title: "Create your account",
      subtitle: "Join a growing community of film lovers tracking and sharing what they watch.",
    },
    AVATAR: {
      title: "Pick an avatar",
      subtitle: "Choose a profile image that represents you on Ratees.",
    },
  };

  const { title, subtitle } = stepHeadings[currentStep];

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#030303] text-zinc-100 antialiased selection:bg-violet-500/30 selection:text-white">
      {/* Background */}
      <GlowBackground style="cinema" intensity="medium" animated={true} />

      {/* Ambient layers */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden z-0">
        <div className="absolute top-[-15%] left-[-8%] h-[700px] w-[700px] rounded-full bg-violet-600/12 blur-[180px] mix-blend-screen" />
        <div className="absolute bottom-[-15%] right-[-8%] h-[700px] w-[700px] rounded-full bg-cyan-500/8 blur-[200px] mix-blend-screen" />
        <div className="absolute top-[40%] left-[45%] h-[350px] w-[350px] rounded-full bg-fuchsia-500/4 blur-[140px]" />
        <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.012)_1px,transparent_1px)] [background-size:28px_28px]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0),#030303_82%)]" />
      </div>

      <AuthNavbar />

      <section className="relative z-10 flex min-h-screen items-center justify-center px-4 py-20 sm:px-6 lg:px-8">
        <div className="grid w-full max-w-[1280px] overflow-hidden rounded-[28px] border border-white/[0.05] bg-[#080808]/50 shadow-[0_60px_120px_-40px_rgba(0,0,0,0.95)] backdrop-blur-3xl lg:min-h-[720px] lg:grid-cols-12">

          {/* ── LEFT PANEL ── */}
          <div className="relative hidden overflow-hidden border-r border-white/[0.05] lg:col-span-5 lg:flex lg:flex-col lg:justify-between p-14 xl:p-16">

            <div className="absolute inset-0 bg-gradient-to-br from-white/[0.025] via-transparent to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />

            {/* Top section */}
            <div className="relative z-10 space-y-10">
              {/* Brand pill */}
              <div className="inline-flex items-center gap-2.5 rounded-full border border-white/[0.08] bg-white/[0.04] px-4 py-2 backdrop-blur-md">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-violet-400 opacity-60" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-violet-400" />
                </span>
                <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-zinc-500">
                  Ratees · Early Access
                </span>
              </div>

              {/* Hero copy */}
              <div>
                <h1 className="text-[2.8rem] xl:text-[3.2rem] font-bold tracking-[-0.03em] leading-[1.05] text-white">
                  Cinema is better
                  <br />
                  <span className="text-zinc-400">together.</span>
                </h1>

                <p className="mt-5 max-w-xs text-[15px] leading-[1.75] text-zinc-500">
                  Log films, write reviews, build watchlists, and connect with a
                  community that takes cinema seriously.
                </p>
              </div>

              {/* Feature list */}
              <ul className="space-y-3.5">
                {[
                  { text: "Track every film you've seen" },
                  { text: "Share reviews and curated lists" },
                  { text: "Discover hidden gems from real cinephiles" },
                  { text: "Build your taste profile over time" },
                ].map(({ text }) => (
                  <li key={text} className="flex items-center gap-3 text-[13px] text-zinc-500">
                    <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full border border-violet-500/30 bg-violet-500/10">
                      <span className="h-1 w-1 rounded-full bg-violet-400" />
                    </span>
                    {text}
                  </li>
                ))}
              </ul>
            </div>


            {/* Bottom Features */}
            <div className="relative z-10">
              <div className="mb-6 h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />

              <div className="grid gap-3">
                {/* Connect */}
                <div className="group flex items-start gap-4 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4 transition-all duration-300 hover:border-violet-500/20 hover:bg-white/[0.04]">
                  <div className="rounded-xl border border-violet-500/20 bg-violet-500/10 p-2.5">
                    <Users className="h-4 w-4 text-violet-400" />
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold text-white">
                      Connect with Friends
                    </h3>
                    <p className="mt-1 text-xs leading-relaxed text-zinc-500">
                      Follow friends, compare ratings, and share your movie journey together.
                    </p>
                  </div>
                </div>
              </div>
              {/* Discover */}
              <div className="group flex items-start gap-4 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4 transition-all duration-300 hover:border-cyan-500/20 hover:bg-white/[0.04]">
                <div className="rounded-xl border border-cyan-500/20 bg-cyan-500/10 p-2.5">
                  <Sparkles className="h-4 w-4 text-cyan-400" />
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-white">
                    Discover Great Movies
                  </h3>
                  <p className="mt-1 text-xs leading-relaxed text-zinc-500">
                    Explore hidden gems, trending films, and recommendations tailored to your taste.
                  </p>
                </div>
              </div>

              {/* Track */}
              <div className="group flex items-start gap-4 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4 transition-all duration-300 hover:border-amber-500/20 hover:bg-white/[0.04]">
                <div className="rounded-xl border border-amber-500/20 bg-amber-500/10 p-2.5">
                  <Film className="h-4 w-4 text-amber-400" />
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-white">
                    Track Your Journey
                  </h3>
                  <p className="mt-1 text-xs leading-relaxed text-zinc-500">
                    Log movies, build watchlists, and create your personal cinematic archive.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* ── RIGHT PANEL ── */}
          <div className="relative flex items-center justify-center p-6 sm:p-12 lg:col-span-7">

            <div className="pointer-events-none absolute top-[-5%] right-[-5%] h-80 w-80 rounded-full bg-violet-600/6 blur-[130px]" />
            <div className="pointer-events-none absolute bottom-[-5%] left-[-5%] h-60 w-60 rounded-full bg-cyan-500/4 blur-[100px]" />

            <div className="w-full max-w-[460px] py-4">

              {/* Step indicator — now 2 steps only */}
              <div className="mb-8 flex items-center gap-3">
                {(["FORM", "AVATAR"] as FlowStep[]).map((step) => {
                  const conf = STEP_CONFIG[step];
                  const isActive = step === currentStep;
                  const isPast = conf.number < STEP_CONFIG[currentStep].number;
                  return (
                    <div key={step} className="flex items-center gap-2">
                      <div
                        className={`flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold transition-all duration-300 ${isActive
                          ? "bg-violet-500 text-white"
                          : isPast
                            ? "bg-violet-500/20 text-violet-400"
                            : "bg-white/[0.06] text-zinc-600"
                          }`}
                      >
                        {isPast ? "✓" : conf.number}
                      </div>
                      <span
                        className={`text-[11px] font-medium transition-colors duration-300 ${isActive ? "text-zinc-300" : "text-zinc-600"
                          }`}
                      >
                        {conf.label}
                      </span>
                      {conf.number < 2 && (
                        <div className="ml-2 h-px w-6 bg-white/[0.06]" />
                      )}
                    </div>
                  );
                })}
              </div>

              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -16 }}
                  transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  className="relative overflow-hidden rounded-2xl border border-white/[0.07] bg-[#0C0C0C]/60 p-7 shadow-[0_40px_100px_-30px_rgba(0,0,0,0.9)] backdrop-blur-3xl sm:p-10"
                >
                  <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-b from-white/[0.025] to-transparent" />
                  <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/[0.1] to-transparent" />

                  <div className="relative z-10">
                    {/* Card header */}
                    <div className="mb-9">
                      <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-violet-500/20 bg-violet-500/10 px-3 py-1">
                        <div className="h-1.5 w-1.5 rounded-full bg-violet-400" />
                        <span className="text-[11px] font-medium tracking-wide text-violet-400">
                          Step {STEP_CONFIG[currentStep].number} of 2
                        </span>
                      </div>

                      <h2 className="text-[1.85rem] font-bold tracking-[-0.02em] leading-tight text-white">
                        {title}
                      </h2>
                      <p className="mt-3 text-[14px] leading-[1.7] text-zinc-500">
                        {subtitle}
                      </p>
                    </div>

                    {/* Steps */}
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
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Footer */}
              <p className="mt-6 text-center text-[12px] text-zinc-200">
                Already have an account?{" "}
                <a
                  href="/login"
                  className="text-zinc-300 underline underline-offset-2 hover:text-white transition-colors duration-200"
                >
                 Login
                </a>
              </p>
            </div>
          </div>

        </div>
      </section>
    </main>
  );
}