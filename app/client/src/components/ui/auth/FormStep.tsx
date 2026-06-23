import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, AlertCircle, Eye, EyeOff } from "lucide-react";
import GoogleButton from "@/components/ui/buttons/GoogleButton";
import { handelSignUpWithGoogle } from "@/functions/auth.function";

export type FormState = {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
};

type ValidationErrors = {
  [key in keyof FormState]?: string;
};

interface FormStepProps {
  form: FormState;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onNext: () => void;
}

export default function FormStep({ form, onChange, onNext }: FormStepProps) {
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [touched, setTouched] = useState<Set<string>>(new Set());
  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);

  const validateField = (name: string, value: string): string | undefined => {
    switch (name) {
      case "username":
        if (!value.trim()) return "Username is required";
        if (value.length < 3) return "Username must be at least 3 characters";
        if (!/^[a-zA-Z0-9_-]+$/.test(value)) return "Letters, numbers, underscores, and hyphens only";
        return undefined;
      case "email":
        if (!value.trim()) return "Email is required";
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return "Invalid email formatting";
        return undefined;
      case "password":
        if (!value) return "Password is required";
        if (value.length < 8) return "Password must be at least 8 characters";
        return undefined;
      case "confirmPassword":
        if (!value) return "Please confirm your password";
        if (value !== form.password) return "Passwords do not match";
        return undefined;
      default:
        return undefined;
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    onChange(e);

    // Real-time validation update for immediate checkmark response while typing
    setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }));
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTouched((prev) => { const next = new Set(prev); next.add(name); return next; });
    setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
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
    onNext();
  };

  return (
    <>
      <div className="text-center space-y-1.5 mb-8">
        <p className="text-xs font-semibold tracking-[0.08em] uppercase bg-gradient-to-r from-orange-400 to-amber-200 bg-clip-text text-transparent">
          Join Ratees
        </p>
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-100">
          Your next favorite movie starts here
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
          {/* Username Field */}
          <div className="space-y-1.5 w-full">
            <div className="relative">
              <input
                type="text"
                name="username"
                value={form.username}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Username"
                className={`w-full h-11 pl-3.5 pr-10 rounded-lg text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:ring-[3px] focus:ring-offset-0 focus:bg-zinc-950/80 transition-all ${errors.username && touched.has("username") ? "bg-red-950/10 border border-red-500/30" : "bg-zinc-900/40 border border-white/[0.05]"}`}
              />
              <div className="absolute right-3.5 top-1/2 -translate-y-1/2 flex items-center pointer-events-none z-10">
                <AnimatePresence>
                  {form.username && !errors.username && (
                    <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}>
                      <Check size={16} className="text-green-500 stroke-[2.5]" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
            {errors.username && touched.has("username") && (
              <div className="text-red-400 text-[11px] flex items-center gap-1.5 pl-0.5"><AlertCircle size={12} />{errors.username}</div>
            )}
          </div>

          {/* Email Field */}
          <div className="space-y-1.5 w-full">
            <div className="relative">
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Email address"
                className={`w-full h-11 pl-3.5 pr-10 rounded-lg text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:ring-[3px] focus:ring-offset-0 focus:bg-zinc-950/80 transition-all ${errors.email && touched.has("email") ? "bg-red-950/10 border border-red-500/30" : "bg-zinc-900/40 border border-white/[0.05]"}`}
              />
              <div className="absolute right-3.5 top-1/2 -translate-y-1/2 flex items-center pointer-events-none z-10">
                <AnimatePresence>
                  {form.email && !errors.email && (
                    <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}>
                      <Check size={16} className="text-green-500 stroke-[2.5]" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
            {errors.email && touched.has("email") && (
              <div className="text-red-400 text-[11px] flex items-center gap-1.5 pl-0.5"><AlertCircle size={12} />{errors.email}</div>
            )}
          </div>

          {/* Password Field */}
          <div className="space-y-1.5 w-full relative">
            <div className="relative">
              <input
                type={showPass ? "text" : "password"}
                name="password"
                value={form.password}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Password"
                className={`w-full h-11 pl-3.5 pr-14 rounded-lg text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:ring-[3px] transition-all ${errors.password && touched.has("password") ? "bg-red-950/10 border border-red-500/30" : "bg-zinc-900/40 border border-white/[0.05]"}`}
              />
              <div className="absolute right-3.5 top-1/2 -translate-y-1/2 flex items-center gap-2 z-10">
                <AnimatePresence>
                  {form.password && !errors.password && (
                    <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}>
                      <Check size={16} className="text-green-500 stroke-[2.5]" />
                    </motion.div>
                  )}
                </AnimatePresence>
                {form.password && (
                  <button type="button" onClick={() => setShowPass(!showPass)} className="text-zinc-500 hover:text-zinc-300 focus:outline-none">
                    {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                )}
              </div>
            </div>
            {errors.password && touched.has("password") && (
              <div className="text-red-400 text-[11px] flex items-center gap-1.5 pl-0.5"><AlertCircle size={12} />{errors.password}</div>
            )}
          </div>

          {/* Confirm Password Field */}
          <div className="space-y-1.5 w-full relative">
            <div className="relative">
              <input
                type={showConfirmPass ? "text" : "password"}
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Confirm password"
                className={`w-full h-11 pl-3.5 pr-14 rounded-lg text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:ring-[3px] transition-all ${errors.confirmPassword && touched.has("confirmPassword") ? "bg-red-950/10 border border-red-500/30" : "bg-zinc-900/40 border border-white/[0.05]"}`}
              />
              <div className="absolute right-3.5 top-1/2 -translate-y-1/2 flex items-center gap-2 z-10">
                <AnimatePresence>
                  {form.confirmPassword && !errors.confirmPassword && (
                    <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}>
                      <Check size={16} className="text-green-500 stroke-[2.5]" />
                    </motion.div>
                  )}
                </AnimatePresence>
                {form.confirmPassword && (
                  <button type="button" onClick={() => setShowConfirmPass(!showConfirmPass)} className="text-zinc-500 hover:text-zinc-300 focus:outline-none">
                    {showConfirmPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                )}
              </div>
            </div>
            {errors.confirmPassword && touched.has("confirmPassword") && (
              <div className="text-red-400 text-[11px] flex items-center gap-1.5 pl-0.5"><AlertCircle size={12} />{errors.confirmPassword}</div>
            )}
          </div>
        </div>

        <button type="submit" className="w-full h-11 rounded-lg font-medium text-sm flex items-center justify-center bg-zinc-100 text-zinc-950 hover:bg-white active:scale-[0.98] cursor-pointer shadow-md transition-all duration-200">
          Create account
        </button>
      </form>
    </>
  );
}