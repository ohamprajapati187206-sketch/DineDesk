import { io }  from 'socket.io-client';
import { useState, useEffect } from "react";
import axios from "axios";

// ── API client ────────────────────────────────────────────────────────────────
const api = axios.create({ baseURL: "http://localhost:4000/api" });

// ── Palette ───────────────────────────────────────────────────────────────────
const C = {
  bg: "#0D0F14", surface: "#151820", card: "#1C2030", border: "#252A3A",
  accent: "#F5A623", accentSoft: "#F5A62322", green: "#2ECC71", greenSoft: "#2ECC7122",
  red: "#E74C3C", redSoft: "#E74C3C22", blue: "#3498DB", blueSoft: "#3498DB22",
  purple: "#9B59B6", purpleSoft: "#9B59B622", text: "#F0F2F8", muted: "#6B7280",
  mutedLight: "#9CA3AF",
};

// ── Icon ─────────────────────────────────────────────────────────────────────
const Icon = ({ name, size = 18, color = "currentColor" }) => {
  const icons = {
    dashboard: <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z" />,
    restaurant: <path d="M11 9H9V2H7v7H5V2H3v7c0 2.12 1.66 3.84 3.75 3.97V22h2.5v-9.03C11.34 12.84 13 11.12 13 9V2h-2v7zm5-3v8h2.5v8H21V2c-2.76 0-5 2.24-5 4z" />,
    hotel: <path d="M7 13c1.66 0 3-1.34 3-3S8.66 7 7 7s-3 1.34-3 3 1.34 3 3 3zm12-6h-8v7H3V5H1v15h2v-3h18v3h2v-9c0-2.21-1.79-4-4-4z" />,
    booking: <path d="M17 12h-5v5h5v-5zM16 1v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-1V1h-2zm3 18H5V8h14v11z" />,
    billing: <path d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z" />,
    inventory: <path d="M20 2H4c-1 0-2 .9-2 2v3.01c0 .72.43 1.34 1 1.72V20c0 1.1 1.1 2 2 2h14c.9 0 2-.9 2-2V8.72c.57-.38 1-.99 1-1.71V4c0-1.1-1-2-2-2zm-5 12H9v-2h6v2zm5-7H4V4l16-.02V7z" />,
    staff: <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />,
    orders: <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 3c1.93 0 3.5 1.57 3.5 3.5S13.93 13 12 13s-3.5-1.57-3.5-3.5S10.07 6 12 6zm7 13H5v-.23c0-.62.28-1.2.76-1.58C7.47 15.82 9.64 15 12 15s4.53.82 6.24 2.19c.48.38.76.97.76 1.58V19z" />,
    reports: <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z" />,
    menu: <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z" />,
    plus: <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />,
    check: <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />,
    alert: <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />,
    logout: <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z" />,
    rupee: <path d="M13.5 11H10V9h3.5c.83 0 1.5-.67 1.5-1.5S14.33 6 13.5 6H8v2h2.08L15 15h-3.5L8 11.5V13h2.5l3.5 4H17l-3.89-4.48C14.67 12.03 15.5 11.1 15.5 10c0-1.93-1.57-3.5-3.5-3.5H8V5H6v2H4v2h2v8h2v-3h1.5L13 17h2.5l-3.78-4.23C12.56 12.32 13.5 11.74 13.5 11z" />,
    notification: <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z" />,
    trend_up: <path d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z" />,
  };
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill={color} style={{ flexShrink: 0 }}>
      {icons[name] || <circle cx="12" cy="12" r="10" />}
    </svg>
  );
};

// ── Reusable UI ───────────────────────────────────────────────────────────────
const Badge = ({ label, color = C.accent }) => (
  <span style={{ background: color + "22", color, border: `1px solid ${color}44`, borderRadius: 6, padding: "2px 10px", fontSize: 11, fontWeight: 700, letterSpacing: 0.5, textTransform: "uppercase", whiteSpace: "nowrap" }}>{label}</span>
);

const StatCard = ({ label, value, sub, icon, color = C.accent, trend }) => (
  <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: "20px 22px", display: "flex", flexDirection: "column", gap: 8, borderLeft: `3px solid ${color}`, flex: 1, minWidth: 150 }}>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
      <span style={{ fontSize: 12, color: C.muted, fontWeight: 600, letterSpacing: 0.8, textTransform: "uppercase" }}>{label}</span>
      <div style={{ background: color + "22", borderRadius: 10, padding: 7, display: "flex" }}>
        <Icon name={icon} size={16} color={color} />
      </div>
    </div>
    <div style={{ fontSize: 28, fontWeight: 800, color: C.text, fontFamily: "'DM Mono', monospace" }}>{value}</div>
    {sub && <div style={{ fontSize: 12, color: trend === "up" ? C.green : C.muted }}>{trend === "up" && "↑ "}{sub}</div>}
  </div>
);

const Btn = ({ label, onClick, color = C.accent, small, icon, outline }) => (
  <button onClick={onClick} style={{ background: outline ? "transparent" : color, color: outline ? color : "#000", border: `1.5px solid ${color}`, borderRadius: 10, padding: small ? "6px 14px" : "10px 20px", fontSize: small ? 12 : 13, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: 6, letterSpacing: 0.3, transition: "opacity .15s", whiteSpace: "nowrap" }}
    onMouseEnter={e => e.currentTarget.style.opacity = "0.8"}
    onMouseLeave={e => e.currentTarget.style.opacity = "1"}
  >
    {icon && <Icon name={icon} size={14} color={outline ? color : "#000"} />}
    {label}
  </button>
);

const SectionTitle = ({ title, sub }) => (
  <div style={{ marginBottom: 20 }}>
    <h2 style={{ fontSize: 22, fontWeight: 800, color: C.text, margin: 0 }}>{title}</h2>
    {sub && <p style={{ fontSize: 13, color: C.muted, margin: "4px 0 0" }}>{sub}</p>}
  </div>
);

const TableRow = ({ cells, header }) => (
  <tr style={{ borderBottom: `1px solid ${C.border}` }}>
    {cells.map((c, i) => (
      <td key={i} style={{ padding: "12px 16px", fontSize: header ? 11 : 13, color: header ? C.muted : C.text, fontWeight: header ? 700 : 400, letterSpacing: header ? 0.8 : 0, textTransform: header ? "uppercase" : "none", whiteSpace: "nowrap" }}>{c}</td>
    ))}
  </tr>
);

// ── Login Page ────────────────────────────────────────────────────────────────
const Login = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.post("/auth/login", { email, password });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      onLogin(res.data.user);
    } catch {
      setError("Invalid email or password");
    }
    setLoading(false);
  };

  return (
    <div style={{ minHeight: "100vh", background: C.bg, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;600;700;800;900&family=DM+Mono&display=swap'); * { box-sizing: border-box; } body { margin: 0; }`}</style>
      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 20, padding: 40, width: "100%", maxWidth: 400 }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ width: 56, height: 56, background: C.accent, borderRadius: 16, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
            <Icon name="restaurant" size={28} color="#000" />
          </div>
          <div style={{ fontSize: 28, fontWeight: 900, color: C.text }}>DineDesk</div>
          <div style={{ fontSize: 13, color: C.muted, marginTop: 4 }}>Sign in to your account</div>
        </div>
        {error && <div style={{ background: C.redSoft, border: `1px solid ${C.red}44`, borderRadius: 10, padding: "10px 14px", color: C.red, fontSize: 13, marginBottom: 16 }}>{error}</div>}
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email address" type="email"
            style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 10, padding: "12px 16px", color: C.text, fontSize: 14, outline: "none", fontFamily: "inherit" }} />
          <input value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" type="password"
            onKeyDown={e => e.key === "Enter" && handleLogin()}
            style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 10, padding: "12px 16px", color: C.text, fontSize: 14, outline: "none", fontFamily: "inherit" }} />
          <button onClick={handleLogin} disabled={loading}
            style={{ background: C.accent, color: "#000", border: "none", borderRadius: 10, padding: "13px", fontSize: 14, fontWeight: 800, cursor: "pointer", marginTop: 4 }}>
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </div>
      </div>
    </div>
  );
};

// ── Dashboard ─────────────────────────────────────────────────────────────────
const Dashboard = () => {
  const [summary, setSummary] = useState(null);
  const [orders, setOrders] = useState([]);
  const [branches, setBranches] = useState([]);
  const [activeBranch, setActiveBranch] = useState(null); // null = all branches
  const [loading, setLoading] = useState(true);

  const statusColor = { New: C.blue, Preparing: C.accent, Ready: C.green, Delivered: C.purple, Billed: C.muted };

  useEffect(() => {
    api.get("/branches").then(r => {
      setBranches(r.data);
      if (r.data.length === 1) setActiveBranch(r.data[0]); // auto-select if single branch
    }).catch(() => {});
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const params = activeBranch ? `?branchId=${activeBranch.id}` : '';
        const [summaryRes, ordersRes] = await Promise.all([
          api.get(`/reports/summary${params}`),
          api.get(`/orders${params}`)
        ]);
        setSummary(summaryRes.data);
        setOrders(ordersRes.data.slice(0, 5));
      } catch (err) { console.error(err); }
      setLoading(false);
    };
    fetchData();
  }, [activeBranch]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>

      {/* ── Header + Branch Switcher ── */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
        <SectionTitle
          title="Dashboard"
          sub={activeBranch ? `Viewing: ${activeBranch.name}` : "All Branches — Combined View"}
        />
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <button
            onClick={() => setActiveBranch(null)}
            style={{
              padding: "7px 16px", borderRadius: 10, fontSize: 12, fontWeight: 700, cursor: "pointer",
              background: !activeBranch ? C.accent : "transparent",
              color: !activeBranch ? "#000" : C.muted,
              border: `1.5px solid ${!activeBranch ? C.accent : C.border}`
            }}>
            All
          </button>
          {branches.map(b => (
            <button key={b.id}
              onClick={() => setActiveBranch(b)}
              style={{
                padding: "7px 16px", borderRadius: 10, fontSize: 12, fontWeight: 700, cursor: "pointer",
                background: activeBranch?.id === b.id ? C.accent : "transparent",
                color: activeBranch?.id === b.id ? "#000" : C.muted,
                border: `1.5px solid ${activeBranch?.id === b.id ? C.accent : C.border}`
              }}>
              {b.name}
            </button>
          ))}
          <Btn label="+ Branch" small outline color={C.accent} onClick={() => {
            const name = prompt("Branch name:");
            const address = prompt("Address:");
            if (name) api.post("/branches", { name, address }).then(r => setBranches([...branches, r.data]));
          }} />
        </div>
      </div>

      {/* ── Branch Cards (superadmin all-view) ── */}
      {!activeBranch && branches.length > 1 && (
        <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
          {branches.map(b => (
            <div key={b.id}
              onClick={() => setActiveBranch(b)}
              style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: "16px 20px", flex: "1 1 200px", cursor: "pointer", transition: "border .2s" }}
              onMouseEnter={e => e.currentTarget.style.borderColor = C.accent}
              onMouseLeave={e => e.currentTarget.style.borderColor = C.border}>
              <div style={{ fontSize: 15, fontWeight: 700, color: C.text, marginBottom: 6 }}>{b.name}</div>
              <div style={{ fontSize: 12, color: C.muted, marginBottom: 10 }}>{b.address || "No address"}</div>
              <div style={{ display: "flex", gap: 16 }}>
                <div><div style={{ fontSize: 18, fontWeight: 700, color: C.accent }}>{b._count?.orders || 0}</div><div style={{ fontSize: 11, color: C.muted }}>Orders</div></div>
                <div><div style={{ fontSize: 18, fontWeight: 700, color: C.green }}>{b._count?.staff || 0}</div><div style={{ fontSize: 11, color: C.muted }}>Staff</div></div>
                <div><div style={{ fontSize: 18, fontWeight: 700, color: C.blue }}>{b._count?.rooms || 0}</div><div style={{ fontSize: 11, color: C.muted }}>Rooms</div></div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Stat Cards ── */}
      {loading
        ? <div style={{ color: C.muted, padding: 40, textAlign: "center" }}>Loading...</div>
        : <>
          <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
            <StatCard label="Today's Revenue" value={`₹${summary?.todayRevenue?.toFixed(0) || 0}`} sub="From today's orders" icon="rupee" color={C.accent} trend="up" />
            <StatCard label="Today's Orders" value={summary?.todayOrders || 0} sub="Orders placed today" icon="orders" color={C.blue} />
            <StatCard label="Rooms Occupied" value={`${summary?.occupiedRooms || 0}/${summary?.totalRooms || 0}`} sub="Current occupancy" icon="hotel" color={C.green} />
            <StatCard label="Low Stock Items" value={summary?.lowStockItems || 0} sub="Need restocking" icon="alert" color={summary?.lowStockItems > 0 ? C.red : C.green} />
          </div>

          {/* ── Recent Orders ── */}
          <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, overflow: "hidden" }}>
            <div style={{ padding: "18px 20px", borderBottom: `1px solid ${C.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontWeight: 700, fontSize: 15, color: C.text }}>Recent Orders</span>
              <Badge label={`${summary?.totalOrders || 0} total`} color={C.blue} />
            </div>
            {orders.length === 0
              ? <div style={{ padding: 40, textAlign: "center", color: C.muted }}>No orders yet.</div>
              : <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead style={{ background: C.surface }}>
                    <TableRow header cells={["Order ID", "Type", "Source", "Total", "Status"]} />
                  </thead>
                  <tbody>
                    {orders.map(o => (
                      <TableRow key={o.id} cells={[
                        <span style={{ fontWeight: 700, color: C.accent }}>#{o.id}</span>,
                        o.type, o.source,
                        <span style={{ fontFamily: "monospace", color: C.accent }}>₹{o.total}</span>,
                        <Badge label={o.status} color={statusColor[o.status] || C.muted} />
                      ]} />
                    ))}
                  </tbody>
                </table>
            }
          </div>
        </>
      }
    </div>
  );
};
// ── Restaurant Management ─────────────────────────────────────────────────────
const RestaurantMgmt = () => {
  const [activeTab, setActiveTab] = useState("floor");
  const [tables, setTables] = useState([]);
  const [menu, setMenu] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddMenu, setShowAddMenu] = useState(false);
  const [newItem, setNewItem] = useState({ name: "", category: "", price: "", isVeg: true });

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [t, m, o] = await Promise.all([api.get("/tables"), api.get("/menu"), api.get("/orders")]);
        setTables(t.data);
        setMenu(m.data);
        setOrders(o.data.filter(o => ["New", "Preparing", "Ready"].includes(o.status)));
      } catch (err) { console.error(err); }
      setLoading(false);
    };
    fetchAll();
  }, []);

  const tColor = { Free: C.green, Occupied: C.red, Reserved: C.accent, Cleaning: C.purple };

  const handleAddMenuItem = async () => {
    try {
      const res = await api.post("/menu", { ...newItem, price: parseFloat(newItem.price) });
      setMenu([...menu, res.data]);
      setNewItem({ name: "", category: "", price: "", isVeg: true });
      setShowAddMenu(false);
    } catch (err) { alert("Failed to add item"); }
  };

  const handleTableStatus = async (id, status) => {
    try {
      await api.patch(`/tables/${id}/status`, { status });
      setTables(tables.map(t => t.id === id ? { ...t, status } : t));
    } catch (err) { alert("Failed to update table"); }
  };

  const handleOrderStatus = async (id, status) => {
    try {
      await api.patch(`/orders/${id}/status`, { status });
      setOrders(orders.map(o => o.id === id ? { ...o, status } : o));
    } catch (err) { alert("Failed to update order"); }
  };

  if (loading) return <div style={{ color: C.muted, padding: 40, textAlign: "center" }}>Loading...</div>;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <SectionTitle title="Restaurant Management" sub="Floor map, orders and menu — all live from database" />
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        {["floor", "orders", "menu"].map(t => (
          <button key={t} onClick={() => setActiveTab(t)} style={{ background: activeTab === t ? C.accent : C.card, color: activeTab === t ? "#000" : C.muted, border: `1px solid ${activeTab === t ? C.accent : C.border}`, borderRadius: 10, padding: "8px 20px", fontWeight: 700, fontSize: 13, cursor: "pointer", textTransform: "capitalize" }}>
            {t === "orders" ? "Live Orders" : t === "menu" ? "Menu Items" : "Floor Map"}
          </button>
        ))}
      </div>

      {activeTab === "floor" && (
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: 24 }}>
          {tables.length === 0 ? (
            <div style={{ textAlign: "center", color: C.muted, padding: 40 }}>
              No tables yet. Add tables via Postman: POST /api/tables
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(110px, 1fr))", gap: 14 }}>
              {tables.map(t => (
                <div key={t.id} style={{ background: (tColor[t.status] || C.green) + "18", border: `2px solid ${(tColor[t.status] || C.green)}55`, borderRadius: 14, padding: "16px 12px", textAlign: "center", cursor: "pointer" }}
                  onClick={() => handleTableStatus(t.id, t.status === "Free" ? "Occupied" : "Free")}>
                  <div style={{ fontSize: 16, fontWeight: 800, color: tColor[t.status] || C.green }}>{t.name}</div>
                  <div style={{ fontSize: 11, color: C.muted, margin: "4px 0" }}>👥 {t.capacity}</div>
                  <Badge label={t.status} color={tColor[t.status] || C.green} />
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === "orders" && (
        <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
          {orders.length === 0 ? (
            <div style={{ color: C.muted, padding: 40, textAlign: "center", width: "100%" }}>No active orders right now.</div>
          ) : orders.map(o => (
            <div key={o.id} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: 20, minWidth: 200, flex: 1 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
                <span style={{ fontWeight: 800, color: C.accent, fontSize: 16 }}>#{o.id}</span>
                <Badge label={o.status} color={o.status === "Ready" ? C.green : o.status === "New" ? C.blue : C.accent} />
              </div>
              <div style={{ fontSize: 12, color: C.muted, marginBottom: 12 }}>Type: {o.type} · Source: {o.source}</div>
              <div style={{ fontSize: 13, color: C.accent, fontWeight: 700, marginBottom: 12 }}>₹{o.total}</div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {o.status === "New" && <Btn label="Start Preparing" small color={C.accent} onClick={() => handleOrderStatus(o.id, "Preparing")} />}
                {o.status === "Preparing" && <Btn label="Mark Ready" small color={C.green} onClick={() => handleOrderStatus(o.id, "Ready")} />}
                {o.status === "Ready" && <Btn label="Mark Delivered" small color={C.blue} onClick={() => handleOrderStatus(o.id, "Delivered")} />}
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === "menu" && (
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, overflow: "hidden" }}>
          <div style={{ padding: "16px 20px", borderBottom: `1px solid ${C.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontWeight: 700, color: C.text }}>Menu Items ({menu.length})</span>
            <Btn label="Add Item" small icon="plus" color={C.accent} onClick={() => setShowAddMenu(!showAddMenu)} />
          </div>
          {showAddMenu && (
            <div style={{ padding: 20, borderBottom: `1px solid ${C.border}`, background: C.surface, display: "flex", gap: 12, flexWrap: "wrap", alignItems: "flex-end" }}>
              {[["Name", "name", "text"], ["Category", "category", "text"], ["Price", "price", "number"]].map(([label, key, type]) => (
                <div key={key} style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  <span style={{ fontSize: 11, color: C.muted, fontWeight: 600 }}>{label}</span>
                  <input type={type} value={newItem[key]} onChange={e => setNewItem({ ...newItem, [key]: e.target.value })}
                    style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 8, padding: "8px 12px", color: C.text, fontSize: 13, width: 130, outline: "none" }} />
                </div>
              ))}
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <span style={{ fontSize: 11, color: C.muted, fontWeight: 600 }}>Type</span>
                <select value={newItem.isVeg} onChange={e => setNewItem({ ...newItem, isVeg: e.target.value === "true" })}
                  style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 8, padding: "8px 12px", color: C.text, fontSize: 13, outline: "none" }}>
                  <option value="true">Veg</option>
                  <option value="false">Non-Veg</option>
                </select>
              </div>
              <Btn label="Save Item" small color={C.green} icon="check" onClick={handleAddMenuItem} />
            </div>
          )}
          {menu.length === 0 ? (
            <div style={{ padding: 40, textAlign: "center", color: C.muted }}>No menu items yet. Add your first item!</div>
          ) : (
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead style={{ background: C.surface }}>
                <TableRow header cells={["Item", "Category", "Price", "Type", "Status"]} />
              </thead>
              <tbody>
                {menu.map((m, i) => (
                  <TableRow key={i} cells={[
                    <span style={{ fontWeight: 600, color: C.text }}>{m.name}</span>,
                    m.category,
                    <span style={{ fontFamily: "monospace", color: C.accent }}>₹{m.price}</span>,
                    <Badge label={m.isVeg ? "Veg" : "Non-Veg"} color={m.isVeg ? C.green : C.red} />,
                    <Badge label={m.isActive ? "Active" : "Off"} color={m.isActive ? C.green : C.muted} />
                  ]} />
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
};

// ── Hotel Management ──────────────────────────────────────────────────────────
const HotelMgmt = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const rColor = { Available: C.green, Occupied: C.red, Dirty: C.purple, Maintenance: C.accent };

  useEffect(() => {
    api.get("/rooms").then(r => { setRooms(r.data); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const handleStatus = async (id, status) => {
    try {
      await api.patch(`/rooms/${id}/status`, { status });
      setRooms(rooms.map(r => r.id === id ? { ...r, status } : r));
    } catch { alert("Failed to update room"); }
  };

  if (loading) return <div style={{ color: C.muted, padding: 40, textAlign: "center" }}>Loading rooms...</div>;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <SectionTitle title="Hotel Management" sub="Live room status from database" />
      <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
        {Object.entries(rColor).map(([s, c]) => (
          <StatCard key={s} label={s} value={rooms.filter(r => r.status === s).length} icon="hotel" color={c} />
        ))}
      </div>
      {rooms.length === 0 ? (
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: 40, textAlign: "center", color: C.muted }}>
          No rooms yet. Add rooms via Postman: POST /api/rooms
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: 14 }}>
          {rooms.map(r => (
            <div key={r.id} style={{ background: C.card, border: `2px solid ${(rColor[r.status] || C.green)}44`, borderRadius: 14, padding: 16, borderTop: `3px solid ${rColor[r.status] || C.green}` }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                <span style={{ fontSize: 20, fontWeight: 800, color: C.text }}>#{r.number}</span>
                <Badge label={r.status} color={rColor[r.status] || C.green} />
              </div>
              <div style={{ fontSize: 12, color: C.muted, marginBottom: 10 }}>{r.type} · ₹{r.price}/night</div>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {r.status !== "Available" && <Btn label="Set Available" small color={C.green} onClick={() => handleStatus(r.id, "Available")} />}
                {r.status !== "Occupied" && <Btn label="Set Occupied" small color={C.red} onClick={() => handleStatus(r.id, "Occupied")} />}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ── Inventory ─────────────────────────────────────────────────────────────────
const Inventory = () => {
  const [stock, setStock] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [newItem, setNewItem] = useState({ name: "", unit: "", currentStock: "", minStock: "", supplier: "" });

  useEffect(() => {
    api.get("/inventory").then(r => { setStock(r.data); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const handleAdd = async () => {
    try {
      const res = await api.post("/inventory", newItem);
      setStock([...stock, res.data]);
      setNewItem({ name: "", unit: "", currentStock: "", minStock: "", supplier: "" });
      setShowAdd(false);
    } catch { alert("Failed to add item"); }
  };

  const stockColor = (c, m) => c <= m ? C.red : c <= m * 1.3 ? C.accent : C.green;

  if (loading) return <div style={{ color: C.muted, padding: 40, textAlign: "center" }}>Loading inventory...</div>;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <SectionTitle title="Inventory Management" sub="Live stock tracking from database" />
      <div style={{ display: "flex", gap: 12 }}>
        <Btn label="Add Stock Item" icon="plus" color={C.accent} onClick={() => setShowAdd(!showAdd)} />
      </div>
      {showAdd && (
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: 20, display: "flex", gap: 12, flexWrap: "wrap", alignItems: "flex-end" }}>
          {[["Name", "name"], ["Unit", "unit"], ["Current Stock", "currentStock"], ["Min Stock", "minStock"], ["Supplier", "supplier"]].map(([label, key]) => (
            <div key={key} style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <span style={{ fontSize: 11, color: C.muted, fontWeight: 600 }}>{label}</span>
              <input value={newItem[key]} onChange={e => setNewItem({ ...newItem, [key]: e.target.value })}
                style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, padding: "8px 12px", color: C.text, fontSize: 13, width: 130, outline: "none" }} />
            </div>
          ))}
          <Btn label="Save" small color={C.green} icon="check" onClick={handleAdd} />
        </div>
      )}
      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, overflow: "hidden" }}>
        {stock.length === 0 ? (
          <div style={{ padding: 40, textAlign: "center", color: C.muted }}>No inventory items yet. Add your first item!</div>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead style={{ background: C.surface }}>
              <TableRow header cells={["Item", "Stock", "Min", "Bar", "Supplier", "Status"]} />
            </thead>
            <tbody>
              {stock.map((s, i) => {
                const color = stockColor(s.currentStock, s.minStock);
                const pct = Math.min(100, Math.round((s.currentStock / (s.minStock * 2)) * 100));
                return (
                  <TableRow key={i} cells={[
                    <span style={{ fontWeight: 600, color: C.text }}>{s.name}</span>,
                    `${s.currentStock} ${s.unit}`,
                    `${s.minStock} ${s.unit}`,
                    <div style={{ width: 100, background: C.border, borderRadius: 4, height: 8 }}>
                      <div style={{ width: `${pct}%`, background: color, height: "100%", borderRadius: 4 }} />
                    </div>,
                    s.supplier || "—",
                    <Badge label={s.currentStock <= s.minStock ? "Low Stock" : "OK"} color={color} />
                  ]} />
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

// ── Staff ─────────────────────────────────────────────────────────────────────
const StaffMgmt = () => {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [newStaff, setNewStaff] = useState({ name: "", role: "", department: "", phone: "", salary: "" });
  const sColor = { Present: C.green, Absent: C.red, "On Leave": C.accent };

  useEffect(() => {
    api.get("/staff").then(r => { setStaff(r.data); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const handleAdd = async () => {
    try {
      const res = await api.post("/staff", newStaff);
      setStaff([...staff, res.data]);
      setNewStaff({ name: "", role: "", department: "", phone: "", salary: "" });
      setShowAdd(false);
    } catch { alert("Failed to add staff"); }
  };

  const handleAttendance = async (id, status) => {
    try {
      await api.patch(`/staff/${id}/attendance`, { status });
      setStaff(staff.map(s => s.id === id ? { ...s, attendance: [{ status }] } : s));
    } catch { alert("Failed to mark attendance"); }
  };

  if (loading) return <div style={{ color: C.muted, padding: 40, textAlign: "center" }}>Loading staff...</div>;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <SectionTitle title="Staff Management" sub="Real employee data from database" />
      <Btn label="Add Employee" icon="plus" color={C.accent} onClick={() => setShowAdd(!showAdd)} />
      {showAdd && (
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: 20, display: "flex", gap: 12, flexWrap: "wrap", alignItems: "flex-end" }}>
          {[["Name", "name"], ["Role", "role"], ["Department", "department"], ["Phone", "phone"], ["Salary", "salary"]].map(([label, key]) => (
            <div key={key} style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <span style={{ fontSize: 11, color: C.muted, fontWeight: 600 }}>{label}</span>
              <input value={newStaff[key]} onChange={e => setNewStaff({ ...newStaff, [key]: e.target.value })}
                style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, padding: "8px 12px", color: C.text, fontSize: 13, width: 130, outline: "none" }} />
            </div>
          ))}
          <Btn label="Save" small color={C.green} icon="check" onClick={handleAdd} />
        </div>
      )}
      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, overflow: "hidden" }}>
        {staff.length === 0 ? (
          <div style={{ padding: 40, textAlign: "center", color: C.muted }}>No staff yet. Add your first employee!</div>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead style={{ background: C.surface }}>
              <TableRow header cells={["Name", "Role", "Dept", "Phone", "Salary", "Attendance", "Action"]} />
            </thead>
            <tbody>
              {staff.map((s, i) => {
                const lastAttendance = s.attendance?.[0]?.status || "Not Marked";
                return (
                  <TableRow key={i} cells={[
                    <span style={{ fontWeight: 600, color: C.text }}>{s.name}</span>,
                    s.role, s.department, s.phone || "—",
                    <span style={{ fontFamily: "monospace", color: C.accent }}>₹{s.salary}</span>,
                    <Badge label={lastAttendance} color={sColor[lastAttendance] || C.muted} />,
                    <div style={{ display: "flex", gap: 6 }}>
                      <Btn label="Present" small color={C.green} onClick={() => handleAttendance(s.id, "Present")} />
                      <Btn label="Absent" small color={C.red} onClick={() => handleAttendance(s.id, "Absent")} />
                    </div>
                  ]} />
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

// ── Booking ───────────────────────────────────────────────────────────────────
const Booking = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const sColor = { Confirmed: C.green, Waitlist: C.accent, Pending: C.blue, Cancelled: C.red };

  useEffect(() => {
    api.get("/bookings").then(r => { setBookings(r.data); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const handleCancel = async (id) => {
    try {
      await api.patch(`/bookings/${id}`, { status: "Cancelled" });
      setBookings(bookings.map(b => b.id === id ? { ...b, status: "Cancelled" } : b));
    } catch { alert("Failed to cancel booking"); }
  };

  if (loading) return <div style={{ color: C.muted, padding: 40, textAlign: "center" }}>Loading bookings...</div>;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <SectionTitle title="Table & Room Booking" sub="All reservations from database" />
      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, overflow: "hidden" }}>
        {bookings.length === 0 ? (
          <div style={{ padding: 40, textAlign: "center", color: C.muted }}>No bookings yet.</div>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead style={{ background: C.surface }}>
              <TableRow header cells={["ID", "Guest", "Type", "Check In", "Check Out", "Status", "Action"]} />
            </thead>
            <tbody>
              {bookings.map(b => (
                <TableRow key={b.id} cells={[
                  <span style={{ color: C.accent, fontWeight: 700 }}>#{b.id}</span>,
                  b.guestName, b.type,
                  new Date(b.checkIn).toLocaleDateString(),
                  new Date(b.checkOut).toLocaleDateString(),
                  <Badge label={b.status} color={sColor[b.status] || C.muted} />,
                  b.status !== "Cancelled" && <Btn label="Cancel" small outline color={C.red} onClick={() => handleCancel(b.id)} />
                ]} />
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

// ── Reports ───────────────────────────────────────────────────────────────────
const Reports = () => {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/reports/summary")
      .then(r => { setSummary(r.data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <div style={{ color: C.muted, padding: 40, textAlign: "center" }}>Loading reports...</div>;
  if (!summary) return <div style={{ color: C.red, padding: 40, textAlign: "center" }}>Failed to load.</div>;

  const maxRev = Math.max(...(summary.weeklyRevenue?.map(d => d.revenue) || [1]), 1);
  const maxOrd = Math.max(...(summary.weeklyRevenue?.map(d => d.orders) || [1]), 1);
  const totalTypeCount = summary.typeBreakdown?.reduce((s, t) => s + t.count, 0) || 1;
  const typeColors = { 'Dine-in': C.accent, 'Takeaway': C.blue, 'Delivery': C.green };
  const roomColors = { 'Available': C.green, 'Occupied': C.accent, 'Maintenance': C.red };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <SectionTitle title="Reports & Analytics" sub="Live data from your database" />

      {/* ── Stat Cards ── */}
      <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
        <StatCard label="Today's Revenue" value={`₹${summary.todayRevenue?.toFixed(0) || 0}`} icon="rupee" color={C.accent} />
        <StatCard label="Today's Orders" value={summary.todayOrders || 0} icon="orders" color={C.blue} />
        <StatCard label="Total Orders" value={summary.totalOrders || 0} icon="trend_up" color={C.green} />
        <StatCard label="Total Staff" value={summary.totalStaff || 0} icon="staff" color={C.purple} />
        <StatCard label="Rooms Occupied" value={`${summary.occupiedRooms || 0}/${summary.totalRooms || 0}`} icon="hotel" color={C.green} />
        <StatCard label="Low Stock" value={summary.lowStockItems || 0} icon="alert" color={summary.lowStockItems > 0 ? C.red : C.green} />
      </div>

      {/* ── Weekly Revenue Bar Chart ── */}
      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: 24 }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: C.text, marginBottom: 4 }}>Weekly Revenue</div>
        <div style={{ fontSize: 12, color: C.muted, marginBottom: 20 }}>Last 7 days</div>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 10, height: 140 }}>
          {summary.weeklyRevenue?.map((d, i) => (
            <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
              <div style={{ fontSize: 10, color: C.accent, fontWeight: 700 }}>
                {d.revenue > 0 ? `₹${d.revenue >= 1000 ? (d.revenue / 1000).toFixed(1) + 'k' : d.revenue.toFixed(0)}` : ''}
              </div>
              <div style={{
                width: "100%", borderRadius: "6px 6px 0 0",
                background: i === 6 ? C.accent : C.accentSoft,
                height: `${Math.max((d.revenue / maxRev) * 100, 4)}%`,
                transition: "height 0.4s ease",
                border: i === 6 ? "none" : `1px solid ${C.accent}44`
              }} />
              <div style={{ fontSize: 11, color: C.muted }}>{d.day}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Orders Per Day Line-style ── */}
      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: 24 }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: C.text, marginBottom: 4 }}>Orders Per Day</div>
        <div style={{ fontSize: 12, color: C.muted, marginBottom: 20 }}>Last 7 days</div>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 10, height: 100 }}>
          {summary.weeklyRevenue?.map((d, i) => (
            <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
              <div style={{ fontSize: 10, color: C.blue, fontWeight: 700 }}>{d.orders > 0 ? d.orders : ''}</div>
              <div style={{
                width: "100%", borderRadius: "6px 6px 0 0",
                background: C.blueSoft,
                height: `${Math.max((d.orders / maxOrd) * 100, 4)}%`,
                border: `1px solid ${C.blue}44`
              }} />
              <div style={{ fontSize: 11, color: C.muted }}>{d.day}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Bottom Row: Order Type + Room Status ── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>

        {/* Order Type Donut */}
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: 24 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: C.text, marginBottom: 4 }}>Order Types</div>
          <div style={{ fontSize: 12, color: C.muted, marginBottom: 16 }}>This week</div>
          {summary.typeBreakdown?.map((t, i) => {
            const pct = totalTypeCount > 0 ? ((t.count / totalTypeCount) * 100).toFixed(0) : 0;
            return (
              <div key={i} style={{ marginBottom: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 5 }}>
                  <span style={{ color: C.text }}>{t.type}</span>
                  <span style={{ color: typeColors[t.type], fontWeight: 700 }}>{t.count} ({pct}%)</span>
                </div>
                <div style={{ height: 8, background: C.surface, borderRadius: 4, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${pct}%`, background: typeColors[t.type], borderRadius: 4, transition: "width 0.4s ease" }} />
                </div>
              </div>
            );
          })}
        </div>

        {/* Room Status */}
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: 24 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: C.text, marginBottom: 4 }}>Room Status</div>
          <div style={{ fontSize: 12, color: C.muted, marginBottom: 16 }}>Current occupancy</div>
          {summary.roomStatus?.map((r, i) => {
            const pct = summary.totalRooms > 0 ? ((r.count / summary.totalRooms) * 100).toFixed(0) : 0;
            return (
              <div key={i} style={{ marginBottom: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 5 }}>
                  <span style={{ color: C.text }}>{r.label}</span>
                  <span style={{ color: roomColors[r.label], fontWeight: 700 }}>{r.count} ({pct}%)</span>
                </div>
                <div style={{ height: 8, background: C.surface, borderRadius: 4, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${pct}%`, background: roomColors[r.label], borderRadius: 4, transition: "width 0.4s ease" }} />
                </div>
              </div>
            );
          })}

          {/* Online vs Offline */}
          <div style={{ marginTop: 20, borderTop: `1px solid ${C.border}`, paddingTop: 16 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: C.text, marginBottom: 10 }}>Order Source</div>
            {summary.sourceBreakdown?.map((s, i) => {
              const pct = totalTypeCount > 0 ? ((s.count / totalTypeCount) * 100).toFixed(0) : 0;
              const col = s.source === 'Online' ? C.purple : C.green;
              return (
                <div key={i} style={{ marginBottom: 10 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 4 }}>
                    <span style={{ color: C.muted }}>{s.source}</span>
                    <span style={{ color: col, fontWeight: 700 }}>{s.count}</span>
                  </div>
                  <div style={{ height: 6, background: C.surface, borderRadius: 3, overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${pct}%`, background: col, borderRadius: 3 }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

// ── Billing (static for now) ──────────────────────────────────────────────────
const Billing = () => {
  const items = [{ name: "Paneer Tikka", qty: 2, price: 280 }, { name: "Naan", qty: 3, price: 45 }, { name: "Butter Chicken", qty: 1, price: 340 }];
  const subtotal = items.reduce((s, i) => s + i.qty * i.price, 0);
  const gst = Math.round(subtotal * 0.05);
  const total = subtotal + gst;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <SectionTitle title="Billing & Invoicing" sub="GST-compliant billing" />
      <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, flex: 2, minWidth: 280, overflow: "hidden" }}>
          <div style={{ background: C.surface, padding: "16px 20px", borderBottom: `1px solid ${C.border}` }}>
            <div style={{ fontWeight: 800, fontSize: 16, color: C.text }}>Invoice #INV-001</div>
          </div>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead style={{ background: C.surface }}><TableRow header cells={["Item", "Qty", "Rate", "Amount"]} /></thead>
            <tbody>{items.map((item, i) => <TableRow key={i} cells={[item.name, item.qty, `₹${item.price}`, `₹${item.qty * item.price}`]} />)}</tbody>
          </table>
          <div style={{ padding: "16px 20px", borderTop: `1px solid ${C.border}` }}>
            {[["Subtotal", `₹${subtotal}`], ["GST 5%", `₹${gst}`]].map(([l, v]) => (
              <div key={l} style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: C.muted, marginBottom: 6 }}><span>{l}</span><span>{v}</span></div>
            ))}
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 18, fontWeight: 800, color: C.accent, marginTop: 10, paddingTop: 10, borderTop: `1px solid ${C.border}` }}>
              <span>Total</span><span>₹{total}</span>
            </div>
          </div>
        </div>
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, flex: 1, minWidth: 200, padding: 24, display: "flex", flexDirection: "column", gap: 14 }}>
          <div style={{ fontWeight: 700, fontSize: 15, color: C.text }}>Accept Payment</div>
          <div style={{ fontSize: 28, fontWeight: 800, color: C.accent, fontFamily: "monospace" }}>₹{total}</div>
          {[["Cash", C.green], ["Card", C.blue], ["UPI", C.purple]].map(([m, c]) => (
            <button key={m} style={{ background: c + "18", border: `1.5px solid ${c}44`, color: c, borderRadius: 10, padding: "10px 16px", fontWeight: 700, fontSize: 13, cursor: "pointer", textAlign: "left" }}>{m}</button>
          ))}
          <Btn label="Print Receipt" icon="check" color={C.green} onClick={() => alert("Receipt printed!")} />
        </div>
      </div>
    </div>
  );
};

const OnlineOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [showReceipt, setShowReceipt] = useState(null);
  const [formItems, setFormItems] = useState([{ name: "", qty: 1, price: "" }]);
  const [formType, setFormType] = useState("Dine-in");
  const [formRef, setFormRef] = useState("");

  const stColor = {
    New: C.blue, Preparing: C.accent, Ready: C.green,
    Delivered: C.purple, Billed: C.muted
  };

  const fetchOrders = () =>
    api.get("/orders").then(r => { setOrders(r.data); setLoading(false); }).catch(() => setLoading(false));

  useEffect(() => {
    fetchOrders();
    const iv = setInterval(() => api.get("/orders").then(r => setOrders(r.data)).catch(() => {}), 10000);
    return () => clearInterval(iv);
  }, []);

  const handleStatus = async (id, status) => {
    try {
      await api.patch(`/orders/${id}/status`, { status });
      setOrders(orders.map(o => o.id === id ? { ...o, status } : o));
    } catch { alert("Failed to update"); }
  };

  const subtotal = formItems.reduce((s, i) => s + (parseFloat(i.price) || 0) * (parseInt(i.qty) || 0), 0);
  const gst = subtotal * 0.05;
  const grandTotal = subtotal + gst;

  const addItem = () => setFormItems([...formItems, { name: "", qty: 1, price: "" }]);
  const removeItem = i => setFormItems(formItems.filter((_, idx) => idx !== i));
  const updateItem = (i, field, val) => setFormItems(formItems.map((it, idx) => idx === i ? { ...it, [field]: val } : it));

  const createOfflineOrder = async () => {
    try {
      const payload = {
        type: formType,
        source: "Offline",
        tableRef: formRef || "Walk-in",
        items: formItems.map(i => ({
          name: i.name, quantity: parseInt(i.qty), price: parseFloat(i.price)
        })),
        total: grandTotal
      };
      const res = await api.post("/orders", payload);
      setOrders([res.data, ...orders]);
      setShowReceipt({ order: res.data, items: formItems, subtotal, gst, grandTotal, ref: formRef });
      setShowForm(false);
      setFormItems([{ name: "", qty: 1, price: "" }]);
      setFormRef("");
    } catch { alert("Failed to create order"); }
  };

  const printReceipt = () => window.print();

  if (loading) return <div style={{ color: C.muted, padding: 40, textAlign: "center" }}>Loading orders...</div>;

  // ── Receipt Modal ──────────────────────────────────────────────
  if (showReceipt) {
    const { order, items, subtotal: sub, gst: g, grandTotal: gt, ref } = showReceipt;
    return (
      <div style={{ display: "flex", justifyContent: "center" }}>
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: 32, width: 360, fontFamily: "monospace" }}>
          <div style={{ textAlign: "center", marginBottom: 16 }}>
            <div style={{ fontSize: 20, fontWeight: 700, color: C.text }}>DineDesk</div>
            <div style={{ fontSize: 12, color: C.muted }}>{new Date().toLocaleString()}</div>
          </div>
          <div style={{ borderTop: `1px dashed ${C.border}`, margin: "12px 0" }} />
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 4 }}>
            <span style={{ color: C.muted }}>Order #</span><span style={{ color: C.accent, fontWeight: 700 }}>{order.id}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 4 }}>
            <span style={{ color: C.muted }}>Type</span><span>{order.type}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 4 }}>
            <span style={{ color: C.muted }}>Ref</span><span>{ref || "Walk-in"}</span>
          </div>
          <div style={{ borderTop: `1px dashed ${C.border}`, margin: "12px 0" }} />
          {items.map((it, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 6 }}>
              <span>{it.name} x{it.qty}</span>
              <span>₹{(parseFloat(it.price) * parseInt(it.qty)).toFixed(2)}</span>
            </div>
          ))}
          <div style={{ borderTop: `1px dashed ${C.border}`, margin: "12px 0" }} />
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 4 }}>
            <span style={{ color: C.muted }}>Subtotal</span><span>₹{sub.toFixed(2)}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 4 }}>
            <span style={{ color: C.muted }}>GST (5%)</span><span>₹{g.toFixed(2)}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 15, fontWeight: 700, marginTop: 8 }}>
            <span>TOTAL</span><span style={{ color: C.accent }}>₹{gt.toFixed(2)}</span>
          </div>
          <div style={{ borderTop: `1px dashed ${C.border}`, margin: "12px 0" }} />
          <div style={{ textAlign: "center", fontSize: 12, color: C.muted }}>Thank you for dining with us!</div>
          <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
            <Btn label="← Back" outline color={C.muted} onClick={() => setShowReceipt(null)} />
            <Btn label="Print Receipt" color={C.accent} onClick={printReceipt} />
          </div>
        </div>
      </div>
    );
  }

  // ── Offline Order Form ─────────────────────────────────────────
  if (showForm) return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <Btn label="← Back" small outline color={C.muted} onClick={() => setShowForm(false)} />
        <SectionTitle title="New Offline Order" sub="Walk-in, dine-in, or takeaway" />
      </div>
      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: 24 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
          <div>
            <div style={{ fontSize: 12, color: C.muted, marginBottom: 6 }}>ORDER TYPE</div>
            <select value={formType} onChange={e => setFormType(e.target.value)}
              style={{ width: "100%", background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, color: C.text, padding: "8px 12px", fontSize: 13 }}>
              <option>Dine-in</option><option>Takeaway</option><option>Delivery</option>
            </select>
          </div>
          <div>
            <div style={{ fontSize: 12, color: C.muted, marginBottom: 6 }}>TABLE / CUSTOMER</div>
            <input value={formRef} onChange={e => setFormRef(e.target.value)} placeholder="Table 4 or Name"
              style={{ width: "100%", background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, color: C.text, padding: "8px 12px", fontSize: 13 }} />
          </div>
        </div>

        <div style={{ fontSize: 12, color: C.muted, marginBottom: 10 }}>ITEMS</div>
        {formItems.map((it, i) => (
          <div key={i} style={{ display: "flex", gap: 10, marginBottom: 10, alignItems: "center" }}>
            <input placeholder="Item name" value={it.name} onChange={e => updateItem(i, "name", e.target.value)}
              style={{ flex: 2, background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, color: C.text, padding: "8px 10px", fontSize: 13 }} />
            <input placeholder="Qty" type="number" min="1" value={it.qty} onChange={e => updateItem(i, "qty", e.target.value)}
              style={{ flex: 0.5, background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, color: C.text, padding: "8px 10px", fontSize: 13 }} />
            <input placeholder="₹ Price" type="number" value={it.price} onChange={e => updateItem(i, "price", e.target.value)}
              style={{ flex: 1, background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, color: C.text, padding: "8px 10px", fontSize: 13 }} />
            {formItems.length > 1 && <Btn label="✕" small outline color={C.red} onClick={() => removeItem(i)} />}
          </div>
        ))}
        <Btn label="+ Add Item" small outline color={C.accent} onClick={addItem} />

        <div style={{ borderTop: `1px solid ${C.border}`, marginTop: 20, paddingTop: 16, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontSize: 13, color: C.muted }}>Subtotal: ₹{subtotal.toFixed(2)}</div>
            <div style={{ fontSize: 13, color: C.muted }}>GST (5%): ₹{gst.toFixed(2)}</div>
            <div style={{ fontSize: 16, fontWeight: 700, color: C.accent, marginTop: 4 }}>Total: ₹{grandTotal.toFixed(2)}</div>
          </div>
          <Btn label="Create + Print Receipt" color={C.accent} onClick={createOfflineOrder} />
        </div>
      </div>
    </div>
  );

  // ── Orders Table ───────────────────────────────────────────────
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <SectionTitle title="Online Orders" sub="Live orders — auto-refreshes every 10 seconds" />
        <Btn label="+ New Offline Order" color={C.accent} onClick={() => setShowForm(true)} />
      </div>
      <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
        <StatCard label="New" value={orders.filter(o => o.status === "New").length} icon="orders" color={C.blue} />
        <StatCard label="Preparing" value={orders.filter(o => o.status === "Preparing").length} icon="orders" color={C.accent} />
        <StatCard label="Total Today" value={orders.length} icon="trend_up" color={C.green} />
      </div>
      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, overflow: "hidden" }}>
        {orders.length === 0
          ? <div style={{ padding: 40, textAlign: "center", color: C.muted }}>No orders yet.</div>
          : <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead style={{ background: C.surface }}>
                <TableRow header cells={["ID", "Type", "Source", "Total", "Status", "Actions"]} />
              </thead>
              <tbody>
                {orders.map(o => (
                  <TableRow key={o.id} cells={[
                    <span style={{ color: C.accent, fontWeight: 700 }}>#{o.id}</span>,
                    o.type, o.source,
                    <span style={{ fontFamily: "monospace", color: C.accent }}>₹{o.total}</span>,
                    <Badge label={o.status} color={stColor[o.status] || C.muted} />,
                    <div style={{ display: "flex", gap: 6 }}>
                      {o.status === "New" && <Btn label="Accept" small color={C.green} onClick={() => handleStatus(o.id, "Preparing")} />}
                      {o.status === "Preparing" && <Btn label="Ready" small color={C.accent} onClick={() => handleStatus(o.id, "Ready")} />}
                      <Btn label="Receipt" small outline color={C.muted} onClick={() => setShowReceipt({ order: o, items: o.OrderItem || [], subtotal: o.total * 0.952, gst: o.total * 0.048, grandTotal: o.total, ref: o.tableRef })} />
                    </div>
                  ]} />
                ))}
              </tbody>
            </table>
        }
      </div>
    </div>
  );
};

// ── Sidebar & App Shell ───────────────────────────────────────────────────────
const MODULES = [
  { id: "dashboard", label: "Dashboard", icon: "dashboard" },
  { id: "restaurant", label: "Restaurant", icon: "restaurant" },
  { id: "hotel", label: "Hotel", icon: "hotel" },
  { id: "booking", label: "Booking", icon: "booking" },
  { id: "billing", label: "Billing", icon: "billing" },
  { id: "inventory", label: "Inventory", icon: "inventory" },
  { id: "staff", label: "Staff", icon: "staff" },
  { id: "orders", label: "Online Orders", icon: "orders" },
  { id: "reports", label: "Reports", icon: "reports" },
];

export default function DineDesk() {
  const [active, setActive] = useState("dashboard");
 const [notifications, setNotifications] = useState([]);
 const [, setShowNotifications] = useState(false);
 const [unreadCount, setUnreadCount] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [user, setUser] = useState(() => {
    const u = localStorage.getItem("user");
    return u ? JSON.parse(u) : null;
  });

 useEffect(() => {
  const socket = io('http://localhost:4000');
  
  socket.on('connect', () => {
    console.log('Connected to server!');
  });

  socket.on('new_notification', (notification) => {
    setNotifications(prev => [notification, ...prev].slice(0, 20));
    setUnreadCount(prev => prev + 1);
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.connect(g);
      g.connect(ctx.destination);
      o.frequency.value = 880;
      g.gain.value = 0.1;
      o.start();
      o.stop(ctx.currentTime + 0.15);
    } catch {}
  });

  return () => socket.disconnect();
}, []);
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  if (!user) return <Login onLogin={setUser} />;

  const content = {
    dashboard: <Dashboard />, restaurant: <RestaurantMgmt />, hotel: <HotelMgmt />,
    booking: <Booking />, billing: <Billing />, inventory: <Inventory />,
    staff: <StaffMgmt />, orders: <OnlineOrders />, reports: <Reports />,
  };

  return (
    <div style={{ display: "flex", height: "100vh", background: C.bg, color: C.text, fontFamily: "'DM Sans', 'Segoe UI', sans-serif", overflow: "hidden" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800;900&family=DM+Mono:wght@400;500&display=swap'); * { box-sizing: border-box; } ::-webkit-scrollbar { width: 5px; } ::-webkit-scrollbar-thumb { background: #252A3A; border-radius: 10px; } body { margin: 0; }`}</style>

      {isMobile && sidebarOpen && <div onClick={() => setSidebarOpen(false)} style={{ position: "fixed", inset: 0, background: "#00000088", zIndex: 99 }} />}

      {/* Sidebar */}
      <div style={{ width: 220, background: C.surface, borderRight: `1px solid ${C.border}`, display: "flex", flexDirection: "column", height: "100vh", position: isMobile ? "fixed" : "relative", zIndex: 100, top: 0, left: 0, transition: "transform .25s", transform: isMobile && !sidebarOpen ? "translateX(-100%)" : "translateX(0)" }}>
        <div style={{ padding: "22px 20px 18px", borderBottom: `1px solid ${C.border}` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 34, height: 34, background: C.accent, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Icon name="restaurant" size={18} color="#000" />
            </div>
            <div>
              <div style={{ fontWeight: 900, fontSize: 18, color: C.text, letterSpacing: -0.5 }}>DineDesk</div>
              <div style={{ fontSize: 10, color: C.muted, letterSpacing: 1 }}>MULTI-MANAGEMENT</div>
            </div>
          </div>
        </div>
        <nav style={{ flex: 1, padding: "14px 10px", overflowY: "auto", display: "flex", flexDirection: "column", gap: 2 }}>
          {MODULES.map(m => {
            const isActive = active === m.id;
            return (
              <button key={m.id} onClick={() => { setActive(m.id); setSidebarOpen(false); }} style={{ background: isActive ? C.accentSoft : "transparent", border: isActive ? `1px solid ${C.accent}33` : "1px solid transparent", borderRadius: 10, padding: "10px 14px", display: "flex", alignItems: "center", gap: 12, cursor: "pointer", width: "100%", textAlign: "left" }}>
                <Icon name={m.icon} size={17} color={isActive ? C.accent : C.muted} />
                <span style={{ fontSize: 13, fontWeight: isActive ? 700 : 500, color: isActive ? C.accent : C.mutedLight }}>{m.label}</span>
              </button>
            );
          })}
        </nav>
        <div style={{ padding: "14px 16px", borderTop: `1px solid ${C.border}` }}>
          <div style={{ fontSize: 12, color: C.muted, marginBottom: 8 }}>👤 {user.name} · {user.role}</div>
          <button onClick={handleLogout} style={{ background: C.redSoft, border: `1px solid ${C.red}33`, borderRadius: 8, padding: "8px 12px", color: C.red, fontSize: 12, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: 6, width: "100%" }}>
            <Icon name="logout" size={14} color={C.red} /> Sign Out
          </button>
        </div>
      </div>

      {/* Main */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <div style={{ height: 60, background: C.surface, borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", padding: "0 20px", gap: 16, flexShrink: 0 }}>
          {isMobile && (
            <button onClick={() => setSidebarOpen(true)} style={{ background: "none", border: "none", cursor: "pointer", display: "flex" }}>
              <Icon name="menu" size={22} color={C.text} />
            </button>
          )}
          <div style={{ flex: 1, fontSize: 15, fontWeight: 700, color: C.text }}>
            {MODULES.find(m => m.id === active)?.label}
          </div>
          {/* Notification Bell */}
<div style={{ position: "relative" }}>
  <button onClick={() => { setShowNotifications(!setShowNotifications); setUnreadCount(0); }}
    style={{ background: "none", border: "none", cursor: "pointer", color: C.text, display: "flex", position: "relative", padding: 4 }}>
    <Icon name="notification" size={22} color={unreadCount > 0 ? C.accent : C.muted} />
    {unreadCount > 0 && (
      <span style={{ position: "absolute", top: -2, right: -2, background: C.red, color: "#fff", borderRadius: "50%", width: 18, height: 18, fontSize: 10, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center" }}>
        {unreadCount > 9 ? "9+" : unreadCount}
      </span>
    )}
  </button>
  {setShowNotifications && (
    <div style={{ position: "absolute", right: 0, top: 40, width: 320, background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, boxShadow: "0 8px 32px #00000033", zIndex: 200, overflow: "hidden" }}>
      <div style={{ padding: "14px 16px", borderBottom: `1px solid ${C.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontWeight: 700, fontSize: 14, color: C.text }}>Notifications</span>
        <button onClick={() => notifications([])} style={{ background: "none", border: "none", fontSize: 11, color: C.muted, cursor: "pointer" }}>Clear all</button>
      </div>
      <div style={{ maxHeight: 360, overflowY: "auto" }}>
        {notifications.length === 0 ? (
          <div style={{ padding: 32, textAlign: "center", color: C.muted, fontSize: 13 }}>No notifications yet</div>
        ) : notifications.map(n => (
          <div key={n.id} style={{ padding: "12px 16px", borderBottom: `1px solid ${C.border}`, display: "flex", gap: 12, alignItems: "flex-start" }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: n.color, marginTop: 5, flexShrink: 0 }} />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: C.text }}>{n.title}</div>
              <div style={{ fontSize: 12, color: C.muted, marginTop: 2 }}>{n.message}</div>
              <div style={{ fontSize: 11, color: C.muted, marginTop: 4 }}>{n.time}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )}
</div>
          <div style={{ width: 34, height: 34, borderRadius: "50%", background: C.accent, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 13, color: "#000" }}>
            {user.name?.charAt(0).toUpperCase()}
          </div>
        </div>
        <div style={{ flex: 1, overflowY: "auto", padding: isMobile ? 16 : 28 }}>
          {content[active]}
        </div>
      </div>
    </div>
  );
}