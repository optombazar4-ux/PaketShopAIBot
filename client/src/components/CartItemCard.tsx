import { Plus, Minus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface CartItemCardProps {
  id: string;
  productId: number;
  productName: string;
  productPrice: string;
  productImage?: string;
  quantity: number;
  onUpdateQuantity?: (id: string, newQuantity: number) => void;
  onRemove?: (id: string) => void;
}

export default function CartItemCard({
  id,
  productId,
  productName,
  productPrice,
  productImage,
  quantity,
  onUpdateQuantity,
  onRemove
}: CartItemCardProps) {
  const handleIncrease = () => {
    console.log(`Increasing quantity for item ${id}`);
    onUpdateQuantity?.(id, quantity + 1);
  };

  const handleDecrease = () => {
    if (quantity > 1) {
      console.log(`Decreasing quantity for item ${id}`);
      onUpdateQuantity?.(id, quantity - 1);
    }
  };

  const handleRemove = () => {
    console.log(`Removing item ${id}`);
    onRemove?.(id);
  };

  return (
    <Card className="p-3" data-testid={`card-cart-item-${id}`}>
      <div className="flex gap-3">
        <div className="w-20 h-20 rounded-md bg-muted flex-shrink-0 overflow-hidden">
          {productImage ? (
            <img src={productImage} alt={productName} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-muted" />
          )}
        </div>

        <div className="flex-1 flex flex-col min-w-0">
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className="font-semibold text-sm line-clamp-2 flex-1" data-testid={`text-name-${id}`}>
              {productName}
            </h3>
            <Button
              size="icon"
              variant="ghost"
              className="h-6 w-6 flex-shrink-0"
              onClick={handleRemove}
              data-testid={`button-remove-${id}`}
            >
              <Trash2 className="w-3 h-3 text-destructive" />
            </Button>
          </div>

          <p className="text-sm font-bold mb-2" data-testid={`text-price-${id}`}>
            {productPrice}
          </p>

          <div className="flex items-center border rounded-lg w-fit">
            <Button
              size="icon"
              variant="ghost"
              className="h-7 w-7"
              onClick={handleDecrease}
              disabled={quantity <= 1}
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
              className="h-7 w-7"
              onClick={handleIncrease}
              data-testid={`button-increase-${id}`}
            >
              <Plus className="w-3 h-3" />
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
