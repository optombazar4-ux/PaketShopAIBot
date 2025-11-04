import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";

const checkoutSchema = z.object({
  name: z.string().min(2, "Ism kamida 2 ta belgidan iborat bo'lishi kerak"),
  phone: z.string().min(9, "Telefon raqami noto'g'ri"),
  address: z.string().min(10, "Manzilni to'liq kiriting"),
});

type CheckoutFormData = z.infer<typeof checkoutSchema>;

interface CheckoutFormProps {
  defaultName?: string;
  defaultPhone?: string;
  onSubmit?: (data: CheckoutFormData) => void;
  isLoading?: boolean;
}

export default function CheckoutForm({ 
  defaultName = "", 
  defaultPhone = "", 
  onSubmit,
  isLoading = false 
}: CheckoutFormProps) {
  const form = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      name: defaultName,
      phone: defaultPhone,
      address: "",
    },
  });

  const handleSubmit = (data: CheckoutFormData) => {
    console.log("Checkout form submitted:", data);
    onSubmit?.(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ism *</FormLabel>
              <FormControl>
                <Input 
                  placeholder="To'liq ismingizni kiriting" 
                  {...field} 
                  data-testid="input-name"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Telefon raqam *</FormLabel>
              <FormControl>
                <Input 
                  type="tel" 
                  placeholder="+998 90 123 45 67" 
                  {...field} 
                  data-testid="input-phone"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Yetkazib berish manzili *</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Shahar, ko'cha, uy raqami..." 
                  rows={3}
                  {...field} 
                  data-testid="input-address"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button 
          type="submit" 
          className="w-full" 
          size="lg"
          disabled={isLoading}
          data-testid="button-submit-order"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Buyurtma yuklanmoqda...
            </>
          ) : (
            "Buyurtmani tasdiqlash"
          )}
        </Button>
      </form>
    </Form>
  );
}
