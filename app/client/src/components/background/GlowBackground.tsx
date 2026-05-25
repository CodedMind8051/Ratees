import { useState, useEffect, useId } from "react";

/**
 * Enhanced GlowBackground component with multiple premium aesthetic options.
 */

export type GlowStyle = "cinema" | "tech" | "aurora" | "minimal" | "stellar";
export type GlowIntensity = "subtle" | "medium" | "bold";

interface GlowBackgroundProps {
  style?: GlowStyle;
  animated?: boolean;
  intensity?: GlowIntensity;
  interactive?: boolean; // Easily toggle mouse following
}

interface BlobConfig {
  className: string;
  gradient: string;
  blurOffset?: number;
  speed: number;
  reverse?: boolean;
}

// 1. Move static configurations OUTSIDE the component to prevent re-allocation on every render.
const INTENSITY_MAP = {
  subtle: { blur: 100, opacity: "opacity-40" },
  medium: { blur: 120, opacity: "opacity-70" },
  bold: { blur: 140, opacity: "opacity-100" },
};

const THEME_MAP: Record<GlowStyle, BlobConfig[]> = {
  cinema: [
    { className: "top-[-10%] left-[-10%] w-[50vw] h-[50vw]", gradient: "rgba(251,146,60,0.15)", speed: 15 },
    { className: "bottom-[-15%] right-[-10%] w-[45vw] h-[45vw]", gradient: "rgba(249,115,22,0.12)", speed: 18, reverse: true, blurOffset: 20 },
    { className: "top-[30%] right-[20%] w-[35vw] h-[35vw]", gradient: "rgba(34,197,94,0.08)", speed: 20, reverse: true, blurOffset: 10 },
  ],
  tech: [
    { className: "top-[-12%] left-[-15%] w-[55vw] h-[55vw]", gradient: "rgba(6,182,212,0.14)", speed: 16 },
    { className: "bottom-[-15%] right-[-10%] w-[48vw] h-[48vw]", gradient: "rgba(59,130,246,0.12)", speed: 17, reverse: true, blurOffset: 15 },
    { className: "top-[25%] right-[30%] w-[38vw] h-[38vw]", gradient: "rgba(8,145,178,0.1)", speed: 19, reverse: true, blurOffset: 20 },
  ],
  aurora: [
    { className: "top-[-14%] left-[-12%] w-[52vw] h-[52vw]", gradient: "rgba(168,85,247,0.15)", speed: 16 },
    { className: "bottom-[-12%] right-[-12%] w-[50vw] h-[50vw]", gradient: "rgba(236,72,153,0.12)", speed: 18, reverse: true, blurOffset: 20 },
    { className: "top-[60%] left-[30%] w-[40vw] h-[40vw]", gradient: "rgba(139,92,246,0.1)", speed: 20, reverse: true, blurOffset: 15 },
  ],
  minimal: [
    { className: "top-[-15%] left-[-10%] w-[42vw] h-[42vw]", gradient: "rgba(255,255,255,0.08)", speed: 0, blurOffset: 20 },
    { className: "bottom-[-15%] right-[-12%] w-[48vw] h-[48vw]", gradient: "rgba(255,255,255,0.06)", speed: 0, blurOffset: 30 },
  ],
  stellar: [
    { className: "top-[-10%] left-[-12%] w-[50vw] h-[50vw]", gradient: "rgba(88,28,135,0.15)", speed: 17 },
    { className: "bottom-[-18%] right-[-10%] w-[45vw] h-[45vw]", gradient: "rgba(6,182,212,0.1)", speed: 19, reverse: true, blurOffset: 20 },
    { className: "top-[30%] right-[25%] w-[38vw] h-[38vw]", gradient: "rgba(236,72,153,0.08)", speed: 21, reverse: true, blurOffset: 10 },
    { className: "bottom-[20%] left-[30%] w-[32vw] h-[32vw]", gradient: "rgba(59,130,246,0.07)", speed: 23, reverse: true, blurOffset: 15 },
  ],
};

export default function GlowBackground({
  style = "cinema",
  animated = true,
  intensity = "medium",
  interactive = false,
}: GlowBackgroundProps) {
  const componentId = useId().replace(/:/g, ""); // Unique identifier for dynamic scoping CSS
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (!interactive) return;

    const handleMouseMove = (e: MouseEvent) => {
      // Normalizing mouse relative to viewport tracking coordinates
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [interactive]);

  const settings = INTENSITY_MAP[intensity];
  const activeBlobs = THEME_MAP[style];

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 bg-transparent select-none">
      {/* Scope dynamic style element to this unique instance */}
      {animated && (
        <style>{`
          @keyframes drift-${componentId} {
            0%, 100% { transform: translate(0px, 0px) scale(1); }
            25% { transform: translate(4%, -3%) scale(1.02); }
            50% { transform: translate(0px, 3%) scale(1); }
            75% { transform: translate(-4%, -2%) scale(0.98); }
          }
          @keyframes drift-reverse-${componentId} {
            0%, 100% { transform: translate(0px, 0px) scale(1); }
            25% { transform: translate(-4%, 3%) scale(0.98); }
            50% { transform: translate(0px, -3%) scale(1.02); }
            75% { transform: translate(4%, 2%) scale(1); }
          }
        `}</style>
      )}

      {/* Render Engine for configured blobs */}
      <div className={`w-full h-full relative transition-opacity duration-500 ${settings.opacity}`}>
        {activeBlobs.map((blob, index) => {
          const animationName = blob.reverse ? `drift-reverse-${componentId}` : `drift-${componentId}`;
          const finalBlur = settings.blur + (blob.blurOffset || 0);

          return (
            <div
              key={index}
              className={`absolute rounded-full will-change-transform mix-blend-screen ${blob.className}`}
              style={{
                background: `radial-gradient(circle close-harmonics, ${blob.gradient} 0%, transparent 70%)`,
                filter: `blur(${finalBlur}px)`,
                animation: animated && blob.speed > 0 
                  ? `${animationName} ${blob.speed}s ease-in-out infinite` 
                  : "none",
              }}
            />
          );
        })}

        {/* Mouse interactive point tracking element */}
        {interactive && (
          <div
            className="absolute w-[40vw] h-[40vw] rounded-full transition-transform duration-300 ease-out mix-blend-screen"
            style={{
              left: 0,
              top: 0,
              transform: `translate3d(calc(${mousePosition.x}px - 20vw), calc(${mousePosition.y}px - 20vw), 0)`,
              background: `radial-gradient(circle, ${
                style === "cinema" ? "rgba(251,146,60,0.06)" : "rgba(6,182,212,0.06)"
              } 0%, transparent 60%)`,
              filter: `blur(${settings.blur}px)`,
            }}
          />
        )}
      </div>

      {/* Universal Overlays */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.05),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.25)_100%)]" />
    </div>
  );
}