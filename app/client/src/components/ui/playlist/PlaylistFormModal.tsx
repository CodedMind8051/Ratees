import { useState, useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import type { Playlist } from '@/types/playlist.type';

interface PlaylistFormModalProps {
  playlist: Playlist | null;
  loading: boolean;
  onClose: () => void;
  onSubmit: (name: string, description: string, isPublic: boolean) => Promise<void>;
}

export default function PlaylistFormModal({ playlist, loading, onClose, onSubmit }: PlaylistFormModalProps) {
  const [name, setName] = useState(playlist?.playlistName || '');
  const [description, setDescription] = useState(playlist?.description || '');
  const [isPublic, setIsPublic] = useState(playlist?.isPublic ?? true);
  const [nameError, setNameError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setTimeout(() => inputRef.current?.focus(), 50);
  }, []);

  const handleSubmit = async () => {
    if (!name.trim()) {
      setNameError('Playlist name is required');
      return;
    }
    await onSubmit(name.trim(), description.trim(), isPublic);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      <div
        className="relative bg-card border-border w-full sm:max-w-sm sm:rounded-2xl sm:border fade-in rounded-t-2xl border-t border-x p-5 sm:p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-base font-semibold">
            {playlist ? 'Edit Playlist' : 'New Playlist'}
          </h3>
          <button onClick={onClose} className="cursor-pointer p-1.5 rounded-lg hover:bg-secondary text-muted-foreground transition-colors">
            <X size={16} />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mb-1.5">
              Name <span className="text-red-400">*</span>
            </label>
            <input
              ref={inputRef}
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setNameError('');
              }}
              placeholder="e.g. Nolan Universe, Rainy Night Picks…"
              className="w-full bg-secondary border rounded-xl px-3 py-2.5 text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition-colors border-border focus:border-primary/60"
            />
            {nameError && <p className="text-xs text-red-400 mt-1">{nameError}</p>}
          </div>

          <div>
            <label className="block text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mb-1.5">
              Description <span className="text-muted-foreground/50 normal-case tracking-normal font-normal">· optional</span>
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What's the vibe of this playlist?"
              rows={3}
              className="w-full bg-secondary border border-border rounded-xl px-3 py-2.5 text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/60 resize-none transition-colors"
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-foreground">Make Public</p>
              <p className="text-xs text-muted-foreground">Allow others to see this playlist</p>
            </div>
            <button
              type="button"
              onClick={() => setIsPublic(!isPublic)}
              className={`w-11 h-6 rounded-full transition-colors cursor-pointer ${
                isPublic ? 'bg-primary' : 'bg-secondary'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white shadow transform transition-transform ${
                  isPublic ? 'translate-x-5' : 'translate-x-0.5'
                }`}
              />
            </button>
          </div>

          <div className="flex gap-3 pt-1">
            <button
              onClick={onClose}
              className="cursor-pointer flex-1 py-2.5 rounded-xl border border-border text-sm font-medium hover:bg-secondary transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="cursor-pointer flex-1 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-amber-400 disabled:opacity-50 transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              {loading && (
                <span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
              )}
              {loading ? 'Saving...' : playlist ? 'Save Changes' : 'Create'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
