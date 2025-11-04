import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useCart } from "@/hooks/useCart";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Plus, Minus, ShoppingCart } from "lucide-react";

interface ProductDetailProps {
  productId: number;
  onBack: () => void;
}

export default function ProductDetail({ productId, onBack }: ProductDetailProps) {
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const { toast } = useToast();

  const { data: product, isLoading } = useQuery({
    queryKey: ['/api/products', productId],
    queryFn: () => api.getProduct(productId),
  });

  const handleAddToCart = () => {
    if (!product) return;

    addToCart({
      productId: product.id,
      productName: product.name,
      productPrice: product.price,
      productImage: product.images?.[0]?.src,
      quantity,
    });

    toast({
      title: "Savatga qo'shildi",
      description: `${product.name} (${quantity} dona) savatga qo'shildi`,
    });

    onBack();
  };

  const incrementQuantity = () => {
    if (product?.stock_quantity && quantity >= product.stock_quantity) {
      toast({
        title: "Maksimal miqdor",
        description: `Faqat ${product.stock_quantity} dona mavjud`,
        variant: "destructive",
      });
      return;
    }
    setQuantity(q => q + 1);
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(q => q - 1);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="sticky top-0 z-10 bg-background border-b p-4">
          <Button variant="ghost" size="icon" onClick={onBack} data-testid="button-back">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </div>
        <div className="p-4 space-y-4">
          <Skeleton className="w-full aspect-square rounded-lg" />
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-6 w-1/4" />
          <Skeleton className="h-24 w-full" />
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Mahsulot topilmadi</h2>
          <Button onClick={onBack}>Orqaga qaytish</Button>
        </div>
      </div>
    );
  }

  const isInStock = product.stock_status === 'instock';
  const hasDiscount = product.sale_price && parseFloat(product.sale_price) < parseFloat(product.regular_price);

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur border-b">
        <div className="p-4 flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={onBack} data-testid="button-back">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-lg font-semibold truncate">Mahsulot tafsilotlari</h1>
        </div>
      </div>

      {/* Product Image */}
      <div className="p-4">
        <div className="relative aspect-square rounded-lg overflow-hidden bg-muted">
          {product.images?.[0]?.src ? (
            <img
              src={product.images[0].src}
              alt={product.name}
              className="w-full h-full object-contain"
              data-testid="img-product"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground">
              Rasm yo'q
            </div>
          )}
          {hasDiscount && (
            <Badge className="absolute top-3 right-3 bg-red-500">
              Chegirma
            </Badge>
          )}
        </div>
      </div>

      {/* Product Info */}
      <div className="px-4 space-y-4">
        {/* Title and Price */}
        <div>
          <h2 className="text-2xl font-bold mb-2" data-testid="text-product-name">
            {product.name}
          </h2>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-primary" data-testid="text-price">
              {product.price} UZS
            </span>
            {hasDiscount && (
              <span className="text-lg text-muted-foreground line-through">
                {product.regular_price} UZS
              </span>
            )}
          </div>
        </div>

        {/* Stock Status */}
        <div>
          {isInStock ? (
            <Badge variant="outline" className="text-green-600 border-green-600">
              ✓ Mavjud
            </Badge>
          ) : (
            <Badge variant="outline" className="text-red-600 border-red-600">
              Tugagan
            </Badge>
          )}
          {product.stock_quantity !== null && isInStock && (
            <span className="ml-2 text-sm text-muted-foreground">
              ({product.stock_quantity} dona)
            </span>
          )}
        </div>

        {/* Categories */}
        {product.categories && product.categories.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {product.categories.map(cat => (
              <Badge key={cat.id} variant="secondary">
                {cat.name}
              </Badge>
            ))}
          </div>
        )}

        {/* Description */}
        {product.description && (
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Tavsif</h3>
            <div
              className="text-sm text-muted-foreground prose prose-sm max-w-none"
              dangerouslySetInnerHTML={{ __html: product.description }}
              data-testid="text-description"
            />
          </div>
        )}

        {product.short_description && !product.description && (
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Tavsif</h3>
            <div
              className="text-sm text-muted-foreground"
              dangerouslySetInnerHTML={{ __html: product.short_description }}
            />
          </div>
        )}
      </div>

      {/* Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-background border-t p-4 space-y-3">
        {/* Quantity Selector */}
        {isInStock && (
          <div className="flex items-center justify-between">
            <span className="font-medium">Miqdor:</span>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="icon"
                onClick={decrementQuantity}
                disabled={quantity <= 1}
                data-testid="button-decrease-quantity"
              >
                <Minus className="w-4 h-4" />
              </Button>
              <span className="text-xl font-bold w-12 text-center" data-testid="text-quantity">
                {quantity}
              </span>
              <Button
                variant="outline"
                size="icon"
                onClick={incrementQuantity}
                disabled={product.stock_quantity !== null && quantity >= product.stock_quantity}
                data-testid="button-increase-quantity"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}

        {/* Add to Cart Button */}
        <Button
          className="w-full"
          size="lg"
          onClick={handleAddToCart}
          disabled={!isInStock}
          data-testid="button-add-to-cart"
        >
          <ShoppingCart className="w-5 h-5 mr-2" />
          {isInStock ? `Savatga qo'shish (${(parseFloat(product.price) * quantity).toLocaleString()} UZS)` : "Tugagan"}
        </Button>
      </div>
    </div>
  );
}
