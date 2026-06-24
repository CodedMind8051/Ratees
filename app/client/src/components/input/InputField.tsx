import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, AlertCircle, Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/shadcn/input";

type Props = {
  name: string;
  placeholder: string;
  type?: string;
  value: string;
  error?: string;
  isTouched?: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  showToggle?: boolean;
};

export default function InputField({
  name,
  placeholder,
  type = "text",
  value,
  error,
  isTouched = false,
  onChange,
  onBlur,
  showToggle = false,
}: Props) {
  const [visible, setVisible] = useState(false);
  const displayError = !!(error && isTouched);
  const inputType = showToggle ? (visible ? "text" : "password") : type;

  return (
    <div className="space-y-1.5 w-full">
      <div className="relative">
        <Input
          type={inputType}
          name={name}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
          className={`
            w-full
            h-11
            px-3.5
            rounded-lg
            text-zinc-100
            placeholder:text-zinc-600
            text-sm
            border
            transition-all
            duration-200
            ease-out
            focus-visible:ring-[3px]
            focus-visible:ring-offset-0
            ${showToggle ? "pr-11" : "pr-10"} 
            ${
              displayError
                ? "bg-red-950/10 border-red-500/30 focus-visible:border-red-500/40 focus-visible:ring-red-500/[0.04] focus-visible:bg-zinc-950/80"
                : "bg-zinc-900/40 border-white/[0.05] hover:border-white/10 hover:bg-zinc-900/60 focus-visible:border-white/20 focus-visible:bg-zinc-950/80 focus-visible:ring-white/[0.03]"
            }
          `}
        />
        
        <div className="absolute right-3.5 top-1/2 -translate-y-1/2 flex items-center gap-2 z-10">
          {showToggle && value && (
            <button
              type="button"
              onClick={() => setVisible(!visible)}
              className="text-zinc-500 hover:text-zinc-300 transition-colors focus:outline-none"
            >
              {visible ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          )}

          <AnimatePresence>
            {/* REMOVED isTouched condition so it triggers instantly on valid input */}
            {value && !error && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="pointer-events-none"
              >
                <Check size={16} className="text-green-500 stroke-[2.5]" />
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
            <div className="flex items-center gap-1.5 text-red-400 text-[11px] pt-0.5 pl-0.5">
              <AlertCircle size={12} className="shrink-0" />
              <span>{error}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}