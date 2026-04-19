# MediStore Frontend (b6a4-frontend)

Next.js (App Router) frontend for MediStore, an OTC medicine e-commerce platform with role-based experiences for:

- `CUSTOMER`
- `SELLER`
- `ADMIN`

## Tech Stack

- Next.js App Router + TypeScript
- Tailwind CSS
- Redux Toolkit + redux-persist (cart)
- Better Auth client (sessions)
- Socket.IO client (real-time notifications)

## Features

- Homepage with hero + sections, responsive UI
- Shop: browse + filter + debounced search
- Medicine details page
- Cart + checkout (Cash on Delivery)
- Orders list + order details + review flow (from delivered order items)
- Seller: inventory + add medicine + seller orders status updates
- Admin: users + orders + categories + brands
- Role-aware analytics dashboard (customer/seller/admin) with charts
- Notifications: bell icon + offcanvas panel + unread badge (real-time)

## Environment Variables

Create `b6a4-frontend/.env`:

```env
BACKEND_URL=http://localhost:5000/api
FRONTEND_URL=http://localhost:3000/

API_URL=http://localhost:5000/api
AUTH_URL=http://localhost:5000/api/auth

NEXT_PUBLIC_TEST=test-value
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

Notes:
- Server-side fetches use `API_URL` (not `NEXT_PUBLIC_API_URL`).
- Client-side services use `NEXT_PUBLIC_API_URL` (via `src/services/api-base.ts`).

## Install

```bash
cd b6a4-frontend
npm install
```

## Scripts

```bash
npm run dev
npm run build
npm run start
npm run lint
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
npm run dev
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

- Bell icon in navbar opens an offcanvas panel.
- New events appear in real-time using Socket.IO when backend supports websockets.

If your backend is deployed as serverless without websockets, notifications will still work via manual refresh but realtime events require a persistent backend host.
