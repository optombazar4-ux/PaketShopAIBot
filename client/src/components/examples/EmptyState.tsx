import EmptyState from '../EmptyState';
import { ShoppingCart } from 'lucide-react';

export default function EmptyStateExample() {
  return (
    <div className="p-4">
      <EmptyState
        icon={ShoppingCart}
        title="Savatingiz bo'sh"
        description="Hozircha savatingizda mahsulot yo'q. Katalogdan o'zingizga kerakli mahsulotlarni tanlang."
        actionLabel="Katalogga o'tish"
        onAction={() => console.log('Go to catalog')}
      />
    </div>
  );
}
