# Telegram Shop Marketplace — Complete UI/UX Design Specification

## Purpose

Design a polished, mobile-first marketplace that runs as a Telegram Mini App. Customers discover shops and products, select options such as size and color, submit an inquiry, then contact the shop owner directly by Telegram or phone to arrange payment and delivery.

This document describes actual page layouts and component behavior, not just navigation flows.

## Product rules that must shape the UI

- **No online payments.** Do not design a payment gateway, card form, “Pay now” button, payment success screen, or platform-managed checkout.
- The customer action is **“Send inquiry”** or **“Contact shop”**, not “Place paid order.”
- The inquiry records the requested product, options, quantity, and customer contact details. The customer and shop owner agree on final price, payment, pickup, and delivery outside the platform.
- Show a price only when the shop has supplied one. If pricing varies or must be confirmed, display “Price on request.”
- Do not imply stock is reserved or reduced when an inquiry is submitted. Stock availability can change before the shop owner responds.
- Do not assume every Telegram user has a public username. Ask for a phone number, and display the Telegram contact option only when a valid contact route is available.
- Do not invent ratings, verified badges, delivery guarantees, or product availability.

---

# 1. Design system

## 1.1 Visual direction

Use a modern, trustworthy, lightweight commerce interface suitable for Ethiopian customers and small businesses. Avoid looking like a generic admin template or an overly colorful social app.

- **Brand personality:** useful, clear, local-business friendly, trustworthy.
- **Primary color:** deep indigo/blue (`#3F51D7`) for primary actions and selected states.
- **Text:** near-black navy (`#182033`).
- **Secondary text:** slate (`#667085`).
- **Page background:** light cool gray (`#F6F7FB`).
- **Surface/card:** white (`#FFFFFF`).
- **Success/in-stock:** green (`#16845B`).
- **Warning/low stock:** amber (`#B76E00`).
- **Error/out of stock/destructive:** red (`#C83B48`).
- **Borders:** soft gray (`#E6E8EF`).
- **Corner radius:** 12–16 px for cards and inputs; 10–12 px for buttons.
- **Typography:** Inter or Telegram system font stack; use clear hierarchy and avoid tiny text.
- **Spacing:** use a consistent 4/8 px spacing scale.
- **Icons:** simple line icons, same stroke weight. Always pair unfamiliar icons with labels.
- **Imagery:** product photography is the main visual content. Use consistent image ratios and crop behavior.

These are recommended starting tokens; maintain contrast and support dark mode when Telegram theme settings indicate it.

## 1.2 Responsive behavior

### Customer Mini App
- Design first for a 360–430 px mobile viewport.
- Respect Telegram’s safe areas and theme colors.
- Use a single-column page layout with a fixed bottom navigation on primary marketplace pages.
- Use bottom sheets for compact filters, sorting, quantity adjustment, and variant selection where appropriate.
- Keep primary actions above the device’s bottom safe area.
- Do not duplicate Telegram’s native back button with a confusing second back button. Use the app’s page title/back affordance consistently.

### Shop manager dashboard
- Desktop-first at 1280 px and above, but fully responsive.
- Desktop: fixed left sidebar (240–260 px), top header, main content area.
- Tablet: collapsible sidebar.
- Mobile: drawer navigation, compact top bar, tables become stacked cards or horizontal-scroll tables only where appropriate.
- Forms use one column on narrow screens and two columns on wide screens when the fields are logically related.

### Admin dashboard
- Desktop-first, data-dense but readable.
- Fixed sidebar, top bar with global search/notifications/profile, page heading and actions.
- Tables have filters, pagination, loading, empty, and error states.
- On mobile, render manageable row cards rather than tiny unreadable columns.

## 1.3 Shared components

Design reusable components and document their states:
- Primary, secondary, ghost, and destructive buttons.
- Search input with clear action.
- Product card, shop card, category chip, filter chip.
- Price display and “Price on request” label.
- Availability badge: In stock, Low stock (manager only), Out of stock, Availability to confirm.
- Form field with label, helper text, required marker, validation message.
- Quantity stepper with minimum of 1 and configured maximum.
- Image gallery with thumbnails and image loading/error fallback.
- Bottom sheet / modal with close affordance.
- Toast notification and inline alert.
- Skeleton loading cards.
- Empty state with illustration/icon, clear explanation, and next action.
- Confirmation dialog for destructive actions.
- Pagination or “Load more.”
- Status pill for inquiry lifecycle.
- Breadcrumbs for manager/admin desktop pages.
- Permission/verification status panel for shop accounts.

## 1.4 Accessibility and interaction rules

- Minimum comfortable touch target: 44 × 44 px.
- Every form field has a persistent label; do not rely only on placeholders.
- Show focus, pressed, disabled, loading, success, and error states.
- Images need meaningful alt text where they convey product information.
- Do not use color as the only indicator of status.
- Support keyboard navigation in desktop dashboards.
- Confirm destructive actions and explain what will be deleted.
- Preserve entered form data when validation fails.
- Provide readable empty states, not blank screens.

---

# 2. Customer marketplace — Telegram Mini App

## Customer navigation

Use a persistent bottom navigation with four destinations:
1. **Home** — marketplace discovery.
2. **Categories** — browse by product category.
3. **Inquiries** — previously submitted inquiries and their status.
4. **Saved** — saved products and shops.

The top app bar can show the marketplace logo/name on the left and a search or profile/menu action on the right. Do not add a separate account sign-up wall before browsing. Use Telegram identity where available, then collect missing contact details when the customer sends an inquiry.

## C01. Launch / loading screen

**Purpose:** establish brand while Telegram Mini App initializes.

**Layout**
- Centered brand mark.
- Marketplace name under logo.
- Small loading indicator.
- One-line helper text: “Finding shops and products…”
- Use a simple neutral background, with no fake progress percentage.

**States**
- Loading: logo + indicator.
- Load failure: “We couldn’t load the marketplace” + **Try again**.
- Restricted/unavailable: short explanation and **Return to Telegram** if a valid action exists.

**Behavior**
- Validate Telegram Mini App initialization data on the server.
- Avoid showing customer personal information on the loading screen.
- Do not keep the user on a spinner indefinitely; show a retry state.

## C02. Home / marketplace discovery

**Purpose:** help customers quickly discover products and trusted shop pages.

**Layout, top to bottom**
1. Compact app bar: logo/name; profile/menu icon.
2. Search bar with placeholder **“Search products or shops”** and search icon.
3. Optional promotional banner area, only when an admin/shop has configured an actual banner. Do not hard-code fake discounts.
4. Horizontal category strip with icons and labels, plus **See all**.
5. “Popular near you” or “Featured shops” horizontal shop cards only if supported by real data. If location is not collected, use “Featured shops” rather than claiming proximity.
6. “Browse products” section with a two-column product grid.
7. Bottom navigation.

**Product card**
- Square or 4:5 image, edge-to-edge within card.
- Save/heart icon over image at top-right.
- Optional small category or availability chip, without covering the product.
- Product name, maximum two lines.
- Price or “Price on request.”
- Shop name in smaller muted text.
- Tap card opens product detail. Tapping heart toggles saved state with toast/accessible feedback.

**Shop card**
- Shop logo/avatar.
- Shop name and optional factual status badge.
- Short category/description, one or two lines.
- “View shop” affordance.
- Do not invent star ratings or follower counts.

**Interactions**
- Search field opens the search page.
- Category chip opens category results.
- Product card opens C06.
- Shop card opens C08.
- Pull-to-refresh may be supported if natural to the platform.

**States**
- First-time/no data: friendly marketplace empty state with **Browse categories**.
- Loading: skeleton category chips, shop cards, and product cards.
- Error: inline message with retry; keep navigation available.
- No featured shops: omit the section instead of showing empty decorative cards.

## C03. Search

**Purpose:** search products and shops without overwhelming the user.

**Layout**
- Search input at top, autofocus when opened if safe.
- Back action.
- Recent searches (only if stored and permitted) with clear-history action.
- Suggested categories or popular search terms only when based on real data.
- After typing: segmented control **Products / Shops / All**.
- Result count where useful.
- Sort and filter controls.
- Product results in two-column grid; shop results in a vertical list of shop cards.

**Filters**
- Category.
- Minimum/maximum price, only for products with numeric prices.
- Availability: Available / All.
- Shop.
- Sort: Relevance, Newest, Price low to high, Price high to low.
- Use a bottom sheet on mobile with **Reset** and **Show results** buttons.

**States**
- Empty query: show recent searches and categories.
- Loading: skeleton result cards.
- No results: “No matches for ‘…’” plus clear filters / try another term.
- Error: retry message.
- Search should be tolerant of partial terms and basic spelling differences if supported by backend.

## C04. All categories

**Layout**
- Title: **Categories**.
- Optional category search field.
- Grid of category tiles, two columns on mobile.
- Each tile contains a category icon/image, category name, and product count only if the count is accurate and available.
- Nested categories can show chevron and breadcrumb on the next page.
- Bottom navigation remains visible.

**Interactions**
- Tap a category to open C05.
- Search filters categories immediately.
- Empty state when no categories exist: show a brief message; do not show placeholder categories as if they were real.

## C05. Category product listing

**Layout**
- Back action and category title.
- Optional category description.
- Horizontal filter chips: **Filter**, **Sort**, **Availability**.
- Active filters shown as removable chips.
- Two-column product grid using the shared product card.
- Load-more or pagination behavior that does not jump the scroll position.
- Optional subcategory strip when category has children.

**Behavior**
- Keep selected filters when opening a product and returning to results.
- Show the active sort label.
- Do not show price filters if no products in the result set have numeric prices.
- If no products: “No products in this category yet” and **Explore other categories**.

## C06. Product detail

**Purpose:** give enough information to make a confident inquiry.

**Layout, top to bottom**
1. Top navigation with back action and share action.
2. Main image gallery, full content width, approximately 1:1 or 4:5 ratio.
3. Small thumbnails or page indicators below the image.
4. Product title (strong, two or three lines maximum before natural wrapping).
5. Price in prominent text, or **Price on request**.
6. Availability message: In stock / Out of stock / Ask shop to confirm, based on shop data.
7. Shop row: logo, shop name, **View shop**.
8. Product description with readable paragraph spacing.
9. Variant selection section, only if product has variants.
10. Optional product details/specifications as label/value rows.
11. Quantity selector.
12. Small note: “Submitting an inquiry does not reserve stock. The shop will confirm availability and final arrangements.”
13. Sticky bottom action bar: **Send inquiry** primary; save/heart secondary.

**Variant UI**
- Color: visual swatches with text labels and selected outline. Never communicate selection by color alone.
- Size: pill buttons (S, M, L, etc.) with labels exactly as configured by the shop.
- Other option: labeled select or chip group.
- If a combination is unavailable, disable it and show a clear “Unavailable” label.
- Require selection for every required option before enabling **Send inquiry**.
- Update displayed price only when variant pricing exists and is authoritative.

**Interactions**
- Gallery image opens a swipeable full-screen viewer.
- Shop row opens C08.
- Save button toggles saved state.
- Send inquiry opens C09.
- Share uses Telegram’s native sharing/deep-link capabilities when available.

**States**
- Out of stock: still show details but disable inquiry only if shop policy says inquiries are not accepted for unavailable items; otherwise allow **Ask about availability**.
- Deleted/hidden product from stale link: clear unavailable page with **Browse marketplace**.
- Missing image: attractive neutral placeholder, not a broken image icon.

## C07. Image viewer

**Layout**
- Dark or theme-aware full-screen background.
- Large image centered with contain behavior.
- Close button, image count (e.g. 2 of 5), swipe between images.
- No unrelated actions that cover the image.

## C08. Shop storefront

**Purpose:** show the shop identity, contact options, and its products.

**Layout**
1. Cover image/banner when configured; otherwise compact neutral header.
2. Shop logo overlapping or aligned within header.
3. Shop name and factual verification status, if applicable.
4. Short description.
5. Contact row: **Telegram** and **Call** only for available, valid contact routes.
6. Optional public address/opening hours, only when supplied by the shop.
7. Category/product filter or search within shop.
8. Product grid.
9. Optional “About this shop” section below products.
10. Bottom navigation.

**Behavior**
- Telegram button opens the shop’s configured Telegram contact/deep link. If the shop has no valid Telegram contact route, omit the button.
- Call button uses the shop’s published phone number. Do not expose a private number without permission.
- Shop’s listed products can be sorted and filtered.
- If shop is pending/suspended, do not expose it as an active public storefront; use a clear unavailable state for old links.

## C09. Inquiry form / request details

**Purpose:** record the customer’s request so the owner can follow up. This is not payment checkout.

**Page heading:** **Send product inquiry**

**Top summary card**
- Small product image.
- Product name.
- Selected color/size/variant.
- Displayed price or “Price on request.”
- Shop name.
- Quantity stepper.

**Form fields**
- Full name — required.
- Phone number — required; use a country-aware format and allow Ethiopian numbers, including +251, without hardcoding one country as the only possibility.
- Telegram username — optional and prefilled from Telegram only when available; editable only if the product requirements allow it. Explain that a username is optional if phone is supplied.
- Preferred contact method — radio choices: **Telegram**, **Phone call**, **Either**. Only show choices that are possible.
- Note to shop — optional, short multiline field, e.g. delivery area, preferred time, or a product question. Do not ask for card/banking information.
- Consent checkbox or concise notice: “I agree that this contact information will be shared with this shop so they can respond to my inquiry.”

**Bottom action area**
- Primary button: **Send inquiry**.
- Secondary text link: **Back to product**.
- No payment totals, card fields, delivery fee calculations, “Pay now,” or payment confirmation UI.
- If the price is a quote, say “The shop will confirm price and availability.”

**Validation**
- Required name and phone.
- Validate phone format without rejecting legitimate local formatting unnecessarily.
- Show inline field-level errors and preserve valid inputs.
- Prevent double submissions with loading state.
- Do not submit if required variant selections are missing.
- Explain why contact data is requested.

## C10. Inquiry submitted confirmation

**Layout**
- Success icon/illustration.
- Heading: **Inquiry sent**.
- Message: “Your request was sent to [Shop name]. The shop can contact you to confirm availability, price, and delivery or pickup.”
- Inquiry reference number.
- Product summary and selected variant/quantity.
- Primary action **Contact shop on Telegram** when a valid Telegram link exists.
- Secondary action **Call shop** when a phone number exists.
- Link **View inquiry details**.
- Link **Continue browsing**.
- Small reminder: “Payment and delivery are arranged directly with the shop. No payment was collected in this app.”

**Behavior**
- Never say “payment successful,” “order paid,” or “delivery confirmed.”
- Contact actions are optional convenience links; inquiry submission should still work when a contact route is missing, and the confirmation page should explain the available next step.

## C11. Inquiry list

**Layout**
- Title: **My inquiries**.
- Filter tabs/chips: All, New, Responded, Closed (map to actual lifecycle states).
- Inquiry cards showing product thumbnail, product name, shop, submitted date, reference number, and status.
- Tap a card opens C12.
- Empty state: “You haven’t sent any inquiries yet” + **Browse products**.

**Privacy / identity**
- Show only inquiries associated with the authenticated Telegram identity or verified session.
- Do not allow customers to see another customer’s phone number or inquiry.
- If the app cannot securely identify the customer, do not use a guessable reference number as the sole authorization method.

## C12. Inquiry detail

**Layout**
- Back action and inquiry reference.
- Status badge and created date.
- Product summary with variant, quantity, and the price snapshot if one was shown at submission.
- Customer contact details masked or displayed appropriately to the customer.
- Shop details and available **Telegram / Call** contact actions.
- Activity timeline: Submitted, Seen/Responded (only if tracked), Closed (if applicable).
- Informational note that price, stock, delivery, and payment are confirmed directly with the shop.

**Actions**
- Contact shop.
- Copy inquiry reference.
- Close/hide inquiry only if supported by a clear, reversible policy.
- Do not invent chat messages or show a platform chat interface unless an actual chat feature is implemented.

## C13. Saved products and shops

**Layout**
- Title: **Saved**.
- Tabs: Products / Shops.
- Saved products use standard product cards.
- Saved shops use standard shop cards.
- Remove saved item via heart icon or overflow menu.
- Empty state includes a bookmark icon, short explanation, and **Explore marketplace**.
- Persist saves to the user’s account when authenticated; explain behavior if local-only saving is used.

## C14. Customer profile / preferences

**Layout**
- Telegram profile avatar/name if available.
- Contact information only when provided by the user.
- Saved items shortcut.
- My inquiries shortcut.
- Preferred language selector if multiple languages are supported.
- Privacy note explaining which details are shared when submitting an inquiry.
- **Edit contact details** opens a simple form.
- **Delete my data / account** only if supported with a real, safe deletion process.
- Do not require a full profile to browse.

## C15. Global UI states and overlays

Create designed states for:
- Search/filter bottom sheet.
- Variant selection bottom sheet if product detail needs it on smaller devices.
- Quantity picker.
- Share sheet handoff.
- Form validation errors.
- Offline/network error banner.
- Expired Telegram session / initialization error.
- Product removed or hidden.
- Shop unavailable.
- Inquiry submission retry, including duplicate-submission prevention.
- Save/unsave feedback.
- Permission-denied / unauthorized state.
- Dark theme based on Telegram theme parameters.

---

# 3. Shop manager dashboard

## Manager navigation structure

Desktop sidebar:
- Overview
- Products
- Inventory
- Inquiries
- Shop profile
- Settings
- Help / support

Top bar:
- Page title/breadcrumbs
- Shop status (Pending, Active, Suspended)
- Notifications
- Account menu

Use an onboarding checklist for new shops, but do not block all browsing if the shop is pending. A pending shop should clearly see why it is not yet public.

## M01. Manager sign-in

**Layout**
- Brand logo and “Manage your shop” heading.
- Authentication options appropriate to the implementation (email/password, magic link, or Telegram-authenticated account linking).
- Inputs with labels, show/hide password if password auth is used, forgot-password link if supported.
- Primary **Sign in**.
- Link to **Create a shop account** if public registration is enabled.
- Small security/help text.

**States**
- Validation errors under fields.
- Invalid credentials with a neutral message that avoids exposing whether an email exists.
- Loading state and retry behavior.
- Suspended/disabled account message with support path.

## M02. Create account / register shop

**Layout**
- Step indicator: Account → Shop details → Contact → Review.
- Step 1: owner name, email/phone as required, password if used, acceptance of terms.
- Step 2: shop name, category, short description, logo, optional cover.
- Step 3: public contact options (Telegram link/username and phone), address/hours optional.
- Step 4: review summary and submit for approval if approval is required.
- Clear labels for public fields: “Visible to customers.”

**Behavior**
- Autosave draft where appropriate.
- Explain which contact details are public.
- Do not publish an unapproved shop as active.
- Show clear post-submit status: “Application submitted” and what happens next.

## M03. New shop onboarding checklist

**Layout**
- Welcome: “Let’s set up your shop.”
- Progress bar or checklist:
  1. Add shop logo and description.
  2. Add contact methods.
  3. Add first product.
  4. Review storefront.
  5. Submit for approval / publish, depending on policy.
- Each item has completion state and action button.
- Preview card of the storefront.
- If pending approval, show pending badge and review guidance.

**Empty/blocked states**
- If approval is required, explain that public visibility begins after approval.
- Never imply that the shop is live when it is not.

## M04. Overview dashboard

**Layout**
- Page heading **Overview** with date range only if analytics are implemented.
- Four summary cards:
  - Active products
  - New inquiries
  - In-stock products (if stock is tracked)
  - Shop status
- “Recent inquiries” table/list: customer name, product, date, status, view action.
- “Recently updated products” list.
- “Storefront preview” card with **View public shop**.
- Setup reminders if profile/products are incomplete.

**Data integrity**
- Do not show fabricated sales revenue, paid orders, conversion rate, or earnings because the platform does not process payments.
- Inquiry count is not the same as completed sales.
- Empty dashboard should guide the manager to add their first product.

## M05. Products list

**Layout**
- Heading **Products**, description, primary **Add product**.
- Search field.
- Filters: Status (Draft/Published/Archived), Category, Availability, Price type.
- Sort: Recently updated, Newest, Name.
- Desktop table columns:
  - Product thumbnail/name
  - Category
  - Price / Price on request
  - Stock status
  - Published status
  - Last updated
  - Row actions
- Mobile product cards with image, title, price, status chips, and overflow menu.
- Pagination and result count.
- Bulk actions only if implemented safely.

**Row actions**
- Edit.
- Preview.
- Publish/unpublish.
- Duplicate.
- Archive.
- Delete (confirmation required; warn about linked inquiry history).

**States**
- No products: onboarding empty state + **Add your first product**.
- No filter results: clear filters.
- Loading skeleton.
- Server error with retry.
- Show unpublished/draft state distinctly from stock status.

## M06. Add product — basic information

**Layout**
- Breadcrumb: Products / Add product.
- Page title **Add product**.
- Desktop: main form column + sticky side preview/help panel.
- Mobile: one-column form, preview section near bottom.
- Fields:
  - Product name (required).
  - Category (required).
  - Short summary (optional).
  - Full description (optional; support readable line breaks).
  - Product images (at least one recommended; upload, reorder, choose cover).
  - Visibility/status: Save as draft or publish when permitted.
- Side panel: storefront card preview and tips for image quality.
- Bottom sticky actions: **Save draft**, **Save and continue**, **Cancel**.

**Image uploader**
- Drag-and-drop on desktop; camera/gallery selection on mobile.
- Show upload progress, thumbnail preview, remove, reorder, choose cover.
- File type/size guidance before upload.
- Failed upload state with retry.
- Do not lose other form fields after upload failure.

## M07. Add/edit product — price and availability

This can be a second step in a multi-step product form or a clearly separated section on one page.

**Fields**
- Pricing mode: **Fixed price** / **Price on request**.
- Currency selector, default configured by marketplace policy; make currency explicit.
- Price field only for fixed price.
- Optional compare-at price only if there is a real product reason and clear business policy; avoid fake discount styling.
- Inventory tracking toggle.
- Quantity on hand if tracking enabled.
- Availability label/behavior: In stock / Out of stock / Ask shop to confirm.
- Optional SKU/internal code, hidden from customers by default.

**Validation**
- Price must be valid and non-negative.
- Do not allow fixed price with a blank price.
- If price on request is selected, do not show a zero price publicly.
- Stock quantity must be a non-negative integer.
- Warn before setting stock to zero if the product is published.

## M08. Product variants

**Purpose:** allow customers to choose product options such as color and size.

**Layout**
- Section heading **Options and variants**.
- Toggle **This product has options**.
- Add option name (e.g. Color, Size) and option values.
- For color values, allow a swatch plus text label.
- Generate a variant matrix when multiple options are combined.
- Each variant row: option combination, optional SKU, price override (if supported), stock quantity (if inventory tracking), availability.
- Show count of generated variants and allow removal/editing.
- Preview customer-facing option selector.

**Rules**
- No duplicate option names/values.
- A customer must select required options.
- A specific unavailable variant cannot be selected.
- Variant-specific stock should be authoritative if used.
- If stock is not tracked, do not invent quantity or “only 2 left” claims.

## M09. Product preview

**Layout**
- Toggle preview mode for mobile storefront.
- Render the real customer product page using unsaved draft data when possible.
- Show gallery, title, price mode, availability, description, variants, and inquiry button.
- Clear **Back to editing** action.
- Preview must be visibly labeled “Preview” and must not create a public listing or inquiry.

## M10. Edit product

**Layout**
- Same structure as M06–M08, prefilled with saved data.
- Header includes current publish status and last updated timestamp.
- Show unsaved changes warning if leaving.
- Save changes primary action.
- Separate publish/unpublish action with confirmation when needed.
- If the product is referenced by prior inquiries, preserve inquiry snapshots and avoid destructive changes to historical records.

## M11. Inventory overview

**Layout**
- Heading **Inventory**.
- Search products/SKUs.
- Filters: In stock, Low stock, Out of stock, Not tracked.
- Table/card rows: image/name, variant, current quantity, status, last movement, quick-adjust action.
- Optional low-stock threshold settings.
- Quick adjustment opens a modal/bottom sheet with:
  - Product/variant
  - Current quantity
  - Adjustment type: Add stock / Remove stock / Set exact quantity
  - Quantity
  - Reason (optional or required by policy)
  - Save adjustment
- Show confirmation and resulting quantity.

**Rules**
- Record inventory movements with timestamp and actor for auditability.
- Validate no negative stock unless the business explicitly supports backorders.
- Submitting a customer inquiry must not automatically reserve or decrement inventory.
- If inventory is not tracked, clearly label it as not tracked.

## M12. Inquiries inbox

**Purpose:** help the owner follow up on customers without implying that an inquiry is a paid order.

**Layout**
- Heading **Inquiries** and a short description: “Requests from customers interested in your products.”
- Summary chips: New, Contacted, Closed.
- Search by reference, customer, product, or phone where authorized.
- Filters: status, date, product.
- Desktop table:
  - Inquiry reference
  - Customer
  - Product/variant
  - Quantity
  - Submitted date
  - Status
  - Action
- Mobile: inquiry cards with reference, product, date, status, and open action.
- Never label the inbox “Paid orders” or show payment status that the system cannot verify.

## M13. Inquiry detail / contact customer

**Layout**
- Breadcrumb: Inquiries / Reference.
- Header: reference number, status dropdown, submitted date.
- Customer card: name, phone, Telegram username when available, preferred contact method.
- Product request card: image, title, selected options, quantity, price snapshot/price on request, customer note.
- Contact action panel:
  - **Call customer** if phone is available.
  - **Open Telegram** only if a valid Telegram route is available.
  - **Copy phone number** and **Copy inquiry reference**.
- Internal notes section, private to shop staff, if supported.
- Activity timeline showing created/updated/status changes.
- Status options such as New, Contacted, Closed; define each status clearly.
- Optional “Mark as contacted” action.
- Do not add a payment collection panel or force the owner to enter payment details.

**Privacy**
- Only authorized staff of the owning shop can see inquiry contact data.
- Avoid showing customer data in notification previews on shared devices when possible.

## M14. Shop profile editor

**Layout**
- Tabs or sections: Public profile, Contact methods, Location & hours, Branding, Preview.
- Public profile fields: shop name, category, short description, full description.
- Logo uploader and cover image uploader.
- Contact fields: public Telegram link/username, public phone number.
- Optional address, map location, opening hours.
- Live public storefront preview.
- Save changes action.
- Public/private indicator for every contact field.

**Rules**
- Explain that public phone numbers are visible to customers.
- Validate Telegram link format and phone number.
- Do not publish personal contact data by default without owner confirmation.
- If the shop is verified, do not let the owner self-assign a verification badge.

## M15. Shop settings and team access

**Layout**
- Sections: Account, Notifications, Inventory defaults, Inquiry preferences, Team members (if multi-user access exists), Security.
- Notification toggles for new inquiries and stock alerts.
- Role table for team access if supported: Owner, Manager, Staff.
- Confirmation before removing a team member or changing owner privileges.
- Account closure/deletion process with clear consequences.
- Do not display unsupported settings that do nothing.

## M16. Notifications

**Layout**
- Notification list with icon, title, short summary, timestamp, read/unread state.
- Filters: All / Unread.
- Events: new inquiry, shop approval/rejection, product moderation, low-stock alert (if configured).
- Clicking a notification opens the relevant page.
- Empty state: “You’re all caught up.”

## M17. Shop approval status

**Layout**
- Status banner: Pending review / Approved / Needs changes / Suspended.
- Plain-language explanation and next step.
- For needs-changes: list required changes and **Edit shop profile**.
- For rejected/suspended: reason where policy permits, support contact, appeal path if available.
- Never use a red warning without an explanation or next action.

---

# 4. Marketplace admin dashboard

## Admin navigation

- Overview
- Shops
- Customers
- Products
- Categories
- Inquiries (limited support/moderation access)
- Reports / moderation
- Admin users and roles
- Audit log
- Settings

Use role-based access control. Destructive actions require confirmation and an audit record.

## A01. Admin sign-in

**Layout**
- Minimal secure login screen.
- Email/username and password or configured SSO.
- MFA field/challenge if enabled.
- Generic invalid-login message.
- No public admin registration link.
- Rate limiting and suspicious-login handling happen server-side.

## A02. Admin overview

**Layout**
- Page title **Platform overview**.
- Metric cards:
  - Total shops
  - Active shops
  - Pending shop reviews
  - Published products
  - New inquiries in selected period
  - Products flagged for moderation
- Activity chart only when meaningful real data exists.
- “Needs attention” queue: pending shops, flagged products, reports.
- Recent audit events.
- Date filter and clear data-source labels.

**Important**
- Do not show GMV, platform revenue, completed sales, or paid order metrics because payments and completed sales are outside the platform.

## A03. Shop management list

**Layout**
- Search by shop name, owner, or identifier.
- Filters: Pending, Active, Needs changes, Suspended.
- Table columns: shop, owner/contact, category, created date, status, product count, actions.
- Pagination and sortable columns.
- Row actions: View, Review, Suspend/Reactivate, contact owner where permitted.

## A04. Shop review detail

**Layout**
- Shop profile preview exactly as a customer would see it.
- Owner account/contact summary with privacy controls.
- Shop description, category, public contacts, address if supplied, logo/cover, initial products.
- Review checklist: complete profile, prohibited content, valid contact details, image/content policy.
- Actions: **Approve shop**, **Request changes**, **Reject**, with reason input.
- Confirmation dialog describing what approval or rejection changes.
- Audit record for reviewer, time, action, and reason.

## A05. Customer management

**Layout**
- Search by internal user ID, display name, or authorized contact field.
- Table: customer display name, Telegram identifier (masked/limited), joined date, inquiry count, account status.
- Detail page shows only data required for support/moderation.
- Actions: view profile, restrict account, restore account, respond to privacy/data request.
- Require reason for restrictions and log all administrative access/actions.
- Do not provide unrestricted bulk export of phone numbers.

## A06. Product moderation

**Layout**
- Queue tabs: Pending review (if moderation is required), Flagged, Reported, Recently removed.
- Table/cards: thumbnail, title, shop, category, submitted date, flag reason, status.
- Product review detail:
  - Product preview
  - Description and images
  - Shop information
  - Report details if any
  - Decision actions: Approve/Publish, Request changes, Hide, Remove
  - Required moderation reason
- Ensure the owner sees a clear reason and next step when content is removed.

## A07. Category management

**Layout**
- Category tree/list with icon/image, name, parent category, product count, active status, order.
- Actions: Create category, edit, reorder, deactivate.
- Form: name, slug generated/editable under validation, description, icon/image, parent category, display order, status.
- Warn before deactivating a category that still contains products; offer reassignment.
- Avoid permanent deletion when products or historical records reference the category.

## A08. Reports and moderation queue

**Layout**
- Filters: report type, status, date, shop, product.
- Report cards/table: reported item, reason, reporter if appropriate, timestamp, status.
- Detail panel includes the report text and the relevant product/shop.
- Actions: dismiss, request more information, hide content, suspend shop, escalate.
- Require reason for consequential actions.
- Prevent a reporter’s personal information from being exposed unnecessarily to the reported shop.

## A09. Inquiry support view

**Purpose:** support legitimate customer complaints without turning the marketplace into a payment or order-management platform.

**Layout**
- Search by inquiry reference.
- Show inquiry metadata, product snapshot, shop, and status.
- Mask customer phone and Telegram details by default; reveal only with an authorized support reason.
- Actions: mark for review, add internal support note, flag shop or inquiry.
- Do not invent payment state or claim that a sale occurred.

## A10. Admin roles and permissions

**Layout**
- Table of admin accounts, role, last login, status.
- Roles such as Super Admin, Shop Moderator, Support Agent, Category Manager.
- Permission matrix grouped by feature.
- Invite/admin creation flow restricted to authorized admins.
- Confirm changes to high-privilege roles.
- Audit every role change.

## A11. Audit log

**Layout**
- Searchable, filterable event table.
- Fields: timestamp, actor, action, affected entity, reason, result.
- Filters by actor, event type, entity type, and date.
- Detail drawer shows before/after values where safe and available.
- Logs are read-only to ordinary admins and protected from tampering.

## A12. Platform settings

**Layout**
- General marketplace name/logo.
- Supported currencies and formatting.
- Product categories defaults.
- Shop approval/moderation policy.
- Inquiry status definitions.
- Contact/privacy policy links.
- Telegram bot and Mini App connection status with safe diagnostics.
- Image upload configuration status.
- Notification templates.
- Maintenance mode only if properly implemented.
- Never show API tokens/secrets in readable form; secrets must be managed securely server-side.

---

# 5. Shared forms, dialogs, and edge cases

Design the following reusable patterns in addition to the named pages:

1. Confirm archive product.
2. Confirm delete product, explaining whether historical inquiry snapshots remain.
3. Confirm unpublish product.
4. Confirm inventory adjustment.
5. Confirm suspend/reactivate shop.
6. Approve/reject/request changes dialog with reason.
7. Unsaved changes warning.
8. Image upload failure and retry.
9. Invalid or expired Telegram initialization data.
10. Customer contact details missing.
11. Shop has no valid contact route.
12. Product price on request.
13. Variant unavailable.
14. Product out of stock.
15. Inquiry already submitted / duplicate retry prevention.
16. Network disconnected.
17. Permission denied.
18. Session expired.
19. No results.
20. Empty dashboard/inbox.
21. Successful save confirmation.
22. Destructive action failed.
23. Shop suspended while manager is logged in.
24. Customer opens a stale product link.
25. Dark mode / Telegram theme adaptation.

Each must have: trigger, modal/banner/page layout, primary action, secondary action, dismissal behavior, and accessibility notes.

---

# 6. Recommended visual layouts (wireframe-level)

These are structural guides. The implementation should turn them into high-fidelity responsive UI, not display these text wireframes literally.

## Customer home — mobile

```text
┌──────────────────────────────────┐
│ [Logo] Market name          [⋯]  │
│ ┌──────────────────────────────┐ │
│ │ 🔎 Search products or shops  │ │
│ └──────────────────────────────┘ │
│                                  │
│ Categories                 See all│
│ [All] [Fashion] [Tech] [Home] →  │
│                                  │
│ Featured shops             See all│
│ [logo] Shop A  [logo] Shop B  →  │
│                                  │
│ Browse products        Filter    │
│ ┌────────────┐ ┌────────────┐    │
│ │   IMAGE ♡  │ │   IMAGE ♡  │    │
│ │ Product A  │ │ Product B  │    │
│ │ 1,200 ETB  │ │ Price on   │    │
│ │ Shop name  │ │ request    │    │
│ └────────────┘ └────────────┘    │
│ ┌────────────┐ ┌────────────┐    │
│ │   IMAGE ♡  │ │   IMAGE ♡  │    │
│ └────────────┘ └────────────┘    │
│                                  │
│ [Home] [Categories] [Inquiries] [Saved]│
└──────────────────────────────────┘
```

## Product detail — mobile

```text
┌──────────────────────────────────┐
│ [←]                       [Share]│
│ ┌──────────────────────────────┐ │
│ │                              │ │
│ │         PRODUCT IMAGE        │ │
│ │                              │ │
│ └──────────────────────────────┘ │
│               • • ○              │
│ Everyday Sneakers                │
│ 2,450 ETB                        │
│ ● Availability to confirm        │
│ ┌──────────────────────────────┐ │
│ │ [Shop logo] Urban Shop   View│ │
│ └──────────────────────────────┘ │
│ Description                      │
│ Lightweight everyday sneakers…   │
│                                  │
│ Color                            │
│ [Black] [White] [Navy]           │
│ Size                             │
│ [39] [40] [41] [42]              │
│ Quantity             [−] 1 [+]   │
│                                  │
│ Inquiry does not reserve stock.  │
│ ┌──────────────────────────────┐ │
│ │          Send inquiry        │ │
│ └──────────────────────────────┘ │
└──────────────────────────────────┘
```

## Inquiry form — mobile

```text
┌──────────────────────────────────┐
│ [←] Send product inquiry         │
│ ┌──────────────────────────────┐ │
│ │ [img] Sneakers               │ │
│ │ Black / Size 41 · Qty 1      │ │
│ │ 2,450 ETB                    │ │
│ └──────────────────────────────┘ │
│ Full name *                      │
│ [____________________________]   │
│ Phone number *                   │
│ [____________________________]   │
│ Telegram username (optional)     │
│ [____________________________]   │
│ Preferred contact                │
│ (•) Telegram ( ) Phone ( ) Either│
│ Note to shop (optional)          │
│ [____________________________]   │
│ [____________________________]   │
│                                  │
│ Your details are shared with     │
│ this shop to respond to you.     │
│ ┌──────────────────────────────┐ │
│ │          Send inquiry        │ │
│ └──────────────────────────────┘ │
│ No online payment is collected.  │
└──────────────────────────────────┘
```

## Manager overview — desktop

```text
┌───────────────┬───────────────────────────────────────────────┐
│ BRAND         │ Overview                         [Shop status] │
│               ├───────────────────────────────────────────────┤
│ Overview      │ [Active products] [New inquiries] [In stock]  │
│ Products      │                                               │
│ Inventory     │ Recent inquiries               View all       │
│ Inquiries     │ ┌───────────────────────────────────────────┐ │
│ Shop profile  │ │ Ref | Customer | Product | Date | Status  │ │
│ Settings      │ │ ...                                       │ │
│               │ └───────────────────────────────────────────┘ │
│               │                                               │
│               │ Recently updated products                     │
│               │ [thumb] Product A       [Edit]                │
│               │ [thumb] Product B       [Edit]                │
│               │                                               │
│               │ Storefront preview            [View shop]     │
└───────────────┴───────────────────────────────────────────────┘
```

## Product editor — desktop

```text
┌───────────────┬───────────────────────────────────────────────┐
│ Sidebar       │ Products / Add product                        │
│               │ Product information                           │
│               │ ┌──────────────────────────┐ ┌──────────────┐ │
│               │ │ Product name             │ │ Storefront   │ │
│               │ │ Category                 │ │ preview      │ │
│               │ │ Description              │ │              │ │
│               │ │                          │ │ [image]      │ │
│               │ │ Product images            │ │ Product name │ │
│               │ │ [Upload] [thumb][thumb]   │ │ Price        │ │
│               │ └──────────────────────────┘ └──────────────┘ │
│               │ Pricing and availability                      │
│               │ [Fixed price] [Price on request]               │
│               │ Options and variants                           │
│               │ [Add option]                                   │
│               ├───────────────────────────────────────────────┤
│               │ [Cancel] [Save draft] [Save product]           │
└───────────────┴───────────────────────────────────────────────┘
```

## Admin shop review — desktop

```text
┌───────────────┬───────────────────────────────────────────────┐
│ Admin sidebar │ Review shop: Urban Shop      [Pending review] │
│               ├───────────────────────────────────────────────┤
│ Overview      │ ┌─────────────────────────┐ ┌───────────────┐ │
│ Shops         │ │ Public storefront       │ │ Review checks │ │
│ Products      │ │ [cover / logo]          │ │ [✓] Profile   │ │
│ Categories    │ │ Description             │ │ [✓] Contacts  │ │
│ Reports       │ │ Products preview        │ │ [ ] Policy    │ │
│ Audit log     │ └─────────────────────────┘ └───────────────┘ │
│               │ Owner / submission information               │
│               │ Moderation notes                              │
│               ├───────────────────────────────────────────────┤
│               │ [Request changes] [Reject] [Approve shop]     │
└───────────────┴───────────────────────────────────────────────┘
```

---

# 7. Data labels and status language

Use the same language consistently throughout the UI.

## Product visibility
- Draft — not publicly visible.
- Published — publicly visible.
- Archived — hidden from normal browsing, retained for records.

## Availability
- In stock — only if inventory data supports it.
- Out of stock — only if known.
- Ask shop to confirm — preferred when availability is not reliably tracked.
- Not tracked — manager-facing label; customer-facing UI should say “Ask shop to confirm” unless the shop chooses a clearer public message.

## Inquiry status
- New — received by the shop.
- Contacted — shop says it has contacted the customer.
- Closed — shop/customer no longer needs follow-up.
- Optional: Needs support — internal platform support state, not a sales outcome.

Do not use “Paid,” “Payment pending,” “Delivered,” or “Order completed” unless a separate, real and explicitly supported workflow exists. The initial product must not imply one.

## Shop status
- Draft
- Pending review
- Active
- Needs changes
- Suspended

---

# 8. Functional design details that affect the UI

- Telegram identity should be validated server-side using the official Mini App initialization data. Never trust a client-supplied Telegram user ID alone.
- Bot webhook and Mini App frontend must be treated as separate entry points to the same backend.
- Customer browsing should be possible without creating a separate marketplace password account when Telegram identity is sufficient.
- Contact information should be collected only when necessary and accompanied by a clear explanation.
- Inquiry submission must be idempotent or otherwise protected from accidental duplicate submissions.
- Preserve a product/variant/price snapshot in the inquiry so later product edits do not rewrite historical inquiry details.
- Do not deduct stock or create a stock reservation on inquiry submission.
- Shop managers may only edit products and view customer inquiry information belonging to their own shop, unless an explicitly authorized staff role grants access.
- Admin actions need server-side permission checks and audit logs.
- Images need upload validation, safe storage, thumbnails, and loading/error placeholders.
- Search, filter, sort, and pagination need explicit loading, empty, and error UI.
- Use real data for counts and metrics; never add decorative fake analytics.
- Provide sensible localization structure. If Amharic is supported, ensure layouts handle longer/shorter translated labels and Ethiopian phone number formats.
- Currency display must be explicit and configurable; do not assume every product uses the same currency without a marketplace policy.

---

# 9. Recommended implementation order

## Phase 1 — design system and customer marketplace
1. Design tokens, typography, buttons, fields, cards, badges, sheets, dialogs.
2. Launch/loading and shared app shell.
3. Home, categories, search, category results.
4. Product detail, image viewer, variant selection.
5. Inquiry form, confirmation, inquiry list/detail.
6. Shop storefront, saved items, profile.
7. Responsive states, Telegram theme support, loading/empty/error cases.

## Phase 2 — shop management
1. Sign-in and registration.
2. Onboarding and shop approval state.
3. Overview dashboard.
4. Product list and product create/edit/preview.
5. Variants and inventory management.
6. Inquiry inbox and inquiry detail.
7. Shop profile, settings, notifications.

## Phase 3 — admin and moderation
1. Admin sign-in and overview.
2. Shop review and management.
3. Product moderation and categories.
4. Customer/support view.
5. Reports, admin roles, audit logs, settings.

## Phase 4 — quality and polish
1. Mobile/tablet/desktop responsive review.
2. Dark mode and Telegram safe-area review.
3. Keyboard/accessibility pass.
4. Every page’s loading, empty, error, and success states.
5. Validate contact routes and privacy.
6. Confirm that no UI accidentally implies online payment or confirmed delivery.

---

# 10. Definition of done for UI/UX

The work is not complete if it only has a homepage, a generic dashboard, or placeholder CRUD pages.

For **every page** listed above, provide:
- A consistent high-fidelity UI using the design system.
- Responsive behavior at mobile, tablet, and desktop breakpoints where relevant.
- Clear navigation and working primary/secondary actions.
- Form validation and helpful inline messages.
- Loading, empty, error, disabled, success, and permission states where relevant.
- Realistic example data for development, clearly separated from production data.
- Accessible focus and touch states.
- Reusable components rather than inconsistent one-off designs.
- No dead buttons or controls that look functional but do nothing.
- No payment gateway, payment form, paid-order status, or fake sales analytics.
- A short page inventory and component inventory in the project documentation.

## Final instruction to the design/development agent

Treat this file as a page-by-page UI/UX contract. Before coding, create a checklist of every screen (C01–C15, M01–M17, A01–A12), then implement and verify each one. Build polished interfaces with realistic spacing, typography, product imagery, responsive layouts, and complete states. Do not reduce the work to a flowchart or a few generic screens. Every major user action should have a concrete, designed screen or state. Preserve the core business model: product discovery and inquiry happen in the marketplace; the customer and shop owner arrange payment and delivery directly outside the platform.
