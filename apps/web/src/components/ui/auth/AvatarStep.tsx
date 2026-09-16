import { useState } from "react";
import { motion } from "framer-motion";
import { Check, AlertCircle, Loader2 } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/shadcn/avatar";

const AVATARS = [
  { id: "a1", url: "/assets/avatars/avatar1.jpg", fb: "A1" },
  { id: "a2", url: "/assets/avatars/avatar2.webp", fb: "A2" },
  { id: "a3", url: "/assets/avatars/avatar3.jpg", fb: "A3" },
  { id: "a4", url: "/assets/avatars/avatar4.jpg", fb: "A4" },
  { id: "a5", url: "/assets/avatars/avatar5.jpg", fb: "A5" },
  { id: "a6", url: "/assets/avatars/avatar6.jpg", fb: "A6" },
];

interface Props {
  selectedAvatar: string | null;
  onSelectAvatar: (url: string) => void;
  onBack: () => void;
  onSubmit: () => Promise<void>;
}

export default function AvatarStep({ selectedAvatar, onSelectAvatar, onBack, onSubmit }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAvatar) { setError("Please pick an avatar"); return; }
    setLoading(true);
    await onSubmit();
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-3 gap-4 justify-items-center">
        {AVATARS.map(a => {
          const isSelected = selectedAvatar === a.url;
          return (
            <button key={a.id} type="button" onClick={() => { onSelectAvatar(a.url); setError(null); }}
              className="relative focus:outline-none group rounded-full cursor-pointer">
              <div className={`absolute -inset-1 rounded-full transition-all duration-200 ${
                isSelected
                  ? "ring-2 ring-primary shadow-[0_0_16px_rgba(245,158,11,0.35)]"
                  : "ring-1 ring-border group-hover:ring-muted-foreground/30"
              }`} />
              <Avatar className="h-[72px] w-[72px] border border-border">
                <AvatarImage src={a.url} alt="" className={`object-cover transition-opacity ${isSelected ? "" : "opacity-75 group-hover:opacity-100"}`} />
                <AvatarFallback className="bg-secondary text-muted-foreground text-xs">{a.fb}</AvatarFallback>
              </Avatar>
              {isSelected && (
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}
                  className="absolute -bottom-0.5 -right-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-primary border-2 border-background">
                  <Check size={10} className="text-primary-foreground stroke-[3]" />
                </motion.div>
              )}
            </button>
          );
        })}
      </div>

      {error && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="flex items-center justify-center gap-1.5 text-[11px] text-red-400">
          <AlertCircle size={11} /><span>{error}</span>
        </motion.div>
      )}

      <div className="flex gap-3 pt-1">
        <button type="button" disabled={loading} onClick={onBack}
          className="flex-1 h-11 rounded-xl border border-border bg-background/50 text-sm font-medium text-muted-foreground hover:bg-card hover:text-foreground transition-all duration-200 disabled:opacity-50 cursor-pointer">
          Back
        </button>
        <button type="submit" disabled={loading}
          className="relative flex-1 h-12 overflow-hidden rounded-xl bg-gradient-to-r from-primary to-primary/80 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-all duration-200 hover:shadow-xl hover:shadow-primary/30 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 disabled:shadow-none cursor-pointer">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_-20%,rgba(255,255,255,0.15),transparent_60%)]" />
          {loading ? (
            <span className="flex items-center justify-center gap-2"><Loader2 size={14} className="animate-spin" /> Saving...</span>
          ) : "Complete Profile"}
        </button>
      </div>
    </form>
  );
}
