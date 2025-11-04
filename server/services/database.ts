import { db } from '../db';
import { users, cartItems, conversationHistory } from '../db/schema';
import { eq, and } from 'drizzle-orm';

export class DatabaseService {
  async findOrCreateUser(telegramUser: {
    id: number;
    first_name: string;
    last_name?: string;
    username?: string;
  }) {
    const telegramId = telegramUser.id.toString();
    
    const existingUser = await db.query.users.findFirst({
      where: eq(users.telegramId, telegramId),
    });

    if (existingUser) {
      return existingUser;
    }

    const [newUser] = await db.insert(users).values({
      telegramId,
      firstName: telegramUser.first_name,
      lastName: telegramUser.last_name,
      username: telegramUser.username,
    }).returning();

    return newUser;
  }

  async addToCart(userId: string, product: {
    productId: number;
    productName: string;
    productPrice: string;
    productImage?: string;
    quantity: number;
  }) {
    const existing = await db.query.cartItems.findFirst({
      where: and(
        eq(cartItems.userId, userId),
        eq(cartItems.productId, product.productId)
      ),
    });

    if (existing) {
      const [updated] = await db
        .update(cartItems)
        .set({ quantity: existing.quantity + product.quantity })
        .where(eq(cartItems.id, existing.id))
        .returning();
      return updated;
    }

    const [newItem] = await db.insert(cartItems).values({
      userId,
      ...product,
    }).returning();

    return newItem;
  }

  async getCartItems(userId: string) {
    return db.query.cartItems.findMany({
      where: eq(cartItems.userId, userId),
    });
  }

  async updateCartItemQuantity(itemId: string, quantity: number) {
    const [updated] = await db
      .update(cartItems)
      .set({ quantity })
      .where(eq(cartItems.id, itemId))
      .returning();
    return updated;
  }

  async removeCartItem(itemId: string) {
    await db.delete(cartItems).where(eq(cartItems.id, itemId));
  }

  async clearCart(userId: string) {
    await db.delete(cartItems).where(eq(cartItems.userId, userId));
  }

  async saveConversation(userId: string, data: {
    userMessage: string;
    botResponse: string;
    recommendedProducts?: any;
  }) {
    const [conversation] = await db.insert(conversationHistory).values({
      userId,
      ...data,
    }).returning();
    return conversation;
  }

  async getConversationHistory(userId: string, limit = 10) {
    return db.query.conversationHistory.findMany({
      where: eq(conversationHistory.userId, userId),
      orderBy: (history, { desc }) => [desc(history.createdAt)],
      limit,
    });
  }
}

export const databaseService = new DatabaseService();
