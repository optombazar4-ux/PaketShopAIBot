export function ProductCardSkeleton() {
  return (
    <div className="rounded-lg border overflow-hidden">
      <div className="aspect-square bg-gradient-to-r from-muted via-muted/50 to-muted animate-shimmer bg-[length:200%_100%]" />
      <div className="p-3 space-y-2">
        <div className="h-4 bg-gradient-to-r from-muted via-muted/50 to-muted animate-shimmer bg-[length:200%_100%] rounded w-3/4" />
        <div className="h-4 bg-gradient-to-r from-muted via-muted/50 to-muted animate-shimmer bg-[length:200%_100%] rounded w-1/2" />
        <div className="h-8 bg-gradient-to-r from-muted via-muted/50 to-muted animate-shimmer bg-[length:200%_100%] rounded w-full mt-3" />
      </div>
    </div>
  );
}

export function ProductGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function CartItemSkeleton() {
  return (
    <div className="rounded-lg border p-3">
      <div className="flex gap-3">
        <div className="w-20 h-20 bg-gradient-to-r from-muted via-muted/50 to-muted animate-shimmer bg-[length:200%_100%] rounded-md flex-shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-gradient-to-r from-muted via-muted/50 to-muted animate-shimmer bg-[length:200%_100%] rounded w-3/4" />
          <div className="h-4 bg-gradient-to-r from-muted via-muted/50 to-muted animate-shimmer bg-[length:200%_100%] rounded w-1/2" />
          <div className="h-7 bg-gradient-to-r from-muted via-muted/50 to-muted animate-shimmer bg-[length:200%_100%] rounded w-24" />
        </div>
      </div>
    </div>
  );
}
