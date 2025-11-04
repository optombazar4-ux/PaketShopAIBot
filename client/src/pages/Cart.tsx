import { useState } from "react";
import CartItemCard from "@/components/CartItemCard";
import CheckoutForm from "@/components/CheckoutForm";
import EmptyState from "@/components/EmptyState";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ShoppingCart, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

//todo: remove mock functionality
const MOCK_CART_ITEMS = [
  {
    id: "1",
    productId: 1,
    productName: "Samsung Galaxy A54 5G 8/256GB",
    productPrice: "3,299,000 UZS",
    quantity: 2,
  },
  {
    id: "2",
    productId: 2,
    productName: "Apple AirPods Pro 2nd Generation",
    productPrice: "2,499,000 UZS",
    quantity: 1,
  },
];

export default function Cart() {
  const [cartItems, setCartItems] = useState(MOCK_CART_ITEMS); //todo: remove mock functionality
  const [showCheckout, setShowCheckout] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleUpdateQuantity = (id: string, newQuantity: number) => {
    setCartItems(items =>
      items.map(item => item.id === id ? { ...item, quantity: newQuantity } : item)
    );
  };

  const handleRemoveItem = (id: string) => {
    setCartItems(items => items.filter(item => item.id !== id));
    toast({
      title: "Mahsulot o'chirildi",
      description: "Mahsulot savatdan olib tashlandi",
    });
  };

  const handleCheckout = async (formData: any) => {
    console.log("Submitting order:", formData, cartItems);
    setIsSubmitting(true);
    //todo: remove mock functionality - implement actual order submission
    setTimeout(() => {
      setIsSubmitting(false);
      toast({
        title: "Buyurtma qabul qilindi!",
        description: "Tez orada siz bilan bog'lanamiz",
      });
      setShowCheckout(false);
      setCartItems([]);
    }, 2000);
  };

  if (cartItems.length === 0) {
    return (
      <div className="h-screen flex items-center justify-center pb-20">
        <EmptyState
          icon={ShoppingCart}
          title="Savatingiz bo'sh"
          description="Hozircha savatingizda mahsulot yo'q. Katalogdan o'zingizga kerakli mahsulotlarni tanlang."
        />
      </div>
    );
  }

  if (showCheckout) {
    return (
      <div className="pb-20">
        <div className="sticky top-0 z-10 bg-background border-b p-4">
          <div className="flex items-center gap-3">
            <Button
              size="icon"
              variant="ghost"
              onClick={() => setShowCheckout(false)}
              data-testid="button-back-to-cart"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-2xl font-bold">Buyurtma rasmiylashtirish</h1>
          </div>
        </div>

        <div className="p-4 space-y-6">
          <Card className="p-4">
            <h3 className="font-semibold mb-3">Buyurtma tafsilotlari</h3>
            <div className="space-y-2">
              {cartItems.map(item => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    {item.productName} × {item.quantity}
                  </span>
                  <span className="font-medium">{item.productPrice}</span>
                </div>
              ))}
              <Separator className="my-3" />
              <div className="flex justify-between font-semibold">
                <span>Jami:</span>
                <span data-testid="text-total-price">8,097,000 UZS</span>
              </div>
            </div>
          </Card>

          <CheckoutForm
            onSubmit={handleCheckout}
            isLoading={isSubmitting}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="pb-20">
      <div className="sticky top-0 z-10 bg-background border-b p-4">
        <h1 className="text-2xl font-bold">Savatcha</h1>
      </div>

      <div className="p-4 space-y-4">
        {cartItems.map(item => (
          <CartItemCard
            key={item.id}
            {...item}
            onUpdateQuantity={handleUpdateQuantity}
            onRemove={handleRemoveItem}
          />
        ))}

        <Card className="p-4 mt-6">
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Mahsulotlar:</span>
              <span className="font-medium">{cartItems.reduce((sum, item) => sum + item.quantity, 0)} dona</span>
            </div>
            <Separator />
            <div className="flex justify-between items-center">
              <span className="font-semibold text-lg">Jami:</span>
              <span className="font-bold text-xl" data-testid="text-cart-total">8,097,000 UZS</span>
            </div>
          </div>
        </Card>

        <Button
          className="w-full"
          size="lg"
          onClick={() => setShowCheckout(true)}
          data-testid="button-proceed-checkout"
        >
          Buyurtma berish
        </Button>
      </div>
    </div>
  );
}
