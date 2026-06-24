import { useState } from 'react';
import { Pencil, Trash2, Loader2, Check } from 'lucide-react';
import { Review, ReviewFormValues } from '@/types/review.types';

interface AvatarProps {
    src?: string;
    username?: string;
    size?: 'sm' | 'md';
    className?: string;
}

function Avatar({ src, username, size = 'md', className = '' }: AvatarProps) {
    const dim = size === 'sm' ? 'w-7 h-7 text-[10px]' : 'w-9 h-9 text-[11px]';
    const initials = username?.slice(0, 2).toUpperCase() ?? '??';

    if (src) {
        return (
            <img
                src={src}
                alt={username}
                referrerPolicy="no-referrer"
                crossOrigin="anonymous"
                className={`${dim} rounded-full object-cover border-[1.5px] border-primary/20 shrink-0 ${className}`}
                onError={e => {
                    const target = e.currentTarget;
                    target.style.display = 'none';
                    const fallback = target.nextElementSibling as HTMLElement;
                    if (fallback) fallback.style.display = 'flex';
                }}
            />
        );
    }

    return (
        <div className={`
            ${dim} rounded-full shrink-0
            bg-primary/10 border-[1.5px] border-primary/20
            flex items-center justify-center font-medium text-primary ${className}
        `}>
            {initials}
        </div>
    );
}


export function ReviewCardSkeleton() {
    return (
        <div className="bg-card border border-border rounded-xl p-4 animate-pulse">
            <div className="flex items-start justify-between">
                <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-full bg-secondary" />
                    <div className="space-y-2">
                        <div className="h-3 w-24 bg-secondary rounded" />
                        <div className="h-2 w-16 bg-secondary rounded" />
                    </div>
                </div>
                <div className="h-5 w-14 bg-secondary rounded-full" />
            </div>
            <div className="mt-4 space-y-2">
                <div className="h-3 w-full bg-secondary rounded" />
                <div className="h-3 w-[90%] bg-secondary rounded" />
                <div className="h-3 w-[75%] bg-secondary rounded" />
            </div>
        </div>
    );
}

interface ReviewCardProps {
    review: Review;
    isEditing: boolean;
    onEdit: (review: Review) => void;
    onCancelEdit: () => void;
    onSaveEdit: (id: string, values: ReviewFormValues) => Promise<void>;
    onDeleteRequest: (id: string) => void;
    onOpenUserProfile?: (userId: string) => void;
}

export function ReviewCard({
    review,
    isEditing,
    onEdit,
    onCancelEdit,
    onSaveEdit,
    onDeleteRequest,
    onOpenUserProfile,
}: ReviewCardProps) {
    const [editComment, setEditComment] = useState(review?.review);
    const [saving, setSaving] = useState(false);

    const handleStartEdit = () => {
        setEditComment(review?.review);
        onEdit(review);
    };

    const handleSave = async () => {
        const trimmed = editComment.trim();
        if (!trimmed) return;
        setSaving(true);
        await onSaveEdit(review?._id, { comment: trimmed });
        setSaving(false);
    };

    const handleProfileClick = () => {
        if (!review.isOwn) onOpenUserProfile?.(review.userId);
    };

    return (
        <div className={`
            group relative overflow-hidden
            bg-card border rounded-xl p-4
            transition-all duration-200 ease-out
            hover:-translate-y-0.5 hover:shadow-sm
            ${review.isOwn
                ? 'border-l-2 border-l-primary/40 border-t-border border-r-border border-b-border'
                : 'border-border hover:border-border/70'
            }
        `}>
            {review.isOwn && (
                <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.04] to-transparent pointer-events-none rounded-xl" />
            )}

            {isEditing ? (
                <div className="space-y-3">
                    <div className="flex items-center gap-2.5 pb-3 border-b border-border">
                        <Avatar src={review?.profileImage} username={review?.username} size="sm" />
                        <div>
                            <p className="text-xs font-medium text-foreground leading-none">{review?.username}</p>
                            <p className="text-[11px] text-muted-foreground mt-0.5">Editing review</p>
                        </div>
                    </div>

                    <textarea
                        value={editComment}
                        onChange={e => setEditComment(e.target.value)}
                        rows={3}
                        maxLength={1000}
                        autoFocus
                        className="
                            w-full bg-background border border-border rounded-lg
                            px-3 py-2.5 text-sm text-foreground
                            placeholder:text-muted-foreground/40
                            focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/60
                            resize-none transition-all duration-150
                        "
                    />

                    <div className="flex items-center justify-between">
                        <span className="text-[11px] text-muted-foreground">{editComment.length}/1000</span>
                        <div className="flex gap-2">
                            <button
                                type="button"
                                onClick={onCancelEdit}
                                className="
                                    px-3 py-1.5 rounded-lg border border-border
                                    text-xs font-medium text-muted-foreground
                                    hover:bg-secondary hover:text-foreground
                                    transition-all duration-150 active:scale-95
                                "
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={handleSave}
                                disabled={saving || !editComment.trim()}
                                className="
                                    flex items-center gap-1.5 px-3 py-1.5 rounded-lg
                                    bg-primary text-primary-foreground text-xs font-semibold
                                    hover:bg-amber-400 active:scale-95
                                    disabled:opacity-40 disabled:cursor-not-allowed disabled:active:scale-100
                                    transition-all duration-150
                                "
                            >
                                {saving ? <Loader2 size={12} className="animate-spin" /> : <Check size={12} />}
                                {saving ? 'Saving…' : 'Save changes'}
                            </button>
                        </div>
                    </div>
                </div>
            ) : (
                <>
                    <div className="flex items-start justify-between gap-3">
                        <button
                            type="button"
                            onClick={handleProfileClick}
                            disabled={review.isOwn}
                            className={`flex items-center gap-2.5 ${!review.isOwn ? 'cursor-pointer' : 'cursor-default'}`}
                            aria-label={!review.isOwn ? `View ${review.username}'s profile` : undefined}
                        >
                            <div className={`transition-all duration-200 shrink-0 ${!review.isOwn ? 'hover:scale-110 hover:shadow-sm' : ''}`}>
                                <Avatar src={review?.profileImage} username={review?.username} />
                            </div>
                            <div className="text-left">
                                <p className={`
                                    text-sm font-semibold text-foreground leading-snug
                                    transition-colors duration-150
                                    ${!review.isOwn ? 'group-hover:text-primary' : ''}
                                `}>
                                    {review?.username}
                                </p>
                                <p className="text-[11px] text-muted-foreground mt-0.5">
                                    {review?.createdAt.slice(0,10)}
                                </p>
                            </div>
                        </button>

                        {review.isOwn && (
                            <div className="flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-150 shrink-0">
                                <button
                                    type="button"
                                    onClick={handleStartEdit}
                                    title="Edit review"
                                    aria-label="Edit review"
                                    className="
                                        w-7 h-7 rounded-lg border border-transparent
                                        flex items-center justify-center text-muted-foreground
                                        hover:text-yellow-500 hover:bg-secondary hover:border-border
                                        active:scale-90 transition-all duration-150
                                    "
                                >
                                    <Pencil size={12} />
                                </button>
                                <button
                                    type="button"
                                    onClick={() => onDeleteRequest(review?._id)}
                                    title="Delete review"
                                    aria-label="Delete review"
                                    className="
                                        w-7 h-7 rounded-lg border border-transparent
                                        flex items-center justify-center text-muted-foreground
                                        hover:text-red-600 hover:bg-destructive/10 hover:border-destructive/20
                                        active:scale-90 transition-all duration-150
                                    "
                                >
                                    <Trash2 size={12} />
                                </button>
                            </div>
                        )}
                    </div>

                    <p className="text-sm text-muted-foreground mt-3 leading-relaxed">
                        {review?.review}
                    </p>
                </>
            )}
        </div>
    );
}