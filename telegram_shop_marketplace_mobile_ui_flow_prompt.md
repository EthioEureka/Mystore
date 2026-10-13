# Telegram Shop Marketplace — Mobile UI Flow & Agent Build Prompt

## 1. Product Goal

Build a mobile-first, multi-vendor product discovery platform that runs primarily inside Telegram as a Telegram Mini App. Shop owners manage their stores through a responsive web dashboard, which can also be opened from Telegram.

Customers browse products, inspect available variants and stock, and submit a **contact request / purchase inquiry** containing their name, phone number, Telegram username (when available), chosen product options, and quantity. The platform then helps the customer contact the shop owner through Telegram or a phone call.

**Important business rule:** The platform does **not** process payments, collect card details, or confirm payments. Payment, delivery arrangements, negotiation, and the final transaction happen directly between the customer and shop owner outside the platform, through phone, Telegram, or another agreed method.

The checkout page is therefore an **inquiry checkout**, not a payment checkout. Do not add payment gateway integration, online payment forms, payment-provider SDKs, or a “Pay now” action.

## 2. Suggested Technology

- Backend: Laravel 12 (or the compatible version already used by the repository), PHP 8.3+
- Database: MySQL 8
- Frontend: Vue 3 + Inertia.js + TypeScript + Tailwind CSS
- Telegram: Telegram Bot API, Telegram Mini Apps SDK, bot webhook, deep links
- Images: S3-compatible object storage or another production-ready file storage service
- Tests: Pest or PHPUnit
- Queue: Laravel queues; Redis if available, database queue otherwise

Keep the architecture modular and avoid unnecessary microservices. Both the public Mini App and manager dashboard should use the same Laravel backend and authorization rules.

---

# Part A — Complete Mobile Customer UI Flow

## 3. Customer Journey Map

```text
Open Telegram Bot
    |
    v
/start welcome message
    |
    v
Tap "Browse Shops" / "Explore Products"
    |
    v
Marketplace Home
    |------------------------------|
    |                              |
    v                              v
Search Products               Browse Categories
    |                              |
    |--------------+---------------|
                   v
             Product Results
                   |
                   v
              Product Page
                   |
        Select size/color/variant
        Check price and availability
                   |
          +--------+---------+
          |                  |
          v                  v
   Save/Favorite        Contact / Buy
                             |
                             v
                     Inquiry Checkout
                             |
                             v
                  Enter contact details
                  Name + phone + Telegram
                  Variant + quantity
                  Optional note
                             |
                             v
                   Review inquiry summary
                             |
                             v
                   Submit inquiry request
                             |
                             v
                   Inquiry confirmation
                             |
              +--------------+--------------+
              |                             |
              v                             v
       Contact on Telegram           Call shop owner
              |                             |
              +--------------+--------------+
                             |
                             v
             Customer and owner agree on
             payment, delivery, and final sale
                             |
                             v
             Optional inquiry status updates
             in the app (not payment processing)
```

## 4. Telegram Entry and Welcome

### Entry points
- Main bot deep link: `https://t.me/<BOT_USERNAME>?start=marketplace`
- Shop deep link: `https://t.me/<BOT_USERNAME>?start=shop_<SHOP_SLUG>`
- Product deep link: `https://t.me/<BOT_USERNAME>?start=product_<PRODUCT_ID_OR_SLUG>`

Use Telegram's supported deep-link and Mini App launch patterns. Configure the actual bot username and Mini App URL through environment/settings; do not hardcode production credentials.

### `/start` bot message
Message:
> Welcome to [Marketplace Name] 👋  
> Discover products from local shops, check availability, and contact shop owners directly to arrange your purchase.

Buttons:
- **Browse Products** — opens Mini App marketplace
- **Browse Shops** — opens shop discovery
- **Search Products** — opens search view
- **How It Works** — explains that payment and delivery are arranged directly with the shop
- **My Inquiries** — opens the user's inquiry history when identity is available

If the deep link contains a shop or product reference, open that specific destination instead of always showing the homepage.

## 5. Screen 1 — Marketplace Home

### Layout
1. Compact top bar:
   - Marketplace logo/name
   - Search icon or search input
   - Optional customer/account icon
2. Search field with placeholder: `Search products, shops, brands...`
3. Category chips or a horizontally scrollable category row
4. Featured shops section
5. Popular or recently added products
6. Product cards in a two-column mobile grid
7. Bottom navigation:
   - Home
   - Categories
   - Search
   - Saved
   - My Inquiries

### Product card
- Product image
- Product name (two lines maximum)
- Price and currency
- Shop name
- Availability label: `In stock`, `Low stock` (optional), or `Out of stock`
- Favorite icon
- Tap card to open details

Do not show private shop contact information on every product card. Show public contact actions on the product detail and inquiry confirmation pages.

### States
- Loading skeletons
- Empty marketplace state
- Network/API error with retry
- No featured products
- Telegram theme-aware appearance when available, with a usable default theme in a regular browser

## 6. Screen 2 — Search and Category Results

### Search behavior
- Search product title, description, shop name, category, and supported attributes.
- Debounce search requests.
- Support pagination or infinite scroll.
- Keep filters usable on small screens.

### Filters
- Category
- Shop
- Minimum and maximum price
- Availability
- Size/color/brand when relevant to the category

### Sorting
- Relevance
- Newest
- Price: low to high
- Price: high to low

Each result uses the same product card as the homepage. Provide a clear “Clear filters” action and a useful empty state when nothing matches.

## 7. Screen 3 — Shop Discovery

Show a list/grid of public shops with:
- Logo
- Shop name
- Short description
- Category
- Optional public area/address
- Number of currently published products, if useful
- Open Shop button

Shop page:
- Cover and logo
- Name and description
- Shop category
- Public business hours (optional)
- Public address (optional)
- Product search within this shop
- Product categories
- Published product grid
- Contact shop action if contact details are public

Only show shops that are approved and active. Suspended or unapproved shops must not accept new inquiries.

## 8. Screen 4 — Product Detail

### Layout
1. Image gallery/carousel
2. Product name
3. Price and currency
4. Shop name with link to shop page
5. Stock/availability status
6. Product description
7. Variant selectors:
   - Size
   - Color
   - Other configurable options
8. Quantity selector
9. SKU/product code (optional)
10. Delivery note: `Delivery and final cost are arranged directly with the shop.`
11. Primary action: **Contact Shop / Request to Buy**
12. Secondary action: **Save Item**
13. Related products

### Variant behavior
- A selected variant must have a valid combination of attributes.
- Show availability and variant-specific price if applicable.
- Prevent selecting unavailable variants.
- If out of stock, disable the request action or allow a non-binding “Ask about availability” inquiry, clearly labelled.
- Revalidate product status and variant availability on the server when the inquiry is submitted.

### Contact action
If a valid Telegram username is available, provide `Message on Telegram`.
If a public phone number is available, provide `Call Shop`.
If both exist, show both actions but keep **Request to Buy** as the main guided flow.

Do not assume every Telegram user has a username. Use a phone link only when the owner has chosen to publish a contact number.

## 9. Screen 5 — Inquiry Checkout (No Online Payment)

This is the most important screen. Label it clearly as **Request to Buy** or **Send Purchase Inquiry**, not “Pay now”.

### Form fields
Required:
- Customer full name
- Phone number
- Selected product and variant
- Quantity
- Confirmation that the customer understands payment/delivery are arranged directly with the shop

Optional:
- Telegram username, prefilled from verified Telegram Mini App identity when available
- Additional message to the shop
- Preferred contact method: Telegram / phone / either
- Preferred contact time (optional)

For Telegram identity:
- Treat verified Telegram ID as the stable identity key.
- A username may be missing or change; allow the user to enter or update a contact username where appropriate.
- Do not trust arbitrary client-supplied Telegram IDs.
- Ask for phone number explicitly; do not assume Telegram provides it.

### Summary panel
- Product image and name
- Shop name
- Chosen variant(s)
- Quantity
- Current displayed unit price
- Estimated item subtotal
- Note: `This is not a payment. The shop owner will confirm availability, final delivery cost, and payment arrangements with you directly.`

Price information is an inquiry snapshot only. The shop must confirm availability and the final amount directly. Do not label the subtotal as paid or as a final payable total.

### Submission behavior
1. Validate all required fields.
2. Validate product/shop status and selected variant on the server.
3. Store an inquiry and immutable product/variant/price snapshot.
4. Generate a readable inquiry reference, e.g. `INQ-2026-000123`.
5. Notify the shop manager through Telegram and in the manager dashboard.
6. Show the customer the confirmation page.
7. Prevent duplicate inquiry creation caused by double taps or request retries.

Do not reserve or deduct inventory merely because an inquiry was sent. An inquiry is not a confirmed order. If the owner later confirms a sale outside the platform, they may optionally update the inquiry status for their own tracking, but that must not be represented as payment verification.

## 10. Screen 6 — Inquiry Confirmation

Display:
- Success message: `Your request has been sent to the shop.`
- Inquiry reference
- Product and selected variant
- Quantity
- Shop name
- Contact buttons:
  - **Message Shop on Telegram**
  - **Call Shop**
- Reminder: `The shop will confirm availability, final price, delivery, and payment directly with you. No payment has been collected by this platform.`
- Buttons:
  - View My Inquiries
  - Continue Browsing

If the shop has no valid contact route, explain that the shop has received the inquiry and can respond through the available platform notification flow. Do not show a broken contact button.

## 11. Screen 7 — My Inquiries

Show inquiry cards with:
- Reference number
- Product image/name
- Shop name
- Variant and quantity
- Created date
- Inquiry status
- Contact shop button

Suggested statuses:
- Sent
- Shop viewed (only if reliably tracked)
- Responded (only if the shop explicitly records it)
- Closed
- Cancelled by customer

Do not imply that a shop has viewed or responded unless the system has reliable evidence. Avoid pretending that the app can read or track conversations happening in ordinary Telegram chats or phone calls.

Customer can open inquiry details, cancel an inquiry if it has not been handled, and contact the shop again.

## 12. Screen 8 — Saved Items

- Saved product list
- Availability and current price
- Remove from saved items
- Open product detail
- Clear empty state

Persist favorites for authenticated users. For guests, optionally use local/session storage without treating it as trusted identity or purchase data.

## 13. Mobile Navigation and Interaction Rules

- Use a compact bottom navigation in the Mini App.
- Keep the main call to action visible without overwhelming the screen.
- Use Telegram BackButton integration where supported and sensible browser navigation outside Telegram.
- Respect Telegram viewport changes and safe areas.
- Use accessible touch targets, readable text, and clear focus states.
- Avoid excessive animation and heavy page loads.
- Make loading, empty, success, and error states intentional.
- Confirm before discarding a partially completed inquiry form.
- Never display an online payment form, card input, wallet balance, payment success page, or “Pay now” button.

---

# Part B — Shop Manager and Admin UI Flow

## 14. Manager Access Flow

```text
Open Marketplace Bot or Manager Website
          |
          v
Authenticate
(Telegram Mini App auth or normal web login)
          |
          v
Check Shop Membership and Role
          |
          +----------------------------+
          |                            |
          v                            v
No Shop Yet                       Has Shop
          |                            |
          v                            v
Create Shop                    Manager Dashboard
          |                            |
          v                            +-------------------------------+
Pending/Active status                 |             |                 |
          |                           v             v                 v
          v                       Products       Inquiries         Inventory
Approval / Dashboard                 |             |                 |
                                      +-------------+-----------------+
                                                    |
                                                    v
                                           Shop Settings / Reports
```

## 15. Manager Dashboard

### Desktop
- Sidebar: Overview, Products, Inventory, Inquiries, Shop Profile, Settings
- Top bar: shop switcher (if the user manages multiple shops), notification indicator, profile menu
- Main content: summary cards, recent inquiries, low-stock products, recently updated items

### Mobile
- Compact top bar with shop name and notifications
- Summary cards in a single-column or two-column layout
- Shortcuts: Add Product, View Inquiries, Update Stock
- Bottom navigation or compact menu:
  - Overview
  - Products
  - Inquiries
  - Settings

### Dashboard metrics
- Published products
- Draft/hidden products
- Out-of-stock variants
- Low-stock items
- New inquiries
- Inquiries awaiting response
- Closed inquiries

If showing sales or revenue, clearly indicate that the platform does not verify off-platform sales or payments. Prefer inquiry and catalog metrics in the initial version.

## 16. Product Management Flow

```text
Products
  |
  +--> Product List --> Search / Filter / Sort
  |                         |
  |                         +--> Edit Product
  |                         +--> Hide / Publish
  |                         +--> Archive
  |                         +--> Manage Variants
  |
  +--> Add Product
          |
          v
     Basic Details
          |
          v
     Upload Images
          |
          v
     Price and Currency
          |
          v
     Variants and Stock
          |
          v
     Preview Listing
          |
          v
     Save as Draft or Publish
```

### Product form sections
1. Basic information: name, description, category, SKU
2. Images: upload, reorder, select primary image
3. Pricing: amount, currency, optional sale price
4. Variants: size, color, attributes, variant price, SKU, stock
5. Visibility: draft, published, hidden, archived
6. Preview: how customers will see the product

### Product actions
- Create
- Edit
- Publish
- Hide
- Archive
- Restore
- Manage variants
- Adjust stock

Use soft deletion or archival where appropriate so historical inquiries remain understandable. Do not permanently delete products referenced by historical inquiry snapshots.

## 17. Inventory UI

Inventory page should show:
- Product/variant
- SKU
- Variant attributes
- Current quantity
- Low-stock indicator
- Last updated
- Quick stock adjustment

Stock adjustment modal:
- Product/variant
- Current quantity
- Adjustment type: add / remove / set exact quantity
- Quantity
- Reason
- Confirm action

Record every adjustment in an inventory movement history. Do not reserve or deduct stock when a customer merely submits an inquiry. The owner can update inventory based on their real-world transaction.

## 18. Inquiry Management UI

Use the word **Inquiry** consistently throughout the interface. Do not call every inquiry a confirmed order or completed sale.

### Inquiry list
- Reference
- Customer name
- Product
- Variant
- Quantity
- Customer phone
- Telegram username/link when available
- Date received
- Status
- Actions

Filters:
- New
- Sent
- Responded
- Closed
- Cancelled
- Date range
- Product

### Inquiry detail
Show:
- Customer contact details
- Product/variant snapshot
- Requested quantity
- Price snapshot at inquiry time
- Customer message
- Inquiry reference and timestamp
- Status history
- Contact buttons:
  - Open Telegram chat
  - Call customer (only if the customer supplied a phone number and agreed to be contacted)
- Manager-only notes
- Status controls: mark responded, close, reopen where appropriate

The platform cannot reliably know whether a phone call or ordinary Telegram conversation happened. The manager must explicitly update the inquiry status.

### Notifications
When a new inquiry arrives:
- Show an in-dashboard notification.
- Send a Telegram bot notification to the shop owner if they have linked their Telegram identity and notifications are enabled.
- Include a short summary and a protected dashboard deep link.
- Do not expose more customer information than necessary in notifications.

## 19. Shop Profile and Contact Settings

Managers can configure:
- Shop name and unique slug
- Description
- Logo and cover
- Category
- Public phone number
- Public Telegram username
- Public address/area (optional)
- Business hours (optional)
- Contact methods enabled: phone, Telegram, both
- Delivery note
- General purchase instructions
- Shop status (read-only to managers if admin approval is required)

Validate Telegram usernames and generate links using supported formats. Validate phone numbers server-side. Do not expose personal contact details unless the shop owner has chosen to publish them.

## 20. Platform Admin Dashboard

Admin is a normal protected web dashboard. It does not need to live inside the customer Mini App.

### Admin navigation
- Overview
- Shops
- Users
- Products
- Categories
- Inquiries
- Reports
- Platform Settings
- Telegram Integration
- Audit Logs

### Overview
- Total users
- Active shops
- Shops awaiting approval
- Active/published products
- New inquiries
- Closed inquiries
- Recent admin actions

Do not report platform revenue or verified GMV in the initial release because transactions occur outside the platform and cannot be verified by it.

### Shop administration
- Search and filter shops
- View shop details
- Approve, reject, suspend, reactivate
- Review reported content
- See catalog and inquiry counts
- Record moderation reason

### User administration
- Search users
- View role and shop memberships
- Suspend/reactivate accounts
- Review audit trail for administrative actions

### Category management
- Create/edit/deactivate categories
- Set display order
- Optional category icon/image

### Platform settings
- Marketplace name and logo
- Default currency (configurable; do not assume all shops use the same currency forever)
- Shop approval policy
- Product upload limits
- Contact/inquiry settings
- Telegram bot configuration status
- Terms and privacy policy links

Never display actual bot tokens in the dashboard after they are saved. Show only whether configuration is present and allow secure rotation through protected settings or environment configuration.

---

# Part C — Backend and Data Rules

## 21. Core Data Model

Create a normalized schema with foreign keys, indexes, validation, and migrations. Suggested tables:

### Identity
- `users`
- `telegram_accounts` or Telegram identity fields linked securely to users
- `shops`
- `shop_members`

### Catalog
- `categories`
- `products`
- `product_images`
- `product_variants`
- Variant attribute tables if necessary

### Inventory
- `inventory_movements`

### Customer engagement
- `favorites`
- `inquiries`
- `inquiry_status_history`
- `inquiry_notes` or manager notes within an appropriate table
- `notifications`
- `notification_deliveries` if delivery tracking is required

### Platform operations
- `audit_logs`
- `marketplace_settings`
- Telegram webhook/update processing records as appropriate

### Inquiry snapshot fields
Each inquiry should preserve:
- Unique public reference
- Customer user ID when available
- Customer name
- Customer phone
- Customer Telegram username as supplied/verified at that time, if available
- Shop ID
- Product ID where it still exists
- Product name snapshot
- Variant description snapshot
- Quantity
- Unit price snapshot
- Currency snapshot
- Customer note
- Preferred contact method
- Inquiry status
- Created/updated timestamps

Do not store payment credentials because the platform does not process payments.

### Data integrity
- Use foreign keys and indexes.
- Enforce unique shop slugs.
- Enforce variant uniqueness for each product's attribute combination.
- Use decimal columns for prices.
- Keep historical inquiry snapshots unchanged when product details later change.
- Archive rather than hard-delete catalog records referenced by inquiries.
- Use authorization policies for all manager/admin actions.
- Validate all input on the backend.
- Rate-limit inquiry creation and bot actions.
- Protect against duplicate inquiry submissions.
- Avoid logging full phone numbers or sensitive identity payloads unnecessarily.

## 22. Telegram Integration Requirements

- Use the official Telegram Bot API and Mini Apps SDK.
- Use webhook updates in production.
- Validate Telegram Mini App `initData` server-side according to official Telegram instructions.
- Verify authentication timestamps and reject invalid/stale data according to a documented policy.
- Keep bot tokens server-side only.
- Use supported deep links for shop and product entry points.
- Provide browser fallback for the same public catalog pages.
- Handle missing Telegram usernames.
- Never assume the bot can initiate a private conversation with a user who has never interacted with it.
- Use the shop owner's public Telegram username for direct owner contact when available.
- Send inquiry notifications to the owner through the bot only when the owner has started the bot or another supported notification route is available.
- Handle API errors, rate limits, blocked bots, and failed notifications.
- Store delivery outcomes when needed and provide retry behavior.
- Do not pretend to read phone calls or private conversations. Inquiry statuses are updated explicitly by customers or managers.

## 23. Security and Privacy

- Use Laravel authentication and authorization.
- Use CSRF protection for session-based web forms.
- Validate all inputs server-side.
- Escape user-provided content.
- Validate and constrain image uploads.
- Enforce shop ownership on every manager query and action.
- Protect admin routes with a distinct admin permission.
- Validate Telegram signatures server-side.
- Use HTTPS in production.
- Keep credentials in environment variables/secret management.
- Redact secrets and unnecessary personal data from logs.
- Collect only the customer contact details needed to complete the inquiry.
- Tell customers that their name and chosen contact information will be shared with the selected shop to respond to the inquiry.
- Provide a privacy policy and retention policy.
- Do not publish a customer's phone number or Telegram identity on public product pages.
- Do not allow users to enumerate other customers' inquiries.

## 24. Testing Requirements

Automate tests for:
- Shop registration and approval.
- Product CRUD and visibility.
- Product variants and stock validation.
- Customer search and product detail.
- Inquiry submission.
- Inquiry snapshot correctness.
- Duplicate submission protection.
- Manager notification delivery failures.
- Missing Telegram username.
- Invalid Telegram Mini App data.
- Shop ownership isolation.
- Admin-only actions.
- Suspended shops cannot receive new inquiries.
- Hidden products cannot receive normal purchase inquiries.
- Product price changes do not alter historical inquiry snapshots.
- No payment processing is performed.
- Public endpoints do not expose customer contact details.

---

# Part D — Build Plan

## 25. Implementation Phases

### Phase 1 — Repository review and foundation
- Inspect the current repository.
- Confirm Laravel/PHP versions and existing conventions.
- Configure MySQL and environment variables.
- Set up Vue/Inertia/Tailwind if not already present.
- Define roles and authorization.
- Add migrations, factories, seeders, and base layouts.
- Add initial tests.

### Phase 2 — Shops and product catalog
- Shop registration and approval.
- Public shop storefront.
- Category management.
- Product CRUD.
- Product images.
- Variants and stock.
- Public product details.
- Search and filters.

### Phase 3 — Telegram Mini App
- Create/configure bot integration.
- `/start` command.
- Webhook handling.
- Server-side Mini App authentication validation.
- Shop/product deep links.
- Customer navigation inside Telegram.
- Browser fallback.

### Phase 4 — Inquiry checkout
- Contact form.
- Customer identity and contact fields.
- Variant/quantity selection.
- Inquiry reference generation.
- Inquiry snapshots.
- Confirmation screen.
- Customer inquiry history.
- Duplicate-submit protection.

### Phase 5 — Manager dashboard and notifications
- Product and inventory dashboard.
- Inquiry list/detail.
- Telegram owner notifications.
- Direct contact shortcuts.
- Shop profile/contact settings.
- Inquiry status management.

### Phase 6 — Admin dashboard
- User management.
- Shop approvals and suspensions.
- Product moderation.
- Categories.
- Inquiry oversight.
- Platform settings.
- Audit logs.

### Phase 7 — Quality and deployment
- Security review.
- Responsive and Telegram Mini App testing.
- Automated test suite.
- Queue/scheduler setup where needed.
- Production image storage.
- HTTPS and domain configuration.
- Bot webhook setup.
- Deployment and recovery documentation.

## 26. Required Documentation

Create:
- `README.md`
- `docs/architecture.md`
- `docs/database-design.md`
- `docs/telegram-integration.md`
- `docs/ui-flows.md`
- `docs/security-and-privacy.md`
- `docs/deployment.md`
- `.env.example`

Include setup instructions for BotFather, Mini App URL configuration, webhook configuration, required environment variables, database migration, and local testing.

## 27. Definition of Done

The first release is complete when:

1. An administrator can approve and manage shops.
2. A shop owner can create and manage products and variants.
3. Owners can set stock and hide products.
4. Customers can open the marketplace through Telegram.
5. Customers can search and browse shops/products.
6. Customers can select variants and quantities.
7. Customers can submit an inquiry with name and phone number, plus Telegram username when available.
8. The inquiry records an immutable product and price snapshot.
9. The owner receives an in-dashboard and Telegram notification when possible.
10. The customer sees a confirmation page with working phone/Telegram contact links where available.
11. The owner can update inquiry status explicitly.
12. Customer contact details remain private from other customers.
13. The admin can moderate users, shops, products, and categories.
14. The app works in Telegram and in a regular mobile browser.
15. Automated tests cover core flows and security boundaries.
16. No online payment processing exists in this release, and the UI clearly tells customers that final payment and delivery are arranged directly with the shop.

## 28. Final Instructions to the Coding Agent

Start by inspecting the repository and reporting:
1. Existing stack and conventions.
2. What is already implemented.
3. Proposed database model.
4. Key Telegram integration assumptions.
5. A phased implementation plan.

Then implement one phase at a time. Run tests and report actual results after each phase. Do not claim a feature works unless it has been implemented and tested.

Do not replace working project code unnecessarily. Do not add payment gateways, online payment forms, payment credentials, “Pay now” buttons, or fake payment success states. The platform records product inquiries and facilitates contact; the actual transaction happens directly between the customer and shop owner.

Do not create decorative buttons without real behavior. If Telegram credentials or production services are missing, build the integration boundary, document the required configuration, and test everything possible without the credentials.

Prioritize the complete mobile journey: discover product → inspect variant/availability → submit contact inquiry → reach the shop owner directly.
