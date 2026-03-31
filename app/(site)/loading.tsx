export default function Loading() {
  return (
    <div className="pt-16">
      <div className="max-w-content mx-auto section-pad pt-24 pb-20">
        <div className="h-28 bg-muted animate-pulse rounded w-48" />
      </div>
      <div className="max-w-content mx-auto section-pad pb-32">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-20">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="space-y-4">
              <div className="bg-muted animate-pulse" style={{ aspectRatio: '4/3' }} />
              <div className="h-4 bg-muted animate-pulse rounded w-2/3" />
              <div className="h-3 bg-muted animate-pulse rounded w-1/3" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
