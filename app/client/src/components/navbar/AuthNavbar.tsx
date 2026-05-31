import RateesLogo from "../logo/RateesLogo";
import { Button } from "@/components/ui/button";

export default function AuthNavbar() {
  return (
    <nav
      className="
        fixed
        inset-x-0
        top-0
        z-50
        h-16
        border-b
        border-white/[0.05]
        bg-zinc-950/35
        backdrop-blur-2xl
      "
    >
      {/* subtle cinematic border light */}
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      {/* ambient glow */}
      <div className="pointer-events-none absolute left-[10%] top-[-120px] h-[220px] w-[220px] rounded-full bg-violet-500/10 blur-[100px]" />

      <div className="mx-auto flex h-full w-full max-w-7xl items-center justify-between px-5 md:px-10">

        {/* Logo */}
        <a
          href="/"
          className="group flex select-none items-center gap-3"
        >
          {/* logo wrapper */}
          <div className="relative transition-transform duration-300 ease-out group-hover:scale-[1.03]">
            <RateesLogo />

            {/* soft glow */}
            <div className="absolute inset-0 rounded-full bg-white/5 blur-md opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
          </div>

          {/* brand text */}
          <div className="flex flex-col">
            <span className="text-sm font-semibold tracking-tight text-zinc-200 transition-colors duration-300 group-hover:text-white">
              Ratees
            </span>

            <span className="text-[10px] uppercase tracking-[0.22em] text-zinc-500 transition-colors duration-300 group-hover:text-zinc-400">
              Movie community
            </span>
          </div>
        </a>

        {/* right actions */}
        <a href="/login" className="group relative">

          {/* button ambient glow */}
          <div className="absolute inset-0 rounded-full bg-white/[0.03] blur-md opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

          <Button
            variant="outline"
            size="sm"
            className="
              relative
              h-9
              overflow-hidden
              rounded-full
              border
              border-white/[0.06]
              bg-zinc-900/80
              px-5
              text-xs
              font-medium
              tracking-wide
              text-zinc-300
              shadow-[0_1px_2px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.03)]
              backdrop-blur-xl
              transition-all
              duration-300
              ease-out
              hover:border-white/15
              hover:bg-zinc-900/90
              hover:text-white
              hover:shadow-[0_0_25px_rgba(255,255,255,0.04)]
              active:scale-[0.98]
            "
          >
            {/* shimmer effect */}
            <div
              className="
                absolute
                inset-0
                -translate-x-full
                bg-gradient-to-r
                from-transparent
                via-white/[0.06]
                to-transparent
                transition-transform
                duration-[1400ms]
                ease-out
                group-hover:translate-x-full
              "
            />

            <span className="relative z-10">
              Login
            </span>
          </Button>
        </a>
      </div>
    </nav>
  );
}