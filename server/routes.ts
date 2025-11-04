import type { Express } from "express";
import { createServer, type Server } from "http";
import express from "express";
import { wooCommerceService } from "./services/woocommerce";
import { databaseService } from "./services/database";
import { initializeBot } from "./bot/bot";

export async function registerRoutes(app: Express): Promise<Server> {
  // Initialize Telegram bot
  initializeBot();

  // Middleware
  app.use(express.json());

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // Get products from WooCommerce
  app.get('/api/products', async (req, res) => {
    try {
      const { search, category, page, per_page } = req.query;
      const products = await wooCommerceService.getProducts({
        search: search as string,
        category: category as string,
        page: page ? parseInt(page as string) : 1,
        per_page: per_page ? parseInt(per_page as string) : 20,
      });
      res.json(products);
    } catch (error: any) {
      console.error('Error fetching products:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // Get single product
  app.get('/api/products/:id', async (req, res) => {
    try {
      const productId = parseInt(req.params.id);
      const product = await wooCommerceService.getProductById(productId);
      if (!product) {
        return res.status(404).json({ error: 'Mahsulot topilmadi' });
      }
      res.json(product);
    } catch (error: any) {
      console.error('Error fetching product:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // Get cart items for a user
  app.get('/api/cart/:userId', async (req, res) => {
    try {
      const { userId } = req.params;
      const cartItems = await databaseService.getCartItems(userId);
      res.json(cartItems);
    } catch (error: any) {
      console.error('Error fetching cart:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // Add item to cart
  app.post('/api/cart/:userId', async (req, res) => {
    try {
      const { userId } = req.params;
      const { productId, productName, productPrice, productImage, quantity } = req.body;

      const cartItem = await databaseService.addToCart(userId, {
        productId,
        productName,
        productPrice,
        productImage,
        quantity: quantity || 1,
      });

      res.json(cartItem);
    } catch (error: any) {
      console.error('Error adding to cart:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // Update cart item quantity
  app.patch('/api/cart/item/:itemId', async (req, res) => {
    try {
      const { itemId } = req.params;
      const { quantity } = req.body;

      if (quantity < 1) {
        return res.status(400).json({ error: 'Miqdor 1 dan kam bo\'lmasligi kerak' });
      }

      const updated = await databaseService.updateCartItemQuantity(itemId, quantity);
      res.json(updated);
    } catch (error: any) {
      console.error('Error updating cart item:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // Remove cart item
  app.delete('/api/cart/item/:itemId', async (req, res) => {
    try {
      const { itemId } = req.params;
      await databaseService.removeCartItem(itemId);
      res.json({ success: true });
    } catch (error: any) {
      console.error('Error removing cart item:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // Create order (from TWA checkout)
  app.post('/api/orders', async (req, res) => {
    try {
      const { userId, customerName, customerPhone, customerAddress, cartItems } = req.body;

      if (!customerName || !customerPhone || !customerAddress || !cartItems || cartItems.length === 0) {
        return res.status(400).json({ error: 'Barcha maydonlarni to\'ldiring' });
      }

      // Prepare line items for WooCommerce
      const lineItems = cartItems.map((item: any) => ({
        product_id: item.productId,
        quantity: item.quantity,
      }));

      // Create order in WooCommerce
      const order = await wooCommerceService.createOrder({
        customerName,
        customerPhone,
        customerAddress,
        lineItems,
      });

      // Clear user's cart after successful order
      if (userId) {
        await databaseService.clearCart(userId);
      }

      res.json({
        success: true,
        orderId: order.id,
        orderNumber: order.number,
        order,
      });
    } catch (error: any) {
      console.error('Error creating order:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // Get conversation history
  app.get('/api/conversations/:userId', async (req, res) => {
    try {
      const { userId } = req.params;
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
      const conversations = await databaseService.getConversationHistory(userId, limit);
      res.json(conversations);
    } catch (error: any) {
      console.error('Error fetching conversations:', error);
      res.status(500).json({ error: error.message });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
