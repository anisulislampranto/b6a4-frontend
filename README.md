# MediStore Frontend (b6a4-frontend)

Next.js (App Router) frontend for MediStore, an OTC medicine e-commerce platform with role-based experiences for:

- `CUSTOMER`
- `SELLER`
- `ADMIN`

## Tech Stack

- Next.js App Router + TypeScript
- Tailwind CSS
- Redux Toolkit + redux-persist (cart)
- Better Auth (sessions)
- Socket.IO client (real-time notifications support)
- tesseract.js (OCR utilities used by prescription modal component)

## Features

- Responsive homepage UI
- Shop: browse + filter + debounced search
- Medicine details page
- Cart (persisted) + checkout (Cash on Delivery)
- Checkout can redirect to a hosted payment page when backend returns `payment_url` (payment UI option is currently hidden in `CheckoutClient.tsx`)
- Orders list + order details + review flow (from delivered order items)
- Seller: inventory + add medicine + seller orders status updates
- Admin: users + orders + categories + brands
- Role-aware analytics dashboard (customer/seller/admin) with charts
- Notifications panel + unread counting (Socket.IO listeners are wired; navbar trigger may be disabled depending on current UI)
- (WIP/Optional) Prescription OCR modal component exists, but the homepage trigger button may be commented out

## Environment Variables

Create `b6a4-frontend/.env`:

```env
# Server-only
BACKEND_URL=http://localhost:5000
FRONTEND_URL=http://localhost:3000/

# Server-side fetch (App Router / server components)
API_URL=http://localhost:5000/api
# Better Auth server endpoint (used by server-side session check)
AUTH_URL=http://localhost:5000/api/auth

# Client + Next rewrite proxy
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_AUTH_URL=http://localhost:5000/api/auth

# Required by env schema (can be any string)
NEXT_PUBLIC_TEST=test-value
```

Notes:
- Client-side services call `API_BASE_URL = "/api"` and Next.js rewrites `/api/*` to `NEXT_PUBLIC_API_URL/*` (see `next.config.ts`).
- Server components/pages use `process.env.API_URL` for server-side `fetch()` calls.

## Install

```bash
cd b6a4-frontend
pnpm install
```

## Scripts

```bash
pnpm run dev
pnpm run build
pnpm run start
pnpm run lint
```

## Routes (Implemented)

Public / Guest:
- `/`
- `/shop`
- `/shop/[id]`
- `/signin` (guest-only)
- `/signup` (guest-only)

Authenticated:
- `/dashboard`
- `/profile`

Customer-only:
- `/cart`
- `/checkout`
- `/orders`
- `/orders/[id]`

Seller/Admin:
- `/seller/dashboard`
- `/seller/medicines`
- `/seller/medicines/add`
- `/seller/orders`

Admin-only:
- `/admin`
- `/admin/users`
- `/admin/orders`
- `/admin/categories`
- `/admin/brands`

## Local Run

Start backend first, then frontend:

```bash
cd b6a4-frontend
pnpm run dev
```

App runs at `http://localhost:3000`.

## Test Journeys

Customer:
1. Sign up as customer.
2. Browse `/shop`, open a medicine, add to cart.
3. Checkout to place order.
4. Track in `/orders`, open `/orders/[id]`.
5. After `DELIVERED`, submit review from order item.

Seller:
1. Sign up as seller.
2. Add medicine via `/seller/medicines/add`.
3. View `/seller/orders` and update status transitions.

Admin:
1. Seed admin in backend and sign in.
2. Manage users, orders, categories, brands.

## Notifications (Real-time)

- Socket.IO listeners are implemented for `notification:new` and `notification:read-all` events.
- The notifications UI is implemented in `src/components/modules/notifications/NotificationsPanel.tsx`.

If your backend is deployed as serverless without websockets, notifications will still work via manual refresh but realtime events require a persistent backend host.
