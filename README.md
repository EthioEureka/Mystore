# Telegram Shop Marketplace

A mobile-first, multi-vendor product discovery platform running primarily inside Telegram as a **Telegram Mini App**, with a responsive merchant dashboard and platform admin console.

> **Important business rule:** The platform does **not** process online payments, collect card credentials, or confirm transaction settlements. Customers discover products, inspect variants/stock, and submit a **contact purchase inquiry**. All payment arrangements, negotiation, and delivery take place directly between the customer and shop owner through Telegram or phone call.

---

## 🛠️ Technology Stack

- **Backend**: Laravel 13, PHP 8.3+
- **Database**: MySQL 8
- **Frontend**: Vue 3, Inertia.js 2.0, Tailwind CSS 4, Vite
- **Telegram Integration**: Telegram Mini Apps SDK, Telegram Bot API webhook, verified `initData` signature validation
- **Testing**: PHPUnit / Laravel Test Suite

---

## 📱 Mobile UI Flows (Telegram Mini App)

1. **Marketplace Discovery (`/`)**: Search bar, category chips, featured merchant shops, and 2-column product grid with in-stock indicators and favorites.
2. **Search & Categories (`/search`, `/categories`)**: Debounced query search, filter chips, and sorting (Newest, Price Low to High, Price High to Low).
3. **Public Shop Storefront (`/shops/{slug}`)**: Merchant bio, verified badge, operating hours, public address, direct contact actions (`Message on Telegram`, `Call Shop`), and published catalog.
4. **Product Detail (`/shops/{shopSlug}/products/{productSlug}`)**: Carousel image view, variant selectors (size/color), stock availability badge, quantity stepper, and primary action: **Request to Buy / Inquire**.
5. **Inquiry Checkout (`/shops/{shopSlug}/products/{productSlug}/inquire`)**: Customer contact form (Full Name, Phone Number, optional Telegram Username, preferred contact method, note) with non-payment acknowledgment checkbox.
6. **Inquiry Confirmation (`/inquiries/confirmation/{ref}`)**: Displays unique reference (e.g. `INQ-2026-XXXXXX`), immutable product & price snapshot, and instant contact buttons (`Message Shop on Telegram`, `Call Shop`).
7. **Customer Inquiry History (`/inquiries/history`)**: Real-time status tracker (`sent`, `viewed`, `responded`, `closed`, `cancelled`).
8. **Saved Items (`/saved`)**: Personal saved wishlist for quick access.

---

## 💼 Shop Manager Dashboard (`/manager`)

- **Dashboard**: High-level store analytics (products count, pending purchase inquiries, low-stock warnings) and recent inquiries table.
- **Product Management**: Full CRUD for products, SKU, price/sale price, variants, stock, and archive action.
- **Inventory & Stock Adjustments**: Instant quantity adjustments (set, add, deduct) with automatic movement audit history.
- **Inquiry Management**: View customer inquiries, inspect immutable product snapshots, access 1-click customer Telegram/Phone links, and update inquiry status (`viewed`, `responded`, `closed`, `cancelled`) with private manager notes.
- **Shop Profile & Contact Settings**: Configure store bio, public Telegram username, phone number, physical address, business hours, and delivery policies.

---

## 🛡️ Admin Console (`/admin`)

- **Platform Overview**: System-wide counts for users, shops, catalog items, inquiries, and recent moderation audit logs.
- **Shop Moderation**: Approve, suspend, or reject merchant storefronts with reasons logged to `audit_logs`.
- **Category Management**: Create, edit, and reorder marketplace product categories.
- **User Moderation**: View roles (`customer`, `shop_owner`, `admin`) and toggle active/suspended statuses.
- **Marketplace Settings**: Default currency, shop registration permissions, and Telegram Bot status monitoring.

---

## 🚀 Getting Started

### 1. Database & Environment Configuration

Copy environment file and set MySQL credentials:

```bash
cp .env.example .env
php artisan key:generate
```

Configure `.env`:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=telegram_shop_marketplace
DB_USERNAME=your_mysql_user
DB_PASSWORD=your_mysql_password

TELEGRAM_BOT_TOKEN=your_botfather_token_optional
TELEGRAM_BOT_USERNAME=your_bot_username
```

### 2. Run Database Migrations and Seeders

```bash
php artisan migrate --seed
```

This populates default administrators, demo shop owners, categories, sample headphones/cosmetics products, variants, and test inquiries.

### 3. Demo Credentials

- **Platform Administrator**:
  - Email: `admin@example.com`
  - Password: `password123`
- **Shop Owner (SellMate Gadgets)**:
  - Email: `jenny@sellmate.com`
  - Password: `password123`
- **Shop Owner (Herbivore Botanicals)**:
  - Email: `herbi@store.com`
  - Password: `password123`

### 4. Build Assets & Start Development Server

```bash
npm run build
php artisan serve
```

---

## 🤖 Telegram Bot & Mini App Setup

1. Open [@BotFather](https://t.me/BotFather) on Telegram and create a new bot (`/newbot`).
2. Set the Mini App domain via `/newapp` or configure the Menu Button URL to your application domain: `https://yourdomain.com`.
3. Set the webhook URL to receive `/start` commands and deep links:
   ```bash
   curl -F "url=https://yourdomain.com/telegram/webhook" https://api.telegram.org/bot<YOUR_BOT_TOKEN>/setWebhook
   ```
4. Supported deep links:
   - General Marketplace: `https://t.me/<BOT_USERNAME>?start=marketplace`
   - Direct Shop Storefront: `https://t.me/<BOT_USERNAME>?start=shop_<SHOP_SLUG>`
   - Direct Product Search: `https://t.me/<BOT_USERNAME>?start=product_<QUERY>`

---

## 🧪 Running Automated Tests

```bash
php artisan test
```
