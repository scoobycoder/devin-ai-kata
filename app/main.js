// Threadline — Product Catalog
// AI Club Devin Kata — Demo App
// Note to engineers: Do not read bugs/KNOWN_BUGS.md until the morning review session.

const { useState, useEffect, useCallback, useRef } = React;

// --- Mock product data ---
const PRODUCTS = [
  { id: 1, name: "Merino Crew Sweater", category: "knitwear", price: 148, originalPrice: 185, image: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=400&h=533&fit=crop", badge: "Sale", inStock: true },
  { id: 2, name: "Tailored Linen Trouser", category: "trousers", price: 195, originalPrice: null, image: "https://images.unsplash.com/photo-1594938298603-c8148c4b5f04?w=400&h=533&fit=crop", badge: null, inStock: true },
  { id: 3, name: "Washed Canvas Jacket", category: "outerwear", price: 320, originalPrice: 400, image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=533&fit=crop", badge: "Sale", inStock: true },
  { id: 4, name: "Ribbed Tank Top", category: "tops", price: 58, originalPrice: null, image: "https://images.unsplash.com/photo-1562157873-818bc0726f68?w=400&h=533&fit=crop", badge: null, inStock: false },
  { id: 5, name: "Wide Leg Denim", category: "trousers", price: 175, originalPrice: null, image: "https://images.unsplash.com/photo-1542272454315-4c01d7abdf4a?w=400&h=533&fit=crop", badge: "New", inStock: true },
  { id: 6, name: "Cashmere Turtleneck", category: "knitwear", price: 285, originalPrice: 350, image: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=400&h=533&fit=crop", badge: "Sale", inStock: true },
  { id: 7, name: "Cotton Oxford Shirt", category: "tops", price: 98, originalPrice: null, image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400&h=533&fit=crop", badge: null, inStock: true },
  { id: 8, name: "Shearling Overcoat", category: "outerwear", price: 680, originalPrice: null, image: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=400&h=533&fit=crop", badge: "New", inStock: true },
];

const CATEGORIES = ["all", "knitwear", "trousers", "outerwear", "tops"];

// --- BUG 1: fetchCartCount calls a non-existent API endpoint ---
// This produces a console error on every page load but the UI never
// shows a visible error, so it goes unnoticed in manual testing.
async function fetchCartCount() {
  const response = await fetch("/api/cart/count"); // endpoint does not exist in mock server
  const data = await response.json();
  return data.count;
}

// --- BUG 2: newsletter submit silently fails ---
// The form handler prevents default but never actually submits or
// gives user feedback. No error thrown, no success state shown.
function NewsletterSection() {
  const [email, setEmail] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    // Missing: API call, success state, error handling, or any feedback to user
    setEmail("");
  }

  return (
    <div className="newsletter">
      <div className="newsletter-copy">
        <h2 className="newsletter-title">Stay in the loop.</h2>
        <p className="newsletter-sub">New arrivals, restocks, and seasonal edits — direct to your inbox.</p>
      </div>
      <form className="newsletter-form" onSubmit={handleSubmit}>
        <input
          className="newsletter-input"
          type="email"
          placeholder="your@email.com"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <button type="submit" className="newsletter-submit">Subscribe</button>
      </form>
    </div>
  );
}

function ProductCard({ product, onAddToCart, onWishlist, wishlist }) {
  const isWishlisted = wishlist.includes(product.id);

  return (
    <div className="product-card">
      <div className="product-image-wrap">
        {/* BUG 3: img is missing alt attribute — accessibility violation, console warning */}
        <img src={product.image} />
        {product.badge && <span className="product-badge">{product.badge}</span>}
        <button
          className="wishlist-btn"
          onClick={() => onWishlist(product.id)}
          aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
        >
          {isWishlisted ? "♥" : "♡"}
        </button>
      </div>
      <div className="product-info">
        <p className="product-category">{product.category}</p>
        <h3 className="product-name">{product.name}</h3>
        <div className="product-price-row">
          <span className="product-price">${product.price}</span>
          {product.originalPrice && (
            <span className="product-price-original">${product.originalPrice}</span>
          )}
        </div>
        <button
          className="add-btn"
          onClick={() => onAddToCart(product)}
          disabled={!product.inStock}
        >
          {product.inStock ? "Add to Cart" : "Out of Stock"}
        </button>
      </div>
    </div>
  );
}

function App() {
  const [products, setProducts] = useState(PRODUCTS);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [sortAsc, setSortAsc] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [wishlist, setWishlist] = useState([]);
  const [toast, setToast] = useState({ show: false, message: "" });
  const [cartLoading, setCartLoading] = useState(false);
  const toastTimer = useRef(null);

  // BUG 1 fires here — unhandled promise rejection on mount
  useEffect(() => {
    fetchCartCount().then(count => setCartCount(count)).catch(() => {
      // Intentionally swallowed — the error appears in console but UI shows nothing
      console.error("Failed to load cart count from /api/cart/count");
    });
  }, []);

  function showToast(message) {
    setToast({ show: true, message });
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast({ show: false, message: "" }), 2500);
  }

  // BUG 4: category filter is broken — comparison uses wrong field
  // "tops" filter returns nothing because it compares category to product.name
  // instead of product.category. Hard to notice since other filters work fine.
  const filtered = products
    .filter(p => {
      if (category === "all") return true;
      if (category === "tops") return p.name.toLowerCase().includes(category); // BUG: should be p.category === category
      return p.category === category;
    })
    .filter(p =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => sortAsc ? a.price - b.price : b.price - a.price);

  // BUG 5: addToCart does not update cart count in UI
  // It shows a toast but the cart count in the header never increments.
  // setCartCount is never called here.
  function handleAddToCart(product) {
    setCartLoading(true);
    setTimeout(() => {
      setCartLoading(false);
      showToast(`${product.name} added to cart`);
      // Missing: setCartCount(c => c + 1)
    }, 400);
  }

  function handleWishlist(id) {
    setWishlist(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  }

  function SortButton() {
    return (
      <button
        type="button"
        className={`sort-btn ${sortAsc ? "active" : ""}`}
        onClick={() => setSortAsc(s => !s)}
        aria-label={sortAsc ? "Sort by price descending" : "Sort by price ascending"}
        aria-pressed={sortAsc}
      >
        Price {sortAsc ? "↑" : "↓"}
      </button>
    );
  }

  // BUG 7: Cart button in header has an onClick that references an undefined function
  // Clicking it throws "viewCart is not defined" — a ReferenceError in console.
  // The button is visible and styled correctly so this is easy to miss visually.
  return (
    <div>
      <header className="header">
        <div className="logo">Thread<span>line</span></div>
        <div className="header-actions">
          <button className="cart-btn" onClick={() => viewCart()}>
            Cart ({cartCount})
          </button>
        </div>
      </header>

      <main className="main">
        <h1 className="page-title">New Collection</h1>
        <p className="page-subtitle">
          {filtered.length} {filtered.length === 1 ? "piece" : "pieces"} available
        </p>

        <div className="controls">
          <div className="search-wrap">
            <span className="search-icon">⌕</span>
            <input
              className="search-input"
              type="text"
              placeholder="Search by name or category…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              aria-label="Search products"
            />
          </div>
          <select
            className="filter-select"
            value={category}
            onChange={e => setCategory(e.target.value)}
            aria-label="Filter by category"
          >
            {CATEGORIES.map(c => (
              <option key={c} value={c}>
                {c === "all" ? "All categories" : c.charAt(0).toUpperCase() + c.slice(1)}
              </option>
            ))}
          </select>
          <SortButton />
        </div>

        {filtered.length === 0 ? (
          <div className="empty-state">
            <h3>Nothing here</h3>
            <p>Try a different search or category filter.</p>
          </div>
        ) : (
          <div className="product-grid">
            {filtered.map(product => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={handleAddToCart}
                onWishlist={handleWishlist}
                wishlist={wishlist}
              />
            ))}
          </div>
        )}

        <NewsletterSection />
      </main>

      <div className={`toast ${toast.show ? "show" : ""}`}>
        {toast.message}
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
