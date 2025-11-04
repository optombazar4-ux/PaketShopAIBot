export function ProductCardSkeleton() {
  return (
    <div className="rounded-lg border overflow-hidden animate-pulse">
      <div className="aspect-square bg-muted" />
      <div className="p-3 space-y-2">
        <div className="h-4 bg-muted rounded w-3/4" />
        <div className="h-4 bg-muted rounded w-1/2" />
        <div className="h-8 bg-muted rounded w-full mt-3" />
      </div>
    </div>
  );
}

export function ProductGridSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-3">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function CartItemSkeleton() {
  return (
    <div className="rounded-lg border p-3 animate-pulse">
      <div className="flex gap-3">
        <div className="w-20 h-20 bg-muted rounded-md flex-shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-muted rounded w-3/4" />
          <div className="h-4 bg-muted rounded w-1/2" />
          <div className="h-7 bg-muted rounded w-24" />
        </div>
      </div>
    </div>
  );
}
