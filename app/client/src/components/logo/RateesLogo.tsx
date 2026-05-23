import Logo from "@/assets/logo.png";

export default function RateesLogo() {
  return (
    <div 
      className="
        relative
        w-10
        h-10
        rounded-xl
        bg-gradient-to-b
        from-zinc-900
        to-zinc-950
        border
        border-white/[0.06]
        flex
        items-center
        justify-center
        overflow-hidden
        shadow-[0_4px_12px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.05)]
        group
      "
    >
      {/* Subtle background ambient flare */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.03),transparent_60%)] pointer-events-none" />

      {/* High-Fidelity Logo Asset Asset Layer */}
      <img
        src={Logo}
        alt="Ratees Logo"
        className="
          w-5.5 
          h-5.5 
          object-contain 
          relative 
          z-10 
          transition-transform 
          duration-500 
          ease-out 
          group-hover:scale-105
        "
      />
    </div>
  );
}