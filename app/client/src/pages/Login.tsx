import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Check,
  AlertCircle,
  Loader2,
  Eye,
  EyeOff,
} from "lucide-react";

import AuthNavbar from "@/components/navbar/AuthNavbar";
import GlowBackground from "@/components/background/GlowBackground";
import GoogleButton from "@/components/Button/GoogleButton";

import {
  handelSignInWithFiled,
  handelSignUpWithGoogle,
} from "@/functions/auth.function";

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
  onChange: (
    e: React.ChangeEvent<HTMLInputElement>
  ) => void;
  onBlur: (
    e: React.FocusEvent<HTMLInputElement>
  ) => void;
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

  const inputType = showTogglePassword
    ? isPasswordVisible
      ? "text"
      : "password"
    : type;

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
          className={`
            h-12
            w-full
            rounded-xl
            border
            px-4
            text-sm
            text-zinc-100
            placeholder:text-zinc-600
            transition-all
            duration-200
            outline-none
            backdrop-blur-xl
            ${
              showTogglePassword
                ? "pr-12"
                : "pr-10"
            }

            ${
              displayError
                ? "border-red-500/20 bg-red-950/10 focus:border-red-500/30"
                : "border-white/[0.06] bg-zinc-900/40 hover:border-white/[0.10] focus:border-white/[0.16] focus:bg-zinc-900/70"
            }
          `}
        />

        <div className="absolute right-4 top-1/2 flex -translate-y-1/2 items-center gap-2">
          {showTogglePassword && value && (
            <button
              type="button"
              onClick={
                onTogglePasswordVisibility
              }
              className="text-zinc-500 transition-colors hover:text-zinc-300"
              tabIndex={-1}
            >
              {isPasswordVisible ? (
                <EyeOff size={16} />
              ) : (
                <Eye size={16} />
              )}
            </button>
          )}

          <AnimatePresence>
            {value &&
              !error &&
              isTouched && (
                <motion.div
                  initial={{
                    opacity: 0,
                    scale: 0.8,
                  }}
                  animate={{
                    opacity: 1,
                    scale: 1,
                  }}
                  exit={{
                    opacity: 0,
                  }}
                >
                  <Check
                    size={16}
                    className="text-green-500"
                  />
                </motion.div>
              )}
          </AnimatePresence>
        </div>
      </div>

      <AnimatePresence initial={false}>
        {displayError && (
          <motion.div
            initial={{
              opacity: 0,
              height: 0,
            }}
            animate={{
              opacity: 1,
              height: "auto",
            }}
            exit={{
              opacity: 0,
              height: 0,
            }}
            transition={{
              duration: 0.2,
            }}
            className="overflow-hidden"
          >
            <div className="flex items-center gap-1.5 pl-1 text-[11px] text-red-400">
              <AlertCircle
                size={12}
                className="shrink-0"
              />

              <span>{error}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default function Login() {
  const [form, setForm] =
    useState<FormState>({
      email: "",
      password: "",
    });

  const [errors, setErrors] =
    useState<ValidationErrors>({});

  const [loading, setLoading] =
    useState(false);

  const [success, setSuccess] =
    useState(false);

  const [touched, setTouched] =
    useState<Set<string>>(new Set());

  const [showPass, setShowPass] =
    useState(false);

  const validateField = (
    name: string,
    value: string
  ): string | undefined => {
    switch (name) {
      case "email":
        if (!value.trim())
          return "Email is required";

        if (value.length < 3)
          return "Enter a valid email";

        return undefined;

      case "password":
        if (!value)
          return "Password is required";

        if (value.length < 8)
          return "Minimum 8 characters";

        return undefined;

      default:
        return undefined;
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (touched.has(name)) {
      setErrors((prev) => ({
        ...prev,
        [name]: validateField(name, value),
      }));
    }
  };

  const handleBlur = (
    e: React.FocusEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;

    setTouched((prev) => {
      const next = new Set(prev);

      next.add(name);

      return next;
    });

    setErrors((prev) => ({
      ...prev,
      [name]: validateField(name, value),
    }));
  };

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    if (loading) return;

    const validationErrors: ValidationErrors =
      {};

    const allTouched =
      new Set<string>();

    Object.keys(form).forEach((key) => {
      const field =
        key as keyof FormState;

      const error = validateField(
        field,
        form[field]
      );

      if (error)
        validationErrors[field] =
          error;

      allTouched.add(field);
    });

    setTouched(allTouched);

    setErrors(validationErrors);

    if (
      Object.values(validationErrors).some(
        Boolean
      )
    )
      return;

    setLoading(true);

    await new Promise((resolve) =>
      setTimeout(resolve, 1600)
    );

    await handelSignInWithFiled(
      form,
      setSuccess
    );

    setLoading(false);
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#030303] px-4 text-white">
      {/* Background */}
      <GlowBackground
        style="cinema"
        intensity="medium"
        animated={true}
      />

      {/* Ambient lighting */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-[-10%] top-[-20%] h-[600px] w-[600px] rounded-full bg-violet-600/15 blur-[160px] mix-blend-screen" />

        <div className="absolute bottom-[-20%] right-[-10%] h-[700px] w-[700px] rounded-full bg-cyan-500/10 blur-[180px] mix-blend-screen" />

        <div className="absolute top-[35%] left-[40%] h-[300px] w-[300px] rounded-full bg-fuchsia-500/5 blur-[120px]" />

        {/* grid */}
        <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.015)_1px,transparent_1px)] [background-size:24px_24px]" />

        {/* vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0),#030303_85%)]" />
      </div>

      <AuthNavbar />

      <div className="relative z-10 flex w-full items-center justify-center pt-24 pb-10">
        <AnimatePresence mode="wait">
          {success ? (
            <motion.div
              key="success"
              initial={{
                opacity: 0,
                y: 20,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              exit={{
                opacity: 0,
                y: -20,
              }}
              transition={{
                duration: 0.4,
                ease: CUBIC_EASE,
              }}
              className="relative w-full max-w-[440px] overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0C0C0C]/50 p-8 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.85)] backdrop-blur-3xl"
            >
              {/* cinematic light */}
              <div className="absolute inset-0 bg-gradient-to-b from-white/[0.03] to-transparent" />

              <div className="relative z-10 text-center">
                <motion.div
                  initial={{
                    scale: 0.5,
                    opacity: 0,
                  }}
                  animate={{
                    scale: 1,
                    opacity: 1,
                  }}
                  transition={{
                    delay: 0.1,
                    type: "spring",
                    damping: 14,
                  }}
                  className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full border border-green-500/20 bg-green-500/10"
                >
                  <Check
                    size={28}
                    className="text-green-400"
                  />
                </motion.div>

                <h2 className="text-2xl font-bold tracking-tight text-white">
                  Welcome back
                </h2>

                <p className="mx-auto mt-3 max-w-[280px] text-sm leading-6 text-zinc-400">
                  Your account has been
                  verified successfully.
                </p>

                <button className="mt-8 h-11 w-full rounded-xl bg-zinc-100 text-sm font-medium text-zinc-950 transition-all duration-200 hover:bg-white active:scale-[0.98]">
                  Enter dashboard
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="login-card"
              initial={{
                opacity: 0,
                y: 20,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              exit={{
                opacity: 0,
                y: -20,
              }}
              transition={{
                duration: 0.4,
                ease: CUBIC_EASE,
              }}
              className="relative w-full max-w-[440px] overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0C0C0C]/50 p-7 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.85)] backdrop-blur-3xl sm:p-9"
            >
              {/* cinematic light */}
              <div className="absolute inset-0 bg-gradient-to-b from-white/[0.03] to-transparent" />

              {/* glossy edge */}
              <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.10),transparent_40%,transparent)]" />

              <div className="relative z-10">
                {/* Header */}
                <div className="mb-8">
                  <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.03] px-3 py-1 text-xs text-zinc-400">
                    <div className="h-2 w-2 rounded-full bg-violet-400" />

                    Welcome back
                  </div>

                  <h1 className="text-4xl font-bold tracking-tight text-white">
                    Log in to Ratees
                  </h1>

                  <p className="mt-4 max-w-sm text-[15px] leading-7 text-zinc-400">
                    Continue your movie
                    journey and connect with
                    people who love cinema.
                  </p>
                </div>

                {/* Google */}
                <GoogleButton
                  onClick={
                    handelSignUpWithGoogle
                  }
                />

                {/* divider */}
                <div className="my-7 flex items-center gap-4">
                  <div className="h-px flex-1 bg-gradient-to-r from-transparent to-zinc-800/80" />

                  <span className="select-none text-[10px] font-bold uppercase tracking-[0.14em] text-zinc-600">
                    Or continue with email
                  </span>

                  <div className="h-px flex-1 bg-gradient-to-l from-transparent to-zinc-800/80" />
                </div>

                {/* form */}
                <form
                  onSubmit={handleSubmit}
                  className="space-y-5"
                >
                  <div className="space-y-3.5">
                    <FormField
                      name="email"
                      placeholder="Email address"
                      value={form.email}
                      error={errors.email}
                      isTouched={touched.has(
                        "email"
                      )}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />

                    <FormField
                      name="password"
                      placeholder="Password"
                      value={form.password}
                      error={errors.password}
                      isTouched={touched.has(
                        "password"
                      )}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      showTogglePassword
                      isPasswordVisible={
                        showPass
                      }
                      onTogglePasswordVisibility={() =>
                        setShowPass(
                          !showPass
                        )
                      }
                    />
                  </div>

                  {/* warning */}
                  {touched.has(
                    "password"
                  ) &&
                    form.password &&
                    form.password.length <
                      8 && (
                      <motion.div
                        initial={{
                          opacity: 0,
                          height: 0,
                        }}
                        animate={{
                          opacity: 1,
                          height: "auto",
                        }}
                        className="flex items-center gap-2 rounded-xl border border-red-500/10 bg-red-950/10 p-3 text-[11px] text-red-400"
                      >
                        <div className="h-1 w-1 rounded-full bg-red-500" />

                        <span>
                          Password must be at
                          least 8 characters.
                        </span>
                      </motion.div>
                    )}

                  {/* submit */}
                  <button
                    type="submit"
                    disabled={loading}
                    className={`
                      h-12
                      w-full
                      rounded-xl
                      text-sm
                      font-medium
                      transition-all
                      duration-200

                      ${
                        loading
                          ? "cursor-not-allowed border border-white/[0.03] bg-zinc-900 text-zinc-600"
                          : "bg-zinc-100 text-zinc-950 shadow-md hover:bg-white active:scale-[0.98]"
                      }
                    `}
                  >
                    {loading ? (
                      <div className="flex items-center justify-center gap-2">
                        <Loader2
                          size={16}
                          className="animate-spin"
                        />

                        <span>
                          Logging in...
                        </span>
                      </div>
                    ) : (
                      "Log in"
                    )}
                  </button>
                </form>

                {/* footer */}
                <p className="mt-7 text-center text-xs tracking-wide text-zinc-500">
                  Don&apos;t have an account?

                  <a
                    href="/signup"
                    className="ml-1.5 font-medium text-zinc-300 transition-colors duration-200 hover:text-white"
                  >
                    Sign up
                  </a>
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}