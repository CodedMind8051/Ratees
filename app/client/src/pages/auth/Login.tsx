import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "@apollo/client/react";
import { Check, AlertCircle, Loader2, Eye, EyeOff, Clapperboard, LogIn } from "lucide-react";

import AuthNavbar from "@/components/ui/layout/AuthNavbar";
import GoogleButton from "@/components/buttons/GoogleButton";

import { handleSignInWithEmail, handleSignUpWithGoogle } from "@/functions/auth.function";
import { FETCH_TRENDING_CONTENTS } from "@/lib/graphql/query/content.query";
import { env } from "@/lib/env";

const BACKDROP_BASE = env.tmdbBackdropBaseUrl;
const POSTER_BASE = env.tmdbPosterBaseUrl;

function imgUrl(path: string | undefined | null, base: string): string {
  if (!path || path === "N/A") return "";
  if (path.startsWith("/")) return `${base}${path}`;
  return path;
}

type FormState = { email: string; password: string };
type ValidationErrors = { [key in keyof FormState]?: string };

export default function Login() {
  const [form, setForm] = useState<FormState>({ email: "", password: "" });
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [loading, setLoading] = useState(false);
  const [touched, setTouched] = useState<Set<string>>(new Set());
  const [showPass, setShowPass] = useState(false);

  const { data } = useQuery<any>(FETCH_TRENDING_CONTENTS);
  const items = data?.FetchTrendingContents ?? [];

  const scattered = useMemo(() => {
    const valid = items.filter((c: any) => c.poster || c.backdrop);
    return valid.slice(0, 10);
  }, [items]);

  const validate = (name: string, value: string): string | undefined => {
    if (name === "email") {
      if (!value.trim()) return "Email is required";
      if (value.length < 3) return "Enter a valid email";
    }
    if (name === "password") {
      if (!value) return "Password is required";
      if (value.length < 8) return "Minimum 8 characters";
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
    if (touched.has(name)) setErrors((p) => ({ ...p, [name]: validate(name, value) }));
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTouched((p) => new Set(p).add(name));
    setErrors((p) => ({ ...p, [name]: validate(name, value) }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    const allTouched = new Set<string>();
    const validationErrors: ValidationErrors = {};
    (Object.keys(form) as (keyof FormState)[]).forEach((key) => {
      allTouched.add(key);
      const err = validate(key, form[key]);
      if (err) validationErrors[key] = err;
    });
    setTouched(allTouched);
    setErrors(validationErrors);
    if (Object.values(validationErrors).some(Boolean)) return;
    setLoading(true);
    await handleSignInWithEmail(form);
    setLoading(false);
  };

  // Safe, in-bounds positions — nothing sits past the viewport edge, so
  // overflow-hidden on <main> never clips a poster.
  const mobilePos = [
    "top-[3%] left-[4%] w-[16%] -rotate-6",
    "top-[3%] right-[4%] w-[16%] rotate-6",
    "top-[20%] left-[2%] w-[17%] rotate-3",
    "top-[20%] right-[2%] w-[16%] -rotate-3",
    "bottom-[14%] left-[3%] w-[16%] rotate-8",
    "bottom-[14%] right-[3%] w-[14%] rotate-12",
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

  return (
    <main className="relative min-h-screen w-full max-w-[100vw] overflow-x-hidden overflow-y-auto bg-background text-foreground antialiased selection:bg-primary/30">

      {/* Scattered poster images */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        {/* Mobile images */}
        {scattered.slice(0, mobilePos.length).map((c: any, i: number) => {
          const src = imgUrl(c.poster || c.backdrop, c.poster ? POSTER_BASE : BACKDROP_BASE);
          if (!src) return null;
          return (
            <div
              key={`m-${c._id}`}
              className={`absolute lg:hidden opacity-30 transition-opacity duration-500 ${mobilePos[i]}`}
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
        <div className="absolute inset-0 lg:hidden bg-gradient-to-b from-background/55 via-background/25 to-background/80" />
        <div className="absolute inset-0 bg-gradient-to-b from-background/10 via-transparent to-background/60" />
      </div>

      {/* Subtle primary glow */}
      <div className="pointer-events-none fixed left-1/2 top-1/3 z-0 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-primary/5 blur-[120px]" />

      <div className="relative z-10 flex min-h-screen flex-col">
        <AuthNavbar />

        <div className="flex flex-1 items-center justify-center px-4 py-8 sm:py-16 lg:py-20">
          <div className="grid w-full max-w-[1040px] items-center gap-6 sm:gap-10 lg:grid-cols-2 lg:gap-12">

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
                    Trending now
                  </span>
                </div>

                <h1 className="text-[2.8rem] xl:text-[3.2rem] font-bold tracking-[-0.03em] leading-[1.05]">
                  Your next favorite
                  <br />
                  <span className="bg-gradient-to-r from-primary to-amber-300 bg-clip-text text-transparent">
                    movie awaits.
                  </span>
                </h1>

                <p className="mt-5 max-w-sm text-sm leading-relaxed text-muted-foreground/80">
                  Track what you watch, share reviews with friends, and discover films that match your taste.
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

            {/* ── Mobile trending strip — fixed grid, never scrolls, nothing
                can hide off-screen ── */}
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
                    Trending now
                  </span>
                </div>
                <div className="mx-auto grid max-w-[340px] grid-cols-5 gap-2">
                  {scattered.slice(0, 5).map((c: any) => {
                    const src = imgUrl(c.poster, POSTER_BASE);
                    if (!src) return null;
                    return (
                      <div
                        key={`strip-${c._id}`}
                        className="aspect-[2/3] w-full overflow-hidden rounded-lg border border-border/40 bg-card shadow-lg"
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
              <div className="relative rounded-2xl border border-border/50 bg-card/80 backdrop-blur-2xl p-5 xs:p-6 sm:p-8 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.8)]">
                <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-b from-primary/[0.03] via-transparent to-transparent" />
                <div className="pointer-events-none absolute top-0 left-1/2 h-px w-1/3 -translate-x-1/2 bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

                <div className="relative">
                  <div className="mb-5 sm:mb-8 text-center">
                    <div className="mx-auto mb-3 sm:mb-5 flex h-11 w-11 sm:h-14 sm:w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 ring-1 ring-primary/20">
                      <Clapperboard size={20} className="text-primary sm:hidden" />
                      <Clapperboard size={24} className="hidden text-primary sm:block" />
                    </div>
                    <h1 className="text-lg sm:text-2xl font-bold tracking-tight">Welcome back</h1>
                    <p className="mt-1.5 sm:mt-2 text-xs sm:text-sm text-muted-foreground/70">
                      Sign in to continue to Ratees
                    </p>
                  </div>

                  <GoogleButton onClick={handleSignUpWithGoogle} />

                  <div className="my-4 sm:my-6 flex items-center gap-3">
                    <div className="h-px flex-1 bg-border/50" />
                    <span className="text-[10px] font-semibold uppercase tracking-[0.1em] text-muted-foreground/40">
                      or
                    </span>
                    <div className="h-px flex-1 bg-border/50" />
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-3.5 sm:space-y-4">
                    <Field
                      name="email"
                      type="email"
                      placeholder="Email address"
                      value={form.email}
                      error={errors.email}
                      isTouched={touched.has("email")}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                    <Field
                      name="password"
                      type="password"
                      placeholder="Password"
                      value={form.password}
                      error={errors.password}
                      isTouched={touched.has("password")}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      showToggle
                      isVisible={showPass}
                      onToggle={() => setShowPass(!showPass)}
                    />

                    <button
                      type="submit"
                      disabled={loading}
                      className="relative mt-2 flex h-11 sm:h-12 w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-primary to-primary/80 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-all duration-200 hover:shadow-xl hover:shadow-primary/30 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 disabled:shadow-none"
                    >
                      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_-20%,rgba(255,255,255,0.15),transparent_60%)]" />
                      {loading ? (
                        <span className="flex items-center gap-2">
                          <Loader2 size={14} className="animate-spin" /> Logging in...
                        </span>
                      ) : (
                        <span className="flex items-center gap-2">
                          <LogIn size={15} /> Sign in
                        </span>
                      )}
                    </button>
                  </form>

                  <p className="mt-6 sm:mt-8 text-center text-xs text-muted-foreground/60">
                    Don&apos;t have an account?{" "}
                    <a href="/signup" className="font-semibold text-primary transition-colors hover:text-primary/80">
                      Create one
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

/* ─── Field ─── */

function Field({
  name,
  placeholder,
  type = "text",
  value,
  error,
  isTouched,
  onChange,
  onBlur,
  showToggle,
  isVisible,
  onToggle,
}: {
  name: string;
  placeholder: string;
  type?: string;
  value: string;
  error: string | undefined;
  isTouched: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
  showToggle?: boolean;
  isVisible?: boolean;
  onToggle?: () => void;
}) {
  const showError = error && isTouched;
  const inputType = showToggle ? (isVisible ? "text" : "password") : type;

  return (
    <div className="space-y-1.5">
      <div className="relative">
        <input
          type={inputType}
          name={name}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
          className={`h-11 sm:h-12 w-full rounded-xl border bg-background/50 px-3.5 sm:px-4 text-sm text-foreground placeholder:text-muted-foreground/30 outline-none transition-all duration-200
            ${showToggle ? "pr-11" : "pr-10"}
            ${
              showError
                ? "border-red-500/30 focus:border-red-500/50 focus:ring-1 focus:ring-red-500/20"
                : "border-border/60 hover:border-border focus:border-primary/40 focus:ring-1 focus:ring-primary/20 focus:bg-background/70"
            }`}
        />
        <div className="absolute right-3 sm:right-3.5 top-1/2 flex -translate-y-1/2 items-center gap-1.5">
          {showToggle && value && (
            <button
              type="button"
              onClick={onToggle}
              tabIndex={-1}
              className="text-muted-foreground/50 transition-colors hover:text-foreground cursor-pointer"
            >
              {isVisible ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          )}
          {value && !error && isTouched && <Check size={15} className="text-green-500" />}
        </div>
      </div>
      <AnimatePresence initial={false}>
        {showError && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="flex items-center gap-1.5 pl-1 text-[11px] text-red-400">
              <AlertCircle size={11} />
              <span>{error}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}