export default function ProjectLoading() {
  return (
    <div className="pt-16">
      <div className="w-full bg-muted animate-pulse" style={{ aspectRatio: '16/9' }} />
      <div className="max-w-content mx-auto section-pad pt-16 pb-8 space-y-6">
        <div className="h-16 bg-muted animate-pulse rounded w-2/3" />
        <div className="h-4 bg-muted animate-pulse rounded w-full max-w-xl" />
        <div className="h-4 bg-muted animate-pulse rounded w-3/4 max-w-xl" />
      </div>
      <div className="border-y border-border py-6">
        <div className="max-w-content mx-auto section-pad flex gap-12">
          {[1, 2, 3].map((i) => (
            <div key={i} className="space-y-2">
              <div className="h-2 bg-muted animate-pulse rounded w-12" />
              <div className="h-4 bg-muted animate-pulse rounded w-20" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
