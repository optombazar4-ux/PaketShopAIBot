import { useState, useEffect } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import BottomNav from "@/components/BottomNav";
import Catalog from "@/pages/Catalog";
import Cart from "@/pages/Cart";
import Profile from "@/pages/Profile";
import { initTelegramApp } from "@/lib/telegram";

type TabType = 'catalog' | 'cart' | 'profile';

function App() {
  const [activeTab, setActiveTab] = useState<TabType>('catalog');
  const [cartItemCount] = useState(2); //todo: remove mock functionality - get from actual cart state

  useEffect(() => {
    initTelegramApp();
  }, []);

  const renderContent = () => {
    switch (activeTab) {
      case 'catalog':
        return <Catalog />;
      case 'cart':
        return <Cart />;
      case 'profile':
        return <Profile />;
      default:
        return <Catalog />;
    }
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="min-h-screen bg-background">
          {renderContent()}
          <BottomNav 
            activeTab={activeTab} 
            cartItemCount={cartItemCount}
            onTabChange={setActiveTab}
          />
        </div>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
