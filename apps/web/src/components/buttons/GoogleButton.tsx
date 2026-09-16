import { useState } from "react";

interface GoogleButtonProps {
  onClick: () => void;
}

export default function GoogleButton({ onClick }: GoogleButtonProps) {
  const [coords, setCoords] = useState({ x: -1, y: -1 });

  // Subtle interactive spotlight gradient tracking
  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setCoords({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <button
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setCoords({ x: -1, y: -1 })}
      onClick={onClick}
      className="
        relative
        group
        w-full
        h-11
        px-4
        rounded-lg
        bg-zinc-950
        text-zinc-200
        text-sm
        font-medium
        border
        border-zinc-800/80
        hover:border-zinc-700/60
        hover:text-white
        transition-all
        duration-300
        ease-out
        flex
        items-center
        justify-center
        gap-2.5
        overflow-hidden
        shadow-[0_1px_2px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.03)]
        hover:shadow-[0_4px_12px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.05)]
        active:scale-[0.98]
      "
    >
      {/* Premium Ambient Spotlight Overlay */}
      {coords.x !== -1 && (
        <div
          className="absolute pointer-events-none rounded-full blur-[24px] mix-blend-screen opacity-40 transition-opacity duration-300 group-hover:opacity-100"
          style={{
            width: "120px",
            height: "120px",
            background: "radial-gradient(circle, rgba(255,255,255,0.15) 0%, transparent 70%)",
            left: `${coords.x - 60}px`,
            top: `${coords.y - 60}px`,
          }}
        />
      )}

      {/* Standardized, High-Fidelity Google "G" Icon */}
      <svg
        className="w-4 h-4 shrink-0 transition-transform duration-300 group-hover:scale-105"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path
          fill="#4285F4"
          d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v3.92h6.61a5.66 5.66 0 0 1-2.45 3.71v3.08h3.95a12 12 0 0 0 3.63-8.64z"
        />
        <path
          fill="#34A853"
          d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.95-3.08c-1.1.74-2.5 1.18-3.98 1.18-3.06 0-5.66-2.07-6.58-4.86H1.4v3.18A12 12 0 0 0 12 24z"
        />
        <path
          fill="#FBBC05"
          d="M5.42 14.33a7.14 7.14 0 0 1 0-4.66V6.49H1.4a12 12 0 0 0 0 11.02l4.02-3.18z"
        />
        <path
          fill="#EA4335"
          d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.43-3.43A11.93 11.93 0 0 0 12 0 12 12 0 0 0 1.4 6.49l4.02 3.18c.92-2.79 3.52-4.92 6.58-4.92z"
        />
      </svg>

      <span className="relative z-10 tracking-tight">
        Continue with Google
      </span>
    </button>
  );
}