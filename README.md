# ShopEZ | Phase 1 Storefront

A responsive React storefront for a staged MERN e-commerce learning project.

> Phase 1 is a frontend demo. Products are sample data in `src/App.js`; cart and wishlist state live in React memory. Database, authentication, real orders and payments are not connected yet.

## Phase 1 features

- Responsive storefront and navigation
- Product cards, category filtering, search and sort
- Sale pricing, ratings and product descriptions
- Wishlist toggles
- Interactive shopping bag, quantity controls and subtotal
- Empty states and add-to-cart notices
- Mobile layout and reduced-motion support

## Run locally

This repository currently uses Create React App (React Scripts), not Vite. Keep the current build system for this phase so we can focus on learning the frontend rather than migrating tools at the same time.

1. Install Node.js LTS from https://nodejs.org/
2. Clone the repo and enter the folder:

   ```bash
   git clone https://github.com/JagadeeshO11/shopez.git
   cd shopez
   ```

3. Switch to the feature branch:

   ```bash
   git checkout phase-1-storefront-rebuild
   ```

4. Install the dependencies declared in package.json:

   ```bash
   npm install
   ```

5. Run the development server:

   ```bash
   npm start
   ```

6. Open http://localhost:3000 in your browser.

7. Check if the app can compile for production:

   ```bash
   npm run build
   ```

## Main files

- `src/App.js`: sample products, UI, category filtering, search, sorting, wishlist and cart logic.
- `src/App.css`: visual design, responsive breakpoints, product cards, navigation and cart drawer.
- `src/index.js`: existing app entry point. It mounts React and the router.
- `src/index.css`: global CSS. Phase 1 styling is scoped to the storefront stylesheet.
- `public/index.html`: page metadata and the HTML root element where React mounts.

## Commands explained for teaching

| Command | What it does |
| --- | --- |
| `git clone <url>` | Downloads a working copy of a GitHub repository to your computer. |
| `git checkout phase-1-storefront-rebuild` | Switches to our feature branch, keeping the main branch untouched. |
| `npm install` | Installs project dependencies from package.json and package-lock.json. |
| `npm start` | Starts the local development server with hot reload. |
| `npm run build` | Compiles and optimizes the app for deployment. |
| `git status` | Shows changed, staged and untracked files. |
| `git diff` | Reviews code edits before saving a checkpoint. |
| `git add src/App.js src/App.css README.md` | Stages the files we intend to include in a commit. |
| `git commit -m "Build Phase 1 storefront"` | Creates a versioned checkpoint with a message describing the change. |
| `git push -u origin phase-1-storefront-rebuild` | Uploads the branch to GitHub and links the local branch to it. |

## Learn the code in order

1. **JavaScript data:** inspect the `PRODUCTS` array. Each object describes one product.
2. **React state:** `useState` holds selected category, search text, sort choice, cart quantities and favourites.
3. **Derived data:** `useMemo` filters and sorts the products when the relevant state changes.
4. **Rendering lists:** `.map()` creates category tabs and product cards. The `key` prop helps React track list items.
5. **Events:** `onClick` and `onChange` call functions when users interact with buttons and fields.
6. **Cart math:** `addToCart` changes a quantity; `subtotal` combines each product's price and quantity.
7. **Responsive CSS:** read the media queries at the end of `App.css` to see how layouts adapt for smaller screens.

## Next phases

- **Phase 2:** add an Express API, MongoDB/Mongoose product model, and load products from the API.
- **Phase 3:** implement secure authentication, order creation, server-side price and stock validation, and admin-only product management.
- **Phase 4:** integrate a payment provider with server-side verification and webhook handling.
- **Before production:** add tests, server validation, security headers, image fallbacks, shipping/returns/privacy pages and real inventory data.
