import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, AlertCircle, Loader2, Eye, EyeOff, Users, Compass, MessageSquare } from "lucide-react";

import AuthNavbar from "@/components/ui/layout/AuthNavbar";
import GlowBackground from "@/components/ui/common/GlowBackground";
import GoogleButton from "@/components/buttons/GoogleButton";

import { handelSignInWithFiled, handelSignUpWithGoogle } from "@/functions/auth.function";

type FormState = {
  email: string;
  password: string;
};

type ValidationErrors = {
  [key in keyof FormState]?: string;
};

const CUBIC_EASE = [0.22, 1, 0.36, 1];

interface FormFieldProps {
  name: keyof FormState;
  placeholder: string;
  type?: string;
  value: string;
  error: string | undefined;
  isTouched: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
  showTogglePassword?: boolean;
  isPasswordVisible?: boolean;
  onTogglePasswordVisibility?: () => void;
}

const FormField = ({
  name,
  placeholder,
  type = "text",
  value,
  error,
  isTouched,
  onChange,
  onBlur,
  showTogglePassword,
  isPasswordVisible,
  onTogglePasswordVisibility,
}: FormFieldProps) => {
  const displayError = error && isTouched;
  const inputType = showTogglePassword ? (isPasswordVisible ? "text" : "password") : type;

  return (
    <div className="w-full space-y-1.5">
      <div className="relative">
        <input
          type={inputType}
          name={name}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
          className={`h-12 w-full rounded-xl border px-4 text-sm text-zinc-100 placeholder:text-zinc-600 transition-all duration-200 outline-none backdrop-blur-xl ${
            showTogglePassword ? "pr-12" : "pr-10"
          } ${
            displayError
              ? "border-red-500/20 bg-red-950/10 focus:border-red-500/30"
              : "border-white/[0.06] bg-zinc-900/40 hover:border-white/[0.10] focus:border-white/[0.16] focus:bg-zinc-900/70"
          }`}
        />

        <div className="absolute right-4 top-1/2 flex -translate-y-1/2 items-center gap-2">
          {showTogglePassword && value && (
            <button
              type="button"
              onClick={onTogglePasswordVisibility}
              className="text-zinc-500 transition-colors hover:text-zinc-300"
              tabIndex={-1}
            >
              {isPasswordVisible ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          )}

          <AnimatePresence>
            {value && !error && isTouched && (
              <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}>
                <Check size={16} className="text-green-500" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <AnimatePresence initial={false}>
        {displayError && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="flex items-center gap-1.5 pl-1 text-[11px] text-red-400">
              <AlertCircle size={12} className="shrink-0" />
              <span>{error}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default function Login() {
  const [form, setForm] = useState<FormState>({ email: "", password: "" });
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [touched, setTouched] = useState<Set<string>>(new Set());
  const [showPass, setShowPass] = useState(false);

  const validateField = (name: string, value: string): string | undefined => {
    switch (name) {
      case "email":
        if (!value.trim()) return "Email is required";
        if (value.length < 3) return "Enter a valid email";
        return undefined;
      case "password":
        if (!value) return "Password is required";
        if (value.length < 8) return "Minimum 8 characters";
        return undefined;
      default:
        return undefined;
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));

    if (touched.has(name)) {
      setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }));
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTouched((prev) => {
      const next = new Set(prev);
      next.add(name);
      return next;
    });
    setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    const validationErrors: ValidationErrors = {};
    const allTouched = new Set<string>();

    Object.keys(form).forEach((key) => {
      const field = key as keyof FormState;
      const error = validateField(field, form[field]);
      if (error) validationErrors[field] = error;
      allTouched.add(field);
    });

    setTouched(allTouched);
    setErrors(validationErrors);

    if (Object.values(validationErrors).some(Boolean)) return;

    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1600));
    await handelSignInWithFiled(form, setSuccess);
    setLoading(false);
  };

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

      <section className="relative z-10 mt-10 flex min-h-screen items-center justify-center px-4 pt-10 pb-20 sm:px-6 lg:px-8">
        <div className="grid w-full max-w-[1040px] items-stretch overflow-hidden rounded-[28px] border border-white/[0.05] bg-[#080808]/50 shadow-[0_60px_120px_-40px_rgba(0,0,0,0.95)] backdrop-blur-3xl lg:grid-cols-11">
          
          {/* ── LEFT PANEL (Social Network Experience) ── */}
          <div className="relative hidden overflow-hidden border-r border-white/[0.05] lg:col-span-5 lg:flex lg:flex-col lg:justify-between p-11 xl:p-12">
            <div className="absolute inset-0 bg-gradient-to-br from-white/[0.025] via-transparent to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />

            {/* Header Content */}
            <div className="relative z-10 space-y-6">
              {/* Social Network Pill */}
              <div className="inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.04] px-3 py-1.5 backdrop-blur-md">
                <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-400">
                  Shared Cinematic Space
                </span>
              </div>

              <div>
                <h1 className="text-[2.2rem] xl:text-[2.5rem] font-bold tracking-[-0.03em] leading-[1.1] text-white">
                  See what your
                  <br />
                  <span className="text-zinc-400">friends watch.</span>
                </h1>
                <p className="mt-3 max-w-xs text-[13px] leading-[1.65] text-zinc-500">
                  Log back in to keep up with recent reviews, match your tastes, and discover new cinema together.
                </p>
              </div>
            </div>

            {/* Feature Sub-blocks */}
            <div className="relative z-10 mt-8">
              <div className="mb-4 h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />

              <div className="grid gap-2.5">
                {/* Explore with Friends */}
                <div className="flex items-start gap-3 rounded-xl border border-white/[0.04] bg-white/[0.01] p-3">
                  <div className="rounded-lg border border-violet-500/20 bg-violet-500/10 p-2 shrink-0">
                    <Compass className="h-3.5 w-3.5 text-violet-400" />
                  </div>
                  <div>
                    <h3 className="text-xs font-semibold text-white">Explore with Friends</h3>
                    <p className="mt-0.5 text-[11px] leading-normal text-zinc-500">
                      Uncover trending gems, compare taste statistics, and compile co-curated movie lists.
                    </p>
                  </div>
                </div>

                {/* Live Discussions */}
                <div className="flex items-start gap-3 rounded-xl border border-white/[0.04] bg-white/[0.01] p-3">
                  <div className="rounded-lg border border-cyan-500/20 bg-cyan-500/10 p-2 shrink-0">
                    <MessageSquare className="h-3.5 w-3.5 text-cyan-400" />
                  </div>
                  <div>
                    <h3 className="text-xs font-semibold text-white">Read Real Reviews</h3>
                    <p className="mt-0.5 text-[11px] leading-normal text-zinc-500">
                      Skip standard corporate hot-takes. See exactly what your circle thinks instead.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ── RIGHT PANEL (Auth Panel Card) ── */}
          <div className="relative flex items-center justify-center p-6 sm:p-8 lg:col-span-6">
            <div className="pointer-events-none absolute top-[-5%] right-[-5%] h-80 w-80 rounded-full bg-violet-600/6 blur-[130px]" />
            <div className="pointer-events-none absolute bottom-[-5%] left-[-5%] h-60 w-60 rounded-full bg-cyan-500/4 blur-[100px]" />

            <div className="w-full max-w-[380px]">
              <AnimatePresence mode="wait" initial={false}>
                {success ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{ duration: 0.3, ease: CUBIC_EASE }}
                    className="relative overflow-hidden rounded-2xl border border-white/[0.07] bg-[#0C0C0C]/60 p-6 shadow-[0_40px_100px_-30px_rgba(0,0,0,0.9)] backdrop-blur-3xl"
                  >
                    <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-b from-white/[0.025] to-transparent" />
                    <div className="relative z-10 text-center py-4">
                      <motion.div
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full border border-green-500/20 bg-green-500/10"
                      >
                        <Check size={22} className="text-green-400" />
                      </motion.div>
                      <h2 className="text-xl font-bold text-white">Welcome back</h2>
                      <p className="mx-auto mt-2 max-w-[240px] text-xs text-zinc-400">
                        Your account has been verified successfully.
                      </p>
                      <button className="mt-6 h-10 w-full rounded-xl bg-zinc-100 text-xs font-medium text-zinc-950 transition-all duration-200 hover:bg-white active:scale-[0.98]">
                        Enter dashboard
                      </button>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="login-card"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{ duration: 0.3, ease: CUBIC_EASE }}
                    className="relative overflow-hidden rounded-2xl border border-white/[0.07] bg-[#0C0C0C]/60 p-6 shadow-[0_40px_100px_-30px_rgba(0,0,0,0.9)] backdrop-blur-3xl sm:p-7"
                  >
                    <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-b from-white/[0.025] to-transparent" />
                    
                    <div className="relative z-10">
                      {/* Card Header */}
                      <div className="mb-4 pt-1">
                        <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-violet-500/20 bg-violet-500/10 px-2.5 py-0.5">
                          <div className="h-1 w-1 rounded-full bg-violet-400" />
                          <span className="text-[10px] font-medium tracking-wide text-violet-400">Secure Sign In</span>
                        </div>

                        <h2 className="text-[1.5rem] font-bold tracking-[-0.02em] leading-tight text-white">
                          Log in to Ratees
                        </h2>
                      </div>

                      {/* Google Authentication */}
                      <GoogleButton onClick={handelSignUpWithGoogle} />

                      {/* Divider */}
                      <div className="my-3.5 flex items-center gap-3">
                        <div className="h-px flex-1 bg-gradient-to-r from-transparent to-zinc-800/80" />
                        <span className="select-none text-[8.5px] font-bold uppercase tracking-[0.12em] text-zinc-600">
                          Or email login
                        </span>
                        <div className="h-px flex-1 bg-gradient-to-l from-transparent to-zinc-800/80" />
                      </div>

                      {/* Input Actions */}
                      <form onSubmit={handleSubmit} className="space-y-3.5">
                        <div className="space-y-2">
                          <FormField
                            name="email"
                            placeholder="Email address"
                            value={form.email}
                            error={errors.email}
                            isTouched={touched.has("email")}
                            onChange={handleChange}
                            onBlur={handleBlur}
                          />

                          <FormField
                            name="password"
                            placeholder="Password"
                            value={form.password}
                            error={errors.password}
                            isTouched={touched.has("password")}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            showTogglePassword
                            isPasswordVisible={showPass}
                            onTogglePasswordVisibility={() => setShowPass(!showPass)}
                          />
                        </div>

                        {/* Inline short character validation info */}
                        {touched.has("password") && form.password && form.password.length < 8 && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            className="flex items-center gap-2 rounded-xl border border-red-500/10 bg-red-950/10 p-2 text-[10.5px] text-red-400"
                          >
                            <div className="h-1 w-1 rounded-full bg-red-500" />
                            <span>Password must be at least 8 characters.</span>
                          </motion.div>
                        )}

                        <button
                          type="submit"
                          disabled={loading}
                          className={`h-11 w-full rounded-xl text-xs font-medium transition-all duration-200 ${
                            loading
                              ? "cursor-not-allowed border border-white/[0.03] bg-zinc-900 text-zinc-600"
                              : "bg-zinc-100 text-zinc-950 shadow-md hover:bg-white active:scale-[0.98]"
                          }`}
                        >
                          {loading ? (
                            <div className="flex items-center justify-center gap-2">
                              <Loader2 size={14} className="animate-spin" />
                              <span>Logging in...</span>
                            </div>
                          ) : (
                            "Log in"
                          )}
                        </button>
                      </form>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Redirect footer tracking triggers */}
              <p className="mt-4 text-center text-[11px] text-zinc-400">
                Don&apos;t have an account?{" "}
                <a
                  href="/signup"
                  className="ml-1 text-zinc-300 underline underline-offset-2 hover:text-white transition-colors duration-200"
                >
                  Sign up
                </a>
              </p>
            </div>
          </div>

        </div>
      </section>
    </main>
  );
}