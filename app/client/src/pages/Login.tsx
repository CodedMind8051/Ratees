import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, AlertCircle, Loader2, Eye, EyeOff } from "lucide-react";
import AuthNavbar from "@/components/navbar/AuthNavbar";
import GlowBackground from "@/components/background/GlowBackground";
import GoogleButton from "@/components/Button/GoogleButton";
import { handelSignInWithFiled, handelSignUpWithGoogle } from "@/functions/auth.function";

type FormState = {
  email: string;
  password: string;
};

type ValidationErrors = {
  [key in keyof FormState]?: string;
};

const CUBIC_EASE = [0.16, 1, 0.3, 1];


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
  onTogglePasswordVisibility
}: FormFieldProps) => {
  const displayError = error && isTouched;

  const inputType = showTogglePassword
    ? (isPasswordVisible ? "text" : "password")
    : type;

  return (
    <div className="space-y-1.5 w-full">
      <div className="relative">
        <input
          type={inputType}
          name={name}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
          className={`
            w-full h-11 px-3.5 rounded-lg text-sm transition-all duration-200 ease-out text-zinc-100 placeholder:text-zinc-600
            focus:outline-none focus:ring-[3px] focus:ring-offset-0 focus:bg-zinc-950/80
            ${showTogglePassword ? "pr-11" : "pr-10"}
            ${displayError
              ? "bg-red-950/10 border border-red-500/30 focus:border-red-500/40 focus:ring-red-500/[0.04]"
              : "bg-zinc-900/40 border border-white/[0.05] hover:border-white/10 hover:bg-zinc-900/60 focus:border-white/20 focus:ring-white/[0.03]"
            }
          `}
        />

        <div className="absolute right-3.5 top-1/2 -translate-y-1/2 flex items-center gap-2">
          {showTogglePassword && value && (
            <button
              type="button"
              onClick={onTogglePasswordVisibility}
              className="text-zinc-500 hover:text-zinc-300 transition-colors p-0.5 focus:outline-none"
              tabIndex={-1}
            >
              {isPasswordVisible ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          )}

          <AnimatePresence>
            {value && !error && isTouched && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="pointer-events-none"
              >
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
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="overflow-hidden"
          >
            <div className="flex items-center gap-1.5 text-red-400 text-[11px] pt-0.5 pl-0.5">
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
  const [form, setForm] = useState<FormState>({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState<ValidationErrors>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [touched, setTouched] = useState<Set<string>>(new Set());

  const [showPass, setShowPass] = useState(false);

  const validateField = (name: string, value: string): string | undefined => {
    switch (name) {
      case "email":
        if (!value.trim()) return "Email is required";
        if (value.length < 3) return "Entry must be at least 3 characters";
        return undefined;

      case "password":
        if (!value) return "Password is required";
        if (value.length < 8) return "Password must be at least 8 characters";
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
      const fieldName = key as keyof FormState;
      const error = validateField(fieldName, form[fieldName]);
      if (error) validationErrors[fieldName] = error;
      allTouched.add(fieldName);
    });

    setTouched(allTouched);
    setErrors(validationErrors);

    if (Object.values(validationErrors).some(Boolean)) return;

    setLoading(true);

    await new Promise((resolve) => setTimeout(resolve, 2000));
    await handelSignInWithFiled(form, setSuccess);
    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-zinc-950 text-white overflow-x-hidden relative flex flex-col items-center justify-center">
      <GlowBackground style="cinema" intensity="medium" animated={true} />
      <AuthNavbar />

      <div className="w-full flex items-center justify-center pt-24 pb-12 px-4 relative z-10">
        <AnimatePresence mode="wait">
          {success ? (
            /* Success Login Authenticated Screen */
            <motion.div
              key="success-screen"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.5, ease: CUBIC_EASE }}
              className="w-full max-w-[420px] p-8 rounded-2xl backdrop-blur-xl bg-zinc-950/40 border border-white/[0.06] shadow-[0_24px_60px_-15px_rgba(0,0,0,0.8)] text-center relative"
            >
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
              <motion.div
                initial={{ scale: 0.4, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.15, type: "spring", damping: 15 }}
                className="w-14 h-14 bg-green-500/10 border border-green-500/20 rounded-full flex items-center justify-center mx-auto mb-5"
              >
                <Check size={24} className="text-green-400" />
              </motion.div>
              <h2 className="text-xl font-semibold tracking-tight text-zinc-100 mb-1.5">Welcome Back!</h2>
              <p className="text-zinc-400 text-xs tracking-wide max-w-[280px] mx-auto mb-6">
                Successfully logged in. Accessing your personalized theater data...
              </p>
              <button className="w-full h-11 rounded-lg bg-zinc-100 text-zinc-950 font-medium text-sm hover:bg-white active:scale-[0.98] transition-all duration-200 shadow-md">
                Enter Dashboard
              </button>
            </motion.div>
          ) : (
            /* Main Login Card Asset Container Layout */
            <motion.div
              key="login-form-card"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.5, ease: CUBIC_EASE }}
              className="w-full max-w-[420px] p-8 rounded-2xl backdrop-blur-xl bg-zinc-950/40 border border-white/[0.06] shadow-[0_24px_60px_-15px_rgba(0,0,0,0.8)] relative"
            >
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

              <div className="text-center space-y-1.5 mb-8">
                <p className="text-xs font-semibold tracking-[0.08em] uppercase bg-gradient-to-r from-orange-400 to-amber-200 bg-clip-text text-transparent">
                  Welcome Back
                </p>
                <h1 className="text-2xl font-semibold tracking-tight text-zinc-100">
                  Log in to your Ratees account
                </h1>
              </div>
              <GoogleButton onClick={handelSignUpWithGoogle} />
              <form onSubmit={handleSubmit} className="space-y-5">


                <div className="my-6 flex items-center gap-4">
                  <div className="h-px bg-gradient-to-r from-transparent to-zinc-800/80 flex-1" />
                  <span className="text-[10px] font-bold tracking-[0.12em] text-zinc-600 uppercase select-none">
                    Or continue with
                  </span>
                  <div className="h-px bg-gradient-to-l from-transparent to-zinc-800/80 flex-1" />
                </div>

                <div className="space-y-3.5">
                  <FormField
                    name="email"
                    placeholder="Username or Email address"
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
                    showTogglePassword={true}
                    isPasswordVisible={showPass}
                    onTogglePasswordVisibility={() => setShowPass(!showPass)}
                  />
                </div>

                {/* Password length notice overlay container */}
                {touched.has("password") && form.password && form.password.length < 8 && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="bg-red-950/10 border border-red-500/10 rounded-lg p-2.5 text-[11px] text-red-400 flex items-center gap-2"
                  >
                    <div className="w-1 h-1 rounded-full bg-red-500" />
                    <span>Password must be at least 8 characters long.</span>
                  </motion.div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className={`
                    w-full h-11 rounded-lg font-medium text-sm flex items-center justify-center gap-2 transition-all duration-200
                    ${loading
                      ? "bg-zinc-900 text-zinc-600 cursor-not-allowed border border-white/[0.02]"
                      : "bg-zinc-100 text-zinc-950 hover:bg-white active:scale-[0.98] cursor-pointer shadow-md"
                    }
                  `}
                >
                  {loading ? (
                    <>
                      <Loader2 size={16} className="animate-spin text-zinc-500" />
                      <span className="text-zinc-500">Verifying credentials context...</span>
                    </>
                  ) : (
                    "Log in"
                  )}
                </button>
              </form>

              <p className="text-center text-xs text-zinc-500 mt-6 tracking-wide">
                Don't have an account?
                <span className="text-zinc-300 hover:text-white ml-1.5 font-medium transition-colors duration-200 cursor-pointer underline-offset-4 hover:underline">
                  <a href="/signup">Sign up</a>
                </span>
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}