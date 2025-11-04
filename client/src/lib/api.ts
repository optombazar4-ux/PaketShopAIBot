import { WooCommerceProduct, WooCommerceCategory, CartItem } from "@shared/schema";

const API_BASE = '';

export const api = {
  // Products
  async getProducts(params?: { search?: string; category?: number; page?: number; per_page?: number }): Promise<WooCommerceProduct[]> {
    const query = new URLSearchParams();
    if (params?.search) query.set('search', params.search);
    if (params?.category) query.set('category', params.category.toString());
    if (params?.page) query.set('page', params.page.toString());
    if (params?.per_page) query.set('per_page', params.per_page.toString());
    
    const response = await fetch(`${API_BASE}/api/products?${query}`);
    if (!response.ok) throw new Error('Failed to fetch products');
    return response.json();
  },

  async getProduct(id: number): Promise<WooCommerceProduct> {
    const response = await fetch(`${API_BASE}/api/products/${id}`);
    if (!response.ok) throw new Error('Failed to fetch product');
    return response.json();
  },

  async getCategories(): Promise<WooCommerceCategory[]> {
    const response = await fetch(`${API_BASE}/api/categories`);
    if (!response.ok) throw new Error('Failed to fetch categories');
    return response.json();
  },

  // Cart
  async getCart(userId: string): Promise<CartItem[]> {
    const response = await fetch(`${API_BASE}/api/cart/${userId}`);
    if (!response.ok) throw new Error('Failed to fetch cart');
    return response.json();
  },

  async addToCart(userId: string, item: {
    productId: number;
    productName: string;
    productPrice: string;
    productImage?: string;
    quantity: number;
  }): Promise<CartItem> {
    const response = await fetch(`${API_BASE}/api/cart/${userId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(item),
    });
    if (!response.ok) throw new Error('Failed to add to cart');
    return response.json();
  },

  async updateCartItem(itemId: string, quantity: number): Promise<CartItem> {
    const response = await fetch(`${API_BASE}/api/cart/item/${itemId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ quantity }),
    });
    if (!response.ok) throw new Error('Failed to update cart item');
    return response.json();
  },

  async removeCartItem(itemId: string): Promise<void> {
    const response = await fetch(`${API_BASE}/api/cart/item/${itemId}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to remove cart item');
  },

  // Orders
  async createOrder(orderData: {
    userId?: string;
    customerName: string;
    customerPhone: string;
    customerAddress: string;
    cartItems: Array<{
      productId: number;
      productName: string;
      productPrice: string;
      quantity: number;
    }>;
  }): Promise<{ success: boolean; orderId: number; orderNumber: string }> {
    const response = await fetch(`${API_BASE}/api/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to create order');
    }
    return response.json();
  },
};
