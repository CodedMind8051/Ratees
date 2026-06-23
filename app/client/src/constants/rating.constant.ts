import { RatingKey } from "@/types/rating.types";

export const RATING_ORDER: RatingKey[] = ['masterpiece', 'good', 'timepass', 'waste'];

export const RATING_LABELS: Record<RatingKey, string> = {
  masterpiece: 'Masterpiece',
  good:        'Good',
  timepass:    'Timepass',
  waste:       'Waste',
};

export const RATING_COLORS: Record<RatingKey, string> = {
  masterpiece: '#a855f7',
  good:        '#22c55e',
  timepass:    '#f59e0b',
  waste:       '#ef4444',
};