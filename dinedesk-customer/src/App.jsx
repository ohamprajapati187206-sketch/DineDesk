import { useState, useEffect } from "react";
import { Routes, Route, Link, useNavigate } from "react-router-dom";
import axios from "axios";

// ── API ──────────────────────────────────────────────────────────────────────
const api = axios.create({ baseURL: "http://localhost:4000/api" });

// ── Colors ───────────────────────────────────────────────────────────────────
const C = {
  bg: "#FFFAF5",
  card: "#FFFFFF",
  border: "#F0E6D3",
  accent: "#E8821A",
  accentLight: "#FFF3E0",
  text: "#1A1A2E",
  muted: "#8B7355",
  green: "#2D8A4E",
  red: "#C0392B",
  surface: "#FDF6EE",
};

// ── Reusable UI ───────────────────────────────────────────────────────────────
const Btn = ({ label, onClick, color = C.accent, outline, full, small, disabled }) => (
  <button onClick={onClick} disabled={disabled} style={{
    background: outline ? "transparent" : disabled ? "#ccc" : color,
    color: outline ? color : "#fff",
    border: `2px solid ${disabled ? "#ccc" : color}`,
    borderRadius: 12, padding: small ? "8px 18px" : "13px 28px",
    fontSize: small ? 13 : 15, fontWeight: 700, cursor: disabled ? "not-allowed" : "pointer",
    width: full ? "100%" : "auto", transition: "all .2s", fontFamily: "inherit",
    opacity: disabled ? 0.6 : 1
  }}
    onMouseEnter={e => !disabled && (e.currentTarget.style.opacity = "0.85")}
    onMouseLeave={e => !disabled && (e.currentTarget.style.opacity = "1")}
  >{label}</button>
);

const Badge = ({ label, color = C.accent }) => (
  <span style={{ background: color + "22", color, border: `1px solid ${color}44`, borderRadius: 20, padding: "3px 12px", fontSize: 12, fontWeight: 700 }}>{label}</span>
);

// ── Navbar ────────────────────────────────────────────────────────────────────
const Navbar = ({ cartCount, user, onLogout }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <nav style={{ background: C.card, borderBottom: `1px solid ${C.border}`, padding: "0 24px", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 100, boxShadow: "0 2px 12px #0000000A" }}>
      <Link to="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ width: 36, height: 36, background: C.accent, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>🍽</div>
        <div>
          <div style={{ fontWeight: 900, fontSize: 18, color: C.text }}>DineDesk</div>
          <div style={{ fontSize: 10, color: C.muted, marginTop: -2 }}>ORDER & BOOK</div>
        </div>
      </Link>

      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <Link to="/menu" style={{ textDecoration: "none", color: C.muted, fontWeight: 600, fontSize: 14 }}>Menu</Link>
        <Link to="/book-table" style={{ textDecoration: "none", color: C.muted, fontWeight: 600, fontSize: 14 }}>Book Table</Link>
        <Link to="/book-room" style={{ textDecoration: "none", color: C.muted, fontWeight: 600, fontSize: 14 }}>Book Room</Link>

        <Link to="/cart" style={{ textDecoration: "none", position: "relative" }}>
          <div style={{ background: C.accentLight, border: `1px solid ${C.border}`, borderRadius: 10, padding: "8px 14px", display: "flex", alignItems: "center", gap: 6, cursor: "pointer" }}>
            <span style={{ fontSize: 16 }}>🛒</span>
            <span style={{ fontWeight: 700, fontSize: 14, color: C.accent }}>Cart</span>
            {cartCount > 0 && (
              <span style={{ background: C.accent, color: "#fff", borderRadius: "50%", width: 20, height: 20, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 800 }}>{cartCount}</span>
            )}
          </div>
        </Link>

        {user ? (
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 13, color: C.muted, fontWeight: 600 }}>Hi, {user.name?.split(" ")[0]}</span>
            <button onClick={onLogout} style={{ background: "none", border: `1px solid ${C.border}`, borderRadius: 8, padding: "6px 12px", fontSize: 12, color: C.muted, cursor: "pointer" }}>Logout</button>
          </div>
        ) : (
          <Link to="/auth"><Btn label="Sign In" small /></Link>
        )}
      </div>
    </nav>
  );
};

// ── Home Page ─────────────────────────────────────────────────────────────────
const Home = () => {
  return (
    <div>
      {/* Hero */}
      <div style={{ background: `linear-gradient(135deg, #1A1A2E 0%, #2D1B00 100%)`, padding: "80px 24px", textAlign: "center" }}>
        <div style={{ fontSize: 56, marginBottom: 16 }}>🍽️</div>
        <h1 style={{ fontSize: 48, fontWeight: 900, color: "#FFFFFF", margin: "0 0 16px", lineHeight: 1.1 }}>
          Great Food,<br />
          <span style={{ color: C.accent }}>Delivered Fresh</span>
        </h1>
        <p style={{ fontSize: 18, color: "#9CA3AF", marginBottom: 36, maxWidth: 500, margin: "0 auto 36px" }}>
          Order food online, book a table, or reserve a room — all in one place.
        </p>
        <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
          <Link to="/menu"><Btn label="🍛 Order Food Now" /></Link>
          <Link to="/book-table"><Btn label="📅 Book a Table" outline color="#fff" /></Link>
        </div>
      </div>

      {/* Features */}
      <div style={{ padding: "60px 24px", maxWidth: 900, margin: "0 auto" }}>
        <h2 style={{ textAlign: "center", fontSize: 30, fontWeight: 800, color: C.text, marginBottom: 40 }}>Everything in One Place</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 20 }}>
          {[
            { emoji: "🍛", title: "Order Food", desc: "Browse our full menu and get food delivered to your doorstep", link: "/menu", btn: "Order Now" },
            { emoji: "📅", title: "Book a Table", desc: "Reserve your favourite table for dine-in — any time, any day", link: "/book-table", btn: "Book Table" },
            { emoji: "🏨", title: "Book a Room", desc: "Comfortable rooms for overnight stays with breakfast included", link: "/book-room", btn: "Book Room" },
            { emoji: "📦", title: "Track Orders", desc: "Follow your order live from kitchen to your doorstep", link: "/my-orders", btn: "My Orders" },
          ].map(f => (
            <div key={f.title} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 20, padding: 28, textAlign: "center", boxShadow: "0 4px 20px #0000000A" }}>
              <div style={{ fontSize: 40, marginBottom: 14 }}>{f.emoji}</div>
              <h3 style={{ fontSize: 18, fontWeight: 800, color: C.text, marginBottom: 8 }}>{f.title}</h3>
              <p style={{ fontSize: 14, color: C.muted, lineHeight: 1.6, marginBottom: 20 }}>{f.desc}</p>
              <Link to={f.link}><Btn label={f.btn} small full /></Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ── Menu Page ─────────────────────────────────────────────────────────────────
const MenuPage = ({ cart, setCart }) => {
  const [menu, setMenu] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");

  useEffect(() => {
    api.get("/menu").then(r => { setMenu(r.data.filter(m => m.isActive)); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const addToCart = (item) => {
    setCart(prev => {
      const existing = prev.find(c => c.id === item.id);
      if (existing) return prev.map(c => c.id === item.id ? { ...c, qty: c.qty + 1 } : c);
      return [...prev, { ...item, qty: 1 }];
    });
  };

  const getQty = (id) => cart.find(c => c.id === id)?.qty || 0;

  const categories = ["All", ...new Set(menu.map(m => m.category))];
  const filtered = menu.filter(m =>
    (filter === "All" || m.category === filter) &&
    m.name.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <div style={{ padding: 60, textAlign: "center", color: C.muted, fontSize: 18 }}>Loading menu... 🍽️</div>;

  return (
    <div style={{ maxWidth: 1000, margin: "0 auto", padding: "32px 24px" }}>
      <h1 style={{ fontSize: 32, fontWeight: 900, color: C.text, marginBottom: 8 }}>Our Menu</h1>
      <p style={{ color: C.muted, marginBottom: 28 }}>Fresh, delicious food made with love</p>

      {/* Search */}
      <input value={search} onChange={e => setSearch(e.target.value)} placeholder="🔍 Search dishes..."
        style={{ width: "100%", background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: "12px 18px", fontSize: 15, color: C.text, outline: "none", marginBottom: 20, fontFamily: "inherit", boxSizing: "border-box" }} />

      {/* Filter tabs */}
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 28 }}>
        {categories.map(cat => (
          <button key={cat} onClick={() => setFilter(cat)} style={{
            background: filter === cat ? C.accent : C.card, color: filter === cat ? "#fff" : C.muted,
            border: `1px solid ${filter === cat ? C.accent : C.border}`, borderRadius: 20,
            padding: "7px 18px", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit"
          }}>{cat}</button>
        ))}
      </div>

      {/* Menu grid */}
      {filtered.length === 0 ? (
        <div style={{ textAlign: "center", color: C.muted, padding: 60 }}>No items found 😔</div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 20 }}>
          {filtered.map(item => (
            <div key={item.id} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 20, overflow: "hidden", boxShadow: "0 4px 20px #0000000A" }}>
              <div style={{ background: `linear-gradient(135deg, ${item.isVeg ? "#E8F5E9" : "#FBE9E7"}, ${item.isVeg ? "#C8E6C9" : "#FFCCBC"})`, height: 120, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 56 }}>
                {item.isVeg ? "🥗" : "🍗"}
              </div>
              <div style={{ padding: 18 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
                  <h3 style={{ fontSize: 16, fontWeight: 800, color: C.text, margin: 0 }}>{item.name}</h3>
                  <Badge label={item.isVeg ? "Veg" : "Non-Veg"} color={item.isVeg ? C.green : C.red} />
                </div>
                <div style={{ fontSize: 12, color: C.muted, marginBottom: 14 }}>{item.category}</div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: 22, fontWeight: 900, color: C.accent }}>₹{item.price}</span>
                  {getQty(item.id) === 0 ? (
                    <Btn label="Add to Cart" small onClick={() => addToCart(item)} />
                  ) : (
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <button onClick={() => setCart(prev => prev.map(c => c.id === item.id ? { ...c, qty: c.qty - 1 } : c).filter(c => c.qty > 0))}
                        style={{ width: 30, height: 30, borderRadius: "50%", background: C.accentLight, border: `1px solid ${C.border}`, fontSize: 18, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, color: C.accent }}>−</button>
                      <span style={{ fontWeight: 800, fontSize: 16, color: C.text }}>{getQty(item.id)}</span>
                      <button onClick={() => addToCart(item)}
                        style={{ width: 30, height: 30, borderRadius: "50%", background: C.accent, border: "none", fontSize: 18, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, color: "#fff" }}>+</button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
const PaymentModal = ({ total, onSuccess, onClose }) => {
  const [method, setMethod] = useState("upi");
  const [upiId, setUpiId] = useState("");
  const [card, setCard] = useState({ number: "", expiry: "", cvv: "", name: "" });
  const [step, setStep] = useState("form");

  const handlePay = () => {
    if (method === "upi" && !upiId.includes("@")) { alert("Enter a valid UPI ID (e.g. name@upi)"); return; }
    if (method === "card" && (card.number.length < 16 || !card.expiry || !card.cvv)) { alert("Enter valid card details"); return; }
    setStep("processing");
    setTimeout(() => setStep("success"), 2500);
    setTimeout(() => onSuccess(), 3500);
  };

  return (
    <div style={{ position: "fixed", inset: 0, background: "#00000088", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div style={{ background: "#fff", borderRadius: 24, width: "100%", maxWidth: 420, overflow: "hidden", boxShadow: "0 20px 60px #00000033" }}>

        {/* Header */}
        <div style={{ background: C.accent, padding: "20px 24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontSize: 12, color: "#fff9", fontWeight: 600 }}>DineDesk Payments</div>
            <div style={{ fontSize: 24, fontWeight: 900, color: "#fff" }}>₹{total}</div>
          </div>
          <button onClick={onClose} style={{ background: "#ffffff33", border: "none", borderRadius: 8, padding: "6px 10px", color: "#fff", cursor: "pointer", fontSize: 16 }}>✕</button>
        </div>

        <div style={{ padding: 24 }}>
          {step === "processing" && (
            <div style={{ textAlign: "center", padding: "40px 0" }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>⏳</div>
              <div style={{ fontWeight: 700, fontSize: 16, color: "#1A1A2E" }}>Processing Payment...</div>
              <div style={{ fontSize: 13, color: "#8B7355", marginTop: 8 }}>Please don't close this window</div>
            </div>
          )}

          {step === "success" && (
            <div style={{ textAlign: "center", padding: "40px 0" }}>
              <div style={{ fontSize: 56, marginBottom: 16 }}>✅</div>
              <div style={{ fontWeight: 800, fontSize: 18, color: "#2D8A4E" }}>Payment Successful!</div>
              <div style={{ fontSize: 13, color: "#8B7355", marginTop: 8 }}>Redirecting to order tracking...</div>
            </div>
          )}

          {step === "form" && (
            <>
              {/* Payment method tabs */}
              <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
                {[["upi", "📲 UPI"], ["card", "💳 Card"], ["cash", "💵 Cash"]].map(([m, label]) => (
                  <button key={m} onClick={() => setMethod(m)} style={{
                    flex: 1, background: method === m ? "#FFF3E0" : "#f5f5f5",
                    border: `2px solid ${method === m ? C.accent : "transparent"}`,
                    borderRadius: 10, padding: "8px 4px", fontSize: 11,
                    fontWeight: 700, cursor: "pointer",
                    color: method === m ? C.accent : "#8B7355",
                    fontFamily: "inherit"
                  }}>{label}</button>
                ))}
              </div>

              {/* UPI */}
              {method === "upi" && (
                <div>
                  <label style={{ fontSize: 13, fontWeight: 700, color: "#8B7355", display: "block", marginBottom: 8 }}>UPI ID</label>
                  <input value={upiId} onChange={e => setUpiId(e.target.value)}
                    placeholder="yourname@upi"
                    style={{ width: "100%", border: "1px solid #F0E6D3", borderRadius: 10, padding: "12px 16px", fontSize: 15, outline: "none", fontFamily: "inherit", boxSizing: "border-box" }} />
                  <div style={{ fontSize: 12, color: "#8B7355", marginTop: 8 }}>Supported: GPay, PhonePe, Paytm, BHIM</div>
                  <div style={{ display: "flex", gap: 12, marginTop: 14 }}>
                    {["GPay", "PhonePe", "Paytm", "BHIM"].map(app => (
                      <div key={app} style={{ flex: 1, background: "#f5f5f5", borderRadius: 8, padding: "8px 4px", textAlign: "center", fontSize: 11, fontWeight: 600, color: "#555" }}>{app}</div>
                    ))}
                  </div>
                </div>
              )}

              {/* Card */}
              {method === "card" && (
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  <input
                    value={card.number}
                    onChange={e => setCard({ ...card, number: e.target.value.replace(/\D/g, "").slice(0, 16) })}
                    placeholder="Card Number (16 digits)"
                    style={{ border: "1px solid #F0E6D3", borderRadius: 10, padding: "12px 16px", fontSize: 15, outline: "none", fontFamily: "inherit" }} />
                  <div style={{ display: "flex", gap: 12 }}>
                    <input
                      value={card.expiry}
                      onChange={e => setCard({ ...card, expiry: e.target.value })}
                      placeholder="MM/YY"
                      style={{ flex: 1, border: "1px solid #F0E6D3", borderRadius: 10, padding: "12px 16px", fontSize: 15, outline: "none", fontFamily: "inherit" }} />
                    <input
                      value={card.cvv}
                      onChange={e => setCard({ ...card, cvv: e.target.value.slice(0, 3) })}
                      placeholder="CVV" type="password"
                      style={{ flex: 1, border: "1px solid #F0E6D3", borderRadius: 10, padding: "12px 16px", fontSize: 15, outline: "none", fontFamily: "inherit" }} />
                  </div>
                  <input
                    value={card.name}
                    onChange={e => setCard({ ...card, name: e.target.value })}
                    placeholder="Name on Card"
                    style={{ border: "1px solid #F0E6D3", borderRadius: 10, padding: "12px 16px", fontSize: 15, outline: "none", fontFamily: "inherit" }} />
                </div>
              )}

              {/* Cash */}
              {method === "cash" && (
                <div style={{ background: "#FFF3E0", border: "1px solid #F5A62344", borderRadius: 12, padding: 20, textAlign: "center" }}>
                  <div style={{ fontSize: 40, marginBottom: 10 }}>💵</div>
                  <div style={{ fontWeight: 700, color: "#1A1A2E", fontSize: 16 }}>Pay ₹{total} on delivery</div>
                  <div style={{ fontSize: 13, color: "#8B7355", marginTop: 6 }}>Please keep exact change ready</div>
                </div>
              )}

              {/* Pay button */}
              <button onClick={handlePay} style={{
                width: "100%", background: C.accent, color: "#fff",
                border: "none", borderRadius: 12, padding: 16,
                fontSize: 16, fontWeight: 800, cursor: "pointer",
                marginTop: 20, fontFamily: "inherit"
              }}>
                {method === "cash" ? "Place Order" : `Pay ₹${total}`}
              </button>

              {/* Security badge */}
              <div style={{ display: "flex", justifyContent: "center", gap: 6, marginTop: 14, alignItems: "center" }}>
                <span style={{ fontSize: 12 }}>🔒</span>
                <span style={{ fontSize: 11, color: "#8B7355" }}>Secured by 256-bit SSL encryption</span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
// ── Cart Page ─────────────────────────────────────────────────────────────────
const CartPage = ({ cart, setCart, user }) => {
  const navigate = useNavigate();
  const [placing, setPlacing] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const gst = Math.round(subtotal * 0.05);
  const total = subtotal + gst;

  const placeOrder = () => {
  if (!user) { navigate("/auth"); return; }
  if (cart.length === 0) return;
  setShowPayment(true);
};

const handlePaymentSuccess = async () => {
  setShowPayment(false);
  setPlacing(true);
  try {
    const res = await api.post("/orders", {
      type: "delivery", source: "Direct App",
      items: cart.map(i => ({ menuItemId: i.id, quantity: i.qty, price: i.price }))
    });
    setCart([]);
    navigate(`/track/${res.data.id}`);
  } catch { alert("Order failed. Please try again."); }
  setPlacing(false);
};
  if (cart.length === 0) return (
    <div style={{ maxWidth: 500, margin: "80px auto", padding: 24, textAlign: "center" }}>
      <div style={{ fontSize: 64, marginBottom: 16 }}>🛒</div>
      <h2 style={{ fontSize: 24, fontWeight: 800, color: C.text, marginBottom: 8 }}>Your cart is empty</h2>
      <p style={{ color: C.muted, marginBottom: 28 }}>Add some delicious items from our menu!</p>
      <Link to="/menu"><Btn label="Browse Menu" /></Link>
    </div>
  );

  return (
    <div style={{ maxWidth: 700, margin: "0 auto", padding: "32px 24px" }}>
      <h1 style={{ fontSize: 28, fontWeight: 900, color: C.text, marginBottom: 24 }}>Your Cart 🛒</h1>
      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

        {/* Items */}
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 20, overflow: "hidden" }}>
          {cart.map((item, i) => (
            <div key={item.id} style={{ display: "flex", alignItems: "center", padding: "16px 20px", borderBottom: i < cart.length - 1 ? `1px solid ${C.border}` : "none", gap: 16 }}>
              <div style={{ fontSize: 32 }}>{item.isVeg ? "🥗" : "🍗"}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: 15, color: C.text }}>{item.name}</div>
                <div style={{ fontSize: 13, color: C.muted }}>{item.category}</div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <button onClick={() => setCart(prev => prev.map(c => c.id === item.id ? { ...c, qty: c.qty - 1 } : c).filter(c => c.qty > 0))}
                  style={{ width: 28, height: 28, borderRadius: "50%", background: C.accentLight, border: `1px solid ${C.border}`, cursor: "pointer", fontWeight: 700, color: C.accent, fontSize: 16 }}>−</button>
                <span style={{ fontWeight: 800, width: 20, textAlign: "center" }}>{item.qty}</span>
                <button onClick={() => setCart(prev => prev.map(c => c.id === item.id ? { ...c, qty: c.qty + 1 } : c))}
                  style={{ width: 28, height: 28, borderRadius: "50%", background: C.accent, border: "none", cursor: "pointer", fontWeight: 700, color: "#fff", fontSize: 16 }}>+</button>
              </div>
              <div style={{ fontWeight: 800, fontSize: 16, color: C.accent, minWidth: 70, textAlign: "right" }}>₹{item.price * item.qty}</div>
            </div>
          ))}
        </div>

        {/* Bill summary */}
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 20, padding: 24 }}>
          <h3 style={{ fontWeight: 800, fontSize: 18, color: C.text, marginBottom: 16 }}>Bill Summary</h3>
          {[["Subtotal", `₹${subtotal}`], ["GST (5%)", `₹${gst}`]].map(([l, v]) => (
            <div key={l} style={{ display: "flex", justifyContent: "space-between", fontSize: 14, color: C.muted, marginBottom: 10 }}>
              <span>{l}</span><span>{v}</span>
            </div>
          ))}
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 20, fontWeight: 900, color: C.text, paddingTop: 14, borderTop: `2px solid ${C.border}`, marginTop: 4 }}>
            <span>Total</span><span style={{ color: C.accent }}>₹{total}</span>
          </div>
          <div style={{ marginTop: 20 }}>
            <Btn label={placing ? "Placing Order..." : `Place Order · ₹${total}`} full onClick={placeOrder} disabled={placing} />
            {showPayment && (
  <PaymentModal
    total={total}
    onSuccess={handlePaymentSuccess}
    onClose={() => setShowPayment(false)}
  />
)}
          </div>
          {!user && <p style={{ fontSize: 12, color: C.muted, textAlign: "center", marginTop: 10 }}>You'll be asked to sign in before placing the order</p>}
        </div>
      </div>
    </div>
  );
};

// ── Order Tracking ────────────────────────────────────────────────────────────
const TrackOrder = () => {
  const orderId = window.location.pathname.split("/").pop();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = () => {
      api.get("/orders").then(r => {
        const found = r.data.find(o => o.id === parseInt(orderId));
        setOrder(found);
        setLoading(false);
      }).catch(() => setLoading(false));
    };
    fetchOrder();
    const interval = setInterval(fetchOrder, 5000);
    return () => clearInterval(interval);
  }, [orderId]);

  const steps = ["New", "Preparing", "Ready", "Delivered"];
  const currentStep = order ? steps.indexOf(order.status) : 0;

  if (loading) return <div style={{ padding: 60, textAlign: "center", color: C.muted }}>Loading order... 🔄</div>;
  if (!order) return <div style={{ padding: 60, textAlign: "center", color: C.muted }}>Order not found</div>;

  return (
    <div style={{ maxWidth: 600, margin: "0 auto", padding: "40px 24px" }}>
      <h1 style={{ fontSize: 28, fontWeight: 900, color: C.text, marginBottom: 4 }}>Order #{order.id}</h1>
      <p style={{ color: C.muted, marginBottom: 40 }}>Auto-updates every 5 seconds 🔄</p>

      {/* Progress */}
      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 20, padding: 32, marginBottom: 24 }}>
        <div style={{ display: "flex", justifyContent: "space-between", position: "relative" }}>
          <div style={{ position: "absolute", top: 20, left: "10%", right: "10%", height: 3, background: C.border, zIndex: 0 }}>
            <div style={{ width: `${(currentStep / (steps.length - 1)) * 100}%`, height: "100%", background: C.accent, transition: "width .5s" }} />
          </div>
          {steps.map((step, i) => {
            const done = i <= currentStep;
            const emojis = ["📋", "👨‍🍳", "✅", "🛵"];
            return (
              <div key={step} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, zIndex: 1 }}>
                <div style={{ width: 44, height: 44, borderRadius: "50%", background: done ? C.accent : C.border, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, transition: "background .3s" }}>
                  {emojis[i]}
                </div>
                <span style={{ fontSize: 12, fontWeight: done ? 700 : 400, color: done ? C.accent : C.muted }}>{step}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Order details */}
      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 20, padding: 24 }}>
        <h3 style={{ fontWeight: 800, color: C.text, marginBottom: 16 }}>Order Details</h3>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10, fontSize: 14 }}>
          <span style={{ color: C.muted }}>Status</span>
          <Badge label={order.status} color={order.status === "Delivered" ? C.green : C.accent} />
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10, fontSize: 14 }}>
          <span style={{ color: C.muted }}>Type</span>
          <span style={{ fontWeight: 600, color: C.text }}>{order.type}</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 18, fontWeight: 900, paddingTop: 14, borderTop: `1px solid ${C.border}` }}>
          <span style={{ color: C.text }}>Total</span>
          <span style={{ color: C.accent }}>₹{order.total}</span>
        </div>
      </div>

      <div style={{ marginTop: 24, textAlign: "center" }}>
        <Link to="/menu"><Btn label="Order More Food" outline color={C.accent} /></Link>
      </div>
    </div>
  );
};

// ── Book Table ────────────────────────────────────────────────────────────────
const BookTable = ({ user }) => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ guestName: "", guestPhone: "", date: "", time: "", guests: "2" });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async () => {
    if (!user) { navigate("/auth"); return; }
    if (!form.guestName || !form.date || !form.time) { alert("Please fill all fields"); return; }
    setSubmitting(true);
    try {
      const checkIn = new Date(`${form.date}T${form.time}`);
      const checkOut = new Date(checkIn.getTime() + 2 * 60 * 60 * 1000);
      await api.post("/bookings", {
        guestName: form.guestName, guestPhone: form.guestPhone,
        type: "Table", checkIn, checkOut
      });
      setSuccess(true);
    } catch { alert("Failed to book table. Please try again."); }
    setSubmitting(false);
  };

  if (success) return (
    <div style={{ maxWidth: 500, margin: "80px auto", padding: 24, textAlign: "center" }}>
      <div style={{ fontSize: 64, marginBottom: 16 }}>🎉</div>
      <h2 style={{ fontSize: 26, fontWeight: 900, color: C.text, marginBottom: 8 }}>Table Booked!</h2>
      <p style={{ color: C.muted, marginBottom: 28 }}>Your table is confirmed. We'll see you soon!</p>
      <Link to="/"><Btn label="Back to Home" /></Link>
    </div>
  );

  return (
    <div style={{ maxWidth: 520, margin: "0 auto", padding: "40px 24px" }}>
      <h1 style={{ fontSize: 30, fontWeight: 900, color: C.text, marginBottom: 6 }}>📅 Book a Table</h1>
      <p style={{ color: C.muted, marginBottom: 32 }}>Reserve your spot for a perfect dining experience</p>
      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 20, padding: 28, display: "flex", flexDirection: "column", gap: 18 }}>
        {[
          { label: "Your Name", key: "guestName", type: "text", placeholder: "e.g. Arjun Patel" },
          { label: "Phone Number", key: "guestPhone", type: "tel", placeholder: "e.g. 9876543210" },
          { label: "Date", key: "date", type: "date", placeholder: "" },
          { label: "Time", key: "time", type: "time", placeholder: "" },
        ].map(f => (
          <div key={f.key}>
            <label style={{ fontSize: 13, fontWeight: 700, color: C.muted, display: "block", marginBottom: 8 }}>{f.label}</label>
            <input type={f.type} value={form[f.key]} placeholder={f.placeholder}
              onChange={e => setForm({ ...form, [f.key]: e.target.value })}
              style={{ width: "100%", background: C.surface, border: `1px solid ${C.border}`, borderRadius: 10, padding: "12px 16px", fontSize: 15, color: C.text, outline: "none", fontFamily: "inherit", boxSizing: "border-box" }} />
          </div>
        ))}
        <div>
          <label style={{ fontSize: 13, fontWeight: 700, color: C.muted, display: "block", marginBottom: 8 }}>Number of Guests</label>
          <select value={form.guests} onChange={e => setForm({ ...form, guests: e.target.value })}
            style={{ width: "100%", background: C.surface, border: `1px solid ${C.border}`, borderRadius: 10, padding: "12px 16px", fontSize: 15, color: C.text, outline: "none", fontFamily: "inherit" }}>
            {[1, 2, 3, 4, 5, 6, 7, 8].map(n => <option key={n} value={n}>{n} {n === 1 ? "Guest" : "Guests"}</option>)}
          </select>
        </div>
        <Btn label={submitting ? "Booking..." : "Confirm Booking"} full onClick={handleSubmit} disabled={submitting} />
        {!user && <p style={{ fontSize: 12, color: C.muted, textAlign: "center" }}>You'll be asked to sign in</p>}
      </div>
    </div>
  );
};

// ── Book Room ─────────────────────────────────────────────────────────────────
const BookRoom = ({ user }) => {
  const navigate = useNavigate();
  const [rooms, setRooms] = useState([]);
  const [form, setForm] = useState({ guestName: "", guestPhone: "", checkIn: "", checkOut: "", roomId: "" });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    api.get("/rooms").then(r => setRooms(r.data.filter(room => room.status === "Available"))).catch(() => {});
  }, []);

  const handleSubmit = async () => {
    if (!user) { navigate("/auth"); return; }
    if (!form.guestName || !form.checkIn || !form.checkOut || !form.roomId) { alert("Please fill all fields"); return; }
    setSubmitting(true);
    try {
      await api.post("/bookings", {
        guestName: form.guestName, guestPhone: form.guestPhone,
        type: "Room", roomId: parseInt(form.roomId),
        checkIn: new Date(form.checkIn), checkOut: new Date(form.checkOut)
      });
      setSuccess(true);
    } catch { alert("Failed to book room. Please try again."); }
    setSubmitting(false);
  };

  if (success) return (
    <div style={{ maxWidth: 500, margin: "80px auto", padding: 24, textAlign: "center" }}>
      <div style={{ fontSize: 64, marginBottom: 16 }}>🏨</div>
      <h2 style={{ fontSize: 26, fontWeight: 900, color: C.text, marginBottom: 8 }}>Room Booked!</h2>
      <p style={{ color: C.muted, marginBottom: 28 }}>Your room is confirmed. We look forward to hosting you!</p>
      <Link to="/"><Btn label="Back to Home" /></Link>
    </div>
  );

  return (
    <div style={{ maxWidth: 520, margin: "0 auto", padding: "40px 24px" }}>
      <h1 style={{ fontSize: 30, fontWeight: 900, color: C.text, marginBottom: 6 }}>🏨 Book a Room</h1>
      <p style={{ color: C.muted, marginBottom: 32 }}>Comfortable stay with great hospitality</p>

      {/* Room selection */}
      {rooms.length > 0 && (
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 24 }}>
          {rooms.map(r => (
            <div key={r.id} onClick={() => setForm({ ...form, roomId: r.id.toString() })}
              style={{ background: form.roomId === r.id.toString() ? C.accentLight : C.card, border: `2px solid ${form.roomId === r.id.toString() ? C.accent : C.border}`, borderRadius: 14, padding: "14px 20px", cursor: "pointer", flex: 1, minWidth: 120 }}>
              <div style={{ fontWeight: 800, color: C.text }}>Room #{r.number}</div>
              <div style={{ fontSize: 13, color: C.muted }}>{r.type}</div>
              <div style={{ fontSize: 16, fontWeight: 900, color: C.accent, marginTop: 4 }}>₹{r.price}/night</div>
            </div>
          ))}
        </div>
      )}

      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 20, padding: 28, display: "flex", flexDirection: "column", gap: 18 }}>
        {[
          { label: "Your Name", key: "guestName", type: "text", placeholder: "e.g. Priya Sharma" },
          { label: "Phone Number", key: "guestPhone", type: "tel", placeholder: "e.g. 9876543210" },
          { label: "Check-In Date", key: "checkIn", type: "date", placeholder: "" },
          { label: "Check-Out Date", key: "checkOut", type: "date", placeholder: "" },
        ].map(f => (
          <div key={f.key}>
            <label style={{ fontSize: 13, fontWeight: 700, color: C.muted, display: "block", marginBottom: 8 }}>{f.label}</label>
            <input type={f.type} value={form[f.key]} placeholder={f.placeholder}
              onChange={e => setForm({ ...form, [f.key]: e.target.value })}
              style={{ width: "100%", background: C.surface, border: `1px solid ${C.border}`, borderRadius: 10, padding: "12px 16px", fontSize: 15, color: C.text, outline: "none", fontFamily: "inherit", boxSizing: "border-box" }} />
          </div>
        ))}
        <Btn label={submitting ? "Booking..." : "Confirm Room Booking"} full onClick={handleSubmit} disabled={submitting} />
      </div>
    </div>
  );
};

// ── Auth Page ─────────────────────────────────────────────────────────────────
const AuthPage = ({ onLogin }) => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    setLoading(true);
    setError("");
    try {
      if (isLogin) {
        const res = await api.post("/auth/login", { email: form.email, password: form.password });
        localStorage.setItem("customer_token", res.data.token);
        localStorage.setItem("customer_user", JSON.stringify(res.data.user));
        onLogin(res.data.user);
        navigate("/");
      } else {
        await api.post("/auth/register", { name: form.name, email: form.email, password: form.password, role: "customer" });
        setIsLogin(true);
        setError("Account created! Please sign in.");
      }
    } catch { setError(isLogin ? "Invalid email or password" : "Email already exists"); }
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: 420, margin: "60px auto", padding: "0 24px" }}>
      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 24, padding: 36 }}>
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>🍽️</div>
          <h2 style={{ fontSize: 24, fontWeight: 900, color: C.text, marginBottom: 4 }}>
            {isLogin ? "Welcome Back!" : "Create Account"}
          </h2>
          <p style={{ color: C.muted, fontSize: 14 }}>{isLogin ? "Sign in to place orders and book tables" : "Join DineDesk to get started"}</p>
        </div>

        {error && <div style={{ background: error.includes("created") ? "#E8F5E9" : "#FFEBEE", border: `1px solid ${error.includes("created") ? C.green : C.red}44`, borderRadius: 10, padding: "10px 14px", color: error.includes("created") ? C.green : C.red, fontSize: 13, marginBottom: 18 }}>{error}</div>}

        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {!isLogin && (
            <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Full Name"
              style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 10, padding: "13px 16px", fontSize: 15, color: C.text, outline: "none", fontFamily: "inherit" }} />
          )}
          <input value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="Email Address" type="email"
            style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 10, padding: "13px 16px", fontSize: 15, color: C.text, outline: "none", fontFamily: "inherit" }} />
          <input value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} placeholder="Password" type="password"
            onKeyDown={e => e.key === "Enter" && handleSubmit()}
            style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 10, padding: "13px 16px", fontSize: 15, color: C.text, outline: "none", fontFamily: "inherit" }} />
          <Btn label={loading ? "Please wait..." : isLogin ? "Sign In" : "Create Account"} full onClick={handleSubmit} disabled={loading} />
        </div>

        <div style={{ textAlign: "center", marginTop: 20, fontSize: 14, color: C.muted }}>
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button onClick={() => { setIsLogin(!isLogin); setError(""); }}
            style={{ background: "none", border: "none", color: C.accent, fontWeight: 700, cursor: "pointer", fontSize: 14, fontFamily: "inherit" }}>
            {isLogin ? "Sign Up" : "Sign In"}
          </button>
        </div>
      </div>
    </div>
  );
};

// ── My Orders ─────────────────────────────────────────────────────────────────
const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const stColor = { New: "#3498DB", Preparing: "#E8821A", Ready: "#2D8A4E", Delivered: "#9B59B6" };

  useEffect(() => {
    api.get("/orders").then(r => { setOrders(r.data); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  if (loading) return <div style={{ padding: 60, textAlign: "center", color: C.muted }}>Loading orders...</div>;

  return (
    <div style={{ maxWidth: 700, margin: "0 auto", padding: "40px 24px" }}>
      <h1 style={{ fontSize: 28, fontWeight: 900, color: C.text, marginBottom: 24 }}>My Orders 📦</h1>
      {orders.length === 0 ? (
        <div style={{ textAlign: "center", padding: 60, color: C.muted }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>📭</div>
          <p>No orders yet. Order something delicious!</p>
          <div style={{ marginTop: 20 }}><Link to="/menu"><Btn label="Browse Menu" /></Link></div>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {orders.map(o => (
            <div key={o.id} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: 20, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
              <div>
                <div style={{ fontWeight: 800, fontSize: 16, color: C.text }}>Order #{o.id}</div>
                <div style={{ fontSize: 13, color: C.muted, marginTop: 4 }}>{o.type} · {o.source}</div>
                <div style={{ fontSize: 20, fontWeight: 900, color: C.accent, marginTop: 4 }}>₹{o.total}</div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10, alignItems: "flex-end" }}>
                <Badge label={o.status} color={stColor[o.status] || C.muted} />
                <Link to={`/track/${o.id}`}><Btn label="Track Order" small outline color={C.accent} /></Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ── App Root ──────────────────────────────────────────────────────────────────
export default function App() {
  const [cart, setCart] = useState([]);
  const [user, setUser] = useState(() => {
    const u = localStorage.getItem("customer_user");
    return u ? JSON.parse(u) : null;
  });

  const handleLogout = () => {
    localStorage.removeItem("customer_token");
    localStorage.removeItem("customer_user");
    setUser(null);
  };

  return (
    <div style={{ minHeight: "100vh", background: C.bg, fontFamily: "'Outfit', 'Segoe UI', sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800;900&display=swap'); * { box-sizing: border-box; } body { margin: 0; } a { text-decoration: none; }`}</style>
      <Navbar cartCount={cart.reduce((s, i) => s + i.qty, 0)} user={user} onLogout={handleLogout} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/menu" element={<MenuPage cart={cart} setCart={setCart} />} />
        <Route path="/cart" element={<CartPage cart={cart} setCart={setCart} user={user} />} />
        <Route path="/track/:id" element={<TrackOrder />} />
        <Route path="/book-table" element={<BookTable user={user} />} />
        <Route path="/book-room" element={<BookRoom user={user} />} />
        <Route path="/auth" element={<AuthPage onLogin={setUser} />} />
        <Route path="/my-orders" element={<MyOrders />} />
      </Routes>
    </div>
  );
}