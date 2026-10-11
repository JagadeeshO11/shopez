# ShopEZ | Storefront connected to shopezbe

A responsive Create React App storefront using the existing ShopEZ Express + MongoDB backend.

## Connected capabilities

- Loads product catalogue from `GET /api/v1/products`; product cards use MongoDB document IDs and backend fields.
- Email/password sign up and sign in through `POST /api/v1/auth/register` and `POST /api/v1/auth/login`.
- Short-lived access JWTs (15 minutes by default) are held in frontend memory; refresh tokens are HttpOnly cookies and are never written to localStorage.
- Every browser/device login creates a separate MongoDB session. Refresh tokens are stored as SHA-256 hashes and rotated on refresh.
- Account security screen lists active devices, supports signing out one device, and supports signing out all devices.
- Access tokens are bound to a session so revoked sessions stop authorizing protected API requests.
- Persistent customer cart uses `/api/v1/cart` and `/api/v1/cart/items`.
- Persistent wishlist uses `/api/v1/wishlist`.
- Checkout submits an order through `POST /api/v1/orders` using cash on delivery. The current backend order route saves the order, validates submitted product IDs and stock, decreases stock and clears the cart.
- Search, category filtering, sorting and Deals view run against the API-loaded product list.
- Empty/loading/error states are shown if the backend cannot return products.

## API base URL

The default production API base is `https://shopezbe.vercel.app/api/v1`. Override it for local development by adding a `.env` file in the frontend root:

```dotenv
REACT_APP_API_URL=http://localhost:5000/api/v1
```

Restart `npm start` after changing environment variables. Do not put MongoDB credentials, JWT secrets, or other private backend secrets into the frontend `.env`; variables prefixed with `REACT_APP_` are bundled into public browser code.

## Run frontend locally

```bash
git clone https://github.com/JagadeeshO11/shopez.git
cd shopez
git checkout phase-1-storefront-rebuild
npm install
npm start
```

Open http://localhost:3000.

Build check:

```bash
npm run build
```

## Run backend locally

In a separate terminal:

```bash
git clone https://github.com/JagadeeshO11/shopezbe.git
cd shopezbe
npm install
```

Create a local `.env` using `.env.example` as a template. Add a valid MongoDB Atlas URI and a long random `JWT_SECRET`. Keep `.env` private and never commit it.

```bash
npm run dev
```

The backend listens on port 5000 by default. Verify `http://localhost:5000/api/health`. Then set the frontend `REACT_APP_API_URL` to `http://localhost:5000/api/v1` and restart the frontend.

## Seed data note

The frontend no longer displays hard-coded sample products. The public product endpoint returns products stored in MongoDB. If the catalogue is empty, add product documents using the backend's admin-protected product creation route or a trusted seed script. Admin product creation requires a user with the `admin` role and a valid JWT. Never put admin credentials in frontend source code.

## User flow

1. Register or sign in with email and password.
2. Add products to the bag or wishlist.
3. Reopen the app while signed in to load the backend-saved cart and wishlist.
4. Fill delivery address details and place a cash-on-delivery order.
5. Orders and stock changes are managed by the backend.

## Important limits to address before production

- Email verification/OTP, password reset, Google sign-in, mobile OTP, online payment gateway, refunds, delivery-partner onboarding and admin UI are not connected in this pass. Email/password login and multi-device session management are implemented.
- Checkout currently uses cash on delivery because the backend has no payment-provider verification route.
- Verify the API deployment, CORS allowlist, MongoDB connection, JWT secret and seed product catalogue before release.
- The current backend order route updates stock after order creation without a MongoDB transaction. Add transactional stock reservation to avoid race conditions before handling real traffic.
- Set `JWT_SECRET` to a long random secret, and optionally set `ACCESS_TOKEN_TTL=15m` and `REFRESH_TOKEN_DAYS=30` in backend environment variables. Never expose these values in frontend environment variables.
- The backend must be redeployed after backend commits before the frontend can use the new refresh/session endpoints.
- Review validation and auth hardening in the backend before public production use.

## What the key code teaches

- `axios.create({ baseURL })`: centralises API URL and timeout settings.
- `useEffect`: loads products and signed-in customer data from the backend.
- `useState`: stores API results and current UI state.
- `useMemo`: derives filtered products and totals without duplicating catalogue data.
- `Authorization: Bearer <token>`: sends the backend-issued JWT to protected endpoints.
- `npm start`: starts the frontend development server.
- `npm run build`: creates an optimised production bundle.
