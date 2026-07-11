import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { Review, ReviewFormValues } from '@/types/review.types';
import { useMutation, useQuery } from '@apollo/client/react';
import { GET_REVIEWS } from '@/lib/graphql/query/review.query';
import { SUBMIT_REVIEWS, UPDATE_REVIEW, DELETE_REVIEW } from '@/lib/graphql/mutation/review.mutation';


interface UseReviewsReturn {
    reviews: Review[];
    error?: Error | null,
    loading: boolean,
    submitting: boolean;
    deleteConfirmId: string | null;
    editingId: string | null;
    setDeleteConfirmId: (id: string | null) => void;
    startEditing: (review: Review) => { comment: string };
    cancelEditing: () => void;
    submitReview: (values: ReviewFormValues) => Promise<void>;
    updateReview: (id: string, values: ReviewFormValues) => Promise<void>;
    deleteReview: (id: string) => Promise<void>;
}


interface GetReviewsResponse {
    getReviews: Review[];
}

export function useReviews(contentId?: string): UseReviewsReturn {

    const { loading, data, error } = useQuery<GetReviewsResponse>(GET_REVIEWS, {
        variables: {
            ContentId: contentId,
            page: 1
        },
        skip: !contentId,
    });

    const [submitReviewMutation] = useMutation(SUBMIT_REVIEWS, {
        refetchQueries: [
            {
                query: GET_REVIEWS,
                variables: {
                    ContentId: contentId,
                    page: 1
                }
            }
        ]
    })

    const [updateReviewMutation] = useMutation(UPDATE_REVIEW, {
        refetchQueries: [
            {
                query: GET_REVIEWS,
                variables: {
                    ContentId: contentId,
                    page: 1
                }
            }
        ]
    })

    const [deleteReviewMutation] = useMutation(DELETE_REVIEW, {
        refetchQueries: [
            {
                query: GET_REVIEWS,
                variables: {
                    ContentId: contentId,
                    page: 1
                }
            }
        ]
    })

    const [submitting, setSubmitting] = useState(false);
    const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
    const [editingId, setEditingId] = useState<string | null>(null);

    const reviews: Review[] = data?.getReviews || [];


    const submitReview = useCallback(async (values: ReviewFormValues) => {
        setSubmitting(true);
        try {
            await submitReviewMutation({ variables: { ContentId: contentId, ...values } })
            toast.success('Review posted');
        } catch (error: unknown) {
            console.error('Failed to submit review:', error);
            const message = error instanceof Error ? error.message : 'Failed to post review. Try again.';
            toast.error(message);
        } finally {
            setSubmitting(false);
        }
    }, [contentId]);

    const startEditing = useCallback((review: Review) => {
        setEditingId(review?._id);
        return { comment: review?.review };
    }, []);

    const cancelEditing = useCallback(() => {
        setEditingId(null);
    }, []);

    const updateReview = useCallback(async (id: string, values: ReviewFormValues) => {
        try {
            await updateReviewMutation({ variables: { reviewId: id, ...values } })
            setEditingId(null);
            toast.success('Review updated');
        } catch (error: unknown) {
            console.error('Failed to update review:', error);
            const message = error instanceof Error ? error.message : 'Failed to post review. Try again.';
            toast.error(message);
        }
    }, []);

    const deleteReview = useCallback(async (id: string) => {
        try {
            await deleteReviewMutation({ variables: { reviewId: id } })
            setDeleteConfirmId(null);
            toast.success('Review deleted');
        } catch (error: unknown) {
            console.error('Failed to delete review:', error);
            const message = error instanceof Error ? error.message : 'Failed to delete review. Try again.';
            toast.error(message);
        }
    }, []);

    return {
        reviews,
        error,
        loading,
        submitting,
        deleteConfirmId,
        editingId,
        setDeleteConfirmId,
        startEditing,
        cancelEditing,
        submitReview,
        updateReview,
        deleteReview,
    };
}