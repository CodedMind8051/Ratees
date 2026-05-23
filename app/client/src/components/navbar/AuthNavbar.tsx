import RateesLogo from "../logo/RateesLogo";

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
        md:px-8 
        bg-zinc-950/20 
        backdrop-blur-md 
        border-b 
        border-white/[0.04]
        flex 
        items-center
      "
        >
            <div className="w-full flex items-center justify-between max-w-7xl mx-auto">

                {/* Brand/Logo Section */}
                <div className="flex items-center gap-3 group cursor-pointer">
                    <RateesLogo />
                    <div className="flex flex-col justify-center -space-y-0.5">
                        <h1 className="font-semibold text-sm tracking-tight text-zinc-100 group-hover:text-white transition-colors duration-200">
                            Ratees
                        </h1>
                        <p className="text-[11px] text-zinc-500 tracking-wide select-none">
                            For movie lovers
                        </p>
                    </div>
                </div>

                {/* Action Button Section */}
                <a href="/login">
                    <button
                        className="
        relative
        group
        h-8.5
        px-4
        rounded-full
        bg-zinc-900/60
        text-xs
        font-medium
        text-zinc-300
        border
        border-white/[0.04]
        hover:border-white/10
        hover:text-white
        transition-all
        duration-300
        ease-out
        overflow-hidden
        flex
        items-center
        justify-center
        shadow-[0_1px_2px_rgba(0,0,0,0.2),inset_0_1px_0_rgba(255,255,255,0.03)]
        hover:shadow-[0_4px_12px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.05)]
        active:scale-[0.96]
      "
                    >
                        {/* Dynamic Background Hover Shimmer Accent */}
                        <div
                            className="
          absolute 
          inset-0 
          bg-gradient-to-r 
          from-transparent 
          via-white/[0.03] 
          to-transparent 
          -translate-x-full 
          group-hover:translate-x-full 
          transition-transform 
          duration-[1000ms] 
          ease-in-out
        "
                        />

                        {/* Button Text String */}
                        <span className="relative z-10 tracking-tight">
                            Log in
                        </span>
                    </button>
                </a>

            </div>
        </nav>
    );
}