import { ProductGridSkeleton, CartItemSkeleton } from '../LoadingSkeleton';

export default function LoadingSkeletonExample() {
  return (
    <div className="p-4 space-y-6">
      <div>
        <h3 className="font-semibold mb-3">Product Grid Skeleton</h3>
        <ProductGridSkeleton />
      </div>
      <div>
        <h3 className="font-semibold mb-3">Cart Item Skeleton</h3>
        <div className="space-y-3">
          <CartItemSkeleton />
          <CartItemSkeleton />
        </div>
      </div>
    </div>
  );
}
