import { useState } from "react";
import { motion } from "framer-motion";
import { Check, AlertCircle, Loader2 } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/shadcn/avatar";

const AVATAR_OPTIONS = [
  { id: "cinema-1", url: "https://play-lh.googleusercontent.com/HHJb4ew7S16SHjqNjp1nEkVKn8L2j1rXPjVmF4fqf-mGjZYYIjhHYKjUJSLbB7SRx1HS", fallback: "A1" },
  { id: "cinema-2", url: "https://cdn.polyspeak.ai/speakmaster/poly-sdispatcher/images/1c02c77b-4a49-48b7-9d47-11c5f83da98b.WEBP", fallback: "A2" },
  { id: "cinema-3", url: "https://avatarfiles.alphacoders.com/856/thumb-1920-85662.jpg", fallback: "A3" },
  { id: "cinema-4", url: "https://i.redd.it/some-death-note-pfps-ive-gathered-v0-mszkgdgr769g1.jpg?width=1200&format=pjpg&auto=webp&s=99a84d4b36e4571eb53cf55cafae87e7c9ea7c5e", fallback: "A4" },
  { id: "cinema-5", url: "https://i.pinimg.com/564x/f3/c3/a4/f3c3a4be7a3b0d2e1ed754bbb40fc705.jpg", fallback: "A5" },
  { id: "cinema-6", url: "https://static.wikia.nocookie.net/f73a1ea9-07b2-4d8d-bd97-7664c90ce1cf", fallback: "A6" },
];

interface AvatarStepProps {
  // 1. Matched the prop type naming exactly with what's defined below
  selectedAvatar: string | null; 
  onSelectAvatar: (url: string) => void;
  onBack: () => void;
  onSubmit: () => Promise<void>;
}

export default function AvatarStep({ selectedAvatar, onSelectAvatar, onBack, onSubmit }: AvatarStepProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleProcessSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // 2. Checking against 'selectedAvatar' prop value since that stores the URL now
    if (!selectedAvatar) {
      setError("Please pick an avatar identity layout to complete onboarding profile.");
      return;
    }
    setLoading(true);
    await onSubmit();
    setLoading(false);
  };

  return (
    <>
      <div className="text-center space-y-1.5 mb-6">
        <p className="text-xs font-semibold tracking-[0.08em] uppercase text-orange-400">Step 2 of 2</p>
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-100">Personalize Your Profile</h1>
      </div>

      <form onSubmit={handleProcessSubmit} className="space-y-6">
        <div className="space-y-4 w-full py-2">
          <p className="text-[11px] font-semibold tracking-[0.08em] text-zinc-400 uppercase text-center select-none">
            Pick your profile identity avatar
          </p>

          <div className="grid grid-cols-3 gap-4 justify-items-center py-2">
            {AVATAR_OPTIONS.map((avatar) => {
              // 3. Since parent stores URL, check selection status by matching URLs
              const isSelected = selectedAvatar === avatar.url;
              return (
                <button
                  key={avatar.id}
                  type="button"
                  onClick={() => {
                    onSelectAvatar(avatar.url); // Sends URL straight up to the parent
                    setError(null);
                  }}
                  className="relative focus:outline-none group rounded-full"
                >
                  <div className={`absolute -inset-1 rounded-full transition-all duration-300 ${isSelected ? "ring-2 ring-orange-500 shadow-[0_0_20px_rgba(249,115,22,0.4)]" : "ring-1 ring-white/5 group-hover:ring-white/20"}`} />
                  <Avatar className="h-20 w-20 border border-zinc-800 transition-transform duration-300 ease-out group-hover:scale-105">
                    <AvatarImage src={avatar.url} alt="Option" className={`object-cover ${isSelected ? "contrast-[1.05]" : "opacity-80 group-hover:opacity-100"}`} />
                    <AvatarFallback className="bg-zinc-900 text-zinc-400">{avatar.fallback}</AvatarFallback>
                  </Avatar>
                  {isSelected && (
                    <motion.div initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-orange-500 flex items-center justify-center shadow-lg border-2 border-zinc-950">
                      <Check size={12} className="text-zinc-950 stroke-[3]" />
                    </motion.div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {error && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="flex items-center gap-1.5 text-red-400 text-[11px] justify-center">
            <AlertCircle size={12} />
            <span>{error}</span>
          </motion.div>
        )}

        <div className="flex gap-3 pt-2">
          <button type="button" disabled={loading} onClick={onBack} className="flex-1 h-11 rounded-lg font-medium text-sm border border-white/5 bg-zinc-900/40 text-zinc-300 hover:bg-zinc-900 hover:text-white transition-all duration-200 disabled:opacity-50">
            Back
          </button>
          <button type="submit" disabled={loading} className="flex-1 h-11 rounded-lg font-medium text-sm flex items-center justify-center gap-2 bg-zinc-100 text-zinc-950 hover:bg-white active:scale-[0.98] shadow-md transition-all duration-200 disabled:bg-zinc-800 disabled:text-zinc-600">
            {loading ? (
              <>
                <Loader2 size={16} className="animate-spin text-zinc-500" />
                <span>Saving...</span>
              </>
            ) : (
              "Complete Profile"
            )}
          </button>
        </div>
      </form>
    </>
  );
}