import BottomNav from '../BottomNav';
import { useState } from 'react';

export default function BottomNavExample() {
  const [activeTab, setActiveTab] = useState<'catalog' | 'cart' | 'profile'>('catalog');

  return (
    <div className="h-screen flex flex-col">
      <div className="flex-1 bg-muted/20 flex items-center justify-center">
        <p className="text-muted-foreground">Active: {activeTab}</p>
      </div>
      <BottomNav
        activeTab={activeTab}
        cartItemCount={3}
        onTabChange={setActiveTab}
      />
    </div>
  );
}
