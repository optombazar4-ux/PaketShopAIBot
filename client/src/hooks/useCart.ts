import { useState, useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { useTelegram } from '@/lib/telegram';
import { CartItem } from '@shared/schema';

export function useCart() {
  const { user } = useTelegram();
  const userId = user?.id?.toString() || 'guest';
  const queryClient = useQueryClient();

  const { data: cartItems = [], isLoading } = useQuery<CartItem[]>({
    queryKey: ['/api/cart', userId],
    queryFn: () => api.getCart(userId),
    enabled: !!userId,
  });

  const addToCartMutation = useMutation({
    mutationFn: (item: {
      productId: number;
      productName: string;
      productPrice: string;
      productImage?: string;
      quantity: number;
    }) => api.addToCart(userId, item),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/cart', userId] });
    },
  });

  const updateQuantityMutation = useMutation({
    mutationFn: ({ itemId, quantity }: { itemId: string; quantity: number }) =>
      api.updateCartItem(itemId, quantity),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/cart', userId] });
    },
  });

  const removeItemMutation = useMutation({
    mutationFn: (itemId: string) => api.removeCartItem(itemId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/cart', userId] });
    },
  });

  const cartItemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return {
    cartItems,
    cartItemCount,
    isLoading,
    addToCart: addToCartMutation.mutate,
    updateQuantity: updateQuantityMutation.mutate,
    removeItem: removeItemMutation.mutate,
    isAddingToCart: addToCartMutation.isPending,
  };
}
