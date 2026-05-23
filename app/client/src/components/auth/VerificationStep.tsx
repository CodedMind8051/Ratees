import { motion } from "framer-motion";
import { Mail } from "lucide-react";

interface VerificationStepProps {
  email: string;
}

export default function VerificationStep({ email }: VerificationStepProps) {
  const handleOpenGmail = () => {
    const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    const isIOS = /iPhone|iPad|iPod/.test(navigator.userAgent);

    if (isMobile) {
      if (isIOS) {
        // iOS: Try Gmail app deep link, fallback to web
        window.location.href = "googlegmail://";
        
        setTimeout(() => {
          window.open("https://mail.google.com/mail/", "_blank");
        }, 1500);
      } else {
        // Android: Gmail app should open via the Gmail URL directly
        // If Gmail app is installed, it will handle the URL
        window.location.href = "https://mail.google.com/mail/";
      }
    } else {
      // Desktop
      window.open("https://mail.google.com/mail/", "_blank");
    }
  };

  return (
    <div className="text-center">
      <motion.div
        initial={{ scale: 0.4, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.15, type: "spring", damping: 14 }}
        className="w-14 h-14 bg-orange-500/10 border border-orange-500/20 rounded-full flex items-center justify-center mx-auto mb-5"
      >
        <Mail size={24} className="text-orange-400" />
      </motion.div>
      <h2 className="text-xl font-semibold tracking-tight text-zinc-100 mb-2">Please verify your email</h2>
      <p className="text-zinc-400 text-xs leading-relaxed max-w-[310px] mx-auto mb-6">
        We sent a verification link to <span className="text-zinc-200 font-medium">{email || "your address"}</span>. 
        Click the link inside to unlock your theater rating profile.
      </p>
      <div className="space-y-3">
        <button 
          onClick={handleOpenGmail} 
          className="w-full h-11 rounded-lg bg-zinc-100 text-zinc-950 font-medium text-sm hover:bg-white active:scale-[0.98] transition-all duration-200 shadow-md cursor-pointer"
        >
          Open Gmail
        </button>
        <p className="text-center text-[11px] text-zinc-600 tracking-wide pt-1">
          Didn't receive a message?{" "}
          <span className="text-zinc-400 hover:text-white underline cursor-pointer transition-colors duration-150">
            Resend token
          </span>
        </p>
      </div>
    </div>
  );
}