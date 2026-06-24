import { useState, useCallback, useEffect } from 'react';
import { toast } from 'sonner';
import { Review, ReviewFormValues } from '@/types/review.types';
import { useQuery } from '@apollo/client/react';
import { GET_REVIEWS } from '@/lib/graphql/query/review.query';

// ─── mock seed data (replace with Apollo mutation/query calls) ────────────────
// const SEED_REVIEWS: Review[] = [
//     {
//         id: 'rev-1',
//         userId: 'user-self',
//         username: 'Arjun Rao',
//         avatar: 'AR',
//         comment:
//             'Absolutely stunning. Every frame feels intentional — the pacing, the score, the performances. One of the best things I have watched in years.',
//         date: 'Jun 12, 2026',
//         isOwn: true,
//     },
//     {
//         id: 'rev-2',
//         userId: 'user-42',
//         username: 'Priya Sharma',
//         avatar: 'PS',
//         comment:
//             'Really enjoyed it. The second half slows down a little but the payoff is worth it. Would recommend to anyone who likes slow-burn thrillers.',
//         date: 'Jun 10, 2026',
//         isOwn: false,
//     },
//     {
//         id: 'rev-3',
//         userId: 'user-99',
//         username: 'Karan M',
//         avatar: 'KM',
//         comment:
//             'Decent, not great. The first episode hooked me but after that it felt like they were stretching the story unnecessarily.',
//         date: 'Jun 8, 2026',
//         isOwn: false,
//     },
// ];

interface UseReviewsReturn {
    reviews: Review[];
    error?: any,
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

    console.log(contentId)

    const { loading, data, error } = useQuery<GetReviewsResponse>(GET_REVIEWS, {
        variables: {
            contentId: contentId,
            page: 1
        }
    })

    const [submitting, setSubmitting] = useState(false);
    const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [reviews, setReviews] = useState([])


    useEffect(() => {
        setReviews(data?.getReviews || [])
    }, [data?.getReviews])


    const submitReview = useCallback(async (values: ReviewFormValues) => {
        setSubmitting(true);
        try {
            // TODO: await submitReviewMutation({ variables: { contentId, ...values } })
            await new Promise(r => setTimeout(r, 500)); // simulate network

            const newReview: Review = {
                _id: `rev-${Date.now()}`,
                userId: 'user-self',
                username: 'Arjun Rao',   // TODO: pull from auth session
                profileImage: 'AR',
                review: values.comment,
                createdAt: new Date().toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                }),
                isOwn: true,
            };

            setReviews(prev => [newReview, ...prev]);
            toast.success('Review posted');
        } catch {
            toast.error('Failed to post review. Try again.');
        } finally {
            setSubmitting(false);
        }
    }, []);

    const startEditing = useCallback((review: Review) => {
        setEditingId(review?._id);
        return { comment: review?.review };
    }, []);

    const cancelEditing = useCallback(() => {
        setEditingId(null);
    }, []);

    const updateReview = useCallback(async (id: string, values: ReviewFormValues) => {
        try {
            // TODO: await updateReviewMutation({ variables: { id, ...values } })
            await new Promise(r => setTimeout(r, 400));
            setReviews(prev =>
                prev.map(r => (r?._id === id ? { ...r, ...values } : r))
            );
            setEditingId(null);
            toast.success('Review updated');
        } catch {
            toast.error('Failed to update review. Try again.');
        }
    }, []);

    const deleteReview = useCallback(async (id: string) => {
        try {
            // TODO: await deleteReviewMutation({ variables: { id } })
            await new Promise(r => setTimeout(r, 300));
            setReviews(prev => prev.filter(r => r?._id !== id));
            setDeleteConfirmId(null);
            toast.success('Review deleted');
        } catch {
            toast.error('Failed to delete review. Try again.');
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