import { useEffect, useRef, useId, useMemo } from "react";
import { cn } from "@/lib/utils";

export type GlowStyle = "cinema" | "tech" | "aurora" | "minimal" | "stellar";
export type GlowIntensity = "subtle" | "medium" | "bold";

interface GlowBackgroundProps {
  style?: GlowStyle;
  animated?: boolean;
  intensity?: GlowIntensity;
  interactive?: boolean;
  className?: string;
}

interface BlobConfig {
  className: string;
  gradient: string;
  blurOffset?: number;
  speed: number;
  reverse?: boolean;
}

const INTENSITY_MAP = {
  subtle: { blur: 90, opacity: "opacity-35" },
  medium: { blur: 130, opacity: "opacity-55" },
  bold: { blur: 180, opacity: "opacity-75" },
};

const THEME_MAP: Record<GlowStyle, BlobConfig[]> = {
  cinema: [
    { className: "top-[-12%] left-[-8%] w-[55vw] h-[55vw]", gradient: "rgba(251,146,60,0.16)", speed: 22 },
    { className: "bottom-[-15%] right-[-12%] w-[50vw] h-[50vw]", gradient: "rgba(249,115,22,0.12)", speed: 26, reverse: true, blurOffset: 25 },
    { className: "top-[35%] right-[15%] w-[40vw] h-[40vw]", gradient: "rgba(225,29,72,0.06)", speed: 30, reverse: true, blurOffset: 15 },
  ],
  tech: [
    { className: "top-[-10%] left-[-12%] w-[55vw] h-[55vw]", gradient: "rgba(6,182,212,0.15)", speed: 18 },
    { className: "bottom-[-12%] right-[-8%] w-[48vw] h-[48vw]", gradient: "rgba(59,130,246,0.12)", speed: 22, reverse: true, blurOffset: 20 },
    { className: "top-[25%] right-[25%] w-[42vw] h-[42vw]", gradient: "rgba(147,51,234,0.08)", speed: 28, reverse: true, blurOffset: 30 },
  ],
  aurora: [
    { className: "top-[-15%] left-[-10%] w-[55vw] h-[55vw]", gradient: "rgba(168,85,247,0.18)", speed: 20 },
    { className: "bottom-[-10%] right-[-10%] w-[52vw] h-[52vw]", gradient: "rgba(236,72,153,0.14)", speed: 25, reverse: true, blurOffset: 25 },
    { className: "top-[55%] left-[25%] w-[45vw] h-[45vw]", gradient: "rgba(139,92,246,0.10)", speed: 32, reverse: true, blurOffset: 20 },
  ],
  minimal: [
    { className: "top-[-15%] left-[-10%] w-[45vw] h-[45vw]", gradient: "rgba(255,255,255,0.05)", speed: 0, blurOffset: 30 },
    { className: "bottom-[-15%] right-[-10%] w-[50vw] h-[50vw]", gradient: "rgba(255,255,255,0.03)", speed: 0, blurOffset: 40 },
  ],
  stellar: [
    { className: "top-[-8%] left-[-10%] w-[52vw] h-[52vw]", gradient: "rgba(88,28,135,0.18)", speed: 24 },
    { className: "bottom-[-18%] right-[-8%] w-[48vw] h-[48vw]", gradient: "rgba(6,182,212,0.11)", speed: 28, reverse: true, blurOffset: 25 },
    { className: "top-[30%] right-[20%] w-[40vw] h-[40vw]", gradient: "rgba(236,72,153,0.07)", speed: 34, reverse: true, blurOffset: 15 },
    { className: "bottom-[25%] left-[25%] w-[35vw] h-[35vw]", gradient: "rgba(59,130,246,0.08)", speed: 38, reverse: true, blurOffset: 20 },
  ],
};

export default function GlowBackground({
  style = "cinema",
  animated = true,
  intensity = "medium",
  interactive = false,
  className,
}: GlowBackgroundProps) {
  const componentId = useId().replace(/:/g, "");
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!interactive) return;

    const container = containerRef.current;
    if (!container) return;

    const handlePointerMove = (e: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      // Delivers seamless mouse tracking completely skipping the React engine re-renders
      container.style.setProperty(`--mouse-x-${componentId}`, `${x}px`);
      container.style.setProperty(`--mouse-y-${componentId}`, `${y}px`);
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    return () => window.removeEventListener("pointermove", handlePointerMove);
  }, [interactive, componentId]);

  const settings = INTENSITY_MAP[intensity];
  const activeBlobs = THEME_MAP[style];

  const interactiveColor = useMemo(() => {
    switch (style) {
      case "cinema": return "rgba(251,146,60,0.08)";
      case "tech": return "rgba(6,182,212,0.08)";
      case "aurora": return "rgba(168,85,247,0.08)";
      case "stellar": return "rgba(236,72,153,0.06)";
      default: return "rgba(255,255,255,0.04)";
    }
  }, [style]);

  return (
    <div 
      ref={containerRef}
      className={cn(
        "absolute inset-0 overflow-hidden pointer-events-none z-0 bg-transparent select-none",
        className
      )}
    >
      {animated && (
        <style>{`
          @keyframes drift-${componentId} {
            0%, 100% { transform: translate3d(0, 0, 0) scale(1); }
            25% { transform: translate3d(2.5%, -1.5%, 0) scale(1.01); }
            50% { transform: translate3d(0, 1.5%, 0) scale(1); }
            75% { transform: translate3d(-2.5%, -1%, 0) scale(0.99); }
          }
          @keyframes drift-rev-${componentId} {
            0%, 100% { transform: translate3d(0, 0, 0) scale(1); }
            25% { transform: translate3d(-2.5%, 1.5%, 0) scale(0.99); }
            50% { transform: translate3d(0, -1.5%, 0) scale(1.01); }
            75% { transform: translate3d(2.5%, 1%, 0) scale(1); }
          }
        `}</style>
      )}

      {/* Primary Color Blur Mesh Layer */}
      <div className={cn("w-full h-full relative transition-opacity duration-1000", settings.opacity)}>
        {activeBlobs.map((blob, index) => {
          const animationName = blob.reverse ? `drift-rev-${componentId}` : `drift-${componentId}`;
          const finalBlur = settings.blur + (blob.blurOffset || 0);

          return (
            <div
              key={index}
              className={cn("absolute rounded-full will-change-transform mix-blend-plus-lighter", blob.className)}
              style={{
                background: `radial-gradient(circle at center, ${blob.gradient} 0%, transparent 70%)`,
                filter: `blur(${finalBlur}px)`,
                animation: animated && blob.speed > 0 
                  ? `${animationName} ${blob.speed}s ease-in-out infinite` 
                  : "none",
              }}
            />
          );
        })}

        {/* Dynamic Accelerated Cursor Tracker Aura */}
        {interactive && (
          <div
            className="absolute w-[45vw] h-[45vw] rounded-full will-change-transform pointer-events-none mix-blend-plus-lighter transition-transform duration-500 ease-out"
            style={{
              left: 0,
              top: 0,
              transform: `translate3d(calc(var(--mouse-x-${componentId}, -999px) - 22.5vw), calc(var(--mouse-y-${componentId}, -999px) - 22.5vw), 0)`,
              background: `radial-gradient(circle at center, ${interactiveColor} 0%, transparent 65%)`,
              filter: `blur(${settings.blur}px)`,
            }}
          />
        )}
      </div>

      {/* Premium Cinematic Ambient Lighting Filters */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.02),transparent_60%)] mix-blend-overlay" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_30%,rgba(9,9,11,0.5)_100%)]" />
      
      {/* High-Fidelity Micro-Grain Texture Overlay (Mitigates raw digital banding curves) */}
      <div className="absolute inset-0 opacity-[0.015] pointer-events-none bg-[url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http%3A%2F%2Fwww.w3.org/2000/svg%22%3E%3Cfilter id=%22noise%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.85%22 numOctaves=%223%22 stitchTiles=%22stitch%22%2F%3E%3C%2filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noise)%22%2F%3E%3C%2Fsvg%3E')]" />
    </div>
  );
}