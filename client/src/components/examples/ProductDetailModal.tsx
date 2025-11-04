import ProductDetailModal from '../ProductDetailModal';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

export default function ProductDetailModalExample() {
  const [isOpen, setIsOpen] = useState(false);

  if (!isOpen) {
    return (
      <div className="p-4">
        <Button onClick={() => setIsOpen(true)}>
          Open Product Detail
        </Button>
      </div>
    );
  }

  return (
    <ProductDetailModal
      id={1}
      name="Samsung Galaxy A54 5G 8/256GB"
      price="3,299,000 UZS"
      regularPrice="3,699,000 UZS"
      description="<p>Samsung Galaxy A54 5G - eng so'nggi texnologiyalar bilan jihozlangan smartfon. 120Hz Super AMOLED ekran, 50MP kamera va kuchli 5000mAh batareya.</p>"
      shortDescription="5G ulanish, 50MP kamera, 5000mAh batareya"
      stockStatus="instock"
      stockQuantity={15}
      onClose={() => setIsOpen(false)}
      onAddToCart={(id, qty) => console.log('Added:', id, qty)}
    />
  );
}
