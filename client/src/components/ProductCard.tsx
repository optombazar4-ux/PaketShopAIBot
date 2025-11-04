import { Plus, Minus, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";

interface ProductCardProps {
  id: number;
  name: string;
  price: string;
  image?: string;
  stockStatus: 'instock' | 'outofstock' | 'onbackorder';
  onAddToCart?: (productId: number, quantity: number) => void;
  onViewDetails?: (productId: number) => void;
}

export default function ProductCard({ 
  id, 
  name, 
  price, 
  image, 
  stockStatus,
  onAddToCart,
  onViewDetails 
}: ProductCardProps) {
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);

  const handleAddToCart = () => {
    console.log(`Adding product ${id} to cart, quantity: ${quantity}`);
    onAddToCart?.(id, quantity);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const handleViewDetails = () => {
    console.log(`Viewing product ${id} details`);
    onViewDetails?.(id);
  };

  const isOutOfStock = stockStatus === 'outofstock';

  return (
    <Card 
      className="overflow-hidden flex flex-col hover-elevate cursor-pointer"
      onClick={handleViewDetails}
      data-testid={`card-product-${id}`}
    >
      <div className="relative aspect-square bg-muted">
        {image ? (
          <img 
            src={image} 
            alt={name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <ShoppingCart className="w-12 h-12 text-muted-foreground" />
          </div>
        )}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
            <Badge variant="destructive">Tugagan</Badge>
          </div>
        )}
        {isAdded && (
          <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
            <Badge>Qo'shildi ✓</Badge>
          </div>
        )}
      </div>
      
      <div className="p-3 flex flex-col flex-1" onClick={(e) => e.stopPropagation()}>
        <h3 className="font-semibold text-sm line-clamp-2 mb-2" data-testid={`text-name-${id}`}>
          {name}
        </h3>
        
        <p className="text-lg font-bold mb-3 mt-auto" data-testid={`text-price-${id}`}>
          {price}
        </p>

        {!isOutOfStock && (
          <div className="flex items-center gap-2">
            <div className="flex items-center border rounded-lg">
              <Button
                size="icon"
                variant="ghost"
                className="h-8 w-8"
                onClick={(e) => {
                  e.stopPropagation();
                  setQuantity(Math.max(1, quantity - 1));
                }}
                data-testid={`button-decrease-${id}`}
              >
                <Minus className="w-3 h-3" />
              </Button>
              <span className="px-3 text-sm font-medium min-w-[2rem] text-center" data-testid={`text-quantity-${id}`}>
                {quantity}
              </span>
              <Button
                size="icon"
                variant="ghost"
                className="h-8 w-8"
                onClick={(e) => {
                  e.stopPropagation();
                  setQuantity(quantity + 1);
                }}
                data-testid={`button-increase-${id}`}
              >
                <Plus className="w-3 h-3" />
              </Button>
            </div>
            <Button 
              size="sm" 
              className="flex-1"
              onClick={(e) => {
                e.stopPropagation();
                handleAddToCart();
              }}
              data-testid={`button-add-to-cart-${id}`}
            >
              <ShoppingCart className="w-3 h-3 mr-1" />
              Qo'shish
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
}
