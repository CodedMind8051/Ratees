import { useEffect, useState, type ComponentType } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowLeft, Bell } from 'lucide-react';

interface ComingSoonProps {
  icon: ComponentType<{ size?: number | string; className?: string }>;
  eyebrow: string;
  title: string;
  description: string;
}

// A handful of muted accent hues so the floating avatar cluster below reads
// as "different people" without needing real images, and without breaking
// the app's neutral/primary-only palette rule — these are just varied
// opacities/tints of the existing tokens, not new colors.
const AVATAR_STYLES = [
  'bg-primary/15 ring-primary/25',
  'bg-secondary ring-border',
  'bg-primary/10 ring-primary/20',
  'bg-muted-foreground/10 ring-border',
];

export default function ComingSoon({ icon: Icon, eyebrow, title, description }: ComingSoonProps) {
  const [notifyMe, setNotifyMe] = useState(false);

  // Respect reduced-motion preference for the continuous ambient animations.
  const [reduceMotion, setReduceMotion] = useState(false);
  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduceMotion(query.matches);
    const listener = () => setReduceMotion(query.matches);
    query.addEventListener('change', listener);
    return () => query.removeEventListener('change', listener);
  }, []);

  return (
    <div className="relative min-h-[calc(100vh-4rem)] overflow-hidden flex items-center justify-center px-6 py-20">
      {/* ambient background glow */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <motion.div
          className="absolute left-1/2 top-1/2 h-[560px] w-[560px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-[120px]"
          animate={reduceMotion ? undefined : { scale: [1, 1.12, 1], opacity: [0.5, 0.75, 0.5] }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
        />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              'linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />
      </div>

      <div className="w-full max-w-lg text-center">
        {/* icon with pulsing radar rings */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="relative mx-auto mb-8 flex h-20 w-20 items-center justify-center"
        >
          {!reduceMotion &&
            [0, 1].map(i => (
              <motion.span
                key={i}
                className="absolute inset-0 rounded-full border border-primary/30"
                animate={{ scale: [1, 1.9], opacity: [0.6, 0] }}
                transition={{ duration: 2.4, repeat: Infinity, ease: 'easeOut', delay: i * 1.2 }}
              />
            ))}
          <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 ring-1 ring-primary/25 text-primary">
            <Icon size={26} />
          </div>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-primary"
        >
          {eyebrow} · Coming Soon
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.18 }}
          className="mb-4 text-3xl sm:text-4xl font-bold tracking-tight text-foreground"
        >
          {title}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.26 }}
          className="mx-auto mb-9 max-w-sm text-sm leading-relaxed text-muted-foreground"
        >
          {description}
        </motion.p>

        {/* floating avatar cluster — a wink at the feature itself, built
            from the same animate-pulse skeleton language used elsewhere */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.34 }}
          className="mb-10 flex items-center justify-center"
        >
          <div className="flex -space-x-3">
            {AVATAR_STYLES.map((style, i) => (
              <motion.div
                key={i}
                className={`h-10 w-10 rounded-full ring-2 ring-background ${style} animate-pulse`}
                animate={reduceMotion ? undefined : { y: [0, -4, 0] }}
                transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut', delay: i * 0.25 }}
              />
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.42 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3"
        >
          

          <Link
            to="/"
            className="flex items-center gap-2 rounded-xl border border-border px-5 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
          >
            <ArrowLeft size={15} />
            Back to Home
          </Link>
        </motion.div>
      </div>
    </div>
  );
}