# ShopEZ | Phase 1 Storefront

A responsive React storefront built as the first stage of a MERN e-commerce learning project.

> This is a frontend demo. Products are sample data in `src/App.js`; cart state is held in React memory. No real database, authentication, orders, or payments are connected yet.

## Phase 1 features

- Responsive storefront and navigation
- Product cards, categories, search, sorting, ratings and sale pricing
- Wishlist toggles
- Interactive shopping bag with quantity controls and subtotal
- Empty states, accessible labels and add-to-cart notifications
- Mobile-friendly layout and reduced-motion support

## Run locally

This repository currently uses Create React App (React Scripts) rather than Vite. Keep the current package setup for Phase 1 to avoid mixing build systems during the first rebuild.

1. Install Node.js LTS from https://nodejs.org/
2. Clone the repository and change into its folder:

   ```bash
   git clone https://github.com/JagadeeshO11/shopez.git
   cd shopez
   ```

3. Switch to the feature branch:

   ```bash
   git checkout phase-1-storefront-rebuild
   ```

4. Install dependencies:

   ```bash
   npm install
   ```

5. Start the development server:

   ```bash
   npm start
   ```

6. Open http://localhost:3000

7. Check the production build:

   ```bash
   npm run build
   ```

## How the code works

- `src/App.js`: holds sample product data, page structure, category filtering, search, sorting, wishlist state, cart state and subtotal logic.
- `src/App.css`: contains the storefront design system, responsive breakpoints, product grid, drawer and interaction states.
- `src/index.js`: existing Create React App entry point. The rebuild deliberately leaves the app bootstrapping and installed dependencies intact.
- `src/index.css`: existing global base styles. The storefront-specific design is scoped to `App.css`.
- `public/index.html`: document metadata and the HTML root element used by React.

## Teaching notes: the commands and why

| Command | Why we use it |
| --- | --- |
| `git clone <url>` | Creates a local copy of the repository. |
| `git checkout phase-1-storefront-rebuild` | Moves work onto the feature branch instead of editing `main`. |
| `npm install` | Installs the dependencies declared in `package.json`. |
| `npm start` | Starts the local development server with hot reload. |
| `npm run build` | Creates an optimized production build and catches many compile-time issues. |
| `git status` | Shows files changed locally. |
| `git add src/App.js src/App.css README.md` | Stages only the intended changes. |
| `git commit -m "Build Phase 1 storefront"` | Records a checkpoint with a descriptive message. |
| `git push -u origin phase-1-storefront-rebuild` | Uploads the feature branch to GitHub. |
| `git diff` | Reviews what changed before committing. |

## Suggested learning order

1. Read the `PRODUCTS` array and understand JavaScript objects and arrays.
2. Learn React state: `useState` stores cart, category, search and sort choices.
3. Learn derived data: `useMemo` filters and sorts products when relevant inputs change.
4. Learn rendering arrays with `map()` and stable React `key` values.
5. Learn event handlers such as `onClick` and `onChange`.
6. Trace how `addToCart` updates quantities and how subtotal is calculated from product data.
7. Read `App.css` from desktop styles to responsive media queries.

## Next phases

- **Phase 2:** add Express API, MongoDB/Mongoose product model and API-driven product listing.
- **Phase 3:** secure registration/login, customer order creation, server-side price and stock validation, admin-only product management.
- **Phase 4:** integrate a payment provider with server-side verification and webhook handling.
- **Before production:** add tests, error handling, image fallbacks, security headers, input validation, privacy/returns/shipping pages and real inventory data.
