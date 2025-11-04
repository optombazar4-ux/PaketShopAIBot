import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, Phone, MapPin, Package, LogOut } from "lucide-react";
import { useTelegram } from "@/lib/telegram";

export default function Profile() {
  const { user, onClose } = useTelegram();

  //todo: remove mock functionality
  const userName = user?.first_name || "Foydalanuvchi";
  const userPhone = "+998 90 123 45 67";
  const orderCount = 3;

  return (
    <div className="pb-20">
      <div className="sticky top-0 z-10 bg-background border-b p-4">
        <h1 className="text-2xl font-bold">Profil</h1>
      </div>

      <div className="p-4 space-y-4">
        <Card className="p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center">
              <User className="w-8 h-8 text-primary-foreground" />
            </div>
            <div>
              <h2 className="text-xl font-semibold" data-testid="text-user-name">{userName}</h2>
              <p className="text-sm text-muted-foreground">PaketShop mijozi</p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-3 text-sm">
              <Phone className="w-4 h-4 text-muted-foreground" />
              <span data-testid="text-user-phone">{userPhone}</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Package className="w-4 h-4 text-muted-foreground" />
              <span data-testid="text-order-count">{orderCount} ta buyurtma</span>
            </div>
          </div>
        </Card>

        <div className="space-y-2">
          <Button 
            variant="outline" 
            className="w-full justify-start" 
            size="lg"
            data-testid="button-orders"
          >
            <Package className="w-4 h-4 mr-3" />
            Buyurtmalarim
          </Button>
          
          <Button 
            variant="outline" 
            className="w-full justify-start" 
            size="lg"
            data-testid="button-addresses"
          >
            <MapPin className="w-4 h-4 mr-3" />
            Manzillarim
          </Button>
        </div>

        <Card className="p-4 bg-muted/50">
          <h3 className="font-semibold mb-2">To'lov usuli</h3>
          <p className="text-sm text-muted-foreground">
            Yetkazib berganda to'lash (naqd yoki karta orqali)
          </p>
        </Card>

        <Button
          variant="destructive"
          className="w-full"
          size="lg"
          onClick={onClose}
          data-testid="button-close-app"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Ilovadan chiqish
        </Button>

        <p className="text-xs text-center text-muted-foreground pt-4">
          PaketShop AI Assistant v1.0
        </p>
      </div>
    </div>
  );
}
