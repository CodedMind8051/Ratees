import  { useState } from 'react';
import {
  ListVideo, Plus, Pencil, Trash2, ChevronRight,
  ArrowLeft, Film, Tv, X, Check, GripVertical, Search
} from 'lucide-react';
import { toast } from 'sonner';
import { mockPlaylists, allContent, Playlist, ContentItem } from '@/data/mockData';
import MovieDetailModal from '@/components/MovieDetailModal';

export default function PlaylistsContent() {
  const [playlists, setPlaylists] = useState<Playlist[]>(mockPlaylists);
  const [activePlaylist, setActivePlaylist] = useState<Playlist | null>(null);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editingPlaylist, setEditingPlaylist] = useState<Playlist | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [selectedContent, setSelectedContent] = useState<ContentItem | null>(null);
  const [addContentOpen, setAddContentOpen] = useState(false);
  const [addSearchQuery, setAddSearchQuery] = useState('');

  const handleCreatePlaylist = (name: string, description: string) => {
    // BACKEND: POST /api/playlists { name, description }
    const newPlaylist: Playlist = {
      id: `playlist-new-${Date.now()}`,
      name,
      description,
      items: [],
      createdAt: 'Jun 12, 2026',
      updatedAt: 'Jun 12, 2026',
    };
    setPlaylists(prev => [newPlaylist, ...prev]);
    toast.success(`Playlist "${name}" created`);
  };

  const handleRenamePlaylist = (id: string, name: string, description: string) => {
    // BACKEND: PATCH /api/playlists/:id { name, description }
    setPlaylists(prev => prev.map(p => p.id === id ? { ...p, name, description, updatedAt: 'Jun 12, 2026' } : p));
    if (activePlaylist?.id === id) {
      setActivePlaylist(prev => prev ? { ...prev, name, description } : null);
    }
    toast.success('Playlist updated');
  };

  const handleDeletePlaylist = (id: string) => {
    // BACKEND: DELETE /api/playlists/:id
    const pl = playlists.find(p => p.id === id);
    setPlaylists(prev => prev.filter(p => p.id !== id));
    if (activePlaylist?.id === id) setActivePlaylist(null);
    setDeleteConfirmId(null);
    toast.success(`"${pl?.name}" deleted`);
  };

  const handleRemoveFromPlaylist = (playlistId: string, contentId: string) => {
    // BACKEND: DELETE /api/playlists/:playlistId/items/:contentId
    setPlaylists(prev => prev.map(p =>
      p.id === playlistId ? { ...p, items: p.items.filter(i => i !== contentId), updatedAt: 'Jun 12, 2026' } : p
    ));
    setActivePlaylist(prev => prev ? { ...prev, items: prev.items.filter(i => i !== contentId) } : null);
    toast.success('Removed from playlist');
  };

  const handleAddToPlaylist = (playlistId: string, contentId: string) => {
    // BACKEND: POST /api/playlists/:playlistId/items { contentId }
    const pl = playlists.find(p => p.id === playlistId);
    if (pl?.items.includes(contentId)) {
      toast.error('Already in this playlist');
      return;
    }
    setPlaylists(prev => prev.map(p =>
      p.id === playlistId ? { ...p, items: [...p.items, contentId], updatedAt: 'Jun 12, 2026' } : p
    ));
    setActivePlaylist(prev => prev ? { ...prev, items: [...prev.items, contentId] } : null);
    const content = allContent.find(c => c.id === contentId);
    toast.success(`"${content?.title}" added to playlist`);
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

  return (
    <div className="max-w-screen-2xl mx-auto px-4 lg:px-8 xl:px-10 2xl:px-16 py-8">
      {activePlaylist ? (
        /* Playlist Detail View */
        <PlaylistDetailView
          playlist={activePlaylist}
          onBack={() => setActivePlaylist(null)}
          onEdit={() => setEditingPlaylist(activePlaylist)}
          onDelete={() => setDeleteConfirmId(activePlaylist.id)}
          onRemoveItem={(contentId) => handleRemoveFromPlaylist(activePlaylist.id, contentId)}
          onViewContent={setSelectedContent}
          onAddContent={() => setAddContentOpen(true)}
        />
      ) : (
        /* Playlists Grid */
        <>
          <div className="flex items-center justify-between mb-8">
            <div>
              <div className="flex items-center gap-3">
                <ListVideo size={24} className="text-primary" />
                <h1 className="text-2xl font-bold text-foreground">My Playlists</h1>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                {playlists.length} playlists · {playlists.reduce((acc, p) => acc + p.items.length, 0)} total titles
              </p>
            </div>
            <button
              onClick={() => setCreateModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-semibold hover:bg-amber-400 transition-all active:scale-95"
            >
              <Plus size={16} />
              New Playlist
            </button>
          </div>

          {playlists.length === 0 ? (
            <div className="text-center py-24 border border-dashed border-border rounded-2xl">
              <ListVideo size={44} className="text-muted-foreground mx-auto mb-4" />
              <p className="text-lg font-semibold text-foreground mb-2">No playlists yet</p>
              <p className="text-sm text-muted-foreground mb-6 max-w-sm mx-auto">
                Create your first playlist to organize movies and series into themed collections.
              </p>
              <button
                onClick={() => setCreateModalOpen(true)}
                className="px-5 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-semibold hover:bg-amber-400 transition-all"
              >
                Create First Playlist
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 gap-5">
              {/* Create new card */}
              <button
                onClick={() => setCreateModalOpen(true)}
                className="group flex flex-col items-center justify-center gap-3 h-64 bg-secondary/50 border-2 border-dashed border-border rounded-2xl hover:border-primary/50 hover:bg-primary/5 transition-all duration-200"
              >
                <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <Plus size={22} className="text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
                <p className="text-sm font-medium text-muted-foreground group-hover:text-primary transition-colors">Create New Playlist</p>
              </button>

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
            </div>
          )}
        </>
      )}

      {/* Create/Edit Playlist Modal */}
      {(createModalOpen || editingPlaylist) && (
        <PlaylistFormModal
          playlist={editingPlaylist}
          onClose={() => { setCreateModalOpen(false); setEditingPlaylist(null); }}
          onSubmit={(name, description) => {
            if (editingPlaylist) {
              handleRenamePlaylist(editingPlaylist.id, name, description);
            } else {
              handleCreatePlaylist(name, description);
            }
            setCreateModalOpen(false);
            setEditingPlaylist(null);
          }}
        />
      )}

      {/* Delete Confirm */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setDeleteConfirmId(null)}>
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
          <div className="relative bg-card border border-border rounded-2xl p-6 w-full max-w-sm fade-in" onClick={e => e.stopPropagation()}>
            <h3 className="text-base font-semibold mb-2">Delete Playlist?</h3>
            <p className="text-sm text-muted-foreground mb-5">
              &quot;{playlists.find(p => p.id === deleteConfirmId)?.name}&quot; will be permanently deleted. This cannot be undone.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteConfirmId(null)} className="flex-1 py-2.5 rounded-lg border border-border text-sm font-medium hover:bg-secondary transition-colors">Cancel</button>
              <button
                onClick={() => handleDeletePlaylist(deleteConfirmId)}
                className="flex-1 py-2.5 rounded-lg bg-accent text-white text-sm font-semibold hover:bg-red-600 transition-colors"
              >
                Delete Playlist
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Content to Playlist Modal */}
      {addContentOpen && activePlaylist && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => { setAddContentOpen(false); setAddSearchQuery(''); }}>
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
          <div className="relative bg-card border border-border rounded-2xl w-full max-w-lg fade-in overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between px-5 py-4 border-b border-border">
              <h3 className="text-base font-semibold">Add to &quot;{activePlaylist.name}&quot;</h3>
              <button onClick={() => { setAddContentOpen(false); setAddSearchQuery(''); }} className="p-1.5 rounded-lg hover:bg-secondary text-muted-foreground">
                <X size={16} />
              </button>
            </div>
            <div className="px-5 py-3 border-b border-border">
              <div className="flex items-center gap-2 bg-secondary rounded-lg px-3 py-2">
                <Search size={15} className="text-muted-foreground" />
                <input
                  type="text"
                  value={addSearchQuery}
                  onChange={e => setAddSearchQuery(e.target.value)}
                  placeholder="Search titles to add..."
                  className="flex-1 bg-transparent text-sm text-foreground placeholder-muted-foreground focus:outline-none"
                  autoFocus
                />
              </div>
            </div>
            <div className="max-h-80 overflow-y-auto py-2">
              {filteredAddContent.length === 0 ? (
                <div className="py-10 text-center">
                  <p className="text-sm text-muted-foreground">
                    {addSearchQuery ? `No results for "${addSearchQuery}"` : 'All titles already added'}
                  </p>
                </div>
              ) : (
                filteredAddContent.map(content => (
                  <button
                    key={`add-content-${content.id}`}
                    onClick={() => handleAddToPlaylist(activePlaylist.id, content.id)}
                    className="w-full flex items-center gap-4 px-5 py-3 hover:bg-secondary transition-colors text-left"
                  >
                    <div className="w-10 h-14 rounded-md overflow-hidden shrink-0 bg-secondary">
                      <img src={content.poster} alt={`${content.title} poster`} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-foreground truncate">{content.title}</p>
                      <p className="text-xs text-muted-foreground">{content.year} · {content.genre[0]}</p>
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded-full border shrink-0 ${
                      content.type === 'Movie' ? 'border-border text-muted-foreground' : 'border-blue-500/40 text-blue-400'
                    }`}>
                      {content.type}
                    </span>
                  </button>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Movie Detail Modal */}
      {selectedContent && (
        <MovieDetailModal
          content={selectedContent}
          onClose={() => setSelectedContent(null)}
        />
      )}
    </div>
  );
}

/* ─── Playlist Card ─── */
interface PlaylistCardProps {
  playlist: Playlist;
  coverImage: string | null;
  onOpen: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

function PlaylistCard({ playlist, coverImage, onOpen, onEdit, onDelete }: PlaylistCardProps) {
  const itemPreviews = playlist.items.slice(0, 4).map(id => allContent.find(c => c.id === id)).filter(Boolean) as ContentItem[];

  return (
    <div className="group bg-card border border-border rounded-2xl overflow-hidden hover:border-muted transition-all duration-200 card-hover">
      {/* Cover */}
      <div
        className="relative h-44 cursor-pointer overflow-hidden bg-secondary"
        onClick={onOpen}
        role="button"
        tabIndex={0}
        onKeyDown={e => { if (e.key === 'Enter') onOpen(); }}
        aria-label={`Open ${playlist.name} playlist`}
      >
        {playlist.items.length === 0 ? (
          <div className="w-full h-full flex items-center justify-center">
            <ListVideo size={40} className="text-muted-foreground/40" />
          </div>
        ) : itemPreviews.length === 1 ? (
          <img src={itemPreviews[0].poster} alt={`${playlist.name} cover`} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
        ) : (
          <div className="grid grid-cols-2 h-full gap-0.5">
            {itemPreviews.slice(0, 4).map((item, idx) => (
              <div key={`cover-${playlist.id}-${item.id}`} className="overflow-hidden">
                <img src={item.poster} alt={item.title} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
              </div>
            ))}
          </div>
        )}
        <div className="absolute inset-0 gradient-overlay" />

        {/* Item count badge */}
        <div className="absolute top-3 right-3">
          <span className="text-xs font-bold px-2 py-1 bg-black/60 text-white rounded-full border border-white/10">
            {playlist.items.length} {playlist.items.length === 1 ? 'title' : 'titles'}
          </span>
        </div>

        {/* Hover: open arrow */}
        <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="p-2 bg-primary rounded-full">
            <ChevronRight size={14} className="text-primary-foreground" />
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-semibold text-foreground leading-tight truncate">{playlist.name}</h3>
            {playlist.description && (
              <p className="text-xs text-muted-foreground mt-1 line-clamp-2 leading-relaxed">{playlist.description}</p>
            )}
          </div>
          <div className="flex gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={e => { e.stopPropagation(); onEdit(); }}
              className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
              title="Edit playlist"
            >
              <Pencil size={13} />
            </button>
            <button
              onClick={e => { e.stopPropagation(); onDelete(); }}
              className="p-1.5 rounded-lg text-muted-foreground hover:text-accent hover:bg-accent/10 transition-colors"
              title="Delete playlist"
            >
              <Trash2 size={13} />
            </button>
          </div>
        </div>
        <p className="text-xs text-muted-foreground mt-2">Updated {playlist.updatedAt}</p>
      </div>
    </div>
  );
}

/* ─── Playlist Detail View ─── */
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
      {/* Back header */}
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft size={16} />
          All Playlists
        </button>
      </div>

      {/* Playlist header */}
      <div className="flex items-start gap-6 mb-8">
        {/* Cover collage */}
        <div className="shrink-0 w-32 h-32 rounded-2xl overflow-hidden bg-secondary border border-border">
          {items.length === 0 ? (
            <div className="w-full h-full flex items-center justify-center">
              <ListVideo size={32} className="text-muted-foreground/40" />
            </div>
          ) : items.length === 1 ? (
            <img src={items[0].poster} alt={`${playlist.name} cover`} className="w-full h-full object-cover" />
          ) : (
            <div className="grid grid-cols-2 h-full gap-0.5">
              {items.slice(0, 4).map(item => (
                <div key={`detail-cover-${item.id}`} className="overflow-hidden">
                  <img src={item.poster} alt={item.title} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-foreground">{playlist.name}</h2>
              {playlist.description && (
                <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{playlist.description}</p>
              )}
              <div className="flex items-center gap-3 mt-3">
                <span className="text-sm text-muted-foreground">
                  <span className="text-foreground font-semibold">{items.length}</span> titles
                </span>
                <span className="text-muted-foreground">·</span>
                <span className="text-sm text-muted-foreground">Updated {playlist.updatedAt}</span>
              </div>
            </div>
            <div className="flex gap-2 shrink-0">
              <button
                onClick={onEdit}
                className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary transition-all"
              >
                <Pencil size={14} />
                Edit
              </button>
              <button
                onClick={onDelete}
                className="flex items-center gap-2 px-3 py-2 rounded-lg border border-accent/30 text-sm font-medium text-accent hover:bg-accent/10 transition-all"
              >
                <Trash2 size={14} />
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Add content button */}
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-base font-semibold text-foreground">
          Titles <span className="text-muted-foreground font-normal">({items.length})</span>
        </h3>
        <button
          onClick={onAddContent}
          className="flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/30 text-primary rounded-xl text-sm font-medium hover:bg-primary/20 transition-all"
        >
          <Plus size={15} />
          Add Titles
        </button>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-border rounded-2xl">
          <Film size={44} className="text-muted-foreground mx-auto mb-4" />
          <p className="text-lg font-semibold text-foreground mb-2">This playlist is empty</p>
          <p className="text-sm text-muted-foreground mb-6 max-w-sm mx-auto">
            Add movies and series to start building this collection.
          </p>
          <button
            onClick={onAddContent}
            className="px-5 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-semibold hover:bg-amber-400 transition-all"
          >
            Add First Title
          </button>
        </div>
      ) : (
        <div className="space-y-3">
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

/* ─── Playlist Item Row ─── */
interface PlaylistItemRowProps {
  content: ContentItem;
  index: number;
  onView: () => void;
  onRemove: () => void;
}

function PlaylistItemRow({ content, index, onView, onRemove }: PlaylistItemRowProps) {
  return (
    <div className="group flex items-center gap-4 p-3 bg-card border border-border rounded-xl hover:border-muted transition-all duration-150">
      <div className="flex items-center gap-3 shrink-0">
        <GripVertical size={16} className="text-muted-foreground/40 cursor-grab" />
        <span className="text-sm font-mono text-muted-foreground w-5 text-center">{index + 1}</span>
      </div>

      <div
        className="w-10 h-14 rounded-lg overflow-hidden bg-secondary shrink-0 cursor-pointer"
        onClick={onView}
        role="button"
        tabIndex={0}
        onKeyDown={e => { if (e.key === 'Enter') onView(); }}
        aria-label={`View ${content.title}`}
      >
        <img src={content.poster} alt={`${content.title} poster`} className="w-full h-full object-cover" />
      </div>

      <div className="flex-1 min-w-0 cursor-pointer" onClick={onView} role="button" tabIndex={-1}>
        <p className="text-sm font-semibold text-foreground truncate">{content.title}</p>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-xs text-muted-foreground">{content.year}</span>
          <span className="text-muted-foreground">·</span>
          <span className="text-xs text-muted-foreground">{content.genre[0]}</span>
          <span className="text-muted-foreground">·</span>
          <span className={`text-xs flex items-center gap-1 ${content.type === 'Movie' ? 'text-muted-foreground' : 'text-blue-400'}`}>
            {content.type === 'Movie' ? <Film size={10} /> : <Tv size={10} />}
            {content.type}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <span className="text-xs text-muted-foreground hidden sm:block">{content.runtime}</span>
        <button
          onClick={onRemove}
          className="p-1.5 rounded-lg text-muted-foreground hover:text-accent hover:bg-accent/10 transition-colors opacity-0 group-hover:opacity-100"
          title={`Remove ${content.title} from playlist — this cannot be undone`}
        >
          <X size={14} />
        </button>
      </div>
    </div>
  );
}

/* ─── Playlist Form Modal ─── */
interface PlaylistFormModalProps {
  playlist: Playlist | null;
  onClose: () => void;
  onSubmit: (name: string, description: string) => void;
}

function PlaylistFormModal({ playlist, onClose, onSubmit }: PlaylistFormModalProps) {
  const [name, setName] = useState(playlist?.name ?? '');
  const [description, setDescription] = useState(playlist?.description ?? '');
  const [loading, setLoading] = useState(false);
  const [nameError, setNameError] = useState('');

  const handleSubmit = async () => {
    if (!name.trim()) {
      setNameError('Playlist name is required');
      return;
    }
    setLoading(true);
    await new Promise(r => setTimeout(r, 500));
    setLoading(false);
    onSubmit(name.trim(), description.trim());
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      <div
        className="relative bg-card border border-border rounded-2xl p-6 w-full max-w-sm fade-in"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-base font-semibold">{playlist ? 'Edit Playlist' : 'Create New Playlist'}</h3>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-secondary text-muted-foreground">
            <X size={16} />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1.5 uppercase tracking-wide">
              Playlist Name <span className="text-accent">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={e => { setName(e.target.value); setNameError(''); }}
              placeholder="e.g. Nolan Universe, Rainy Night Picks..."
              className={`w-full bg-secondary border rounded-lg px-3 py-2.5 text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors ${
                nameError ? 'border-accent' : 'border-border focus:border-primary'
              }`}
            />
            {nameError && <p className="text-xs text-accent mt-1">{nameError}</p>}
          </div>

          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1.5 uppercase tracking-wide">Description</label>
            <p className="text-xs text-muted-foreground mb-1.5">Optional — describe the theme of this playlist</p>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="What's the vibe of this playlist?"
              rows={3}
              className="w-full bg-secondary border border-border rounded-lg px-3 py-2.5 text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary resize-none"
            />
          </div>

          <div className="flex gap-3 pt-1">
            <button
              onClick={onClose}
              className="flex-1 py-2.5 rounded-lg border border-border text-sm font-medium hover:bg-secondary transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="flex-1 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:bg-amber-400 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
            >
              {loading
                ? <span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                : <Check size={14} />
              }
              {loading ? 'Saving...' : playlist ? 'Save Changes' : 'Create Playlist'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}