import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "@apollo/client/react";
import { Clapperboard } from "lucide-react";
import { handleSignUpWithEmail } from "@/functions/auth.function";
import AuthNavbar from "@/components/ui/layout/AuthNavbar";
import FormStep, { FormState } from "@/components/ui/auth/FormStep";
import AvatarStep from "@/components/ui/auth/AvatarStep";
import { FETCH_TRENDING_CONTENTS } from "@/lib/graphql/query/content.query";
import { env } from "@/lib/env";

const BACKDROP_BASE = env.tmdbBackdropBaseUrl;
const POSTER_BASE = env.tmdbPosterBaseUrl;

function imgUrl(path: string | undefined | null, base: string): string {
  if (!path || path === "N/A") return "";
  if (path.startsWith("/")) return `${base}${path}`;
  return path;
}

export type FlowStep = "FORM" | "AVATAR";
const STEPS: FlowStep[] = ["FORM", "AVATAR"];
const STEP_LABELS = { FORM: "Account", AVATAR: "Avatar" };

const mobilePos = [
  "top-[3%] left-[4%] w-[18%] -rotate-6",
  "top-[3%] right-[4%] w-[18%] rotate-6",
  "top-[22%] left-[2%] w-[20%] rotate-3",
  "top-[22%] right-[2%] w-[18%] -rotate-3",
  "bottom-[16%] left-[3%] w-[18%] rotate-8",
  "bottom-[16%] right-[3%] w-[16%] rotate-12",
];

const desktopPos = [
  "top-[8%] left-[5%] w-28 -rotate-6",
  "top-[15%] right-[8%] w-24 rotate-3",
  "top-[45%] left-[2%] w-20 rotate-12",
  "top-[55%] right-[3%] w-32 -rotate-3",
  "top-[75%] left-[10%] w-24 rotate-6",
  "top-[30%] left-[15%] w-16 -rotate-12",
  "top-[65%] right-[12%] w-20 rotate-8",
  "top-[10%] left-[30%] w-16 rotate-12",
];

export default function Signup() {
  const [step, setStep] = useState<FlowStep>("FORM");
  const [selectedAvatar, setSelectedAvatar] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const { data } = useQuery<any>(FETCH_TRENDING_CONTENTS);
  const items = data?.FetchTrendingContents ?? [];

  const scattered = useMemo(() => {
    const valid = items.filter((c: any) => c.poster || c.backdrop);
    return valid.slice(0, 10);
  }, [items]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const handleFinalSubmit = async () => {
    await handleSignUpWithEmail(form, selectedAvatar!);
  };

  const stepIndex = STEPS.indexOf(step);

  return (
    <main className="relative min-h-screen bg-background text-foreground antialiased overflow-hidden selection:bg-primary/30">

      {/* Scattered poster images */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        {/* Mobile images */}
        {scattered.slice(0, mobilePos.length).map((c: any, i: number) => {
          const src = imgUrl(c.poster || c.backdrop, c.poster ? POSTER_BASE : BACKDROP_BASE);
          if (!src) return null;
          return (
            <div
              key={`m-${c._id}`}
              className={`absolute lg:hidden opacity-35 transition-opacity duration-500 ${mobilePos[i]}`}
            >
              <div className="aspect-[2/3] w-full overflow-hidden rounded-lg border border-border/10 shadow-xl">
                <img
                  src={src}
                  alt=""
                  className="h-full w-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).parentElement!.style.display = "none";
                  }}
                />
              </div>
            </div>
          );
        })}
        {/* Desktop images */}
        {scattered.slice(0, desktopPos.length).map((c: any, i: number) => {
          const src = imgUrl(c.poster || c.backdrop, c.poster ? POSTER_BASE : BACKDROP_BASE);
          if (!src) return null;
          return (
            <div
              key={`d-${c._id}`}
              className={`absolute hidden lg:block opacity-30 hover:opacity-50 transition-opacity duration-500 ${desktopPos[i]}`}
            >
              <div className="aspect-[2/3] w-full overflow-hidden rounded-lg border border-border/20 shadow-2xl">
                <img
                  src={src}
                  alt=""
                  className="h-full w-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).parentElement!.style.display = "none";
                  }}
                />
              </div>
            </div>
          );
        })}

        {/* Vignette — full radial only on desktop; lighter linear fade on mobile
            so posters stay visible instead of being swallowed by the overlay */}
        <div className="absolute inset-0 hidden lg:block bg-[radial-gradient(ellipse_at_center,transparent_30%,#09090b_85%)]" />
        <div className="absolute inset-0 lg:hidden bg-gradient-to-b from-background/50 via-background/20 to-background/75" />
        <div className="absolute inset-0 bg-gradient-to-b from-background/10 via-transparent to-background/60" />
      </div>

      <div className="pointer-events-none fixed left-1/2 top-1/3 z-0 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-primary/5 blur-[120px]" />

      <div className="relative z-10 flex min-h-screen flex-col">
        <AuthNavbar />

        <div className="flex flex-1 items-center justify-center px-4 py-10 sm:py-16 lg:py-20">
          <div className="grid w-full max-w-[1040px] items-center gap-8 sm:gap-10 lg:grid-cols-2 lg:gap-12">

            {/* ── Left (desktop) ── */}
            <div className="hidden lg:block">
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="max-w-md"
              >
                <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/[0.08] px-4 py-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                  <span className="text-[11px] font-semibold uppercase tracking-[0.15em] text-primary/80">
                    Join the community
                  </span>
                </div>

                <h1 className="text-[2.8rem] xl:text-[3.2rem] font-bold tracking-[-0.03em] leading-[1.05]">
                  Cinema is better
                  <br />
                  <span className="bg-gradient-to-r from-primary to-amber-300 bg-clip-text text-transparent">
                    together.
                  </span>
                </h1>

                <p className="mt-5 max-w-sm text-sm leading-relaxed text-muted-foreground/80">
                  Log films, write reviews, build watchlists, and connect with a community that takes cinema seriously.
                </p>

                {scattered.length > 0 && (
                  <div className="mt-10 flex gap-3">
                    {scattered.slice(0, 4).map((c: any) => (
                      <div
                        key={c._id}
                        className="h-24 w-[66px] overflow-hidden rounded-lg border border-border/40 bg-card shadow-lg"
                      >
                        <img
                          src={imgUrl(c.poster, POSTER_BASE)}
                          alt=""
                          className="h-full w-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = "none";
                          }}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            </div>

            {/* ── Mobile trending filmstrip (in-flow, always fully visible) ── */}
            {scattered.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="lg:hidden"
              >
                <div className="mb-3 flex items-center justify-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                  <span className="text-[10px] font-semibold uppercase tracking-[0.15em] text-primary/80">
                    Join the community
                  </span>
                </div>
                <div className="flex justify-center gap-2.5 overflow-x-auto px-2 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                  {scattered.slice(0, 5).map((c: any) => {
                    const src = imgUrl(c.poster, POSTER_BASE);
                    if (!src) return null;
                    return (
                      <div
                        key={`strip-${c._id}`}
                        className="h-[92px] w-16 shrink-0 overflow-hidden rounded-lg border border-border/40 bg-card shadow-lg"
                      >
                        <img
                          src={src}
                          alt=""
                          className="h-full w-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).parentElement!.style.display = "none";
                          }}
                        />
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* ── Right: Card ── */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.05 }}
              className="mx-auto w-full max-w-[420px] lg:mx-0 lg:ml-auto"
            >
              <div className="relative rounded-2xl border border-border/50 bg-card/80 backdrop-blur-2xl p-6 sm:p-8 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.8)]">
                <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-b from-primary/[0.03] via-transparent to-transparent" />
                <div className="pointer-events-none absolute top-0 left-1/2 h-px w-1/3 -translate-x-1/2 bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

                <div className="relative">
                  <div className="mb-6 sm:mb-8 text-center">
                    <div className="mx-auto mb-4 sm:mb-5 flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 ring-1 ring-primary/20">
                      <Clapperboard size={22} className="text-primary" />
                    </div>
                    <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
                      {step === "FORM" ? "Create your account" : "Pick an avatar"}
                    </h1>
                    <p className="mt-2 text-sm text-muted-foreground/70">
                      {step === "FORM" ? "Join a community of film lovers" : "Choose an image that represents you"}
                    </p>
                  </div>

                  {/* Step indicator */}
                  <div className="mb-6 sm:mb-8 flex items-center justify-center gap-2 sm:gap-3">
                    {STEPS.map((s, i) => {
                      const isActive = i === stepIndex;
                      const isPast = i < stepIndex;
                      return (
                        <div key={s} className="flex items-center gap-2">
                          <div
                            className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold transition-all ${
                              isActive
                                ? "bg-primary text-primary-foreground shadow-lg shadow-primary/30"
                                : isPast
                                ? "bg-primary/20 text-primary"
                                : "bg-secondary/50 text-muted-foreground/50"
                            }`}
                          >
                            {isPast ? "✓" : i + 1}
                          </div>
                          <span
                            className={`text-xs font-medium transition-colors ${
                              isActive ? "text-foreground" : "text-muted-foreground/50"
                            }`}
                          >
                            {STEP_LABELS[s]}
                          </span>
                          {i < STEPS.length - 1 && (
                            <div className={`mx-1 h-px w-6 sm:w-8 transition-colors ${isPast ? "bg-primary/30" : "bg-border/50"}`} />
                          )}
                        </div>
                      );
                    })}
                  </div>

                  <AnimatePresence mode="wait">
                    <motion.div
                      key={step}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -12 }}
                      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                    >
                      {step === "FORM" && (
                        <FormStep form={form} onChange={handleInputChange} onNext={() => setStep("AVATAR")} />
                      )}
                      {step === "AVATAR" && (
                        <AvatarStep
                          selectedAvatar={selectedAvatar}
                          onSelectAvatar={setSelectedAvatar}
                          onBack={() => setStep("FORM")}
                          onSubmit={handleFinalSubmit}
                        />
                      )}
                    </motion.div>
                  </AnimatePresence>

                  <p className="mt-8 text-center text-xs text-muted-foreground/60">
                    Already have an account?{" "}
                    <a href="/login" className="font-semibold text-primary transition-colors hover:text-primary/80">
                      Sign in
                    </a>
                  </p>
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </div>
    </main>
  );
}