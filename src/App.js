import { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import "./App.css";

const API_BASE_URL = (process.env.REACT_APP_API_URL || "https://shopezbe.vercel.app/api/v1").replace(/\/$/, "");
const API_ROOT = API_BASE_URL.replace(/\/api\/v1$/, "");
const API = axios.create({ baseURL: API_BASE_URL, timeout: 15000, withCredentials: true });
let refreshRequest = null;
const money = (value) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(Number(value) || 0);
const getProductId = (product) => String(product?._id || product?.id || "");
const getPrice = (product) => Number(product?.price || 0);
const getOriginalPrice = (product) => Number(product?.originalPrice || product?.oldPrice || product?.price || 0);
const getImage = (product) => product?.image || product?.images?.[0] || "https://images.unsplash.com/photo-1490312278390-ab64016e0aa9?auto=format&fit=crop&w=900&q=80";
const discountPercent = (product) => getOriginalPrice(product) > getPrice(product) ? Math.round((1 - getPrice(product) / getOriginalPrice(product)) * 100) : Number(product?.discount || 0);

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
    user: <><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></>,
  };
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name] || paths.check}</svg>;
}

function App() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [category, setCategory] = useState("All products");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("featured");
  const [currentView, setCurrentView] = useState("shop");
  const [searchOpen, setSearchOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [saved, setSaved] = useState([]);
  const [notice, setNotice] = useState("");
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState("");
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState("login");
  const [authForm, setAuthForm] = useState({ name: "", email: "", password: "", phone: "" });
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem("shopez_user") || "null"); } catch { return null; }
  });
  const [token, setToken] = useState("");
  const [sessionId, setSessionId] = useState("");
  const [sessions, setSessions] = useState([]);
  const [sessionManagerOpen, setSessionManagerOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [shipping, setShipping] = useState({ name: "", phone: "", email: "", address: "", city: "", state: "Andhra Pradesh", pincode: "" });

  const notify = useCallback((message) => {
    setNotice(message);
    window.setTimeout(() => setNotice(""), 2600);
  }, []);

  const authorized = useCallback((accessToken = token) => ({
    headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : {},
  }), [token]);

  const loadProducts = useCallback(async () => {
    setLoading(true);
    setApiError("");
    try {
      const response = await API.get("/products");
      setProducts(Array.isArray(response.data.products) ? response.data.products : []);
    } catch (error) {
      setApiError(error.response?.data?.message || "Could not load products from ShopEZ backend.");
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadCustomerData = useCallback(async (accessToken = token) => {
    if (!accessToken) { setCart([]); setSaved([]); return; }
    try {
      const [cartResponse, wishlistResponse] = await Promise.all([
        API.get("/cart", authorized(accessToken)),
        API.get("/wishlist", authorized(accessToken)),
      ]);
      setCart(cartResponse.data.cart?.items || []);
      setSaved((wishlistResponse.data.wishlist || []).map((item) => String(typeof item === "object" ? getProductId(item) : item)));
    } catch (error) {
      if (error.response?.status === 401) {
        localStorage.removeItem("shopez_user");
        setToken("");
        setSessionId("");
        setUser(null);
        setCart([]);
        setSaved([]);
      } else {
        notify(error.response?.data?.message || "Sign in again to sync your bag and wishlist.");
      }
    }
  }, [authorized, notify, token]);

  useEffect(() => { loadProducts(); }, [loadProducts]);
  useEffect(() => {
    let active = true;
    API.post("/auth/refresh").then((response) => {
      if (!active) return;
      setToken(response.data.accessToken || "");
      setSessionId(response.data.sessionId || "");
      setUser(response.data.user || null);
      if (response.data.user) localStorage.setItem("shopez_user", JSON.stringify(response.data.user));
    }).catch(() => {
      if (!active) return;
      setToken("");
      setSessionId("");
      setUser(null);
      localStorage.removeItem("shopez_user");
    });
    return () => { active = false; };
  }, []);
  useEffect(() => {
    const interceptor = API.interceptors.response.use((response) => response, async (error) => {
      const original = error.config;
      const url = String(original?.url || "");
      if (error.response?.status !== 401 || !original || original._retried || /\/auth\/(login|register|refresh|logout|logout-all)/.test(url)) throw error;
      original._retried = true;
      try {
        if (!refreshRequest) refreshRequest = API.post("/auth/refresh").finally(() => { refreshRequest = null; });
        const refreshed = await refreshRequest;
        const nextToken = refreshed.data.accessToken;
        setToken(nextToken);
        setSessionId(refreshed.data.sessionId || "");
        setUser(refreshed.data.user || null);
        if (refreshed.data.user) localStorage.setItem("shopez_user", JSON.stringify(refreshed.data.user));
        original.headers = original.headers || {};
        original.headers.Authorization = `Bearer ${nextToken}`;
        return API(original);
      } catch (refreshError) {
        setToken("");
        setSessionId("");
        setUser(null);
        setCart([]);
        setSaved([]);
        localStorage.removeItem("shopez_user");
        throw refreshError;
      }
    });
    return () => API.interceptors.response.eject(interceptor);
  }, []);
  useEffect(() => {
    if (token) {
      API.defaults.headers.common.Authorization = `Bearer ${token}`;
      loadCustomerData(token);
    } else {
      delete API.defaults.headers.common.Authorization;
      setCart([]);
      setSaved([]);
    }
  }, [token, loadCustomerData]);
  useEffect(() => {
    if (user) setShipping((current) => ({
      ...current,
      name: current.name || user.name || "",
      phone: current.phone || user.phone || "",
      email: current.email || user.email || "",
      address: current.address || user.address || "",
    }));
  }, [user]);

  const categories = useMemo(() => ["All products", ...new Set(products.map((product) => product.category).filter(Boolean))], [products]);
  const filteredProducts = useMemo(() => {
    let result = products.filter((product) => {
      const matchesCategory = category === "All products" || product.category?.toLowerCase() === category.toLowerCase();
      const matchesView = currentView === "wishlist" ? saved.includes(getProductId(product)) : currentView === "deals" ? discountPercent(product) > 0 : true;
      const searchable = [product.name, product.brand, product.category, product.description, product.sku, product.seller].filter(Boolean).join(" ").toLowerCase();
      return matchesCategory && matchesView && searchable.includes(query.toLowerCase());
    });
    if (sort === "price-low") result = [...result].sort((a, b) => getPrice(a) - getPrice(b));
    if (sort === "price-high") result = [...result].sort((a, b) => getPrice(b) - getPrice(a));
    if (sort === "rating") result = [...result].sort((a, b) => Number(b.rating || 0) - Number(a.rating || 0));
    if (sort === "discount") result = [...result].sort((a, b) => discountPercent(b) - discountPercent(a));
    if (sort === "name") result = [...result].sort((a, b) => a.name.localeCompare(b.name));
    return result;
  }, [category, currentView, products, query, saved, sort]);

  const cartItems = useMemo(() => cart.map((item) => {
    const product = typeof item.product === "object" ? item.product : products.find((p) => getProductId(p) === String(item.product));
    return product ? { ...item, product } : null;
  }).filter(Boolean), [cart, products]);
  const cartCount = cartItems.reduce((sum, item) => sum + Number(item.quantity || 0), 0);
  const subtotal = cartItems.reduce((sum, item) => sum + getPrice(item.product) * Number(item.quantity || 0), 0);

  const navigateTo = (view, target) => {
    setCurrentView(view);
    setDrawerOpen(false);
    setCategory("All products");
    if (view !== "wishlist") setQuery("");
    if (view === "deals") setSort("discount");
    if (target) window.setTimeout(() => document.getElementById(target)?.scrollIntoView({ behavior: "smooth" }), 0);
  };

  const toggleSaved = async (product) => {
    if (!token) { notify("Sign in to keep your wishlist synced."); setAuthOpen(true); return; }
    const id = getProductId(product);
    const wasSaved = saved.includes(id);
    setSaved((items) => wasSaved ? items.filter((item) => item !== id) : [...items, id]);
    try {
      const response = wasSaved
        ? await API.delete(`/wishlist/${id}`, authorized())
        : await API.post(`/wishlist/${id}`, {}, authorized());
      setSaved((response.data.wishlist || []).map((item) => String(typeof item === "object" ? getProductId(item) : item)));
    } catch (error) {
      setSaved((items) => wasSaved ? [...items, id] : items.filter((item) => item !== id));
      notify(error.response?.data?.message || "Could not update wishlist.");
    }
  };

  const addToCart = async (product) => {
    if (!token) { notify("Sign in to save your bag between visits."); setAuthOpen(true); return; }
    if (Number(product.stock || 0) <= 0) { notify("This product is currently out of stock."); return; }
    try {
      const response = await API.post("/cart/items", { productId: getProductId(product), quantity: 1 }, authorized());
      setCart(response.data.cart?.items || []);
      notify(`${product.name} added to your bag`);
    } catch (error) {
      notify(error.response?.data?.message || "Could not add this product to your bag.");
    }
  };

  const changeQuantity = async (item, nextQuantity) => {
    try {
      let response;
      if (nextQuantity <= 0) {
        response = await API.delete(`/cart/items/${item._id}`, authorized());
      } else {
        response = await API.patch(`/cart/items/${item._id}`, { quantity: nextQuantity }, authorized());
      }
      setCart(response.data.cart?.items || []);
    } catch (error) {
      notify(error.response?.data?.message || "Could not update bag quantity.");
    }
  };

  const loadSessions = async () => {
    try {
      const response = await API.get("/auth/sessions", authorized());
      setSessions(response.data.sessions || []);
      setSessionManagerOpen(true);
    } catch (error) {
      notify(error.response?.data?.message || "Could not load signed-in devices.");
    }
  };

  const revokeSession = async (id) => {
    try {
      await API.delete(`/auth/sessions/${id}`, authorized());
      setSessions((items) => items.filter((item) => item.id !== id));
      if (id === sessionId) {
        setToken("");
        setSessionId("");
        setUser(null);
        setCart([]);
        setSaved([]);
        localStorage.removeItem("shopez_user");
        setSessionManagerOpen(false);
      }
      notify("Selected device session signed out.");
    } catch (error) {
      notify(error.response?.data?.message || "Could not sign out that device.");
    }
  };

  const signOutAll = async () => {
    try {
      await API.post("/auth/logout-all", {}, authorized());
    } catch (error) {
      notify(error.response?.data?.message || "Could not sign out all devices.");
      return;
    }
    localStorage.removeItem("shopez_user");
    setToken("");
    setSessionId("");
    setUser(null);
    setCart([]);
    setSaved([]);
    setSessions([]);
    setSessionManagerOpen(false);
    notify("Signed out from all devices.");
  };

  const signOut = () => {
    API.post("/auth/logout").catch(() => {});
    localStorage.removeItem("shopez_user");
    setToken("");
    setSessionId("");
    setUser(null);
    setCart([]);
    setSaved([]);
    notify("You have signed out.");
  };

  const submitAuth = async (event) => {
    event.preventDefault();
    setBusy(true);
    try {
      const path = authMode === "register" ? "/auth/register" : "/auth/login";
      const payload = authMode === "register"
        ? { name: authForm.name.trim(), email: authForm.email.trim(), password: authForm.password, phone: authForm.phone.trim() }
        : { email: authForm.email.trim(), password: authForm.password };
      const response = await API.post(path, payload);
      const nextToken = response.data.accessToken;
      localStorage.setItem("shopez_user", JSON.stringify(response.data.user));
      setToken(nextToken);
      setSessionId(response.data.sessionId || "");
      setUser(response.data.user);
      setAuthOpen(false);
      setAuthForm({ name: "", email: "", password: "", phone: "" });
      notify(authMode === "register" ? "Your ShopEZ account is ready." : "Welcome back to ShopEZ.");
    } catch (error) {
      notify(error.response?.data?.message || "Could not sign in. Check the backend connection.");
    } finally {
      setBusy(false);
    }
  };

  const submitCheckout = async (event) => {
    event.preventDefault();
    setBusy(true);
    try {
      const items = cartItems.map((item) => ({ product: getProductId(item.product), quantity: Number(item.quantity) }));
      const response = await API.post("/orders", {
        items,
        shippingAddress: shipping,
        paymentMethod: "COD",
        shippingFee: subtotal >= 1499 ? 0 : 79,
      }, authorized());
      await loadCustomerData(token);
      setCheckoutOpen(false);
      setCartOpen(false);
      notify(`Order placed: ${String(response.data.order?._id || "").slice(-8)}. Payment method: cash on delivery.`);
    } catch (error) {
      notify(error.response?.data?.message || "Checkout failed. Please check your address and bag.");
    } finally {
      setBusy(false);
    }
  };

  const CATEGORIES = [
    { name: "All products", icon: "✳", tone: "sand" },
    ...categories.filter((name) => name !== "All products").map((name, index) => ({
      name,
      icon: ["⌁", "✦", "◇", "⌂", "✿", "◈"][index % 6],
      tone: ["blue", "pink", "green", "yellow", "sand"][index % 5],
    })),
  ];

  return <div className="storefront">
    <div className="announcement"><span>THE LITTLE THINGS, DELIVERED WITH CARE</span><span className="announcement-right">Free delivery on orders over ₹1,499 <span aria-hidden="true">↗</span></span></div>
    <header className="site-header">
      <button className="icon-button mobile-menu" aria-label="Open menu" onClick={() => setDrawerOpen(!drawerOpen)}><Icon name="menu" /></button>
      <a className="wordmark" href="#top" aria-label="ShopEZ home">shop<span>ez</span><i>.</i></a>
      <nav className={`main-nav ${drawerOpen ? "nav-open" : ""}`} aria-label="Main navigation">
        <button className={currentView === "shop" ? "nav-active" : ""} onClick={() => navigateTo("shop", "shop")}>Shop</button>
        <button onClick={() => { setCurrentView("shop"); setCategory("All products"); setDrawerOpen(false); document.getElementById("categories")?.scrollIntoView({ behavior: "smooth" }); }}>Categories</button>
        <button className={currentView === "deals" ? "nav-active" : ""} onClick={() => navigateTo("deals", "shop")}>Deals</button>
        <button className={currentView === "wishlist" ? "nav-active" : ""} onClick={() => navigateTo("wishlist", "shop")}>Wishlist <span className="nav-count">{saved.length}</span></button>
        <button onClick={() => { setDrawerOpen(false); document.getElementById("story")?.scrollIntoView({ behavior: "smooth" }); }}>About</button>
        <a href="mailto:hello@shopez.example" onClick={() => setDrawerOpen(false)}>Contact</a>
      </nav>
      <div className="header-actions">
        <div className={`search-wrap ${searchOpen ? "search-open" : ""}`}>
          {searchOpen && <input autoFocus aria-label="Search products" placeholder="Search name, brand or category..." value={query} onChange={(event) => { setQuery(event.target.value); setCurrentView("shop"); }} onKeyDown={(event) => { if (event.key === "Escape") { setSearchOpen(false); setQuery(""); } if (event.key === "Enter") document.getElementById("shop")?.scrollIntoView({ behavior: "smooth" }); }} />}
          <button className="icon-button search-toggle" aria-label={searchOpen ? "Close search" : "Open search"} onClick={() => { if (searchOpen) { setSearchOpen(false); setQuery(""); } else { setSearchOpen(true); setCurrentView("shop"); } }}><Icon name={searchOpen ? "close" : "search"} size={19} /></button>
        </div>
        <button className={`icon-button wishlist-button ${currentView === "wishlist" ? "action-active" : ""}`} aria-label={`Open wishlist, ${saved.length} saved`} onClick={() => navigateTo("wishlist", "shop")}><Icon name="heart" /></button>
        <button className="icon-button" aria-label={user ? "Account options" : "Sign in"} title={user ? user.name : "Sign in"} onClick={() => user ? loadSessions() : setAuthOpen(true)}><Icon name="user" /></button>
        {user && <button className="account-name" onClick={signOut} title="Sign out this device">{user.name.split(" ")[0]} · Sign out</button>}
        <button className="bag-button" aria-label={`Open shopping bag, ${cartCount} items`} onClick={() => setCartOpen(true)}><Icon name="bag" size={19} /><span className="bag-label">Bag</span><span className="bag-count">{cartCount}</span></button>
      </div>
    </header>
    <main id="top">
      <section className="hero"><div className="hero-copy"><div className="eyebrow"><span className="eyebrow-dot" /> A BETTER WAY TO SHOP</div><h1>Good finds.<br /><em>Better days.</em></h1><p>Everyday essentials and little luxuries, picked to make your world feel a little more you.</p><a className="primary-button" href="#shop">Explore the collection <Icon name="arrow" size={18} /></a><div className="hero-proof"><div className="avatar-stack"><span>R</span><span>A</span><span>S</span></div><div><strong>Loved by everyday people</strong><small>Thoughtful picks, happy deliveries.</small></div></div></div>
        <div className="hero-visual"><div className="hero-sun" /><div className="hero-image image-back"><img src="https://images.unsplash.com/photo-1490312278390-ab64016e0aa9?auto=format&fit=crop&w=900&q=85" alt="A calm, sunlit lifestyle interior" /></div><div className="hero-image image-front"><img src="https://images.unsplash.com/photo-1547949003-9792a18a2601?auto=format&fit=crop&w=800&q=85" alt="Minimal everyday bag in warm neutral tones" /></div><div className="floating-note"><span>✳</span><div><strong>Picked with purpose</strong><small>Made for your everyday</small></div></div><div className="hero-stamp">GOOD<br />THINGS<br /><span>INSIDE</span></div></div><div className="hero-bottom-note"><span>01 / THE EVERYDAY EDIT</span><span>SCROLL TO DISCOVER ↓</span></div>
      </section>
      <section className="category-strip" id="categories" aria-label="Shop by category">{CATEGORIES.map((item) => <button key={item.name} className={`category-tile ${item.tone} ${category === item.name ? "selected" : ""}`} onClick={() => { setCategory(item.name); setCurrentView("shop"); document.getElementById("shop")?.scrollIntoView({ behavior: "smooth" }); }}><span className="category-icon">{item.icon}</span><span>{item.name}</span><Icon name="arrow" size={16} /></button>)}</section>
      <section className="product-section" id="shop">
        <div className="section-heading"><div><div className="eyebrow">{currentView === "wishlist" ? "YOUR SAVED PICKS" : currentView === "deals" ? "GOOD THINGS, BETTER PRICES" : "THE GOOD STUFF"}</div><h2>{currentView === "wishlist" ? <>Your <em>wishlist.</em></> : currentView === "deals" ? <>Little <em>deals.</em></> : <>Find your <em>favourite.</em></>}</h2><p>{currentView === "wishlist" ? "Your favourite finds, all in one place." : currentView === "deals" ? "Browse items currently discounted in the catalogue." : "Useful things. Lovely details. Zero overthinking."}</p></div><label className="sort-select">Sort by <select value={sort} onChange={(event) => setSort(event.target.value)} aria-label="Sort products"><option value="featured">Featured</option><option value="price-low">Price: low to high</option><option value="price-high">Price: high to low</option><option value="rating">Top rated</option><option value="discount">Biggest discount</option><option value="name">Name: A to Z</option></select></label></div>
        <div className="filter-row"><div className="filter-tabs">{CATEGORIES.map((item) => <button key={item.name} className={category === item.name ? "filter-active" : ""} onClick={() => { setCategory(item.name); setCurrentView("shop"); }}>{item.name}</button>)}</div><span className="product-count">{loading ? "Loading..." : `${filteredProducts.length} finds`}</span></div>
        {loading ? <div className="empty-results"><span>✳</span><h3>Finding the good stuff</h3><p>Connecting to the ShopEZ catalogue...</p></div>
        : apiError ? <div className="empty-results api-error"><span>⌁</span><h3>ShopEZ catalogue is unavailable</h3><p>{apiError}</p><button className="text-button" onClick={loadProducts}>Try again <Icon name="arrow" size={16} /></button><small>API: {API_ROOT}</small></div>
        : filteredProducts.length ? <div className="product-grid">{filteredProducts.map((product, index) => {
          const id = getProductId(product);
          const discount = discountPercent(product);
          return <article className="product-card" key={id} style={{ "--card-index": index }}>
            <div className="product-image-wrap"><img src={getImage(product)} alt={product.name} loading="lazy" onError={(event) => { event.currentTarget.src = "https://images.unsplash.com/photo-1490312278390-ab64016e0aa9?auto=format&fit=crop&w=900&q=80"; }} /><span className="product-tag">{discount > 0 ? `${discount}% OFF` : product.category || "SHOP EZ"}</span><button className={`save-button ${saved.includes(id) ? "is-saved" : ""}`} aria-label={saved.includes(id) ? `Remove ${product.name} from favourites` : `Save ${product.name} to favourites`} onClick={() => toggleSaved(product)}><Icon name="heart" size={18} /></button><button className="quick-add" onClick={() => addToCart(product)} disabled={Number(product.stock || 0) <= 0}><Icon name="plus" size={17} /> {Number(product.stock || 0) <= 0 ? "Out of stock" : "Add to bag"}</button></div>
            <div className="product-meta"><div><span className="product-category">{product.category}{product.brand ? ` · ${product.brand}` : ""}</span><h3>{product.name}</h3></div><span className="rating">★ {Number(product.rating || 0).toFixed(1)}</span></div>
            <p className="product-description">{product.description || "A considered pick for your everyday."}</p><div className="product-details"><span>{product.sku ? `SKU: ${product.sku}` : `${product.gender || "Everyday"} collection`}</span><span className={Number(product.stock || 0) <= 10 ? "stock-low" : "stock-ok"}>{Number(product.stock || 0) <= 0 ? "Currently out of stock" : Number(product.stock) <= 10 ? `Only ${product.stock} left` : `${product.stock} in stock`}</span>{product.sizes?.length > 0 && <span>Sizes: {product.sizes.slice(0, 4).join(", ")}</span>}{product.colors?.length > 0 && <span>Colors: {product.colors.slice(0, 3).join(", ")}</span>}</div><div className="price-line"><strong>{money(product.price)}</strong>{getOriginalPrice(product) > getPrice(product) && <><del>{money(getOriginalPrice(product))}</del><span className="discount">{discount}% off</span></>}</div>
          </article>;
        })}</div> : <div className="empty-results"><span>⌕</span><h3>{currentView === "wishlist" ? "Your wishlist is waiting" : "No finds just yet"}</h3><p>{currentView === "wishlist" && !token ? "Sign in to access your saved picks." : "Try another search or category."}</p>{currentView === "wishlist" && !token ? <button className="text-button" onClick={() => setAuthOpen(true)}>Sign in <Icon name="arrow" size={16} /></button> : <button className="text-button" onClick={() => { setQuery(""); setCategory("All products"); setCurrentView("shop"); }}>Show all products <Icon name="arrow" size={16} /></button>}</div>}
        <div className="collection-end"><span>YOU'VE SEEN THE GOOD STUFF</span><span>MORE GOOD THINGS COMING SOON ✳</span></div>
      </section>
      <section className="story-band" id="story"><div className="story-mark">s<span>e.</span></div><div><div className="eyebrow">A SMALL SHOP WITH BIG HEART</div><h2>Less scrolling.<br /><em>More loving what you find.</em></h2><p>We believe shopping should feel simple, personal, and a little delightful. That's the whole idea behind ShopEZ.</p></div><a className="story-link" href="#shop">Find your next favourite <Icon name="arrow" size={18} /></a></section>
    </main>
    <footer className="site-footer"><a className="wordmark footer-wordmark" href="#top">shop<span>ez</span><i>.</i></a><span>Everyday finds, thoughtfully picked.</span><div><a href="#shop">Shop</a><a href="#story">About</a><a href="mailto:hello@shopez.example">Contact</a></div><small>© {new Date().getFullYear()} ShopEZ. Connected to ShopEZ API.</small></footer>
    {notice && <div className="toast" role="status"><span className="toast-check"><Icon name="check" size={16} /></span>{notice}</div>}
    {authOpen && <div className="overlay" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setAuthOpen(false); }}><section className="cart-drawer auth-drawer" role="dialog" aria-modal="true" aria-labelledby="auth-title"><div className="drawer-heading"><div><span className="eyebrow">YOUR SHOP EZ ACCOUNT</span><h2 id="auth-title">{authMode === "register" ? "Join ShopEZ" : "Welcome back"}</h2></div><button className="icon-button" aria-label="Close sign in" onClick={() => setAuthOpen(false)}><Icon name="close" /></button></div><form className="auth-form" onSubmit={submitAuth}>{authMode === "register" && <label>Full name<input required autoComplete="name" value={authForm.name} onChange={(event) => setAuthForm({ ...authForm, name: event.target.value })} /></label>}<label>Email address<input required type="email" autoComplete="email" value={authForm.email} onChange={(event) => setAuthForm({ ...authForm, email: event.target.value })} /></label>{authMode === "register" && <label>Mobile number <span>(optional)</span><input type="tel" autoComplete="tel" value={authForm.phone} onChange={(event) => setAuthForm({ ...authForm, phone: event.target.value })} /></label>}<label>Password<input required type="password" minLength="8" autoComplete={authMode === "register" ? "new-password" : "current-password"} value={authForm.password} onChange={(event) => setAuthForm({ ...authForm, password: event.target.value })} /></label><button className="primary-button checkout-button" type="submit" disabled={busy}>{busy ? "Please wait..." : authMode === "register" ? "Create account" : "Sign in"} <Icon name="arrow" size={18} /></button><p>{authMode === "register" ? "Already have an account?" : "New to ShopEZ?"} <button type="button" className="inline-action" onClick={() => setAuthMode(authMode === "register" ? "login" : "register")}>{authMode === "register" ? "Sign in" : "Create an account"}</button></p><small>Use at least 8 characters. The backend stores a password hash.</small></form></section></div>}

    {sessionManagerOpen && <div className="overlay" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setSessionManagerOpen(false); }}><section className="cart-drawer sessions-drawer" role="dialog" aria-modal="true" aria-labelledby="sessions-title"><div className="drawer-heading"><div><span className="eyebrow">ACCOUNT SECURITY</span><h2 id="sessions-title">Signed-in devices</h2></div><button className="icon-button" aria-label="Close sessions" onClick={() => setSessionManagerOpen(false)}><Icon name="close" /></button></div><p className="sessions-intro">Your account can stay signed in on more than one device. You can end any session here.</p><div className="session-list">{sessions.map((session) => <article className="session-card" key={session.id}><div className="session-card-top"><strong>{session.deviceName || "Web browser"}</strong>{session.current && <span className="current-session">THIS DEVICE</span>}</div><small>Last active: {session.lastUsedAt ? new Date(session.lastUsedAt).toLocaleString() : "Recently"}</small><small>Signed in: {session.createdAt ? new Date(session.createdAt).toLocaleDateString() : "Unknown"}</small><button className="text-button session-revoke" onClick={() => revokeSession(session.id)}>{session.current ? "Sign out this device" : "Sign out device"} <Icon name="arrow" size={15} /></button></article>)}{sessions.length === 0 && <p>No active sessions were returned.</p>}</div><button className="danger-button" onClick={signOutAll}>Sign out of all devices</button><small className="session-security-note">Refresh tokens are stored as hashes on the backend and rotated when refreshed. Access tokens expire after 15 minutes.</small></section></div>}
\n    {cartOpen && <div className="overlay" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setCartOpen(false); }}><aside className="cart-drawer" aria-label="Shopping bag"><div className="drawer-heading"><div><span className="eyebrow">YOUR LITTLE COLLECTION</span><h2>Your bag <span>({cartCount})</span></h2></div><button className="icon-button" aria-label="Close bag" onClick={() => setCartOpen(false)}><Icon name="close" /></button></div>{cartCount === 0 ? <div className="empty-cart"><span className="empty-bag"><Icon name="bag" size={30} /></span><h3>Your bag is taking a nap.</h3><p>{token ? "Find something lovely and it'll show up here." : "Sign in to keep your bag synced between visits."}</p><button className="primary-button" onClick={() => { setCartOpen(false); if (!token) setAuthOpen(true); else document.getElementById("shop")?.scrollIntoView({ behavior: "smooth" }); }}>{token ? "Explore the collection" : "Sign in to continue"} <Icon name="arrow" size={18} /></button></div> : <><div className="cart-items">{cartItems.map((item) => { const product = item.product; return <div className="cart-item" key={item._id}><img src={getImage(product)} alt="" /><div className="cart-item-details"><span className="product-category">{product.category}{product.brand ? ` · ${product.brand}` : ""}</span><h3>{product.name}</h3><strong>{money(product.price)}</strong><div className="quantity-control"><button aria-label={`Decrease ${product.name} quantity`} onClick={() => changeQuantity(item, Number(item.quantity) - 1)}><Icon name="minus" size={14} /></button><span>{item.quantity}</span><button aria-label={`Increase ${product.name} quantity`} onClick={() => changeQuantity(item, Number(item.quantity) + 1)}><Icon name="plus" size={14} /></button></div></div><button className="remove-item" aria-label={`Remove ${product.name}`} onClick={() => changeQuantity(item, 0)}><Icon name="close" size={17} /></button></div>; })}</div><div className="cart-summary"><div><span>Subtotal</span><strong>{money(subtotal)}</strong></div><p>{subtotal >= 1499 ? "Free delivery applied." : `Estimated delivery fee: ${money(79)}.`}</p><button className="primary-button checkout-button" onClick={() => { if (!token) { setCartOpen(false); setAuthOpen(true); } else { setShipping((current) => ({ ...current, name: current.name || user?.name || "", email: current.email || user?.email || "" })); setCheckoutOpen(true); } }}>Continue to checkout <Icon name="arrow" size={18} /></button><small>Cash on delivery only. No online payment gateway is connected.</small></div></>}</aside></div>}
    {checkoutOpen && <div className="overlay" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setCheckoutOpen(false); }}><section className="cart-drawer checkout-drawer" role="dialog" aria-modal="true" aria-labelledby="checkout-title"><div className="drawer-heading"><div><span className="eyebrow">A FEW DETAILS TO DELIVER</span><h2 id="checkout-title">Delivery address</h2></div><button className="icon-button" aria-label="Close checkout" onClick={() => setCheckoutOpen(false)}><Icon name="close" /></button></div><form className="auth-form" onSubmit={submitCheckout}><label>Full name<input required value={shipping.name} onChange={(event) => setShipping({ ...shipping, name: event.target.value })} /></label><label>Email<input required type="email" value={shipping.email} onChange={(event) => setShipping({ ...shipping, email: event.target.value })} /></label><label>Mobile number<input required type="tel" minLength="10" value={shipping.phone} onChange={(event) => setShipping({ ...shipping, phone: event.target.value })} /></label><label>Address<input required value={shipping.address} onChange={(event) => setShipping({ ...shipping, address: event.target.value })} /></label><div className="checkout-fields"><label>City<input required value={shipping.city} onChange={(event) => setShipping({ ...shipping, city: event.target.value })} /></label><label>PIN code<input required inputMode="numeric" pattern="[0-9]{6}" value={shipping.pincode} onChange={(event) => setShipping({ ...shipping, pincode: event.target.value })} /></label></div><label>State<input required value={shipping.state} onChange={(event) => setShipping({ ...shipping, state: event.target.value })} /></label><div className="checkout-total"><span>Items subtotal</span><strong>{money(subtotal)}</strong></div><div className="checkout-total"><span>Delivery</span><strong>{subtotal >= 1499 ? "FREE" : money(79)}</strong></div><div className="checkout-total total-due"><span>Total due on delivery</span><strong>{money(subtotal + (subtotal >= 1499 ? 0 : 79))}</strong></div><button className="primary-button checkout-button" type="submit" disabled={busy || cartCount === 0}>{busy ? "Placing order..." : "Place cash-on-delivery order"} <Icon name="arrow" size={18} /></button><small>The backend validates product IDs and stock, then saves an order with pending payment status.</small></form></section></div>}
  </div>;
}

export default App;
