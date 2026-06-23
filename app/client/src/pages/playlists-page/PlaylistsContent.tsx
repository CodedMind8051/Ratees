import { useState, useRef, useEffect } from 'react';
import {
  ListVideo, Plus, Pencil, Trash2, ChevronRight,
  ArrowLeft, Film, Tv, X, Check, GripVertical, Search
} from 'lucide-react';
import { toast } from 'sonner';
import { mockPlaylists, allContent, Playlist, ContentItem } from '@/data/mockData';
import MovieDetailModal from '@/components/ui/content/ContentDetailModal';

export default function PlaylistsContent() {
  const [playlists, setPlaylists]           = useState<Playlist[]>(mockPlaylists);
  const [activePlaylist, setActivePlaylist] = useState<Playlist | null>(null);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editingPlaylist, setEditingPlaylist] = useState<Playlist | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [selectedContent, setSelectedContent] = useState<ContentItem | null>(null);
  const [addContentOpen, setAddContentOpen] = useState(false);
  const [addSearchQuery, setAddSearchQuery] = useState('');

  const handleCreatePlaylist = (name: string, description: string) => {
    const newPlaylist: Playlist = {
      id: `playlist-new-${Date.now()}`,
      name,
      description,
      items: [],
      createdAt: 'Jun 12, 2026',
      updatedAt: 'Jun 12, 2026',
    };
    setPlaylists(prev => [...prev, newPlaylist]);
    toast.success(`"${name}" created`);
  };

  const handleRenamePlaylist = (id: string, name: string, description: string) => {
    setPlaylists(prev => prev.map(p => p.id === id ? { ...p, name, description, updatedAt: 'Jun 12, 2026' } : p));
    if (activePlaylist?.id === id) setActivePlaylist(prev => prev ? { ...prev, name, description } : null);
    toast.success('Playlist updated');
  };

  const handleDeletePlaylist = (id: string) => {
    const pl = playlists.find(p => p.id === id);
    setPlaylists(prev => prev.filter(p => p.id !== id));
    if (activePlaylist?.id === id) setActivePlaylist(null);
    setDeleteConfirmId(null);
    toast.success(`"${pl?.name}" deleted`);
  };

  const handleRemoveFromPlaylist = (playlistId: string, contentId: string) => {
    setPlaylists(prev => prev.map(p =>
      p.id === playlistId ? { ...p, items: p.items.filter(i => i !== contentId), updatedAt: 'Jun 12, 2026' } : p
    ));
    setActivePlaylist(prev => prev ? { ...prev, items: prev.items.filter(i => i !== contentId) } : null);
    toast.success('Removed from playlist');
  };

  const handleAddToPlaylist = (playlistId: string, contentId: string) => {
    const pl = playlists.find(p => p.id === playlistId);
    if (pl?.items.includes(contentId)) { toast.error('Already in this playlist'); return; }
    setPlaylists(prev => prev.map(p =>
      p.id === playlistId ? { ...p, items: [...p.items, contentId], updatedAt: 'Jun 12, 2026' } : p
    ));
    setActivePlaylist(prev => prev ? { ...prev, items: [...prev.items, contentId] } : null);
    const content = allContent.find(c => c.id === contentId);
    toast.success(`"${content?.title}" added`);
    setAddContentOpen(false);
    setAddSearchQuery('');
  };

  const getPlaylistCover = (playlist: Playlist) => {
    const firstItem = allContent.find(c => c.id === playlist.items[0]);
    return firstItem?.poster ?? null;
  };

  const filteredAddContent = allContent.filter(c =>
    c.title.toLowerCase().includes(addSearchQuery.toLowerCase()) &&
    !activePlaylist?.items.includes(c.id)
  ).slice(0, 10);

  const totalTitles = playlists.reduce((acc, p) => acc + p.items.length, 0);

  return (
    <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 py-6 sm:py-8">
      {activePlaylist ? (
        <PlaylistDetailView
          playlist={activePlaylist}
          onBack={() => setActivePlaylist(null)}
          onEdit={() => setEditingPlaylist(activePlaylist)}
          onDelete={() => setDeleteConfirmId(activePlaylist.id)}
          onRemoveItem={contentId => handleRemoveFromPlaylist(activePlaylist.id, contentId)}
          onViewContent={setSelectedContent}
          onAddContent={() => setAddContentOpen(true)}
        />
      ) : (
        <>
          {/* ── Header ── */}
          <div className="flex items-start justify-between gap-4 mb-6 sm:mb-8">
            <div>
              <div className="flex items-center gap-2.5">
                <ListVideo size={20} className="text-primary" />
                <h1 className="text-xl sm:text-2xl font-bold text-foreground">My Playlists</h1>
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                {playlists.length} playlists · {totalTitles} titles
              </p>
            </div>
            <button
              onClick={() => setCreateModalOpen(true)}
              className="flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 bg-primary text-primary-foreground rounded-xl text-xs sm:text-sm font-semibold hover:bg-amber-400 transition-all active:scale-95 cursor-pointer shrink-0"
            >
              <Plus size={15} />
              <span className="hidden xs:inline">New Playlist</span>
              <span className="xs:hidden">New</span>
            </button>
          </div>

          {playlists.length === 0 ? (
            <div className="text-center py-16 sm:py-24 border border-dashed border-border rounded-2xl">
              <ListVideo size={40} className="text-muted-foreground/30 mx-auto mb-3" />
              <p className="text-sm sm:text-base font-semibold text-foreground mb-2">No playlists yet</p>
              <p className="text-xs sm:text-sm text-muted-foreground mb-6 max-w-xs mx-auto leading-relaxed px-4">
                Create your first playlist to organise movies and series into themed collections.
              </p>
              <button
                onClick={() => setCreateModalOpen(true)}
                className="cursor-pointer px-5 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-semibold hover:bg-amber-400 transition-all active:scale-95"
              >
                Create First Playlist
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
              {playlists.map(playlist => (
                <PlaylistCard
                  key={playlist.id}
                  playlist={playlist}
                  coverImage={getPlaylistCover(playlist)}
                  onOpen={() => setActivePlaylist(playlist)}
                  onEdit={() => setEditingPlaylist(playlist)}
                  onDelete={() => setDeleteConfirmId(playlist.id)}
                />
              ))}

              {/* New playlist card — always last */}
              <button
                onClick={() => setCreateModalOpen(true)}
                className="cursor-pointer group flex flex-col items-center justify-center gap-3 h-56 sm:h-64 bg-secondary/40 border-2 border-dashed border-border rounded-2xl hover:border-primary/50 hover:bg-primary/5 transition-all duration-200"
              >
                <div className="w-11 h-11 rounded-full bg-secondary flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <Plus size={20} className="text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
                <p className="text-sm font-medium text-muted-foreground group-hover:text-primary transition-colors">
                  New Playlist
                </p>
              </button>
            </div>
          )}
        </>
      )}

      {/* ── Create / Edit modal ── */}
      {(createModalOpen || editingPlaylist) && (
        <PlaylistFormModal
          playlist={editingPlaylist}
          onClose={() => { setCreateModalOpen(false); setEditingPlaylist(null); }}
          onSubmit={(name, description) => {
            if (editingPlaylist) handleRenamePlaylist(editingPlaylist.id, name, description);
            else handleCreatePlaylist(name, description);
            setCreateModalOpen(false);
            setEditingPlaylist(null);
          }}
        />
      )}

      {/* ── Delete confirm ── */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-5" onClick={() => setDeleteConfirmId(null)}>
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
          <div className="relative bg-card border border-border rounded-2xl p-6 w-full max-w-sm fade-in" onClick={e => e.stopPropagation()}>
            <div className="w-10 h-10 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-4">
              <Trash2 size={18} className="text-red-400" />
            </div>
            <h3 className="text-base font-bold text-center mb-1">Delete Playlist?</h3>
            <p className="text-sm text-muted-foreground text-center mb-5 leading-relaxed">
              &quot;{playlists.find(p => p.id === deleteConfirmId)?.name}&quot; will be permanently deleted.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="cursor-pointer flex-1 py-2.5 rounded-xl border border-border text-sm font-medium hover:bg-secondary transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeletePlaylist(deleteConfirmId)}
                className="cursor-pointer flex-1 py-2.5 rounded-xl bg-red-500 text-white text-sm font-semibold hover:bg-red-600 active:scale-95 transition-all"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Add content modal ── */}
      {addContentOpen && activePlaylist && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4"
          onClick={() => { setAddContentOpen(false); setAddSearchQuery(''); }}
        >
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
          <div
            className="relative bg-card border-border flex flex-col w-full sm:max-w-lg sm:rounded-2xl sm:border fade-in rounded-t-2xl border-t border-x h-[70dvh] sm:h-[520px]"
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-border shrink-0">
              <div>
                <h3 className="text-sm font-semibold">Add to playlist</h3>
                <p className="text-xs text-muted-foreground mt-0.5 truncate max-w-[220px]">{activePlaylist.name}</p>
              </div>
              <button
                onClick={() => { setAddContentOpen(false); setAddSearchQuery(''); }}
                className="cursor-pointer p-1.5 rounded-lg hover:bg-secondary text-muted-foreground transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            {/* Search */}
            <div className="px-4 py-3 border-b border-border shrink-0">
              <div className="flex items-center gap-2 bg-secondary rounded-xl px-3 py-2.5">
                <Search size={14} className="text-muted-foreground shrink-0" />
                <input
                  type="text"
                  value={addSearchQuery}
                  onChange={e => setAddSearchQuery(e.target.value)}
                  placeholder="Search titles..."
                  className="flex-1 bg-transparent text-sm text-foreground placeholder-muted-foreground focus:outline-none"
                  autoFocus
                />
                {addSearchQuery && (
                  <button onClick={() => setAddSearchQuery('')} className="cursor-pointer text-muted-foreground hover:text-foreground transition-colors">
                    <X size={13} />
                  </button>
                )}
              </div>
            </div>

            {/* Results */}
            <div className="flex-1 overflow-y-auto overscroll-contain">
              {filteredAddContent.length === 0 ? (
                <div className="py-12 text-center px-4">
                  <p className="text-sm text-muted-foreground">
                    {addSearchQuery ? `No results for "${addSearchQuery}"` : 'All titles already added'}
                  </p>
                </div>
              ) : (
                filteredAddContent.map(content => (
                  <button
                    key={`add-${content.id}`}
                    onClick={() => handleAddToPlaylist(activePlaylist.id, content.id)}
                    className="cursor-pointer w-full flex items-center gap-3 px-4 sm:px-5 py-3 hover:bg-secondary transition-colors text-left"
                  >
                    <div className="w-9 h-12 rounded-lg overflow-hidden shrink-0 bg-secondary">
                      <img src={content.poster} alt={content.title} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-foreground truncate">{content.title}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{content.year} · {content.genre[0]}</p>
                    </div>
                    <span className={[
                      'text-[10px] font-medium px-2 py-0.5 rounded-full border shrink-0',
                      content.type === 'Movie'
                        ? 'border-border text-muted-foreground'
                        : 'border-blue-500/40 text-blue-400',
                    ].join(' ')}>
                      {content.type}
                    </span>
                  </button>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── Movie detail modal ── */}
      {selectedContent && (
        <MovieDetailModal
          content={selectedContent}
          onClose={() => setSelectedContent(null)}
        />
      )}
    </div>
  );
}

/* ─── PlaylistCard ──────────────────────────────────────────────────────────── */
interface PlaylistCardProps {
  playlist: Playlist;
  coverImage: string | null;
  onOpen: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

function PlaylistCard({ playlist, coverImage, onOpen, onEdit, onDelete }: PlaylistCardProps) {
  const itemPreviews = playlist.items
    .slice(0, 4)
    .map(id => allContent.find(c => c.id === id))
    .filter(Boolean) as ContentItem[];

  return (
    <div className="group bg-card border border-border rounded-2xl overflow-hidden hover:border-muted transition-all duration-200">
      {/* Cover */}
      <div
        className="relative h-44 sm:h-48 cursor-pointer overflow-hidden bg-secondary"
        onClick={onOpen}
        role="button"
        tabIndex={0}
        onKeyDown={e => { if (e.key === 'Enter') onOpen(); }}
        aria-label={`Open ${playlist.name}`}
      >
        {playlist.items.length === 0 ? (
          <div className="w-full h-full flex items-center justify-center">
            <ListVideo size={36} className="text-muted-foreground/30" />
          </div>
        ) : itemPreviews.length === 1 ? (
          <img
            src={itemPreviews[0].poster}
            alt={playlist.name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="grid grid-cols-2 h-full gap-0.5">
            {Array.from({ length: 4 }).map((_, idx) => {
              const item = itemPreviews[idx];
              return item ? (
                <div key={`cover-${playlist.id}-${item.id}`} className="overflow-hidden">
                  <img
                    src={item.poster}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
              ) : (
                <div key={`cover-${playlist.id}-empty-${idx}`} className="bg-secondary/60 flex items-center justify-center">
                  <ListVideo size={16} className="text-muted-foreground/20" />
                </div>
              );
            })}
          </div>
        )}

        {/* Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        {/* Count badge */}
        <div className="absolute top-2.5 right-2.5">
          <span className="text-[10px] font-bold px-2 py-1 bg-black/60 backdrop-blur-sm text-white rounded-full border border-white/10 tabular-nums">
            {playlist.items.length} {playlist.items.length === 1 ? 'title' : 'titles'}
          </span>
        </div>

        {/* Hover arrow */}
        <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-200 translate-x-1 group-hover:translate-x-0">
          <div className="p-2 bg-primary rounded-full shadow-lg">
            <ChevronRight size={13} className="text-primary-foreground" />
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="p-3.5">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0 cursor-pointer" onClick={onOpen}>
            <h3 className="text-sm font-semibold text-foreground leading-tight truncate hover:text-primary transition-colors">
              {playlist.name}
            </h3>
            {playlist.description && (
              <p className="text-xs text-muted-foreground mt-1 line-clamp-1 leading-relaxed">
                {playlist.description}
              </p>
            )}
          </div>
          {/* Edit / delete — always visible on mobile, hover on desktop */}
          <div className="flex gap-1 shrink-0 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
            <button
              onClick={e => { e.stopPropagation(); onEdit(); }}
              className="cursor-pointer p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
              aria-label="Edit playlist"
            >
              <Pencil size={13} />
            </button>
            <button
              onClick={e => { e.stopPropagation(); onDelete(); }}
              className="cursor-pointer p-1.5 rounded-lg text-muted-foreground hover:text-red-400 hover:bg-red-400/10 transition-colors"
              aria-label="Delete playlist"
            >
              <Trash2 size={13} />
            </button>
          </div>
        </div>
        <p className="text-[10px] text-muted-foreground/50 mt-2 tabular-nums">Updated {playlist.updatedAt}</p>
      </div>
    </div>
  );
}

/* ─── PlaylistDetailView ────────────────────────────────────────────────────── */
interface PlaylistDetailViewProps {
  playlist: Playlist;
  onBack: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onRemoveItem: (contentId: string) => void;
  onViewContent: (content: ContentItem) => void;
  onAddContent: () => void;
}

function PlaylistDetailView({ playlist, onBack, onEdit, onDelete, onRemoveItem, onViewContent, onAddContent }: PlaylistDetailViewProps) {
  const items = playlist.items.map(id => allContent.find(c => c.id === id)).filter(Boolean) as ContentItem[];

  return (
    <div className="slide-up">
      {/* Back */}
      <button
        onClick={onBack}
        className="cursor-pointer flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
      >
        <ArrowLeft size={15} />
        All Playlists
      </button>

      {/* Playlist header */}
      <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6 mb-7">
        {/* Cover collage */}
        <div className="shrink-0 w-24 h-24 sm:w-32 sm:h-32 rounded-2xl overflow-hidden bg-secondary border border-border">
          {items.length === 0 ? (
            <div className="w-full h-full flex items-center justify-center">
              <ListVideo size={28} className="text-muted-foreground/30" />
            </div>
          ) : items.length === 1 ? (
            <img src={items[0].poster} alt={playlist.name} className="w-full h-full object-cover" />
          ) : (
            <div className="grid grid-cols-2 h-full gap-0.5">
              {Array.from({ length: 4 }).map((_, idx) => {
                const item = items[idx];
                return item ? (
                  <div key={`detail-cover-${item.id}`} className="overflow-hidden">
                    <img src={item.poster} alt={item.title} className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <div key={`detail-cover-empty-${idx}`} className="bg-secondary/60 flex items-center justify-center">
                    <ListVideo size={14} className="text-muted-foreground/20" />
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0 w-full">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h2 className="text-xl sm:text-2xl font-bold text-foreground leading-tight">{playlist.name}</h2>
              {playlist.description && (
                <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{playlist.description}</p>
              )}
              <div className="flex items-center gap-2 mt-2.5 text-xs text-muted-foreground">
                <span className="text-foreground font-semibold tabular-nums">{items.length}</span> titles
                <span className="opacity-40">·</span>
                Updated {playlist.updatedAt}
              </div>
            </div>
            <div className="flex gap-2 shrink-0">
              <button
                onClick={onEdit}
                className="cursor-pointer flex items-center gap-1.5 px-3 py-2 rounded-xl border border-border text-xs sm:text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary transition-all"
              >
                <Pencil size={13} />
                <span className="hidden xs:inline">Edit</span>
              </button>
              <button
                onClick={onDelete}
                className="cursor-pointer flex items-center gap-1.5 px-3 py-2 rounded-xl border border-red-500/30 text-xs sm:text-sm font-medium text-red-400 hover:bg-red-500/10 transition-all"
              >
                <Trash2 size={13} />
                <span className="hidden xs:inline">Delete</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Titles bar */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-foreground">
          Titles{' '}
          <span className="text-muted-foreground font-normal tabular-nums">({items.length})</span>
        </h3>
        <button
          onClick={onAddContent}
          className="cursor-pointer flex items-center gap-1.5 px-3.5 py-2 bg-primary/10 border border-primary/30 text-primary rounded-xl text-xs sm:text-sm font-medium hover:bg-primary/20 transition-all active:scale-95"
        >
          <Plus size={14} />
          Add Titles
        </button>
      </div>

      {/* Items */}
      {items.length === 0 ? (
        <div className="text-center py-16 sm:py-20 border border-dashed border-border rounded-2xl">
          <Film size={36} className="text-muted-foreground/30 mx-auto mb-3" />
          <p className="text-sm font-semibold text-foreground mb-2">Playlist is empty</p>
          <p className="text-xs sm:text-sm text-muted-foreground mb-5 max-w-xs mx-auto px-4 leading-relaxed">
            Add movies and series to start building this collection.
          </p>
          <button
            onClick={onAddContent}
            className="cursor-pointer px-5 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-semibold hover:bg-amber-400 transition-all active:scale-95"
          >
            Add First Title
          </button>
        </div>
      ) : (
        <div className="space-y-2.5">
          {items.map((content, index) => (
            <PlaylistItemRow
              key={`pl-item-${playlist.id}-${content.id}`}
              content={content}
              index={index}
              onView={() => onViewContent(content)}
              onRemove={() => onRemoveItem(content.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── PlaylistItemRow ───────────────────────────────────────────────────────── */
interface PlaylistItemRowProps {
  content: ContentItem;
  index: number;
  onView: () => void;
  onRemove: () => void;
}

function PlaylistItemRow({ content, index, onView, onRemove }: PlaylistItemRowProps) {
  return (
    <div className="group flex items-center gap-3 p-3 bg-card border border-border rounded-xl hover:border-muted transition-all duration-150">
      {/* Drag handle + index */}
      <div className="flex items-center gap-2 shrink-0">
        <GripVertical size={15} className="text-muted-foreground/30 cursor-grab hidden sm:block" />
        <span className="text-xs font-mono text-muted-foreground/50 w-4 text-center tabular-nums">{index + 1}</span>
      </div>

      {/* Poster */}
      <div
        className="w-9 h-12 sm:w-10 sm:h-14 rounded-lg overflow-hidden bg-secondary shrink-0 cursor-pointer"
        onClick={onView}
        role="button"
        tabIndex={0}
        onKeyDown={e => { if (e.key === 'Enter') onView(); }}
        aria-label={`View ${content.title}`}
      >
        <img src={content.poster} alt={content.title} className="w-full h-full object-cover" />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0 cursor-pointer" onClick={onView} role="button" tabIndex={-1}>
        <p className="text-sm font-semibold text-foreground truncate hover:text-primary transition-colors">
          {content.title}
        </p>
        <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
          <span className="text-[11px] text-muted-foreground tabular-nums">{content.year}</span>
          <span className="text-muted-foreground/40">·</span>
          <span className="text-[11px] text-muted-foreground">{content.genre[0]}</span>
          <span className="text-muted-foreground/40">·</span>
          <span className={`text-[11px] flex items-center gap-0.5 ${content.type === 'Movie' ? 'text-muted-foreground' : 'text-blue-400'}`}>
            {content.type === 'Movie' ? <Film size={9} /> : <Tv size={9} />}
            {content.type}
          </span>
        </div>
      </div>

      {/* Runtime + remove */}
      <div className="flex items-center gap-2 shrink-0">
        <span className="text-xs text-muted-foreground/50 hidden sm:block tabular-nums">{content.runtime}</span>
        <button
          onClick={onRemove}
          aria-label={`Remove ${content.title}`}
          className="cursor-pointer p-1.5 rounded-lg text-muted-foreground hover:text-red-400 hover:bg-red-400/10 transition-colors"
        >
          <X size={13} />
        </button>
      </div>
    </div>
  );
}

/* ─── PlaylistFormModal ─────────────────────────────────────────────────────── */
interface PlaylistFormModalProps {
  playlist: Playlist | null;
  onClose: () => void;
  onSubmit: (name: string, description: string) => void;
}

function PlaylistFormModal({ playlist, onClose, onSubmit }: PlaylistFormModalProps) {
  const [name, setName]               = useState(playlist?.name ?? '');
  const [description, setDescription] = useState(playlist?.description ?? '');
  const [loading, setLoading]         = useState(false);
  const [nameError, setNameError]     = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setTimeout(() => inputRef.current?.focus(), 50);
  }, []);

  const handleSubmit = async () => {
    if (!name.trim()) { setNameError('Playlist name is required'); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 500));
    setLoading(false);
    onSubmit(name.trim(), description.trim());
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      <div
        className="relative bg-card border-border w-full sm:max-w-sm sm:rounded-2xl sm:border fade-in rounded-t-2xl border-t border-x p-5 sm:p-6"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-base font-semibold">
            {playlist ? 'Edit Playlist' : 'New Playlist'}
          </h3>
          <button onClick={onClose} className="cursor-pointer p-1.5 rounded-lg hover:bg-secondary text-muted-foreground transition-colors">
            <X size={16} />
          </button>
        </div>

        <div className="space-y-4">
          {/* Name */}
          <div>
            <label className="block text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mb-1.5">
              Name <span className="text-red-400">*</span>
            </label>
            <input
              ref={inputRef}
              type="text"
              value={name}
              onChange={e => { setName(e.target.value); setNameError(''); }}
              placeholder="e.g. Nolan Universe, Rainy Night Picks…"
              className={[
                'w-full bg-secondary border rounded-xl px-3 py-2.5 text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition-colors',
                nameError ? 'border-red-500/50' : 'border-border focus:border-primary/60',
              ].join(' ')}
            />
            {nameError && <p className="text-xs text-red-400 mt-1">{nameError}</p>}
          </div>

          {/* Description */}
          <div>
            <label className="block text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mb-1.5">
              Description <span className="text-muted-foreground/50 normal-case tracking-normal font-normal">· optional</span>
            </label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="What's the vibe of this playlist?"
              rows={3}
              className="w-full bg-secondary border border-border rounded-xl px-3 py-2.5 text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/60 resize-none transition-colors"
            />
          </div>

          {/* Actions */}
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
              {loading
                ? <span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                : <Check size={14} />
              }
              {loading ? 'Saving…' : playlist ? 'Save Changes' : 'Create'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}