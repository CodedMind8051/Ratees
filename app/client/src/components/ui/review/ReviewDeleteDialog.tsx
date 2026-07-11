import { useEffect } from 'react';

interface DeleteConfirmDialogProps {
    open: boolean;
    onCancel: () => void;
    onConfirm: () => void;
}

export function DeleteConfirmDialog({
    open,
    onCancel,
    onConfirm,
}: DeleteConfirmDialogProps) {
    useEffect(() => {
        if (!open) return;
        const handler = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onCancel();
        };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [open, onCancel]);

    if (!open) return null;

    return (
        <div
            className="fixed inset-0 z-[60] flex items-center justify-center p-4 animate-dialog-overlay"
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-dialog-title"
            onClick={onCancel}
        >
            <div className="absolute inset-0 bg-black/60" />

            <div
                className="relative bg-card border border-border rounded-2xl p-6 w-full max-w-sm animate-dialog-panel"
                onClick={e => e.stopPropagation()}
            >
                <h3
                    id="delete-dialog-title"
                    className="text-base font-semibold mb-2"
                >
                    Delete Review?
                </h3>
                <p className="text-sm text-muted-foreground mb-5">
                    This will permanently remove your review. This action cannot be undone.
                </p>
                <div className="flex gap-3">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="flex-1 py-2.5 rounded-lg border border-border text-sm font-medium hover:bg-secondary active:scale-95 transition-all duration-150"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={onConfirm}
                        className="flex-1 py-2.5 rounded-lg bg-accent text-white text-sm font-semibold hover:bg-red-600 active:scale-95 transition-all duration-150"
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
}