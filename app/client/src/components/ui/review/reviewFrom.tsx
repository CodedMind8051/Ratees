import { useState } from 'react';
import { Send, Loader2 } from 'lucide-react';
import { ReviewFormValues } from '@/types/review.types';
import { useMutation } from '@apollo/client/react';
import { SUBMIT_REVIEWS } from '@/lib/graphql/mutation/review.mutation';


interface ReviewFormProps {
    onSubmit: (values: ReviewFormValues) => Promise<void>;
    submitting: boolean;
}

export function ReviewForm({ onSubmit, submitting }: ReviewFormProps) {
    const [comment, setComment] = useState('');

 

    const handleSubmit = async () => {
        const trimmed = comment.trim();
        if (!trimmed) return;
        await onSubmit({ review: trimmed });
        setComment('');
    };

    const canSubmit = comment.trim().length > 0 && !submitting;

    return (
        <div className="bg-secondary/20 border border-border rounded-xl p-4 space-y-3">

            <textarea
                value={comment}
                onChange={e => setComment(e.target.value)}
                placeholder="Share what made this title stand out — or not…"
                rows={3}
                maxLength={1000}
                className="
          w-full bg-card border border-border rounded-lg px-3 py-2.5 text-sm
          text-foreground placeholder:text-muted-foreground/50
          focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary
          resize-none transition-colors
        "
            />

            <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">
                    {comment.length}/1000
                </span>
                <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={!canSubmit}
                    className="
            flex items-center gap-2 px-4 py-2 rounded-lg
            bg-primary text-primary-foreground text-sm font-semibold
            hover:bg-amber-400 active:scale-95
            disabled:opacity-40 disabled:cursor-not-allowed disabled:active:scale-100
            transition-all duration-150
            hover:cursor-pointer
          "
                >
                    {submitting ? (
                        <Loader2 size={14} className="animate-spin" />
                    ) : (
                        <Send size={14} />
                    )}
                    {submitting ? 'Posting…' : 'Post Review'}
                </button>
            </div>
        </div>
    );
}