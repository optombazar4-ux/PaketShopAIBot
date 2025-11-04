# PaketShop AI Sotuvchi Bot

AI-powered Telegram shopping assistant for paketshop.uz using Gemini AI, WooCommerce integration, and Telegram Web App.

## Features

- 🤖 **AI Product Recommendations** - Natural language product search using Gemini AI
- 📱 **Telegram Web App** - Beautiful mobile shopping experience
- 🛒 **Shopping Cart** - Persistent cart management with database
- 💳 **Cash on Delivery** - Orders created directly in WooCommerce with "On-Hold" status
- 🎯 **Smart Search** - AI understands customer requests and recommends relevant products

## Setup Instructions

### 1. Environment Variables

Copy `.env.example` and set the following:

```bash
# Required: Telegram Bot Token from @BotFather
TELEGRAM_BOT_TOKEN=your_bot_token

# Required: Your Replit app URL
WEB_APP_URL=https://your-repl-name.repl.co

# Required: WooCommerce API Credentials
WOOCOMMERCE_URL=https://paketshop.uz
WOOCOMMERCE_CONSUMER_KEY=ck_xxxxx
WOOCOMMERCE_CONSUMER_SECRET=cs_xxxxx

# Required: Google Gemini API Key
GEMINI_API_KEY=your_gemini_key
```

### 2. Get API Keys

**Telegram Bot:**
1. Message @BotFather on Telegram
2. Use `/newbot` command
3. Copy the bot token

**WooCommerce API:**
1. Go to WooCommerce → Settings → Advanced → REST API
2. Add Key with Read/Write permissions
3. Copy Consumer Key and Consumer Secret

**Gemini AI:**
1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create new API key
3. Copy the key

### 3. Run the Application

The application automatically:
- Sets up PostgreSQL database
- Runs database migrations
- Starts Telegram bot
- Launches web server on port 5000

### 4. Configure Telegram Web App

1. Open your bot in Telegram
2. Use `/setmenubutton` in @BotFather
3. Set the Web App URL to your Replit URL

## Architecture

```
/server
  /bot         - Telegram bot logic
  /services    - WooCommerce, Gemini AI, Database services
  /db          - Drizzle ORM schema and migrations
  routes.ts    - Express API endpoints

/client
  /src
    /components - React components
    /pages      - Main app pages (Catalog, Cart, Profile)
    /lib        - API client, Telegram integration
    /hooks      - Custom React hooks (useCart)
```

## API Endpoints

- `GET /api/products` - Fetch products from WooCommerce
- `GET /api/products/:id` - Get single product
- `GET /api/cart/:userId` - Get user's cart
- `POST /api/cart/:userId` - Add item to cart
- `PATCH /api/cart/item/:itemId` - Update cart item quantity
- `DELETE /api/cart/item/:itemId` - Remove cart item
- `POST /api/orders` - Create WooCommerce order

## Testing Checklist

- [ ] Bot `/start` command shows TWA buttons
- [ ] AI responds to natural language queries
- [ ] Product catalog loads from WooCommerce
- [ ] Add to cart functionality works
- [ ] Cart persists across sessions
- [ ] Checkout form validation works
- [ ] Orders appear in WooCommerce admin panel
- [ ] Bot confirms order creation

## Tech Stack

- **Frontend:** React, Vite, TailwindCSS, shadcn/ui
- **Backend:** Node.js, Express
- **Database:** PostgreSQL (Drizzle ORM)
- **APIs:** Telegram Bot API, WooCommerce REST API, Google Gemini AI
- **Deployment:** Replit

## License

MIT
