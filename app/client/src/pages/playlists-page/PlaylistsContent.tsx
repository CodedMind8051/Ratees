import { useState, useRef, useEffect } from 'react';
import {
  ListVideo, Plus, Trash2, X, ChevronRight,
  Lock, Globe, PlayCircle, CirclePlus, Pencil, Film, Tv
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import type { Playlist, PlaylistItem } from '@/types/playlist.type';
import type { ContentItemsType } from '@/types/content.types';
import { getPosterUrl } from '@/utils/content.utils';

// Hooks
import {
  usePlaylists,
  usePlaylistItems,
  useCreatePlaylist,
  useUpdatePlaylist,
  useDeletePlaylist,
  useAddToPlaylist,
  useRemoveFromPlaylist,
} from '@/hooks/usePlaylist';
import PlaylistFormModal from '@/components/ui/playlist/PlaylistFormModal';

// Components
import { PlaylistCard } from '@/components/ui/playlist/playlistCard';
import ContentDetailModal from '@/components/ui/content/ContentDetailModal';
import SearchOverlay from '@/components/ui/common/SearchOverlay';
import {
  PlaylistGridSkeleton,
  PlaylistDetailPageSkeleton,
  EmptyState,
  ErrorState,
} from '@/components/ui/playlist/PlaylistSkeletons';

// ============================================
// MAIN COMPONENT
// ============================================

export default function PlaylistsContent() {
  // Use the auth hook for session management
  const { user, loading: loadingSession } = useAuth();
  const userId = user?.id || null;

  // State
  const [activePlaylist, setActivePlaylist] = useState<Playlist | null>(null);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editingPlaylist, setEditingPlaylist] = useState<Playlist | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [deleteItemId, setDeleteItemId] = useState<string | null>(null);
  const [deletingItemId, setDeletingItemId] = useState<string | null>(null);
  const [selectedContent, setSelectedContent] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'detail'>('grid');
  const [addContentOpen, setAddContentOpen] = useState(false);

  // Fetch playlists
  const {
    playlists,
    loading: playlistsLoading,
    error: playlistsError,
    refetch: refetchPlaylists,
  } = usePlaylists({
    userID: userId || '',
    enabled: !!userId,
  });

  useEffect(() => {
    if (userId && refetchPlaylists) {
      refetchPlaylists();
    }
  }, [userId, refetchPlaylists]);

  // Fetch playlist items when active
  const {
    items: playlistItems,
    loading: itemsLoading,
    error: itemsError,
    refetch: refetchItems,
  } = usePlaylistItems({
    playlistId: activePlaylist?._id || '',
    enabled: !!activePlaylist?._id,
  });

  // Mutations
  const { createPlaylist, loading: creating } = useCreatePlaylist();
  const { updatePlaylist, loading: updating } = useUpdatePlaylist();
  const { deletePlaylist, loading: deleting } = useDeletePlaylist();
  const { addToPlaylist } = useAddToPlaylist();
  const { removeFromPlaylist, loading: removingItem } = useRemoveFromPlaylist();

  // Handlers
  const handleCreatePlaylist = async (name: string, description: string, isPublic: boolean) => {
    const success = await createPlaylist({ playlistName: name, description, isPublic });
    if (success) {
      setCreateModalOpen(false);
      refetchPlaylists();
    }
  };

  const handleRenamePlaylist = async (id: string, name: string, description: string, isPublic: boolean) => {
    const success = await updatePlaylist({ playlistId: id, playlistName: name, description, isPublic });
    if (success) {
      setEditingPlaylist(null);
      refetchPlaylists();
      // Refetch playlist items if viewing this playlist
      if (activePlaylist?._id === id) {
        setActivePlaylist(prev => prev ? { ...prev, playlistName: name, description, isPublic } : null);
        refetchItems();
      }
    }
  };

  const handleDeletePlaylist = async (id: string) => {
    const success = await deletePlaylist({ playlistId: id });
    if (success) {
      setDeleteConfirmId(null);
      refetchPlaylists();
      if (activePlaylist?._id === id) {
        setActivePlaylist(null);
        setViewMode('grid');
      }
    }
  };

  const handleAddContent = async (content: ContentItemsType) => {
    if (!activePlaylist?._id || !userId) return;
    const success = await addToPlaylist({
      playlistId: activePlaylist._id,
      contentId: content._id,
    });
    if (success) {
      setAddContentOpen(false);
      refetchItems();
    }
  };

  const handleRemoveItem = async (itemContentId: string) => {
    if (!activePlaylist?._id) return;
    setDeletingItemId(itemContentId);
    try {
      const success = await removeFromPlaylist({
        playlistId: activePlaylist._id,
        contentId: itemContentId,
      });
      if (success) {
        setDeleteItemId(null);
        refetchItems();
      }
    } finally {
      setDeletingItemId(null);
    }
  };

  // Helper functions


  const totalTitles = playlists.reduce((acc, p) => acc + p.totalTracks, 0);

  // Render the header - always shown
  const renderHeader = () => (
    <div className="flex items-start justify-between gap-4 mb-6 sm:mb-8">
      <div>
        <div className="flex items-center gap-2.5">
          <ListVideo size={20} className="text-primary" />
          <h1 className="text-xl sm:text-2xl font-bold text-foreground">My Playlists</h1>
        </div>
        <p className="text-xs sm:text-sm text-muted-foreground mt-1">
          {!userId
            ? 'Sign in to view your playlists'
            : playlistsLoading
              ? 'Loading...'
              : `${playlists.length} playlists · ${totalTitles} titles`}
        </p>
      </div>
      {userId && (
        <button
          onClick={() => setCreateModalOpen(true)}
          className="flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 bg-primary text-primary-foreground rounded-xl text-xs sm:text-sm font-semibold hover:bg-amber-400 transition-all active:scale-95 cursor-pointer shrink-0"
        >
          <Plus size={15} />
          <span className="hidden xs:inline">New Playlist</span>
        </button>
      )}
    </div>
  );

  // Render content based on state
  const renderContent = () => {
    // Still checking session
    if (loadingSession) {
      return <PlaylistGridSkeleton count={8} />;
    }

    // Not logged in
    if (!userId) {
      return (
        <EmptyState
          icon={<ListVideo size={24} className="text-muted-foreground" />}
          title="Sign in to view your playlists"
          description="Create and manage your personal collections of movies and shows."
          action={
            <button
              onClick={() => window.location.reload()}
              className="px-5 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-semibold hover:bg-amber-400 transition-all active:scale-95 cursor-pointer"
            >
              Refresh Page
            </button>
          }
        />
      );
    }

    // Logged in - show grid or detail view
    return viewMode === 'grid' ? (
      <PlaylistsGrid
        playlists={playlists}
        loading={playlistsLoading}
        error={playlistsError}
        onOpen={(playlist) => {
          setActivePlaylist(playlist);
          setViewMode('detail');
        }}
        onEdit={setEditingPlaylist}
        onDelete={(id) => setDeleteConfirmId(id)}
        onRetry={refetchPlaylists}
      />
    ) : (
      <PlaylistDetailView
        playlist={activePlaylist}
        items={playlistItems}
        loading={itemsLoading}
        error={itemsError}
        deletingItemId={deletingItemId}
        onBack={() => {
          setViewMode('grid');
          setActivePlaylist(null);
        }}
        onEdit={() => activePlaylist && setEditingPlaylist(activePlaylist)}
        onDelete={() => activePlaylist && setDeleteConfirmId(activePlaylist._id)}
        onSelectContent={setSelectedContent}
        onDeleteItem={setDeleteItemId}
        onRetry={refetchItems}
        onAddContent={() => setAddContentOpen(true)}
      />
    );
  };

  return (
    <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 py-6 sm:py-8">
      {/* ── HEADER ── */}
      {renderHeader()}

      {/* ── CONTENT ── */}
      {renderContent()}

      {/* ── CREATE/EDIT MODAL ── */}
      {(createModalOpen || editingPlaylist) && (
        <PlaylistFormModal
          playlist={editingPlaylist}
          loading={creating || updating}
          onClose={() => {
            setCreateModalOpen(false);
            setEditingPlaylist(null);
          }}
          onSubmit={async (name, description, isPublic) => {
            if (editingPlaylist) {
              await handleRenamePlaylist(editingPlaylist._id, name, description, isPublic);
            } else {
              await handleCreatePlaylist(name, description, isPublic);
            }
          }}
        />
      )}

      {/* ── DELETE CONFIRM MODAL ── */}
      {deleteConfirmId && (
        <DeleteConfirmModal
          playlistName={playlists.find(p => p._id === deleteConfirmId)?.playlistName || ''}
          loading={deleting}
          onClose={() => setDeleteConfirmId(null)}
          onConfirm={() => handleDeletePlaylist(deleteConfirmId)}
        />
      )}

      {/* ── DELETE ITEM CONFIRM MODAL ── */}
      {deleteItemId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-5" onClick={() => setDeleteItemId(null)}>
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
          <div
            className="relative bg-card border border-border rounded-2xl p-6 w-full max-w-sm fade-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-10 h-10 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-4">
              <Trash2 size={18} className="text-red-400" />
            </div>
            <h3 className="text-base font-bold text-center mb-1">Remove from Playlist?</h3>
            <p className="text-sm text-muted-foreground text-center mb-5 leading-relaxed">
              This item will be removed from the playlist.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteItemId(null)}
                className="cursor-pointer flex-1 py-2.5 rounded-xl border border-border text-sm font-medium hover:bg-secondary transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleRemoveItem(deleteItemId)}
                disabled={removingItem}
                className="cursor-pointer flex-1 py-2.5 rounded-xl bg-red-500 text-white text-sm font-semibold hover:bg-red-600 active:scale-95 transition-all disabled:opacity-50"
              >
                {removingItem ? 'Removing...' : 'Remove'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── CONTENT DETAIL MODAL ── */}
      {selectedContent && (
        <ContentDetailModal
          contentId={selectedContent}
          onClose={() => setSelectedContent(null)}
        />
      )}

      {/* ── ADD CONTENT MODAL ── */}
      {addContentOpen && (
        <SearchOverlay
          onClose={() => setAddContentOpen(false)}
          onSelectMovie={handleAddContent}
          onSelectMovieOnly={true}
        />
      )}
    </div>
  );
}

// ============================================
// PLAYLISTS GRID COMPONENT
// ============================================

interface PlaylistsGridProps {
  playlists: Playlist[];
  loading: boolean;
  error: Error | null;
  onOpen: (playlist: Playlist) => void;
  onEdit: (playlist: Playlist) => void;
  onDelete: (id: string) => void;
  onRetry: () => void;
}

function PlaylistsGrid({
  playlists,
  loading,
  error,
  onOpen,
  onEdit,
  onDelete,
  onRetry,
}: PlaylistsGridProps) {
  if (error) {
    return <ErrorState onRetry={onRetry} />;
  }

  if (loading) {
    return <PlaylistGridSkeleton />;
  }

  if (playlists.length === 0) {
    return (
      <EmptyState
        icon={<ListVideo size={24} className="text-muted-foreground" />}
        title="No playlists yet"
        description="Create your first playlist to organise movies and series into themed collections."
      />
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-5">
      {playlists.map((playlist) => (
        <PlaylistCard
          key={playlist._id}
          playlist={playlist}
          onOpen={() => onOpen(playlist)}
          onEdit={() => onEdit(playlist)}
          onDelete={() => onDelete(playlist._id)}
        />
      ))}
    </div>
  );
}

// ============================================
// PLAYLIST DETAIL VIEW COMPONENT
// ============================================

interface PlaylistDetailViewProps {
  playlist: Playlist | null;
  items: PlaylistItem[];
  loading: boolean;
  error: Error | null;
  deletingItemId: string | null;
  onBack: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onSelectContent: (id: string) => void;
  onDeleteItem: (id: string) => void;
  onRetry: () => void;
  onAddContent: () => void;
}

function PlaylistDetailView({
  playlist,
  items,
  loading,
  error,
  deletingItemId,
  onBack,
  onEdit,
  onDelete,
  onSelectContent,
  onDeleteItem,
  onRetry,
  onAddContent,
}: PlaylistDetailViewProps) {
  if (!playlist) return null;

  if (error) {
    return (
      <div>
        <button onClick={onBack} className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-4">
          <ChevronRight className="rotate-180" size={20} />
          Back to Playlists
        </button>
        <ErrorState onRetry={onRetry} />
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={onBack}
          className="flex items-center gap-2 hover:cursor-pointer text-muted-foreground hover:text-foreground transition-colors"
        >
          <ChevronRight className="rotate-180" size={20} />
          <span className="text-sm">Back</span>
        </button>
      </div>

      {/* Playlist Info */}
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-bold text-foreground">{playlist.playlistName}</h2>
            {playlist.isPublic ? (
              <Globe size={16} className="text-muted-foreground" />
            ) : (
              <Lock size={16} className="text-muted-foreground" />
            )}
          </div>
          {playlist.description && (
            <p className="text-sm text-muted-foreground mt-1">{playlist.description}</p>
          )}
          <p className="text-xs text-muted-foreground mt-2">
            {loading ? 'Loading...' : `${items.length} items`}
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={onAddContent}
            className="cursor-pointer flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-semibold hover:bg-amber-400 transition-colors"
          >
            <CirclePlus size={16} />
            <span className="hidden sm:inline">Add Content</span>
          </button>
          <button
            onClick={onEdit}
            className="cursor-pointer p-2 rounded-lg hover:bg-secondary text-muted-foreground transition-colors"
          >
            <Pencil size={20} />
          </button>
          <button
            onClick={onDelete}
            className="cursor-pointer p-2 rounded-lg hover:bg-secondary text-muted-foreground transition-colors"
          >
            <Trash2 size={20} />
          </button>
        </div>
      </div>

      {/* Items */}
      {loading ? (
        <PlaylistDetailPageSkeleton itemCount={10} />
      ) : items.length === 0 ? (
        <EmptyState
          icon={<PlayCircle size={24} className="text-muted-foreground" />}
          title="No items in this playlist"
          description="Add movies and shows to this playlist from the content pages."
        />
      ) : (
        <div className="space-y-1">
          {items.map((item) => (
            <div
              key={item._id}
              className="flex items-center gap-3 p-3 rounded-xl hover:bg-secondary/50 transition-colors group"
            >
              <div
                onClick={() => onSelectContent(item.contentId)}
                className="flex items-center gap-3 flex-1 min-w-0 cursor-pointer"
              >
                <div className="w-14 h-20 rounded-lg overflow-hidden shrink-0 bg-secondary">
                  {item.poster && (
                    <img
                      src={getPosterUrl(item.poster)}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground truncate">{item.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {item.release_date?.split('-')[0] || 'N/A'} · {item.genre?.[0] || 'N/A'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                {item.Content_Type === 'movie' ? (
                  <>
                    <Film size={12} className="text-primary" aria-hidden="true" />
                    <span className="text-[10px] font-medium px-2 py-0.5 rounded-full border border-border text-muted-foreground">Movie</span>
                  </>
                ) : (
                  <>
                    <Tv size={12} className="text-blue-400" aria-hidden="true" />
                    <span className="text-[10px] font-medium px-2 py-0.5 rounded-full border border-border text-muted-foreground">TV</span>
                  </>
                )}
              </div>
              {/* Delete button - always visible on mobile, hover on desktop */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteItem(item.contentId);
                }}
                disabled={deletingItemId === item.contentId}
                className="cursor-pointer p-1.5 rounded-lg text-red-400 sm:text-muted-foreground sm:hover:text-red-400 sm:hover:bg-red-400/10 transition-colors bg-red-400/10 sm:bg-transparent opacity-100 sm:opacity-0 sm:group-hover:opacity-100 disabled:opacity-50"
                aria-label="Remove from playlist"
              >
                {deletingItemId === item.contentId ? (
                  <span className="w-3.5 h-3.5 border border-red-400 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Trash2 size={14} />
                )}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ============================================
// DELETE CONFIRM MODAL
// ============================================

interface DeleteConfirmModalProps {
  playlistName: string;
  loading: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

function DeleteConfirmModal({ playlistName, loading, onClose, onConfirm }: DeleteConfirmModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-5" onClick={onClose}>
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      <div
        className="relative bg-card border border-border rounded-2xl p-6 w-full max-w-sm fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-10 h-10 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-4">
          <Trash2 size={18} className="text-red-400" />
        </div>
        <h3 className="text-base font-bold text-center mb-1">Delete Playlist?</h3>
        <p className="text-sm text-muted-foreground text-center mb-5 leading-relaxed">
          &quot;{playlistName}&quot; will be permanently deleted.
        </p>
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="cursor-pointer flex-1 py-2.5 rounded-xl border border-border text-sm font-medium hover:bg-secondary transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="cursor-pointer flex-1 py-2.5 rounded-xl bg-red-500 text-white text-sm font-semibold hover:bg-red-600 active:scale-95 transition-all disabled:opacity-50"
          >
            {loading ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
}