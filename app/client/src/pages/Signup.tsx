import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { handelSignUpWithFiled } from "@/functions/auth.function";

import AuthNavbar from "@/components/navbar/AuthNavbar";
import GlowBackground from "@/components/background/GlowBackground";


// Import modular step components
import FormStep, { FormState } from "@/components/auth/FormStep";
import AvatarStep from "@/components/auth/AvatarStep";
import VerificationStep from "@/components/auth/VerificationStep";

export type FlowStep = "FORM" | "AVATAR" | "VERIFY";
const CUBIC_EASE = [0.16, 1, 0.3, 1];

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
    await handelSignUpWithFiled(form, selectedAvatar!, setCurrentStep)
    await new Promise((resolve) => setTimeout(resolve, 1500));
  };

  return (
    <main className="min-h-screen bg-zinc-950 text-white overflow-x-hidden relative flex flex-col items-center justify-center">
      <GlowBackground style="cinema" intensity="medium" animated={true} />
      <AuthNavbar />

      <div className="w-full flex items-center justify-center pt-24 pb-12 px-4 relative z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.4, ease: CUBIC_EASE }}
            className="w-full max-w-[420px] p-8 rounded-2xl backdrop-blur-xl bg-zinc-950/40 border border-white/[0.06] shadow-[0_24px_60px_-15px_rgba(0,0,0,0.8)] relative"
          >
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

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
          </motion.div>
        </AnimatePresence>
      </div>
    </main>
  );
}