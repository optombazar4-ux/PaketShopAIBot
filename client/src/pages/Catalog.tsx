import { useState } from "react";
import ProductCard from "@/components/ProductCard";
import ProductDetailModal from "@/components/ProductDetailModal";
import EmptyState from "@/components/EmptyState";
import { ProductGridSkeleton } from "@/components/LoadingSkeleton";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Package } from "lucide-react";

//todo: remove mock functionality
const MOCK_PRODUCTS = [
  {
    id: 1,
    name: "Samsung Galaxy A54 5G",
    price: "3,299,000 UZS",
    regularPrice: "3,699,000 UZS",
    description: "<p>Samsung Galaxy A54 5G - eng so'nggi texnologiyalar bilan jihozlangan smartfon.</p>",
    shortDescription: "5G ulanish, 50MP kamera",
    stockStatus: 'instock' as const,
    stockQuantity: 15,
  },
  {
    id: 2,
    name: "Apple iPhone 15 Pro Max 256GB",
    price: "15,999,000 UZS",
    regularPrice: "15,999,000 UZS",
    description: "<p>iPhone 15 Pro Max - Apple'ning eng kuchli smartfoni.</p>",
    shortDescription: "A17 Pro chip, Titanium korpus",
    stockStatus: 'instock' as const,
    stockQuantity: 8,
  },
  {
    id: 3,
    name: "Xiaomi Redmi Note 13 Pro",
    price: "2,899,000 UZS",
    regularPrice: "2,899,000 UZS",
    description: "<p>Redmi Note 13 Pro - narx va sifat nisbati ajoyib smartfon.</p>",
    shortDescription: "200MP kamera, 67W tez quvvatlash",
    stockStatus: 'instock' as const,
    stockQuantity: 25,
  },
  {
    id: 4,
    name: "OnePlus 12 16/512GB",
    price: "8,499,000 UZS",
    regularPrice: "8,499,000 UZS",
    description: "<p>OnePlus 12 - flagman darajasidagi smartfon.</p>",
    shortDescription: "Snapdragon 8 Gen 3, 100W quvvatlash",
    stockStatus: 'outofstock' as const,
    stockQuantity: 0,
  },
];

export default function Catalog() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<typeof MOCK_PRODUCTS[0] | null>(null);
  const [isLoading] = useState(false); //todo: remove mock functionality

  const filteredProducts = MOCK_PRODUCTS.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddToCart = (productId: number, quantity: number) => {
    console.log(`Adding product ${productId} to cart, quantity: ${quantity}`);
    //todo: remove mock functionality - implement actual cart logic
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
        {filteredProducts.length === 0 ? (
          <EmptyState
            icon={Package}
            title="Mahsulot topilmadi"
            description="Qidiruv bo'yicha hech narsa topilmadi. Boshqa so'z bilan qidiring."
            actionLabel="Tozalash"
            onAction={() => setSearchQuery("")}
          />
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {filteredProducts.map(product => (
              <ProductCard
                key={product.id}
                id={product.id}
                name={product.name}
                price={product.price}
                stockStatus={product.stockStatus}
                onAddToCart={handleAddToCart}
                onViewDetails={(id) => {
                  const product = MOCK_PRODUCTS.find(p => p.id === id);
                  if (product) setSelectedProduct(product);
                }}
              />
            ))}
          </div>
        )}
      </div>

      {selectedProduct && (
        <ProductDetailModal
          {...selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onAddToCart={handleAddToCart}
        />
      )}
    </div>
  );
}
