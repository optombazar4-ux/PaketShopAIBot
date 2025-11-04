import CartItemCard from '../CartItemCard';

export default function CartItemCardExample() {
  return (
    <div className="space-y-3 p-4">
      <CartItemCard
        id="1"
        productId={101}
        productName="Samsung Galaxy A54 5G 8/256GB"
        productPrice="3,299,000 UZS"
        quantity={2}
        onUpdateQuantity={(id, qty) => console.log('Update quantity:', id, qty)}
        onRemove={(id) => console.log('Remove item:', id)}
      />
      <CartItemCard
        id="2"
        productId={102}
        productName="Apple AirPods Pro 2nd Generation"
        productPrice="2,499,000 UZS"
        quantity={1}
        onUpdateQuantity={(id, qty) => console.log('Update quantity:', id, qty)}
        onRemove={(id) => console.log('Remove item:', id)}
      />
    </div>
  );
}
