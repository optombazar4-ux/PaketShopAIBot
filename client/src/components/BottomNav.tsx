import { Home, ShoppingCart, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface BottomNavProps {
  activeTab: 'catalog' | 'cart' | 'profile';
  cartItemCount?: number;
  onTabChange: (tab: 'catalog' | 'cart' | 'profile') => void;
}

export default function BottomNav({ activeTab, cartItemCount = 0, onTabChange }: BottomNavProps) {
  const tabs = [
    { id: 'catalog' as const, icon: Home, label: 'Katalog', testId: 'button-nav-catalog' },
    { id: 'cart' as const, icon: ShoppingCart, label: 'Savat', testId: 'button-nav-cart' },
    { id: 'profile' as const, icon: User, label: 'Profil', testId: 'button-nav-profile' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background border-t safe-area-inset-bottom">
      <div className="flex items-center justify-around h-16">
        {tabs.map(({ id, icon: Icon, label, testId }) => (
          <button
            key={id}
            onClick={() => {
              console.log(`Navigating to ${id}`);
              onTabChange(id);
            }}
            className={`flex flex-col items-center justify-center flex-1 h-full transition-colors hover-elevate relative ${
              activeTab === id ? 'text-primary' : 'text-muted-foreground'
            }`}
            data-testid={testId}
          >
            <div className="relative">
              <Icon className="w-6 h-6 mb-1" />
              {id === 'cart' && cartItemCount > 0 && (
                <Badge 
                  variant="destructive" 
                  className="absolute -top-2 -right-2 h-5 min-w-[1.25rem] px-1 text-xs flex items-center justify-center"
                  data-testid="badge-cart-count"
                >
                  {cartItemCount > 99 ? '99+' : cartItemCount}
                </Badge>
              )}
            </div>
            <span className="text-xs font-medium">{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
