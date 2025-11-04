import { X, ShoppingCart, Plus, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ProductDetailModalProps {
  id: number;
  name: string;
  price: string;
  regularPrice?: string;
  description: string;
  shortDescription?: string;
  images?: string[];
  stockStatus: 'instock' | 'outofstock' | 'onbackorder';
  stockQuantity?: number | null;
  onClose: () => void;
  onAddToCart?: (productId: number, quantity: number) => void;
}

export default function ProductDetailModal({
  id,
  name,
  price,
  regularPrice,
  description,
  shortDescription,
  images = [],
  stockStatus,
  stockQuantity,
  onClose,
  onAddToCart
}: ProductDetailModalProps) {
  const [quantity, setQuantity] = useState(1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const isOutOfStock = stockStatus === 'outofstock';
  const hasDiscount = regularPrice && regularPrice !== price;

  const handleAddToCart = () => {
    console.log(`Adding product ${id} to cart from modal, quantity: ${quantity}`);
    onAddToCart?.(id, quantity);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-background z-50 flex flex-col">
      <div className="sticky top-0 z-10 bg-background border-b p-4 flex items-center justify-between">
        <h2 className="font-semibold text-lg line-clamp-1">Mahsulot</h2>
        <Button
          size="icon"
          variant="ghost"
          onClick={onClose}
          data-testid="button-close-modal"
        >
          <X className="w-5 h-5" />
        </Button>
      </div>

      <ScrollArea className="flex-1">
        <div className="pb-24">
          <div className="relative aspect-[4/3] bg-muted">
            {images.length > 0 ? (
              <img
                src={images[currentImageIndex]}
                alt={name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <ShoppingCart className="w-16 h-16 text-muted-foreground" />
              </div>
            )}
            {images.length > 1 && (
              <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
                {images.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      index === currentImageIndex
                        ? 'bg-primary w-6'
                        : 'bg-background/50'
                    }`}
                    data-testid={`button-image-indicator-${index}`}
                  />
                ))}
              </div>
            )}
          </div>

          <div className="p-4 space-y-4">
            <div>
              <h1 className="text-2xl font-semibold mb-2" data-testid="text-product-name">
                {name}
              </h1>
              <div className="flex items-center gap-3 mb-3">
                <p className="text-2xl font-bold" data-testid="text-product-price">
                  {price}
                </p>
                {hasDiscount && (
                  <p className="text-lg text-muted-foreground line-through">
                    {regularPrice}
                  </p>
                )}
              </div>
              
              <div className="flex items-center gap-2">
                {isOutOfStock ? (
                  <Badge variant="destructive">Tugagan</Badge>
                ) : (
                  <Badge variant="secondary">
                    Mavjud {stockQuantity ? `(${stockQuantity} dona)` : ''}
                  </Badge>
                )}
              </div>
            </div>

            {shortDescription && (
              <div>
                <h3 className="font-semibold mb-2">Qisqacha</h3>
                <p className="text-sm text-muted-foreground">{shortDescription}</p>
              </div>
            )}

            {description && (
              <div>
                <h3 className="font-semibold mb-2">Tavsif</h3>
                <div 
                  className="text-sm text-muted-foreground prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={{ __html: description }}
                />
              </div>
            )}
          </div>
        </div>
      </ScrollArea>

      {!isOutOfStock && (
        <div className="sticky bottom-0 bg-background border-t p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Miqdor:</span>
            <div className="flex items-center border rounded-lg">
              <Button
                size="icon"
                variant="ghost"
                className="h-9 w-9"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                data-testid="button-decrease-quantity"
              >
                <Minus className="w-4 h-4" />
              </Button>
              <span className="px-4 text-base font-medium min-w-[3rem] text-center" data-testid="text-quantity">
                {quantity}
              </span>
              <Button
                size="icon"
                variant="ghost"
                className="h-9 w-9"
                onClick={() => setQuantity(quantity + 1)}
                data-testid="button-increase-quantity"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <Button
            className="w-full"
            size="lg"
            onClick={handleAddToCart}
            data-testid="button-add-to-cart"
          >
            <ShoppingCart className="w-4 h-4 mr-2" />
            Savatga qo'shish
          </Button>
        </div>
      )}
    </div>
  );
}
