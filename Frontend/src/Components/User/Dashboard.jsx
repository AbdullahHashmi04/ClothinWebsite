import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import CartContext from "../Context/CartContext";
// ─── Design tokens matching the purple admin panel brand ──────────────────────
const C = {
  brand: "#7C3AED",
  brandLight: "#EDE9FE",
  brandMid: "#A78BFA",
  brandDark: "#5B21B6",
  accent: "#F59E0B",
  accentLight: "#FEF3C7",
  danger: "#EF4444",
  dangerLight: "#FEE2E2",
  success: "#10B981",
  successLight: "#D1FAE5",
  bg: "#F8F7FF",
  sidebar: "#FFFFFF",
  card: "#FFFFFF",
  text: "#1F1535",
  muted: "#6B7280",
  border: "#E9E4FF",
  borderLight: "#F3F0FF",
};

// ─── Mock Data ────────────────────────────────────────────────────────────────
const ORDERS = [
  { id: "#A8F21C", date: "Feb 14, 2026", status: "Delivered", items: 3, total: "$124.00", product: "Wireless Headphones" },
  { id: "#B3D90E", date: "Feb 08, 2026", status: "Shipped", items: 1, total: "$89.99", product: "Mechanical Keyboard" },
  { id: "#C7E45A", date: "Jan 29, 2026", status: "Processing", items: 2, total: "$210.50", product: "Smart Watch + Strap" },
  { id: "#D1F033", date: "Jan 15, 2026", status: "Delivered", items: 1, total: "$44.00", product: "USB-C Hub" },
  { id: "#E9A22B", date: "Jan 03, 2026", status: "Returned", items: 1, total: "$79.00", product: "Bluetooth Speaker" },
];

const WISHLIST = [
  { id: 1, name: "AirPods Pro Max", price: "$549.00", oldPrice: "$599.00", img: "🎧", stock: true },
  { id: 2, name: "iPad Air M2", price: "$699.00", oldPrice: null, img: "📱", stock: true },
  { id: 3, name: "Sony WH-1000XM5", price: "$299.00", oldPrice: "$349.00", img: "🎵", stock: false },
  { id: 4, name: "Logitech MX Keys", price: "$119.00", oldPrice: null, img: "⌨️", stock: true },
];

const CART = [
  { id: 1, name: "Samsung 27\" Monitor", qty: 1, price: "$389.00", img: "🖥️" },
  { id: 2, name: "Desk Lamp Pro", qty: 2, price: "$45.00", img: "💡" },
  { id: 3, name: "Cable Management Kit", qty: 1, price: "$22.00", img: "🔌" },
];

const COUPONS = [
  { code: "SAVE15", desc: "15% off your next order", exp: "Mar 31, 2026", type: "percent" },
  { code: "FREESHIP", desc: "Free shipping on any order", exp: "Feb 28, 2026", type: "shipping" },
  { code: "LOYAL50", desc: "$50 loyalty reward credit", exp: "Apr 15, 2026", type: "credit" },
];

const ADDRESSES = [
  { id: 1, label: "Home", name: "Naeem Akhtar", line1: "24 Green Valley Road", line2: "Rawalpindi, Punjab 46000", phone: "+92 300 1234567", default: true },
  { id: 2, label: "Office", name: "Naeem Akhtar", line1: "10 Business Square, F-6", line2: "Islamabad, ICT 44000", phone: "+92 321 7654321", default: false },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
const statusColor = (s) => ({
  Delivered: { bg: C.successLight, color: C.success },
  Shipped: { bg: "#DBEAFE", color: "#2563EB" },
  Processing: { bg: C.accentLight, color: C.accent },
  Returned: { bg: C.dangerLight, color: C.danger },
}[s] || { bg: C.borderLight, color: C.muted });

// ─── Sub-components ───────────────────────────────────────────────────────────

function Badge({ label, ...style }) {
  return (
    <span style={{ fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 20, letterSpacing: "0.03em", ...style }}>
      {label}
    </span>
  );
}

function Card({ children, style = {} }) {
  return (
    <div style={{ background: C.card, borderRadius: 16, border: `1px solid ${C.border}`, padding: "24px", boxShadow: "0 2px 12px rgba(124,58,237,0.06)", ...style }}>
      {children}
    </div>
  );
}

function SectionTitle({ children, action }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
      <h2 style={{ margin: 0, fontSize: 17, fontWeight: 700, color: C.text, fontFamily: "'Sora', sans-serif" }}>{children}</h2>
      {action}
    </div>
  );
}

function Btn({ children, variant = "primary", onClick, style = {}, small = false }) {
  const base = {
    display: "inline-flex", alignItems: "center", gap: 6,
    border: "none", borderRadius: 10, cursor: "pointer",
    fontFamily: "'DM Sans', sans-serif", fontWeight: 600,
    fontSize: small ? 12 : 13, padding: small ? "6px 14px" : "10px 20px",
    transition: "all 0.17s ease", ...style,
  };
  const variants = {
    primary: { background: C.brand, color: "#fff" },
    outline: { background: "transparent", color: C.brand, border: `1.5px solid ${C.brand}` },
    ghost: { background: C.brandLight, color: C.brand },
    danger: { background: C.dangerLight, color: C.danger },
    success: { background: C.successLight, color: C.success },
  };
  return <button onClick={onClick} style={{ ...base, ...variants[variant] }}>{children}</button>;
}

// ─── Sections ────────────────────────────────────────────────────────────────

function ProfileSection() {
  const [editing, setEditing] = useState(false);
  const { user } = useContext(CartContext)
  const [form, setForm] = useState({ Username: user.Username, email: user.Email, phone: "+92 300 1234567", dob: "1995-06-15", gender: "Male" });

  const Field = ({ label, k, type = "text" }) => (
    <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
      <label style={{ fontSize: 12, fontWeight: 600, color: C.muted, textTransform: "uppercase", letterSpacing: "0.05em" }}>{label}</label>
      {editing ? (
        <input
          type={type} value={form[k]}
          onChange={(e) => setForm({ ...form, [k]: e.target.value })}
          style={{ padding: "10px 14px", borderRadius: 10, border: `1.5px solid ${C.brand}`, fontSize: 14, color: C.text, outline: "none", fontFamily: "'DM Sans',sans-serif" }}
        />
      ) : (
        <div style={{ padding: "10px 0", fontSize: 14, fontWeight: 500, color: C.text, borderBottom: `1px solid ${C.borderLight}` }}>{form[k]}</div>
      )}
    </div>
  );

  return (
    <Card>
      <SectionTitle action={<Btn variant={editing ? "primary" : "ghost"} small onClick={() => setEditing(!editing)}>{editing ? "✓ Save" : "✏️ Edit"}</Btn>}>
        My Profile
      </SectionTitle>

      {/* Avatar row */}
      <div style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 28, padding: "18px 20px", background: C.brandLight, borderRadius: 14 }}>
        <div style={{
          width: 72, height: 72, borderRadius: "50%",
          background: `linear-gradient(135deg, ${C.brand}, ${C.brandMid})`,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 28, fontWeight: 700, color: "#fff", fontFamily: "'Sora',sans-serif",
          boxShadow: `0 4px 16px rgba(124,58,237,0.35)`,
          flexShrink: 0,
        }}>{user.picture ? <img src={user.picture} alt={user.Username} style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <div>NA</div>}</div>
        <div>
          <div style={{ fontWeight: 700, fontSize: 18, color: C.text, fontFamily: "'Sora',sans-serif" }}>{user.Username}</div>
          {/* <div style={{ fontSize: 13, color: C.muted, marginTop: 2 }}>Member since Jan 2024</div> */}
          <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
            <Badge label="Gold Member" bg={C.accentLight} color={C.accent} />
            <Badge label="Verified ✓" bg={C.successLight} color={C.success} />
          </div>
        </div>
        {editing && <Btn variant="outline" small style={{ marginLeft: "auto" }}>📷 Change Photo</Btn>}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "18px 24px" }}>
        <Field label="Username" k="Username" />
        {/* <Field label="Last Name" k="lastName" /> */}
        <Field label="Email" k="email" type="email" />
        <Field label="Phone" k="phone" type="tel" />
        <Field label="Date of Birth" k="dob" type="date" />
        <Field label="Gender" k="gender" />
      </div>
    </Card >
  );
}

function OrdersSection() {
  const [expandedId, setExpandedId] = useState(null);
  const [filter, setFilter] = useState("All");
  const statuses = ["All", "Delivered", "Shipped", "Processing", "Returned"];

  const filtered = filter === "All" ? ORDERS : ORDERS.filter(o => o.status === filter);

  return (
    <Card>
      <SectionTitle>Track Orders</SectionTitle>

      {/* Filter pills */}
      <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
        {statuses.map(s => (
          <button key={s} onClick={() => setFilter(s)} style={{
            padding: "6px 16px", borderRadius: 20, fontSize: 12, fontWeight: 600, cursor: "pointer",
            border: "none", transition: "all 0.15s",
            background: filter === s ? C.brand : C.borderLight,
            color: filter === s ? "#fff" : C.muted,
            fontFamily: "'DM Sans',sans-serif",
          }}>{s}</button>
        ))}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {filtered.map(order => {
          const sc = statusColor(order.status);
          const expanded = expandedId === order.id;
          return (
            <div key={order.id} style={{ border: `1px solid ${C.border}`, borderRadius: 12, overflow: "hidden", transition: "box-shadow 0.15s" }}>
              <div
                onClick={() => setExpandedId(expanded ? null : order.id)}
                style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 16px", cursor: "pointer", background: expanded ? C.borderLight : "#fff" }}
              >
                <div style={{ width: 36, height: 36, borderRadius: 10, background: C.brandLight, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>📦</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: 13, color: C.text }}>{order.id}</div>
                  <div style={{ fontSize: 12, color: C.muted, marginTop: 1 }}>{order.product} · {order.date}</div>
                </div>
                <Badge label={order.status} {...sc} />
                <div style={{ fontWeight: 700, fontSize: 14, color: C.text }}>{order.total}</div>
                <span style={{ color: C.brand, fontSize: 12, marginLeft: 4 }}>{expanded ? "▲" : "▼"}</span>
              </div>

              {expanded && (
                <div style={{ padding: "14px 16px 16px", borderTop: `1px solid ${C.border}`, background: C.borderLight }}>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: 14 }}>
                    {[["Items", order.items], ["Total", order.total], ["Date", order.date]].map(([k, v]) => (
                      <div key={k} style={{ background: "#fff", padding: "10px 14px", borderRadius: 10, border: `1px solid ${C.border}` }}>
                        <div style={{ fontSize: 11, color: C.muted, fontWeight: 600, textTransform: "uppercase" }}>{k}</div>
                        <div style={{ fontSize: 15, fontWeight: 700, color: C.text, marginTop: 2 }}>{v}</div>
                      </div>
                    ))}
                  </div>

                  {/* Progress bar for active orders */}
                  {order.status !== "Returned" && (
                    <div style={{ marginBottom: 14 }}>
                      <div style={{ fontSize: 12, color: C.muted, marginBottom: 6, fontWeight: 600 }}>Order Progress</div>
                      <div style={{ display: "flex", alignItems: "center", gap: 0 }}>
                        {["Placed", "Processing", "Shipped", "Delivered"].map((step, i) => {
                          const stepIdx = { Placed: 0, Processing: 1, Shipped: 2, Delivered: 3 };
                          const currentIdx = stepIdx[order.status] ?? 0;
                          const done = i <= currentIdx;
                          return (
                            <div key={step} style={{ display: "flex", alignItems: "center", flex: i < 3 ? 1 : "none" }}>
                              <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                                <div style={{ width: 24, height: 24, borderRadius: "50%", background: done ? C.brand : C.border, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, color: done ? "#fff" : C.muted, fontWeight: 700, transition: "all 0.3s" }}>
                                  {done ? "✓" : i + 1}
                                </div>
                                <div style={{ fontSize: 10, color: done ? C.brand : C.muted, marginTop: 3, fontWeight: done ? 600 : 400, whiteSpace: "nowrap" }}>{step}</div>
                              </div>
                              {i < 3 && <div style={{ flex: 1, height: 2, background: done && i < currentIdx ? C.brand : C.border, margin: "0 4px", marginBottom: 14, transition: "background 0.3s" }} />}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  <div style={{ display: "flex", gap: 8 }}>
                    <Btn variant="ghost" small>📋 View Invoice</Btn>
                    {order.status === "Delivered" && <Btn variant="outline" small>↩️ Return / Refund</Btn>}
                    {order.status === "Shipped" && <Btn variant="outline" small>🚚 Track Shipment</Btn>}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </Card>
  );
}

function ReturnsSection() {
  const [step, setStep] = useState(0);
  const [selected, setSelected] = useState(null);
  const [reason, setReason] = useState("");
  const reasons = ["Item damaged", "Wrong item received", "Changed my mind", "Item not as described", "Other"];

  return (
    <Card>
      <SectionTitle>Returns & Refunds</SectionTitle>

      {step === 0 && (
        <>
          <p style={{ fontSize: 14, color: C.muted, margin: "0 0 18px" }}>Select a delivered order to initiate a return or refund request.</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {ORDERS.filter(o => o.status === "Delivered").map(order => (
              <div key={order.id} onClick={() => { setSelected(order); setStep(1); }}
                style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 16px", border: `1.5px solid ${C.border}`, borderRadius: 12, cursor: "pointer", transition: "border-color 0.15s, background 0.15s" }}
                onMouseEnter={e => e.currentTarget.style.borderColor = C.brand}
                onMouseLeave={e => e.currentTarget.style.borderColor = C.border}
              >
                <div style={{ fontSize: 22 }}>📦</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: 13, color: C.text }}>{order.product}</div>
                  <div style={{ fontSize: 12, color: C.muted }}>{order.id} · {order.date}</div>
                </div>
                <div style={{ fontWeight: 700, color: C.text }}>{order.total}</div>
                <span style={{ color: C.brand }}>→</span>
              </div>
            ))}
          </div>

          {/* Past returns */}
          <div style={{ marginTop: 24, padding: "16px", background: C.dangerLight, borderRadius: 12 }}>
            <div style={{ fontWeight: 700, fontSize: 13, color: C.danger, marginBottom: 8 }}>Past Return · #E9A22B</div>
            <div style={{ fontSize: 13, color: C.text }}>Bluetooth Speaker — Refund of $79.00 processed on Jan 20, 2026</div>
            <Badge label="Refunded ✓" bg={C.successLight} color={C.success} style={{ marginTop: 8, display: "inline-flex" }} />
          </div>
        </>
      )}

      {step === 1 && selected && (
        <>
          <div style={{ padding: "12px 16px", background: C.brandLight, borderRadius: 10, marginBottom: 18, display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 20 }}>📦</span>
            <div>
              <div style={{ fontWeight: 700, fontSize: 13, color: C.text }}>{selected.product}</div>
              <div style={{ fontSize: 12, color: C.muted }}>{selected.id} · {selected.total}</div>
            </div>
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 12, fontWeight: 600, color: C.muted, textTransform: "uppercase", letterSpacing: "0.05em", display: "block", marginBottom: 8 }}>Reason for return</label>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {reasons.map(r => (
                <label key={r} style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer", padding: "10px 14px", borderRadius: 10, border: `1.5px solid ${reason === r ? C.brand : C.border}`, background: reason === r ? C.brandLight : "#fff", transition: "all 0.15s" }}>
                  <input type="radio" name="reason" checked={reason === r} onChange={() => setReason(r)} style={{ accentColor: C.brand }} />
                  <span style={{ fontSize: 14, color: C.text }}>{r}</span>
                </label>
              ))}
            </div>
          </div>

          <div style={{ display: "flex", gap: 10 }}>
            <Btn variant="ghost" onClick={() => setStep(0)} small>← Back</Btn>
            <Btn variant="primary" onClick={() => setStep(2)} small disabled={!reason}>Submit Request</Btn>
          </div>
        </>
      )}

      {step === 2 && (
        <div style={{ textAlign: "center", padding: "32px 20px" }}>
          <div style={{ fontSize: 52, marginBottom: 12 }}>✅</div>
          <div style={{ fontWeight: 700, fontSize: 17, color: C.text, fontFamily: "'Sora',sans-serif" }}>Return Request Submitted!</div>
          <div style={{ fontSize: 13, color: C.muted, marginTop: 6, marginBottom: 20 }}>We'll process your refund within 3–5 business days.</div>
          <Btn variant="ghost" onClick={() => { setStep(0); setSelected(null); setReason(""); }}>Start New Request</Btn>
        </div>
      )}
    </Card>
  );
}

function WishlistSection() {
  const [items, setItems] = useState(WISHLIST);
  const remove = (id) => setItems(items.filter(i => i.id !== id));

  return (
    <Card>
      <SectionTitle><span>❤️ Wishlist <span style={{ fontSize: 13, color: C.muted, fontWeight: 500 }}>({items.length} items)</span></span></SectionTitle>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 12 }}>
        {items.map(item => (
          <div key={item.id} style={{ border: `1px solid ${C.border}`, borderRadius: 14, padding: "16px", position: "relative", background: item.stock ? "#fff" : "#fafafa" }}>
            <button onClick={() => remove(item.id)} style={{ position: "absolute", top: 10, right: 10, background: "none", border: "none", cursor: "pointer", fontSize: 16, color: C.muted, lineHeight: 1 }}>×</button>
            <div style={{ fontSize: 36, marginBottom: 8 }}>{item.img}</div>
            <div style={{ fontWeight: 700, fontSize: 13, color: C.text, marginBottom: 4 }}>{item.name}</div>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 12 }}>
              <span style={{ fontWeight: 700, fontSize: 15, color: C.brand }}>{item.price}</span>
              {item.oldPrice && <span style={{ fontSize: 12, color: C.muted, textDecoration: "line-through" }}>{item.oldPrice}</span>}
            </div>
            {item.stock
              ? <Btn variant="primary" small style={{ width: "100%", justifyContent: "center" }}>🛒 Add to Cart</Btn>
              : <div style={{ fontSize: 12, fontWeight: 600, color: C.muted, textAlign: "center", padding: "6px 0" }}>Out of Stock — Notify Me</div>
            }
          </div>
        ))}
      </div>
    </Card>
  );
}

function CartSection() {
  const [cart, setCart] = useState(CART);
  const updateQty = (id, delta) => setCart(cart.map(i => i.id === id ? { ...i, qty: Math.max(1, i.qty + delta) } : i));
  const remove = (id) => setCart(cart.filter(i => i.id !== id));
  const subtotal = cart.reduce((acc, i) => acc + parseFloat(i.price.replace("$", "")) * i.qty, 0).toFixed(2);

  return (
    <Card>
      <SectionTitle><span>🛒 Saved Cart <span style={{ fontSize: 13, color: C.muted, fontWeight: 500 }}>({cart.length} items)</span></span></SectionTitle>
      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 20 }}>
        {cart.map(item => (
          <div key={item.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", border: `1px solid ${C.border}`, borderRadius: 12 }}>
            <div style={{ fontSize: 28, width: 44, height: 44, display: "flex", alignItems: "center", justifyContent: "center", background: C.borderLight, borderRadius: 10 }}>{item.img}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600, fontSize: 13, color: C.text }}>{item.name}</div>
              <div style={{ fontSize: 13, color: C.brand, fontWeight: 700, marginTop: 2 }}>{item.price}</div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <button onClick={() => updateQty(item.id, -1)} style={{ width: 26, height: 26, borderRadius: 8, border: `1px solid ${C.border}`, background: "#fff", cursor: "pointer", fontWeight: 700, color: C.text }}>−</button>
              <span style={{ fontSize: 14, fontWeight: 600, color: C.text, minWidth: 16, textAlign: "center" }}>{item.qty}</span>
              <button onClick={() => updateQty(item.id, 1)} style={{ width: 26, height: 26, borderRadius: 8, border: `1px solid ${C.border}`, background: "#fff", cursor: "pointer", fontWeight: 700, color: C.text }}>+</button>
            </div>
            <button onClick={() => remove(item.id)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 15, color: C.muted }}>🗑</button>
          </div>
        ))}
      </div>

      <div style={{ padding: "16px", background: C.borderLight, borderRadius: 12 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
          <span style={{ fontSize: 13, color: C.muted }}>Subtotal</span>
          <span style={{ fontSize: 15, fontWeight: 700, color: C.text }}>${subtotal}</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
          <span style={{ fontSize: 13, color: C.muted }}>Shipping</span>
          <span style={{ fontSize: 13, fontWeight: 600, color: C.success }}>Free</span>
        </div>
        <Btn variant="primary" style={{ width: "100%", justifyContent: "center", borderRadius: 12, padding: "13px 20px" }}>⚡ Checkout Now</Btn>
      </div>
    </Card>
  );
}

function LoyaltySection() {
  const points = 2840;
  const nextTier = 5000;
  const pct = Math.round((points / nextTier) * 100);

  return (
    <Card>
      <SectionTitle>Loyalty & Coupons</SectionTitle>

      {/* Points card */}
      <div style={{ background: `linear-gradient(135deg, ${C.brand} 0%, ${C.brandDark} 100%)`, borderRadius: 16, padding: "24px", marginBottom: 20, color: "#fff", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", right: -20, top: -20, width: 120, height: 120, borderRadius: "50%", background: "rgba(255,255,255,0.08)" }} />
        <div style={{ position: "absolute", right: 20, bottom: -30, width: 80, height: 80, borderRadius: "50%", background: "rgba(255,255,255,0.05)" }} />
        <div style={{ fontSize: 12, fontWeight: 600, opacity: 0.8, letterSpacing: "0.08em", textTransform: "uppercase" }}>Your Points</div>
        <div style={{ fontSize: 42, fontWeight: 800, fontFamily: "'Sora',sans-serif", margin: "4px 0 2px" }}>{points.toLocaleString()}</div>
        <div style={{ fontSize: 13, opacity: 0.75 }}>🏆 Gold Member · {nextTier - points} pts to Platinum</div>
        <div style={{ marginTop: 14, background: "rgba(255,255,255,0.2)", borderRadius: 8, height: 8, overflow: "hidden" }}>
          <div style={{ width: `${pct}%`, height: "100%", background: "#fff", borderRadius: 8, transition: "width 0.5s ease" }} />
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4, fontSize: 11, opacity: 0.7 }}>
          <span>{points} pts</span><span>{nextTier} pts</span>
        </div>
      </div>

      {/* Coupons */}
      <div style={{ fontWeight: 700, fontSize: 14, color: C.text, marginBottom: 12 }}>Available Coupons</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {COUPONS.map(c => {
          const icons = { percent: "🏷️", shipping: "🚚", credit: "💳" };
          const colors = { percent: { bg: C.accentLight, color: C.accent }, shipping: { bg: "#DBEAFE", color: "#2563EB" }, credit: { bg: C.brandLight, color: C.brand } };
          const col = colors[c.type];
          return (
            <div key={c.code} style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 16px", border: `1.5px dashed ${col.color}`, borderRadius: 12, background: col.bg }}>
              <div style={{ fontSize: 22 }}>{icons[c.type]}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: 14, color: col.color, fontFamily: "'Sora',sans-serif" }}>{c.code}</div>
                <div style={{ fontSize: 12, color: C.muted, marginTop: 1 }}>{c.desc}</div>
                <div style={{ fontSize: 11, color: C.muted, marginTop: 1 }}>Expires: {c.exp}</div>
              </div>
              <button style={{ background: col.color, color: "#fff", border: "none", borderRadius: 8, padding: "6px 14px", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans',sans-serif" }}>Copy</button>
            </div>
          );
        })}
      </div>
    </Card>
  );
}

function AddressSection() {
  const [addresses, setAddresses] = useState(ADDRESSES);
  const [adding, setAdding] = useState(false);

  return (
    <Card>
      <SectionTitle action={<Btn variant="ghost" small onClick={() => setAdding(!adding)}>{adding ? "✕ Cancel" : "+ Add Address"}</Btn>}>
        Addresses
      </SectionTitle>

      {adding && (
        <div style={{ padding: 18, background: C.brandLight, borderRadius: 12, marginBottom: 18 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
            {["Label", "Full Name", "Address Line 1", "City & ZIP", "Phone"].map(p => (
              <input key={p} placeholder={p} style={{ padding: "10px 14px", borderRadius: 10, border: `1.5px solid ${C.border}`, fontSize: 13, outline: "none", fontFamily: "'DM Sans',sans-serif", gridColumn: p === "Address Line 1" ? "1 / -1" : undefined }} />
            ))}
          </div>
          <Btn variant="primary" small onClick={() => setAdding(false)}>Save Address</Btn>
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {addresses.map(addr => (
          <div key={addr.id} style={{ padding: "16px", border: `1.5px solid ${addr.default ? C.brand : C.border}`, borderRadius: 14, background: addr.default ? C.brandLight : "#fff", position: "relative" }}>
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                  <span style={{ fontWeight: 700, fontSize: 14, color: C.text }}>{addr.label}</span>
                  {addr.default && <Badge label="Default" bg={C.brand} color="#fff" />}
                </div>
                <div style={{ fontSize: 13, color: C.text, fontWeight: 500 }}>{addr.name}</div>
                <div style={{ fontSize: 13, color: C.muted, marginTop: 2 }}>{addr.line1}</div>
                <div style={{ fontSize: 13, color: C.muted }}>{addr.line2}</div>
                <div style={{ fontSize: 13, color: C.muted, marginTop: 2 }}>📞 {addr.phone}</div>
              </div>
              <div style={{ display: "flex", gap: 6 }}>
                <Btn variant="ghost" small>✏️</Btn>
                {!addr.default && <Btn variant="danger" small onClick={() => setAddresses(addresses.filter(a => a.id !== addr.id))}>🗑</Btn>}
              </div>
            </div>
            {!addr.default && (
              <button onClick={() => setAddresses(addresses.map(a => ({ ...a, default: a.id === addr.id })))}
                style={{ marginTop: 10, fontSize: 12, color: C.brand, background: "none", border: "none", cursor: "pointer", fontWeight: 600, padding: 0, fontFamily: "'DM Sans',sans-serif" }}>
                Set as default →
              </button>
            )}
          </div>
        ))}
      </div>
    </Card>
  );
}

function CheckoutSection() {
  const [saved, setSaved] = useState({ card: true, upi: false, wallet: true });
  return (
    <Card>
      <SectionTitle>⚡ Faster Checkout</SectionTitle>
      <p style={{ fontSize: 14, color: C.muted, margin: "0 0 18px" }}>Saved payment methods for one-tap checkout.</p>
      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 20 }}>
        {[
          { key: "card", icon: "💳", label: "Visa ending in ••4892", sub: "Expires 08/27" },
          { key: "upi", icon: "📲", label: "UPI: naeem@okhdfc", sub: "Linked to HDFC Bank" },
          { key: "wallet", icon: "👜", label: "Store Wallet: $24.50", sub: "Available balance" },
        ].map(m => (
          <div key={m.key} style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 16px", border: `1.5px solid ${saved[m.key] ? C.brand : C.border}`, borderRadius: 12, background: saved[m.key] ? C.brandLight : "#fff", transition: "all 0.15s" }}>
            <div style={{ fontSize: 22 }}>{m.icon}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600, fontSize: 13, color: C.text }}>{m.label}</div>
              <div style={{ fontSize: 12, color: C.muted }}>{m.sub}</div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <label style={{ position: "relative", width: 40, height: 22, cursor: "pointer" }}>
                <input type="checkbox" checked={saved[m.key]} onChange={() => setSaved({ ...saved, [m.key]: !saved[m.key] })} style={{ opacity: 0, width: 0, height: 0 }} />
                <div style={{ position: "absolute", inset: 0, borderRadius: 11, background: saved[m.key] ? C.brand : C.border, transition: "background 0.2s" }}>
                  <div style={{ position: "absolute", top: 3, left: saved[m.key] ? 21 : 3, width: 16, height: 16, borderRadius: "50%", background: "#fff", transition: "left 0.2s", boxShadow: "0 1px 4px rgba(0,0,0,0.15)" }} />
                </div>
              </label>
            </div>
          </div>
        ))}
      </div>
      <Btn variant="outline" small>+ Add New Payment Method</Btn>

      {/* Security note */}
      <div style={{ marginTop: 18, padding: "12px 14px", background: C.successLight, borderRadius: 10, fontSize: 12, color: C.success, display: "flex", gap: 8, alignItems: "center" }}>
        <span>🔒</span>
        <span>All payment info is encrypted and secured with 256-bit SSL.</span>
      </div>
    </Card>
  );
}

// ─── Sidebar nav ──────────────────────────────────────────────────────────────

const NAV = [
  { id: "profile", icon: "👤", label: "My Profile" },
  { id: "orders", icon: "📦", label: "Track Orders" },
  { id: "returns", icon: "↩️", label: "Returns & Refunds" },
  { id: "wishlist", icon: "❤️", label: "Wishlist" },
  { id: "cart", icon: "🛒", label: "Saved Cart" },
];

// ─── App ──────────────────────────────────────────────────────────────────────

export default function UserProfileDashboard() {
  const [active, setActive] = useState("profile");

  const content = {
    profile: <ProfileSection />,
    orders: <OrdersSection />,
    returns: <ReturnsSection />,
    wishlist: <WishlistSection />,
    cart: <CartSection />,
    loyalty: <LoyaltySection />,
    address: <AddressSection />,
    checkout: <CheckoutSection />,
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@600;700;800&family=DM+Sans:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; }
        body { margin: 0; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #DDD5FF; border-radius: 10px; }
        .nav-item:hover { background: #F3F0FF !important; }
      `}</style>

      <div style={{ display: "flex", minHeight: "100vh", background: C.bg, fontFamily: "'DM Sans', sans-serif" }}>

        {/* ── Sidebar ── */}
        <aside style={{ width: 260, background: C.sidebar, borderRight: `1px solid ${C.border}`, display: "flex", flexDirection: "column", position: "sticky", top: 0, height: "100vh", overflowY: "auto" }}>
          {/* Brand */}
          <div style={{ padding: "24px 20px 20px", borderBottom: `1px solid ${C.border}` }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 42, height: 42, borderRadius: 12, background: `linear-gradient(135deg, ${C.brand}, ${C.brandMid})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>🛍</div>
              <div>
                <div style={{ fontWeight: 700, fontSize: 15, color: C.text, fontFamily: "'Sora',sans-serif" }}>My Account</div>
                <div style={{ fontSize: 12, color: C.muted }}>Store Management</div>
              </div>
            </div>
          </div>

          {/* Nav */}
          <nav style={{ padding: "12px 12px", flex: 1 }}>
            {NAV.map(item => {
              const isActive = active === item.id;
              return (
                <button
                  key={item.id}
                  className="nav-item"
                  onClick={() => setActive(item.id)}
                  style={{
                    display: "flex", alignItems: "center", gap: 10,
                    width: "100%", padding: "11px 14px", borderRadius: 10,
                    border: "none", cursor: "pointer", textAlign: "left",
                    fontFamily: "'DM Sans',sans-serif", fontSize: 14,
                    fontWeight: isActive ? 600 : 400,
                    color: isActive ? C.brand : C.text,
                    background: isActive ? C.brandLight : "transparent",
                    marginBottom: 2, transition: "all 0.15s",
                  }}
                >
                  <span style={{ fontSize: 16 }}>{item.icon}</span>
                  {item.label}
                  {isActive && <div style={{ marginLeft: "auto", width: 6, height: 6, borderRadius: "50%", background: C.brand }} />}
                </button>
              );
            })}
          </nav>

          {/* Footer */}
          <div style={{ padding: "16px 20px", borderTop: `1px solid ${C.border}` }}>
            <Link to="/"
              style={{ display: "flex", alignItems: "center", gap: 8, background: "none", border: "none", cursor: "pointer", fontSize: 13, color: C.muted, fontFamily: "'DM Sans',sans-serif" }}>
              ← Back to Website
            </Link>
          </div>
        </aside>

        {/* ── Main ── */}
        <main style={{ flex: 1, padding: "32px 36px", overflowY: "auto" }}>
          {/* Page header */}
          <div style={{ marginBottom: 28 }}>
            <h1 style={{ margin: 0, fontSize: 26, fontWeight: 800, color: C.text, fontFamily: "'Sora',sans-serif" }}>
              {NAV.find(n => n.id === active)?.icon} {NAV.find(n => n.id === active)?.label}
            </h1>
            <p style={{ margin: "4px 0 0", fontSize: 14, color: C.muted }}>Manage your {NAV.find(n => n.id === active)?.label.toLowerCase()}</p>
          </div>

          {content[active]}
        </main>
      </div>
    </>
  );
}