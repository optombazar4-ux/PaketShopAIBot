import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import ProductCard from "@/components/ProductCard";
import ProductDetailModal from "@/components/ProductDetailModal";
import EmptyState from "@/components/EmptyState";
import { ProductGridSkeleton } from "@/components/LoadingSkeleton";
import { Input } from "@/components/ui/input";
import { Search, Package } from "lucide-react";
import { api } from "@/lib/api";
import { useCart } from "@/hooks/useCart";
import { useToast } from "@/hooks/use-toast";
import { WooCommerceProduct } from "@shared/schema";

export default function Catalog() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<WooCommerceProduct | null>(null);
  const { addToCart } = useCart();
  const { toast } = useToast();

  const { data: products = [], isLoading } = useQuery({
    queryKey: ['/api/products', searchQuery],
    queryFn: () => api.getProducts({ search: searchQuery || undefined, per_page: 50 }),
  });

  const handleAddToCart = async (productId: number, quantity: number) => {
    const product = products.find(p => p.id === productId);
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
      description: `${product.name} savatga qo'shildi`,
    });
  };

  if (isLoading) {
    return (
      <div className="p-4">
        <ProductGridSkeleton />
      </div>
    );
  }

  return (
    <div className="pb-20">
      <div className="sticky top-0 z-10 bg-background border-b p-4 space-y-3">
        <h1 className="text-2xl font-bold">Katalog</h1>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Mahsulot qidirish..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
            data-testid="input-search"
          />
        </div>
      </div>

      <div className="p-4">
        {products.length === 0 ? (
          <EmptyState
            icon={Package}
            title="Mahsulot topilmadi"
            description="Qidiruv bo'yicha hech narsa topilmadi. Boshqa so'z bilan qidiring."
            actionLabel="Tozalash"
            onAction={() => setSearchQuery("")}
          />
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {products.map(product => (
              <ProductCard
                key={product.id}
                id={product.id}
                name={product.name}
                price={`${product.price} UZS`}
                image={product.images?.[0]?.src}
                stockStatus={product.stock_status}
                onAddToCart={handleAddToCart}
                onViewDetails={(id) => {
                  const product = products.find(p => p.id === id);
                  if (product) setSelectedProduct(product);
                }}
              />
            ))}
          </div>
        )}
      </div>

      {selectedProduct && (
        <ProductDetailModal
          id={selectedProduct.id}
          name={selectedProduct.name}
          price={`${selectedProduct.price} UZS`}
          regularPrice={selectedProduct.regular_price ? `${selectedProduct.regular_price} UZS` : undefined}
          description={selectedProduct.description}
          shortDescription={selectedProduct.short_description}
          images={selectedProduct.images?.map(img => img.src)}
          stockStatus={selectedProduct.stock_status}
          stockQuantity={selectedProduct.stock_quantity}
          onClose={() => setSelectedProduct(null)}
          onAddToCart={handleAddToCart}
        />
      )}
    </div>
  );
}
