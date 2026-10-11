import { useMemo, useState } from "react";
import "./App.css";

const PRODUCTS = [
  { id: 1, name: "Everyday Backpack", category: "Accessories", brand: "Northstar", seller: "Everyday Goods Co.", sku: "SE-ACC-001", stock: 24, delivery: "2–4 days", warranty: "6-month warranty", price: 1299, oldPrice: 1799, rating: 4.8, tag: "BESTSELLER", image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=900&q=85", description: "A lightweight everyday companion with room for everything." },
  { id: 2, name: "Studio Headphones", category: "Electronics", brand: "Soundform", seller: "Soundform Official", sku: "SE-ELC-002", stock: 12, delivery: "1–3 days", warranty: "1-year warranty", price: 2499, oldPrice: 3299, rating: 4.7, tag: "TOP RATED", image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=85", description: "Comfortable listening, rich sound and a clean minimal design." },
  { id: 3, name: "Classic Timepiece", category: "Accessories", brand: "Moment", seller: "Time & Things", sku: "SE-ACC-003", stock: 8, delivery: "2–4 days", warranty: "1-year warranty", price: 1899, oldPrice: 2499, rating: 4.6, tag: "POPULAR", image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=85", description: "A versatile watch made for weekdays and weekends." },
  { id: 4, name: "Daily Carry Sneakers", category: "Fashion", brand: "Stride", seller: "Stride Footwear", sku: "SE-FAS-004", stock: 18, delivery: "2–5 days", warranty: "30-day return", price: 2199, oldPrice: 2899, rating: 4.5, tag: "NEW", image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=85", description: "A bold, comfortable pair that brings energy to every step." },
  { id: 5, name: "Desk Essentials", category: "Home", brand: "WorkNest", seller: "WorkNest Living", sku: "SE-HOM-005", stock: 31, delivery: "2–4 days", warranty: "30-day return", price: 899, oldPrice: 1199, rating: 4.4, tag: "VALUE PICK", image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=900&q=85", description: "Thoughtful essentials to keep your workspace feeling fresh." },
  { id: 6, name: "Travel Bottle", category: "Home", brand: "EverSip", seller: "EverSip Official", sku: "SE-HOM-006", stock: 42, delivery: "1–3 days", warranty: "30-day return", price: 499, oldPrice: 699, rating: 4.7, tag: "ECO PICK", image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=900&q=85", description: "A reusable bottle for commutes, workouts and weekend escapes." },
  { id: 7, name: "Everyday Sunglasses", category: "Fashion", brand: "Daylight", seller: "Daylight Accessories", sku: "SE-FAS-007", stock: 16, delivery: "2–5 days", warranty: "30-day return", price: 799, oldPrice: 1099, rating: 4.3, tag: "TRENDING", image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=900&q=85", description: "An easy finishing touch with a timeless silhouette." },
  { id: 8, name: "Wireless Speaker", category: "Electronics", brand: "Soundform", seller: "Soundform Official", sku: "SE-ELC-008", stock: 9, delivery: "1–3 days", warranty: "1-year warranty", price: 1599, oldPrice: 2199, rating: 4.6, tag: "FAN FAVOURITE", image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=900&q=85", description: "Small enough to carry, lively enough to share your playlist." },
];

const CATEGORIES = [
  { name: "All products", icon: "✳", tone: "sand" },
  { name: "Electronics", icon: "⌁", tone: "blue" },
  { name: "Fashion", icon: "✦", tone: "pink" },
  { name: "Accessories", icon: "◇", tone: "green" },
  { name: "Home", icon: "⌂", tone: "yellow" },
];
const money = (value) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(value);

function Icon({ name, size = 20 }) {
  const paths = {
    search: <><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></>,
    bag: <><path d="M5 8h14l1 13H4L5 8Z" /><path d="M9 8V6a3 3 0 0 1 6 0v2" /></>,
    heart: <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.5 1.1-1.1a5.5 5.5 0 0 0-.1-7.8Z" />,
    arrow: <><path d="M5 12h14" /><path d="m13 6 6 6-6 6" /></>,
    plus: <><path d="M12 5v14" /><path d="M5 12h14" /></>,
    minus: <path d="M5 12h14" />,
    close: <><path d="m18 6-12 12" /><path d="m6 6 12 12" /></>,
    menu: <><path d="M4 7h16" /><path d="M4 12h16" /><path d="M4 17h16" /></>,
    check: <path d="m5 12 4 4L19 6" />,
  };
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>;
}

function App() {
  const [cart, setCart] = useState({});
  const [category, setCategory] = useState("All products");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("featured");
  const [seller, setSeller] = useState("All sellers");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [saved, setSaved] = useState([]);
  const [notice, setNotice] = useState("");
  const filteredProducts = useMemo(() => {
    let result = PRODUCTS.filter((product) => {
      const matchesCategory = category === "All products" || product.category === category;
      const matchesSeller = seller === "All sellers" || product.seller === seller;
      const searchable = `${product.name} ${product.brand} ${product.seller} ${product.category} ${product.sku}`.toLowerCase();
      const matchesQuery = searchable.includes(query.toLowerCase());
      return matchesCategory && matchesSeller && matchesQuery;
    });
    if (sort === "price-low") result = [...result].sort((a, b) => a.price - b.price);
    if (sort === "price-high") result = [...result].sort((a, b) => b.price - a.price);
    if (sort === "rating") result = [...result].sort((a, b) => b.rating - a.rating);
    if (sort === "seller") result = [...result].sort((a, b) => a.seller.localeCompare(b.seller));
    if (sort === "discount") result = [...result].sort((a, b) => (1 - b.price / b.oldPrice) - (1 - a.price / a.oldPrice));
    if (sort === "name") result = [...result].sort((a, b) => a.name.localeCompare(b.name));
    return result;
  }, [category, query, seller, sort]);
  const cartCount = Object.values(cart).reduce((sum, quantity) => sum + quantity, 0);
  const subtotal = PRODUCTS.reduce((sum, product) => sum + product.price * (cart[product.id] || 0), 0);
  const addToCart = (product) => {
    setCart((current) => ({ ...current, [product.id]: (current[product.id] || 0) + 1 }));
    setNotice(`${product.name} added to your bag`);
    window.setTimeout(() => setNotice(""), 2200);
  };
  const changeQuantity = (id, change) => setCart((current) => {
    const nextQuantity = (current[id] || 0) + change;
    const next = { ...current };
    if (nextQuantity <= 0) delete next[id]; else next[id] = nextQuantity;
    return next;
  });
  const toggleSaved = (id) => setSaved((items) => items.includes(id) ? items.filter((item) => item !== id) : [...items, id]);

  return <div className="storefront">
    <div className="announcement"><span>THE LITTLE THINGS, DELIVERED WITH CARE</span><span className="announcement-right">Free delivery on orders over ₹1,499 <span aria-hidden="true">↗</span></span></div>
    <header className="site-header">
      <button className="icon-button mobile-menu" aria-label="Open menu" onClick={() => setDrawerOpen(!drawerOpen)}><Icon name="menu" /></button>
      <a className="wordmark" href="#top" aria-label="ShopEZ home">shop<span>ez</span><i>.</i></a>
      <nav className={`main-nav ${drawerOpen ? "nav-open" : ""}`} aria-label="Main navigation">
        <a className="active" href="#shop" onClick={() => setDrawerOpen(false)}>Shop all</a>
        <a href="#shop" onClick={() => { setCategory("Fashion"); setDrawerOpen(false); }}>Fashion</a>
        <a href="#shop" onClick={() => { setCategory("Electronics"); setDrawerOpen(false); }}>Tech & gadgets</a>
        <a href="#story" onClick={() => setDrawerOpen(false)}>Our story</a>
      </nav>
      <div className="header-actions">
        <label className="header-search"><Icon name="search" size={18} /><input aria-label="Search products" placeholder="Search anything..." value={query} onChange={(event) => { setQuery(event.target.value); document.getElementById("shop")?.scrollIntoView({ behavior: "smooth" }); }} /></label>
        <button className="icon-button wishlist-button" aria-label={`Wishlist, ${saved.length} saved`} onClick={() => { setNotice(saved.length ? `${saved.length} item(s) saved to your favourites` : "Tap the heart on any product to save it"); window.setTimeout(() => setNotice(""), 2200); }}><Icon name="heart" /></button>
        <button className="bag-button" aria-label={`Open shopping bag, ${cartCount} items`} onClick={() => setCartOpen(true)}><Icon name="bag" size={19} /><span className="bag-label">Bag</span><span className="bag-count">{cartCount}</span></button>
      </div>
    </header>
    <main id="top">
      <section className="hero">
        <div className="hero-copy"><div className="eyebrow"><span className="eyebrow-dot" /> A BETTER WAY TO SHOP</div><h1>Good finds.<br /><em>Better days.</em></h1><p>Everyday essentials and little luxuries, picked to make your world feel a little more you.</p><a className="primary-button" href="#shop">Explore the collection <Icon name="arrow" size={18} /></a><div className="hero-proof"><div className="avatar-stack"><span>R</span><span>A</span><span>S</span></div><div><strong>Loved by everyday people</strong><small>Thoughtful picks, happy deliveries.</small></div></div></div>
        <div className="hero-visual"><div className="hero-sun" /><div className="hero-image image-back"><img src="https://images.unsplash.com/photo-1490312278390-ab64016e0aa9?auto=format&fit=crop&w=900&q=85" alt="A calm, sunlit lifestyle interior" /></div><div className="hero-image image-front"><img src="https://images.unsplash.com/photo-1547949003-9792a18a2601?auto=format&fit=crop&w=800&q=85" alt="Minimal everyday bag in warm neutral tones" /></div><div className="floating-note"><span>✳</span><div><strong>Picked with purpose</strong><small>Made for your everyday</small></div></div><div className="hero-stamp">GOOD<br />THINGS<br /><span>INSIDE</span></div></div>
        <div className="hero-bottom-note"><span>01 / THE EVERYDAY EDIT</span><span>SCROLL TO DISCOVER ↓</span></div>
      </section>
      <section className="category-strip" aria-label="Shop by category">{CATEGORIES.map((item) => <button key={item.name} className={`category-tile ${item.tone} ${category === item.name ? "selected" : ""}`} onClick={() => { setCategory(item.name); document.getElementById("shop")?.scrollIntoView({ behavior: "smooth" }); }}><span className="category-icon">{item.icon}</span><span>{item.name}</span><Icon name="arrow" size={16} /></button>)}</section>
      <section className="product-section" id="shop">
        <div className="section-heading"><div><div className="eyebrow">THE GOOD STUFF</div><h2>Find your <em>favourite.</em></h2><p>Useful things. Lovely details. Zero overthinking.</p></div><label className="sort-select">Sort by <select value={sort} onChange={(event) => setSort(event.target.value)} aria-label="Sort products"><option value="featured">Featured</option><option value="price-low">Price: low to high</option><option value="price-high">Price: high to low</option><option value="rating">Top rated</option><option value="discount">Biggest discount</option><option value="name">Name: A to Z</option><option value="seller">Seller: A to Z</option></select></label></div>
        <div className="filter-row"><div className="filter-tabs">{CATEGORIES.map((item) => <button key={item.name} className={category === item.name ? "filter-active" : ""} onClick={() => setCategory(item.name)}>{item.name}</button>)}</div><label className="seller-select">Seller <select value={seller} onChange={(event) => setSeller(event.target.value)} aria-label="Filter by seller"><option>All sellers</option>{[...new Set(PRODUCTS.map((product) => product.seller))].sort().map((name) => <option key={name}>{name}</option>)}</select></label><span className="product-count">{filteredProducts.length} finds</span></div>
        {filteredProducts.length ? <div className="product-grid">{filteredProducts.map((product, index) => <article className="product-card" key={product.id} style={{ "--card-index": index }}><div className="product-image-wrap"><img src={product.image} alt={product.name} loading="lazy" /><span className="product-tag">{product.tag}</span><button className={`save-button ${saved.includes(product.id) ? "is-saved" : ""}`} aria-label={saved.includes(product.id) ? `Remove ${product.name} from favourites` : `Save ${product.name} to favourites`} onClick={() => toggleSaved(product.id)}><Icon name="heart" size={18} /></button><button className="quick-add" onClick={() => addToCart(product)}><Icon name="plus" size={17} /> Add to bag</button></div><div className="product-meta"><div><span className="product-category">{product.category} · {product.brand}</span><h3>{product.name}</h3></div><span className="rating">★ {product.rating}</span></div><p className="product-description">{product.description}</p><div className="product-details"><span>Sold by <strong>{product.seller}</strong></span><span>SKU: {product.sku}</span><span className={product.stock <= 10 ? "stock-low" : "stock-ok"}>{product.stock <= 10 ? `Only ${product.stock} left` : `${product.stock} in stock`}</span><span>Delivery: {product.delivery}</span><span>{product.warranty}</span></div><div className="price-line"><strong>{money(product.price)}</strong><del>{money(product.oldPrice)}</del><span className="discount">{Math.round((1 - product.price / product.oldPrice) * 100)}% off</span></div></article>)}</div> : <div className="empty-results"><span>⌕</span><h3>No finds just yet</h3><p>Try another search or category.</p><button className="text-button" onClick={() => { setQuery(""); setCategory("All products"); setSeller("All sellers"); }}>Show all products <Icon name="arrow" size={16} /></button></div>}
        <div className="collection-end"><span>YOU'VE SEEN THE GOOD STUFF</span><span>MORE GOOD THINGS COMING SOON ✳</span></div>
      </section>
      <section className="story-band" id="story"><div className="story-mark">s<span>e.</span></div><div><div className="eyebrow">A SMALL SHOP WITH BIG HEART</div><h2>Less scrolling.<br /><em>More loving what you find.</em></h2><p>We believe shopping should feel simple, personal, and a little delightful. That's the whole idea behind ShopEZ.</p></div><a className="story-link" href="#shop">Find your next favourite <Icon name="arrow" size={18} /></a></section>
    </main>
    <footer className="site-footer"><a className="wordmark footer-wordmark" href="#top">shop<span>ez</span><i>.</i></a><span>Everyday finds, thoughtfully picked.</span><div><a href="#shop">Shop</a><a href="#story">About</a><a href="mailto:hello@shopez.example">Contact</a></div><small>© {new Date().getFullYear()} ShopEZ. A demo storefront for Phase 1.</small></footer>
    {notice && <div className="toast" role="status"><span className="toast-check"><Icon name="check" size={16} /></span>{notice}</div>}
    {cartOpen && <div className="overlay" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setCartOpen(false); }}><aside className="cart-drawer" aria-label="Shopping bag"><div className="drawer-heading"><div><span className="eyebrow">YOUR LITTLE COLLECTION</span><h2>Your bag <span>({cartCount})</span></h2></div><button className="icon-button" aria-label="Close bag" onClick={() => setCartOpen(false)}><Icon name="close" /></button></div>{cartCount === 0 ? <div className="empty-cart"><span className="empty-bag"><Icon name="bag" size={30} /></span><h3>Your bag is taking a nap.</h3><p>Find something lovely and it'll show up here.</p><button className="primary-button" onClick={() => { setCartOpen(false); document.getElementById("shop")?.scrollIntoView({ behavior: "smooth" }); }}>Explore the collection <Icon name="arrow" size={18} /></button></div> : <><div className="cart-items">{PRODUCTS.filter((product) => cart[product.id]).map((product) => <div className="cart-item" key={product.id}><img src={product.image} alt="" /><div className="cart-item-details"><span className="product-category">{product.category} · {product.brand}</span><h3>{product.name}</h3><small className="cart-seller">Sold by {product.seller}</small><strong>{money(product.price)}</strong><div className="quantity-control"><button aria-label={`Decrease ${product.name} quantity`} onClick={() => changeQuantity(product.id, -1)}><Icon name="minus" size={14} /></button><span>{cart[product.id]}</span><button aria-label={`Increase ${product.name} quantity`} onClick={() => changeQuantity(product.id, 1)}><Icon name="plus" size={14} /></button></div></div><button className="remove-item" aria-label={`Remove ${product.name}`} onClick={() => changeQuantity(product.id, -cart[product.id])}><Icon name="close" size={17} /></button></div>)}</div><div className="cart-summary"><div><span>Subtotal</span><strong>{money(subtotal)}</strong></div><p>Shipping and taxes calculated at checkout.</p><button className="primary-button checkout-button" onClick={() => setNotice("Checkout will be connected in Phase 2.")}>Continue to checkout <Icon name="arrow" size={18} /></button><small>Demo only. No payment will be taken.</small></div></>}</aside></div>}
  </div>;
}
export default App;