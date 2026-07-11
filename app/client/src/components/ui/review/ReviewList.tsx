import { Star } from 'lucide-react';
import { useReviews } from '@/hooks/useReview';
import { ReviewForm } from '@/components/ui/review/ReviewForm';
import { ReviewCard, ReviewCardSkeleton } from '@/components/ui/review/ReviewCard'
import { DeleteConfirmDialog } from '@/components/ui/review/ReviewDeleteDialog';


interface ReviewListProps {
  contentId: string;
  onOpenUserProfile?: (userId: string) => void;
}

export function ReviewList({ contentId, onOpenUserProfile }: ReviewListProps) {
  const {
    reviews,
    submitting,
    deleteConfirmId,
    editingId,
    loading,
    setDeleteConfirmId,
    startEditing,
    cancelEditing,
    submitReview,
    updateReview,
    deleteReview,
  } = useReviews(contentId);

  return (
    <>
      <div className="space-y-5">
        {/* Write a review */}
        <ReviewForm onSubmit={submitReview} submitting={submitting} />

        {/* Review feed */}
        { loading ? <ReviewCardSkeleton/> : reviews.length === 0 ? (
          <div className="text-center py-10">
            <Star size={28} className="text-muted-foreground mx-auto mb-2.5" />
            <p className="text-sm text-muted-foreground">
              No reviews yet — be the first to rate this title.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {reviews.map(review => (
              <ReviewCard
                key={review?._id}
                review={review}
                isEditing={editingId === review?._id}
                onEdit={startEditing}
                onCancelEdit={cancelEditing}
                onSaveEdit={updateReview}
                onDeleteRequest={setDeleteConfirmId}
                onOpenUserProfile={onOpenUserProfile}
              />
            ))}
          </div>
        )}
      </div>

      {/* Delete confirmation — rendered at root level to escape stacking contexts */}
      <DeleteConfirmDialog
        open={deleteConfirmId !== null}
        onCancel={() => setDeleteConfirmId(null)}
        onConfirm={() => deleteConfirmId && deleteReview(deleteConfirmId)}
      />
    </>
  );
}