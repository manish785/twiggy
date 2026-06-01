const ShimmerCard = () => (
  <div className="card-surface w-full overflow-hidden">
    <div className="h-44 animate-pulse bg-gradient-to-r from-ink-100 via-ink-50 to-ink-100" />
    <div className="space-y-3 p-4">
      <div className="h-5 w-3/4 animate-pulse rounded-lg bg-ink-100" />
      <div className="h-4 w-full animate-pulse rounded-lg bg-ink-100" />
      <div className="flex justify-between pt-2">
        <div className="h-6 w-14 animate-pulse rounded-lg bg-ink-100" />
        <div className="h-4 w-16 animate-pulse rounded-lg bg-ink-100" />
      </div>
    </div>
  </div>
);

const Shimmer = () => (
  <div className="page-shell">
    <div className="page-container">
      <div className="mb-8 h-10 w-64 animate-pulse rounded-xl bg-ink-100" />
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <ShimmerCard key={i} />
        ))}
      </div>
    </div>
  </div>
);

export default Shimmer;
