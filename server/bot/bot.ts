import TelegramBot from 'node-telegram-bot-api';
import { wooCommerceService } from '../services/woocommerce';
import { geminiService } from '../services/gemini';
import { databaseService } from '../services/database';

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '';
const WEB_APP_URL = process.env.WEB_APP_URL || 'https://your-replit-url.repl.co';

if (!BOT_TOKEN) {
  console.warn('TELEGRAM_BOT_TOKEN not set. Bot will not start.');
}

export class PaketShopBot {
  private bot: TelegramBot | null = null;

  constructor() {
    if (BOT_TOKEN) {
      this.bot = new TelegramBot(BOT_TOKEN, { polling: true });
      this.setupHandlers();
      console.log('✅ Telegram bot started successfully');
    } else {
      console.warn('⚠️ Telegram bot not started - missing BOT_TOKEN');
    }
  }

  private setupHandlers() {
    if (!this.bot) return;

    // /start command
    this.bot.onText(/\/start/, async (msg) => {
      const chatId = msg.chat.id;
      const user = msg.from;

      if (user) {
        await databaseService.findOrCreateUser(user);
      }

      const welcomeMessage = `🛍 Assalomu alaykum, ${user?.first_name || 'hurmatli mijoz'}!

PaketShop AI Sotuvchi botiga xush kelibsiz!

Men sizga kerakli mahsulotni topishda yordam beraman. Shunchaki menga nima kerakligini yozing, masalan:
• "Menga yaxshi telefon kerak, 5 million gacha"
• "Eng arzon noutbuklar"
• "Gaming mouse"

Yoki quyidagi tugmalardan foydalaning:`;

      await this.bot!.sendMessage(chatId, welcomeMessage, {
        reply_markup: {
          keyboard: [
            [
              { text: '🤖 AI Maslahatchi' },
              { text: '📱 Katalog', web_app: { url: WEB_APP_URL } },
            ],
            [
              { text: '🛒 Savatcha', web_app: { url: `${WEB_APP_URL}?tab=cart` } },
            ],
          ],
          resize_keyboard: true,
        },
      });
    });

    // AI Consultant button
    this.bot.on('message', async (msg) => {
      const chatId = msg.chat.id;
      const text = msg.text;

      if (!text || text.startsWith('/') || text === '🤖 AI Maslahatchi') {
        if (text === '🤖 AI Maslahatchi') {
          await this.bot!.sendMessage(
            chatId,
            'Menga nima kerakligini yozing, men sizga eng mos mahsulotlarni topib beraman! 🔍'
          );
        }
        return;
      }

      // Show typing indicator
      await this.bot!.sendChatAction(chatId, 'typing');

      try {
        const user = msg.from;
        let dbUser;
        if (user) {
          dbUser = await databaseService.findOrCreateUser(user);
        }

        // Fetch products from WooCommerce
        const products = await wooCommerceService.getProducts({ per_page: 50 });

        // Get AI recommendations
        const recommendation = await geminiService.getRecommendations(text, products);

        // Save conversation
        if (dbUser) {
          await databaseService.saveConversation(dbUser.id, {
            userMessage: text,
            botResponse: recommendation.message,
            recommendedProducts: recommendation.productIds,
          });
        }

        // Send response
        await this.bot!.sendMessage(chatId, recommendation.message);

        // If products found, send them with inline buttons
        if (recommendation.productIds.length > 0) {
          const recommendedProducts = products.filter(p =>
            recommendation.productIds.includes(p.id)
          );

          for (const product of recommendedProducts.slice(0, 5)) {
            const productMessage = `📦 *${product.name}*\n\n💰 Narx: ${product.price} UZS\n\n${product.short_description || ''}`;

            const keyboard = {
              inline_keyboard: [
                [
                  {
                    text: '👁 Batafsil ko\'rish',
                    web_app: { url: `${WEB_APP_URL}?product=${product.id}` },
                  },
                ],
              ],
            };

            if (product.images && product.images[0]) {
              await this.bot!.sendPhoto(chatId, product.images[0].src, {
                caption: productMessage,
                parse_mode: 'Markdown',
                reply_markup: keyboard,
              });
            } else {
              await this.bot!.sendMessage(chatId, productMessage, {
                parse_mode: 'Markdown',
                reply_markup: keyboard,
              });
            }
          }

          // Add view all button
          await this.bot!.sendMessage(chatId, '📱 Barcha tavsiyalarni ko\'rish uchun:', {
            reply_markup: {
              inline_keyboard: [
                [
                  {
                    text: '📱 Katalogni ochish',
                    web_app: { url: WEB_APP_URL },
                  },
                ],
              ],
            },
          });
        }
      } catch (error: any) {
        console.error('Bot error:', error);
        await this.bot!.sendMessage(
          chatId,
          'Kechirasiz, xatolik yuz berdi. Iltimos, qaytadan urinib ko\'ring yoki katalogdan foydalaning.',
          {
            reply_markup: {
              inline_keyboard: [
                [
                  {
                    text: '📱 Katalogni ochish',
                    web_app: { url: WEB_APP_URL },
                  },
                ],
              ],
            },
          }
        );
      }
    });

    // Handle web app data (from TWA)
    this.bot.on('web_app_data', async (msg) => {
      const chatId = msg.chat.id;
      const data = JSON.parse(msg.web_app_data!.data);

      console.log('Received web app data:', data);

      if (data.type === 'order_created') {
        await this.bot!.sendMessage(
          chatId,
          `✅ Buyurtmangiz qabul qilindi!\n\nBuyurtma raqami: #${data.orderId}\n\nTez orada operatorlarimiz siz bilan bog'lanadi.`,
          {
            reply_markup: {
              keyboard: [
                [
                  { text: '🤖 AI Maslahatchi' },
                  { text: '📱 Katalog', web_app: { url: WEB_APP_URL } },
                ],
              ],
              resize_keyboard: true,
            },
          }
        );
      }
    });

    console.log('Bot handlers registered');
  }

  getBot() {
    return this.bot;
  }
}

export let botInstance: PaketShopBot | null = null;

export function initializeBot() {
  if (!botInstance) {
    botInstance = new PaketShopBot();
  }
  return botInstance;
}
