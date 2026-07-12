import {  useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  AlertCircle,
  Check,
  Eye,
  EyeOff,
  Lock,
  Mail,
  User,
} from "lucide-react";
import GoogleButton from "@/components/buttons/GoogleButton";
import { handleSignUpWithGoogle } from "@/functions/auth.function";

export type FormState = {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
};

type Errors = { [key in keyof FormState]?: string };

interface Props {
  form: FormState;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onNext: () => void;
}

/* ─── Motion variants ─── */

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06, delayChildren: 0.05 } },
};

const item = {
  hidden: { opacity: 0, y: 8 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] as const },
  },
};

/* ─── Password strength ─── */

function getStrength(pw: string) {
  if (!pw) return 0;
  let score = 0;
  if (pw.length >= 8) score++;
  if (pw.length >= 12) score++;
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) score++;
  if (/\d/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  return Math.min(score, 4);
}

const strengthMeta = [
  { label: "Weak", color: "bg-red-500" },
  { label: "Fair", color: "bg-orange-500" },
  { label: "Good", color: "bg-yellow-500" },
  { label: "Strong", color: "bg-green-500" },
];

export default function FormStep({ form, onChange, onNext }: Props) {
  const [errors, setErrors] = useState<Errors>({});
  const [touched, setTouched] = useState<Set<string>>(new Set());
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const strength = useMemo(() => getStrength(form.password), [form.password]);

  const validate = (name: string, value: string): string | undefined => {
    switch (name) {
      case "username":
        if (!value.trim()) return "Username is required";
        if (value.length < 3) return "At least 3 characters";
        if (!/^[a-zA-Z0-9_-]+$/.test(value)) return "Letters, numbers, _ and - only";
        return;
      case "email":
        if (!value.trim()) return "Email is required";
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return "Invalid email";
        return;
      case "password":
        if (!value) return "Password is required";
        if (value.length < 8) return "At least 8 characters";
        return;
      case "confirmPassword":
        if (!value) return "Please confirm your password";
        if (value !== form.password) return "Passwords don't match";
        return;
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    onChange(e);
    setErrors((p) => ({ ...p, [name]: validate(name, value) }));
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTouched((p) => new Set(p).add(name));
    setErrors((p) => ({ ...p, [name]: validate(name, value) }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const allTouched = new Set<string>();
    const errs: Errors = {};
    (Object.keys(form) as (keyof FormState)[]).forEach((k) => {
      allTouched.add(k);
      const err = validate(k, form[k]);
      if (err) errs[k] = err;
    });
    setTouched(allTouched);
    setErrors(errs);
    if (Object.values(errs).some(Boolean)) return;
    onNext();
  };

  return (
    <>
      <GoogleButton onClick={handleSignUpWithGoogle} />

      <div className="my-5 flex items-center gap-3">
        <div className="h-px flex-1 bg-border" />
        <span className="text-[10px] font-semibold uppercase tracking-[0.1em] text-muted-foreground/50">
          or
        </span>
        <div className="h-px flex-1 bg-border" />
      </div>

      <motion.form
        onSubmit={handleSubmit}
        className="space-y-3.5"
        initial="hidden"
        animate="visible"
        variants={container}
      >
        <motion.div variants={item}>
          <Input
            icon={User}
            name="username"
            placeholder="Username"
            value={form.username}
            error={errors.username}
            isTouched={touched.has("username")}
            onChange={handleChange}
            onBlur={handleBlur}
          />
        </motion.div>

        <motion.div variants={item}>
          <Input
            icon={Mail}
            name="email"
            type="email"
            placeholder="Email address"
            value={form.email}
            error={errors.email}
            isTouched={touched.has("email")}
            onChange={handleChange}
            onBlur={handleBlur}
          />
        </motion.div>

        <motion.div variants={item}>
          <Input
            icon={Lock}
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
          {form.password && (
            <div className="mt-1.5 flex items-center gap-2">
              <div className="flex flex-1 gap-1">
                {[0, 1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className={`h-1 flex-1 rounded-full transition-colors duration-300 ${
                      i < strength ? strengthMeta[strength - 1].color : "bg-border"
                    }`}
                  />
                ))}
              </div>
              <span className="w-10 shrink-0 text-right text-[10px] font-medium text-muted-foreground/60">
                {strength > 0 ? strengthMeta[strength - 1].label : ""}
              </span>
            </div>
          )}
        </motion.div>

        <motion.div variants={item}>
          <Input
            icon={Lock}
            name="confirmPassword"
            type="password"
            placeholder="Confirm password"
            value={form.confirmPassword}
            error={errors.confirmPassword}
            isTouched={touched.has("confirmPassword")}
            onChange={handleChange}
            onBlur={handleBlur}
            showToggle
            isVisible={showConfirm}
            onToggle={() => setShowConfirm(!showConfirm)}
          />
        </motion.div>

        <motion.div variants={item}>
          <button
            type="submit"
            className="relative mt-2 flex h-12 w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-primary to-primary/80 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-all duration-200 hover:shadow-xl hover:shadow-primary/30 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 disabled:shadow-none cursor-pointer"
          >
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_-20%,rgba(255,255,255,0.15),transparent_60%)]" />
            Continue
          </button>
        </motion.div>
      </motion.form>
    </>
  );
}

/* ─── Inline Input ─── */

type IconType = React.ComponentType<{ size?: number; className?: string }>;

function Input({
  icon: Icon,
  name,
  type = "text",
  placeholder,
  value,
  error,
  isTouched,
  onChange,
  onBlur,
  showToggle,
  isVisible,
  onToggle,
}: {
  icon: IconType;
  name: string;
  type?: string;
  placeholder: string;
  value: string;
  error: string | undefined;
  isTouched: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
  showToggle?: boolean;
  isVisible?: boolean;
  onToggle?: () => void;
}) {
  const [focused, setFocused] = useState(false);
  const showError = error && isTouched;
  const inputType = showToggle ? (isVisible ? "text" : "password") : type;

  return (
    <div className="space-y-1.5">
      <div className="relative">
        <Icon
          size={16}
          className={`pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors duration-200 ${
            showError ? "text-red-400/70" : focused ? "text-primary" : "text-muted-foreground/40"
          }`}
        />
        <input
          type={inputType}
          name={name}
          value={value}
          onChange={onChange}
          onFocus={() => setFocused(true)}
          onBlur={(e) => {
            setFocused(false);
            onBlur(e);
          }}
          placeholder={placeholder}
          className={`h-11 w-full rounded-xl border bg-background/50 pl-10 pr-10 text-sm text-foreground placeholder:text-muted-foreground/40 outline-none transition-all duration-200 ${
            showError
              ? "border-red-500/30 focus:border-red-500/50 focus:ring-1 focus:ring-red-500/20"
              : "border-border hover:border-border/80 focus:border-primary/40 focus:ring-1 focus:ring-primary/20"
          }`}
        />
        <div className="absolute right-3 top-1/2 flex -translate-y-1/2 items-center gap-1">
          {showToggle && value && (
            <button
              type="button"
              onClick={onToggle}
              tabIndex={-1}
              className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            >
              {isVisible ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          )}
          {value && !error && isTouched && <Check size={15} className="text-green-500" />}
        </div>
      </div>
      {showError && (
        <div className="flex items-center gap-1.5 pl-1 text-[11px] text-red-400">
          <AlertCircle size={11} />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}