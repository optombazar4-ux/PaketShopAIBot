# PaketShop AI Sales Bot - Complete Setup Guide

## 🚀 Quick Start

The application is now running and ready for configuration! Follow these steps to complete the setup.

## 📋 Prerequisites

You need the following API keys to enable full functionality:

### 1. Telegram Bot Token (REQUIRED)

**How to get:**
1. Open Telegram and search for [@BotFather](https://t.me/BotFather)
2. Send `/newbot` command
3. Follow the prompts to create your bot
4. Copy the API token provided
5. **IMPORTANT:** After creating the bot, send `/setmenubutton` to @BotFather
   - Select your bot
   - Click "Edit Menu Button URL"
   - Enter your Replit URL (e.g., `https://your-repl-name.repl.co`)

**Add to Replit Secrets:**
- Key: `TELEGRAM_BOT_TOKEN`
- Value: Your bot token (e.g., `1234567890:ABCdefGHIjklMNOpqrsTUVwxyz`)

### 2. WooCommerce API Credentials (REQUIRED)

**How to get:**
1. Log in to your WooCommerce admin panel (paketshop.uz/wp-admin)
2. Go to: WooCommerce → Settings → Advanced → REST API
3. Click "Add key"
4. Set permissions to **Read/Write**
5. Click "Generate API key"
6. Copy both the Consumer Key and Consumer Secret

**Add to Replit Secrets:**
- Key: `WOOCOMMERCE_CONSUMER_KEY`
- Value: Your consumer key (starts with `ck_`)

- Key: `WOOCOMMERCE_CONSUMER_SECRET`
- Value: Your consumer secret (starts with `cs_`)

- Key: `WOOCOMMERCE_URL`
- Value: `https://paketshop.uz`

### 3. Google Gemini API Key (REQUIRED for AI features)

**How to get:**
1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Click "Get API Key" or "Create API Key"
3. Copy the generated key

**Add to Replit Secrets:**
- Key: `GEMINI_API_KEY`
- Value: Your Gemini API key

### 4. Web App URL (REQUIRED)

**Set your Replit URL:**
- Key: `WEB_APP_URL`
- Value: Your Replit app URL (e.g., `https://your-repl-name.repl.co`)

## ✅ Configuration Checklist

After adding all secrets, verify your setup:

1. **Check Replit Secrets Panel** - All 6 environment variables should be set:
   - ✓ TELEGRAM_BOT_TOKEN
   - ✓ WEB_APP_URL
   - ✓ WOOCOMMERCE_URL
   - ✓ WOOCOMMERCE_CONSUMER_KEY
   - ✓ WOOCOMMERCE_CONSUMER_SECRET
   - ✓ GEMINI_API_KEY

2. **Restart the Application**
   - Stop the current workflow
   - Start it again to load the new environment variables

3. **Verify Bot is Running**
   - Check the console logs for: ✅ Telegram bot started successfully
   - If you see ⚠️ warnings about missing keys, double-check your secrets

## 🧪 Testing Your Bot

### Test 1: Bot Start Command
1. Open your bot in Telegram
2. Send `/start` command
3. **Expected:** Welcome message with keyboard buttons:
   - 🤖 AI Maslahatchi
   - 📱 Katalog (opens Web App)
   - 🛒 Savatcha (opens Web App)

### Test 2: AI Recommendations
1. Click "🤖 AI Maslahatchi" button
2. Send a natural language query like:
   - "Menga yaxshi telefon kerak, 5 million gacha"
   - "Eng arzon noutbuklar"
   - "Gaming mouse"
3. **Expected:** AI responds with product recommendations and images

### Test 3: Web App Catalog
1. Click "📱 Katalog" button
2. **Expected:** Telegram Web App opens showing:
   - Product grid with real products from WooCommerce
   - Working search functionality
   - Add to cart buttons

### Test 4: Shopping Cart
1. Add a few products to cart from the catalog
2. Click the cart icon in bottom navigation
3. **Expected:** 
   - Cart shows added products
   - Quantity can be adjusted
   - Items can be removed

### Test 5: Checkout & Order Creation
1. In the cart, click "Buyurtma berish" (Place Order)
2. Fill out the checkout form:
   - Name
   - Phone number
   - Delivery address
3. Click "Buyurtmani tasdiqlash" (Confirm Order)
4. **Expected:**
   - Success message in Web App
   - Notification sent back to Telegram chat
   - Order appears in WooCommerce admin with status "On Hold"
   - Payment method: "Cash on Delivery"

## 🔍 Troubleshooting

### Bot Not Starting
- **Issue:** Console shows "TELEGRAM_BOT_TOKEN not set"
- **Fix:** Add TELEGRAM_BOT_TOKEN to Replit Secrets and restart

### AI Not Working
- **Issue:** AI returns "AI xizmati hozirda ishlamayapti"
- **Fix:** Add GEMINI_API_KEY to Replit Secrets and restart

### No Products Loading
- **Issue:** Catalog shows "Mahsulot topilmadi"
- **Fix:** 
  - Verify WooCommerce credentials are correct
  - Check WooCommerce has published products
  - Check console logs for WooCommerce API errors

### Orders Not Creating
- **Issue:** Error when placing order
- **Fix:**
  - Verify WooCommerce API key has Read/Write permissions
  - Check product stock status in WooCommerce
  - Review console logs for detailed error messages

### Web App Button Not Working
- **Issue:** Clicking "Katalog" button does nothing
- **Fix:**
  - Set WEB_APP_URL environment variable
  - Run `/setmenubutton` in @BotFather and set the Web App URL

## 📊 Database Schema

The application uses PostgreSQL with the following tables:

- **users** - Telegram user profiles
- **cart_items** - Shopping cart persistence
- **conversation_history** - AI chat history

Database migrations run automatically on startup.

## 🎯 Feature Overview

### Telegram Bot Features
- ✅ Welcome message with inline keyboard
- ✅ Natural language AI product search
- ✅ Product recommendation with images
- ✅ Deep linking to specific products
- ✅ Order confirmation notifications

### Web App Features
- ✅ Product catalog with search
- ✅ Product detail modals
- ✅ Shopping cart management
- ✅ Checkout form with validation
- ✅ Real-time cart counter
- ✅ Mobile-first responsive design
- ✅ Telegram-native theming

### Backend Features
- ✅ WooCommerce REST API integration
- ✅ Gemini AI for recommendations
- ✅ PostgreSQL database
- ✅ RESTful API endpoints
- ✅ Session management

## 🔐 Security Notes

- All API keys are stored in Replit Secrets (encrypted)
- WooCommerce API uses OAuth 1.0 authentication
- Sessions use secure random secrets
- Database credentials are auto-managed by Replit

## 📝 Next Steps

After successful setup and testing:

1. **Customize Bot Messages** - Edit `server/bot/bot.ts` to change greetings and responses
2. **Adjust AI Prompts** - Modify `server/services/gemini.ts` to tune product recommendations
3. **Style the Web App** - Update `client/src/index.css` for custom branding
4. **Add More Features** - Extend with wishlist, user reviews, order tracking, etc.

## 🆘 Getting Help

If you encounter issues:

1. Check the console logs in Replit
2. Review the error messages in Telegram bot responses
3. Verify all environment variables are set correctly
4. Ensure WooCommerce has published products with stock
5. Test WooCommerce API directly using REST API tools

## 📄 License

MIT License - Feel free to use and modify for your projects!
