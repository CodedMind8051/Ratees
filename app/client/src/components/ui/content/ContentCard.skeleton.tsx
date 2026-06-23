export function ContentCardSkeleton() {
  return (
    <div className="relative bg-card border border-border rounded-xl overflow-hidden animate-pulse">
      <div className="relative aspect-[2/3] bg-secondary">

        <div className="absolute top-2 left-2 h-5 w-12 rounded-full bg-white/20" />

        <div className="absolute top-2 right-2 h-5 w-6 rounded-full bg-white/15" />

      </div>

      <div className="p-3">

        <div className="h-3.5 w-[88%] rounded bg-muted" />

        <div className="h-3 w-[40%] rounded bg-muted mt-2 opacity-70" />

        <div className="flex gap-1 mt-1.5">
          <div className="h-[18px] w-12 rounded bg-secondary" />
          <div className="h-[18px] w-10 rounded bg-secondary" />
        </div>

      </div>
    </div>
  );
}
