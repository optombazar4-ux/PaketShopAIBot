import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import ProductCard from "@/components/ProductCard";
import ProductDetail from "@/pages/ProductDetail";
import EmptyState from "@/components/EmptyState";
import { ProductGridSkeleton } from "@/components/LoadingSkeleton";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, Package, Sparkles } from "lucide-react";
import { api } from "@/lib/api";
import { useCart } from "@/hooks/useCart";
import { useToast } from "@/hooks/use-toast";
import { WooCommerceProduct } from "@shared/schema";
import { cn } from "@/lib/utils";

export default function Catalog() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);
  const { addToCart } = useCart();
  const { toast } = useToast();

  const { data: categories = [], isLoading: categoriesLoading } = useQuery({
    queryKey: ['/api/categories'],
    queryFn: () => api.getCategories(),
  });

  const { data: products = [], isLoading: productsLoading } = useQuery({
    queryKey: ['/api/products', searchQuery, selectedCategory],
    queryFn: () => api.getProducts({
      search: searchQuery || undefined,
      category: selectedCategory || undefined,
      per_page: 50
    }),
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

  const handleCategorySelect = (categoryId: number | null) => {
    setSelectedCategory(categoryId);
  };

  // Show ProductDetail if a product is selected
  if (selectedProductId) {
    return (
      <ProductDetail
        productId={selectedProductId}
        onBack={() => setSelectedProductId(null)}
      />
    );
  }

  return (
    <div className="pb-20">
      {/* Header with Search */}
      <div className="sticky top-0 z-10 bg-background border-b">
        <div className="p-4 space-y-3">
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

        {/* Categories Filter */}
        <div className="px-4 pb-3">
          {categoriesLoading ? (
            <div className="flex gap-2 overflow-x-auto pb-2">
              {[1, 2, 3, 4].map(i => (
                <Skeleton key={i} className="h-8 w-24 rounded-full flex-shrink-0" />
              ))}
            </div>
          ) : (
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              <Badge
                variant={selectedCategory === null ? "default" : "outline"}
                className={cn(
                  "cursor-pointer flex-shrink-0 px-4 py-2 text-sm transition-colors",
                  selectedCategory === null && "bg-primary text-primary-foreground"
                )}
                onClick={() => handleCategorySelect(null)}
                data-testid="category-all"
              >
                Barchasi
              </Badge>
              {categories.map(category => (
                <Badge
                  key={category.id}
                  variant={selectedCategory === category.id ? "default" : "outline"}
                  className={cn(
                    "cursor-pointer flex-shrink-0 px-4 py-2 text-sm transition-colors",
                    selectedCategory === category.id && "bg-primary text-primary-foreground"
                  )}
                  onClick={() => handleCategorySelect(category.id)}
                  data-testid={`category-${category.id}`}
                >
                  {category.name} ({category.count})
                </Badge>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Banner Placeholder */}
      <div className="px-4 pt-4">
        <div 
          className="relative h-40 rounded-lg overflow-hidden bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 flex items-center justify-center text-white"
          data-testid="banner-promo"
        >
          <div className="text-center space-y-2 px-4">
            <Sparkles className="w-8 h-8 mx-auto" data-testid="icon-sparkles" />
            <h2 className="text-xl font-bold" data-testid="text-banner-title">🎉 Chegirmalar Boshlanadi!</h2>
            <p className="text-sm opacity-90" data-testid="text-banner-description">Eng yaxshi narxlarda xarid qiling</p>
          </div>
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-black/10" />
        </div>
      </div>

      {/* Products Grid */}
      <div className="p-4">
        {productsLoading ? (
          <ProductGridSkeleton count={6} />
        ) : products.length === 0 ? (
          <EmptyState
            icon={Package}
            title="Mahsulot topilmadi"
            description={
              searchQuery
                ? "Qidiruv bo'yicha hech narsa topilmadi. Boshqa so'z bilan qidiring."
                : selectedCategory
                ? "Bu kategoriyada mahsulot yo'q."
                : "Hozircha mahsulotlar mavjud emas."
            }
            actionLabel={searchQuery || selectedCategory ? "Tozalash" : undefined}
            onAction={searchQuery || selectedCategory ? () => {
              setSearchQuery("");
              setSelectedCategory(null);
            } : undefined}
          />
        ) : (
          <>
            {/* Results count */}
            <div className="mb-3 text-sm text-muted-foreground">
              {products.length} ta mahsulot topildi
            </div>
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
                  onViewDetails={(id) => setSelectedProductId(id)}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
