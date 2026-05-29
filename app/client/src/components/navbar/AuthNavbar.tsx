import RateesLogo from "../logo/RateesLogo";
import { Button } from "@/components/ui/button";

export default function AuthNavbar() {
  return (
    <nav
      className="
        fixed 
        top-0 
        inset-x-0 
        z-50 
        h-16 
        px-6 
        md:px-12 
        bg-zinc-950/40 
        backdrop-blur-xl 
        border-b 
        border-white/[0.03]
        after:absolute 
        after:bottom-0 
        after:left-0 
        after:right-0 
        after:h-[1px] 
        after:bg-gradient-to-r 
        after:from-transparent 
        after:via-white/10 
        after:to-transparent
        flex 
        items-center
      "
    >
      <div className="w-full flex items-center justify-between max-w-7xl mx-auto">
        
        {/* Brand/Logo Section */}
        <a 
          href="/" 
          className="flex items-center gap-3.5 group cursor-pointer select-none"
        >
          <div className="relative transform group-hover:scale-[1.03] transition-transform duration-300 ease-out">
            <RateesLogo />
            {/* Ambient Logo Glow */}
            <div className="absolute inset-0 bg-white/5 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </div>
          <div className="flex flex-col justify-center -space-y-0.5">
            <span className="font-semibold text-sm tracking-tight text-zinc-200 group-hover:text-white transition-colors duration-200">
              Ratees
            </span>
            <span className="text-[10px] uppercase font-medium text-zinc-500 tracking-widest group-hover:text-zinc-400 transition-colors duration-200">
              For movie lovers
            </span>
          </div>
        </a>

        {/* Action Button Section */}
        <a href="/login" className="relative group block">
          {/* Outer Ambient Glow Behind Button */}
          <div className="absolute inset-0 bg-white/[0.02] rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          <Button
            variant="outline"
            size="sm"
            className="
              relative
              h-9
              px-5
              rounded-full
              bg-zinc-900/80
              text-xs
              font-medium
              text-zinc-300
              border-white/[0.05]
              hover:border-white/20
              hover:bg-zinc-900/90
              hover:text-white
              transition-all
              duration-300
              ease-out
              overflow-hidden
              shadow-[0_1px_2px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.03)]
              hover:shadow-[0_0_20px_rgba(255,255,255,0.03),inset_0_1px_0_rgba(255,255,255,0.08)]
              active:scale-[0.97]
            "
          >
            {/* Premium Moving Shimmer Highlight */}
            <div
              className="
                absolute 
                inset-0 
                bg-gradient-to-r 
                from-transparent 
                via-white/[0.06] 
                to-transparent 
                -translate-x-full 
                group-hover:translate-x-full 
                transition-transform 
                duration-[1200ms] 
                ease-in-out
              "
            />

            <span className="relative z-10 tracking-wide">
              Sign In
            </span>
          </Button>
        </a>

      </div>
    </nav>
  );
}