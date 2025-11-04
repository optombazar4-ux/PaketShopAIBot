import ProductCard from '../ProductCard';

export default function ProductCardExample() {
  return (
    <div className="grid grid-cols-2 gap-3 p-4">
      <ProductCard
        id={1}
        name="Samsung Galaxy A54 5G"
        price="3,299,000 UZS"
        stockStatus="instock"
        onAddToCart={(id, qty) => console.log('Add to cart:', id, qty)}
        onViewDetails={(id) => console.log('View details:', id)}
      />
      <ProductCard
        id={2}
        name="Apple iPhone 15 Pro Max 256GB"
        price="15,999,000 UZS"
        stockStatus="instock"
        onAddToCart={(id, qty) => console.log('Add to cart:', id, qty)}
        onViewDetails={(id) => console.log('View details:', id)}
      />
    </div>
  );
}
