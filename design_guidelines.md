# Design Guidelines: PaketShop AI Sales Telegram Bot & Web App

## Design Approach

**Hybrid Strategy: Telegram Native + E-commerce Best Practices**

This project combines Telegram's native design language with proven e-commerce patterns from Shopify and Amazon mobile apps. The TWA must feel like a seamless extension of Telegram while providing a robust shopping experience.

**Key Principles:**
- Telegram-native aesthetics with var(--tg-theme-*) CSS variables
- Fast, thumb-friendly mobile interactions
- Clear visual hierarchy between AI chat and shopping interfaces
- Trust-building through clean, professional product presentation

---

## Typography

**Font System:**
- Primary: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif (system fonts for performance)
- Emoji support: Native system emoji fonts

**Type Scale:**
- Hero/Product Names: 24px, font-weight: 600
- Section Headers: 20px, font-weight: 600
- Body/Chat Messages: 16px, font-weight: 400
- Product Descriptions: 15px, font-weight: 400, line-height: 1.5
- Prices: 18px, font-weight: 700
- Helper Text/Labels: 14px, font-weight: 500
- Buttons: 16px, font-weight: 600

**Line Heights:** 1.4 for headers, 1.6 for body text to ensure readability in chat contexts

---

## Layout System

**Spacing Primitives (Tailwind units):**
- Core spacing set: 2, 3, 4, 6, 8, 12, 16, 20
- Component padding: p-4 (16px) as baseline
- Section spacing: mb-6, mb-8 for vertical rhythm
- Card gaps: gap-4 for grids

**Container Strategy:**
- Full-width: w-full with px-4 side padding
- Maximum content width: Not needed (mobile-only TWA)
- Chat container: max-w-full with px-3
- Product grid: grid-cols-2 with gap-3

---

## Component Library

### 1. Bot Chat Interface Components

**Message Bubbles:**
- User messages: Rounded rectangles (border-radius: 16px), right-aligned, maximum width 80%
- Bot messages: Left-aligned, same border-radius, with subtle avatar/icon
- AI recommendation cards: Embedded within bot messages as interactive product previews
- Spacing: mb-3 between consecutive messages, mb-6 when switching speakers

**Inline Keyboards:**
- Primary action buttons: Full-width with rounded-lg (8px), py-3, text-center
- Secondary buttons: Outline style with border-2
- Button groups: flex gap-2 for horizontal arrangement
- "View in Catalog" buttons: Compact size (py-2, px-4) with arrow indicator

### 2. TWA Product Catalog

**Product Cards (Grid View):**
- Layout: Two-column grid (grid-cols-2 gap-3)
- Card structure:
  - Product image: aspect-ratio: 1/1, object-fit: cover, rounded-t-lg
  - Info container: p-3 below image
  - Product name: Two-line truncation with text-ellipsis
  - Price: Bold, positioned below name with mt-2
  - "Add to Cart" button: Compact, positioned at card bottom (mt-auto)
- Card elevation: Subtle border or shadow (shadow-sm)
- Hover state: Scale transform (scale-105) with transition

**Product Detail View:**
- Hero image: Full-width, aspect-ratio: 4/3, swipeable gallery if multiple images
- Sticky header: Product name + back button at top
- Content sections: 
  - Price display: Large, prominent (text-2xl font-bold)
  - Stock indicator: Small badge (in-stock/low-stock)
  - Description: Collapsible if lengthy (max-h with "Read more")
  - Specifications: Grid layout (grid-cols-2 gap-y-2)
- Sticky footer: Quantity selector + "Add to Cart" button (sticky bottom-0)

### 3. Shopping Cart

**Cart Item Cards:**
- Horizontal layout: Image (80x80px) + Info + Controls
- Structure per item:
  - Product thumbnail: Left side, rounded-md
  - Product name & price: Center column with flex-1
  - Quantity controls: Right side with +/- buttons (w-8 h-8)
  - Remove button: Small icon (16x16) positioned top-right of card
- Spacing: mb-4 between cart items
- Total section: Sticky bottom with pt-4 border-t, showing subtotal and CTA

### 4. Checkout Form

**Form Layout:**
- Single-column form with mb-6 spacing between fields
- Field groups:
  - Customer Name: Pre-filled from Telegram, editable text input
  - Phone Number: Tel input with Uzbekistan country code prefix (+998)
  - Delivery Address: Textarea with rows="3", placeholder guidance
- Input styling:
  - Border: rounded-lg with border-2
  - Padding: px-4 py-3
  - Focus state: Ring effect (ring-2)
  - Labels: Above inputs with mb-2, font-weight: 600

**Order Summary Card:**
- Positioned above form or as collapsible section
- Shows: Line items (name × quantity), subtotal, delivery note
- Styling: Rounded card with p-4, subtle background treatment

**Submit Button:**
- Full-width, large (py-4), positioned at form bottom
- Clear CTA text: "Buyurtmani tasdiqlash" (Confirm Order)
- Loading state: Spinner icon with disabled appearance

### 5. Navigation & Controls

**Bottom Navigation (TWA):**
- Fixed bottom bar with safe-area-inset-bottom
- Three sections: Catalog, Cart (with badge counter), Profile/Help
- Icons: 24x24px with labels below (12px)

**Header Bar:**
- Sticky top position with backdrop-blur
- Left: Back button or menu icon
- Center: Page title
- Right: Cart icon with item count badge

---

## Images

### Product Images:
- **Hero sections:** Not applicable (no marketing hero - this is a functional app)
- **Product cards:** Required for every product
  - Format: Square (1:1 aspect ratio)
  - Quality: Optimized for mobile (800x800px max)
  - Placeholder: Skeleton loader or brand icon while loading
- **Product detail gallery:** 
  - Primary image: 4:3 aspect ratio, full width
  - Thumbnail strip: Below primary image if multiple views available
  - Zoom interaction: Tap to enlarge, pinch to zoom

### Chat Interface Images:
- **Bot avatar:** Small circular icon (32x32px) next to bot messages
- **Product recommendation previews:** Small thumbnail (60x60px) in AI response cards

### Placeholder Strategy:
- Loading states: Shimmer effect skeleton loaders
- Missing images: Gray background with camera icon

---

## Accessibility & UX

**Touch Targets:**
- Minimum size: 44x44px for all interactive elements
- Spacing between targets: min 8px to prevent mis-taps

**Feedback:**
- Button press: Opacity change (opacity-80) + quick scale
- Cart updates: Toast notification or inline confirmation
- Loading states: Skeleton screens for lists, spinner for actions

**Form Validation:**
- Inline validation: Show errors below fields in red with icon
- Required field indicators: Asterisk (*) in labels
- Success states: Green checkmark when valid

---

## Visual Hierarchy

**Emphasis Levels:**
1. **Critical actions:** Primary buttons (Add to Cart, Confirm Order) - highest contrast
2. **Product prices:** Bold typography, larger size
3. **Product names:** Medium weight, readable size
4. **Descriptions/metadata:** Regular weight, slightly smaller

**Scanning Patterns:**
- Product grids: F-pattern optimized (image top, info below)
- Chat: Chronological bottom-to-top flow
- Forms: Linear top-to-bottom progression

---

## Motion & Transitions

**Minimal Animation Approach:**
- Page transitions: Slide in/out (200ms ease-out)
- Cart badge update: Gentle scale pulse (150ms)
- Product card hover: Subtle lift (transform: translateY(-2px))
- No auto-playing carousels or distracting motion

---

## Telegram-Specific Adaptations

**Theme Integration:**
- Background: var(--tg-theme-bg-color)
- Text: var(--tg-theme-text-color)
- Buttons: var(--tg-theme-button-color) for primary actions
- Secondary background: var(--tg-theme-secondary-bg-color)

**Safe Areas:**
- Account for Telegram's header: pt-2 on main content
- Bottom navigation clear of system gestures: pb-safe

**MainButton API:**
- Use for primary checkout action
- Secondary actions stay in UI (not in MainButton)