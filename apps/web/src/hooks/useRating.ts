import { useMutation } from '@apollo/client/react';
import { SUBMIT_RATING } from '@/lib/graphql/mutation/rating.mutation';
import type { RatingKey } from '@/types/rating.types';
import { toast } from 'sonner';

export const ratingToKey: Record<number, RatingKey> = {
  1: 'waste',
  2: 'timepass',
  3: 'good',
  4: 'masterpiece',
};

export const keyToRating: Record<RatingKey, number> = {
  waste: 1,
  timepass: 2,
  good: 3,
  masterpiece: 4,
};

export function useRating() {
  const [submitRatingMutation, { loading }] = useMutation(SUBMIT_RATING, {
    context: { credentials: 'include' },
    refetchQueries: ['GetContentDetails'],
  });

  const submitRating = async (ContentId: string, rating: RatingKey) => {
    try {
      await submitRatingMutation({
        variables: { ContentId, rating: keyToRating[rating] },
      });
      return true;
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to submit rating';
      toast.error(message);
      return false;
    }
  };

  return { submitRating, loading };
}
