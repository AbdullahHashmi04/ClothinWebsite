// ── Design tokens matching the purple admin panel brand ──
export const C = {
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

export const WISHLIST = [
  { id: 1, name: "AirPods Pro Max", price: "$549.00", oldPrice: "$599.00", img: "🎧", stock: true },
  { id: 2, name: "iPad Air M2", price: "$699.00", oldPrice: null, img: "📱", stock: true },
  { id: 3, name: "Sony WH-1000XM5", price: "$299.00", oldPrice: "$349.00", img: "🎵", stock: false },
  { id: 4, name: "Logitech MX Keys", price: "$119.00", oldPrice: null, img: "⌨️", stock: true },
];

export const CART = [
  { id: 1, name: "Samsung 27\" Monitor", qty: 1, price: "$389.00", img: "🖥️" },
  { id: 2, name: "Desk Lamp Pro", qty: 2, price: "$45.00", img: "💡" },
  { id: 3, name: "Cable Management Kit", qty: 1, price: "$22.00", img: "🔌" },
];

export const COUPONS = [
  { code: "SAVE15", desc: "15% off your next order", exp: "Mar 31, 2026", type: "percent" },
  { code: "FREESHIP", desc: "Free shipping on any order", exp: "Feb 28, 2026", type: "shipping" },
  { code: "LOYAL50", desc: "$50 loyalty reward credit", exp: "Apr 15, 2026", type: "credit" },
];

export const ADDRESSES = [
  { id: 1, label: "Home", name: "Naeem Akhtar", line1: "24 Green Valley Road", line2: "Rawalpindi, Punjab 46000", phone: "+92 300 1234567", default: true },
  { id: 2, label: "Office", name: "Naeem Akhtar", line1: "10 Business Square, F-6", line2: "Islamabad, ICT 44000", phone: "+92 321 7654321", default: false },
];

// ── Helpers ──
export const statusColor = (s) => ({
  Delivered: { bg: C.successLight, color: C.success },
  Shipped: { bg: "#DBEAFE", color: "#2563EB" },
  Processing: { bg: C.accentLight, color: C.accent },
  Returned: { bg: C.dangerLight, color: C.danger },
}[s] || { bg: C.borderLight, color: C.muted });

// ── Shared UI Components ──

export function Badge({ label, ...style }) {
  return (
    <span style={{ fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 20, letterSpacing: "0.03em", ...style }}>
      {label}
    </span>
  );
}

export function Card({ children, style = {} }) {
  return (
    <div style={{ background: C.card, borderRadius: 16, border: `1px solid ${C.border}`, padding: "24px", boxShadow: "0 2px 12px rgba(124,58,237,0.06)", ...style }}>
      {children}
    </div>
  );
}

export function SectionTitle({ children, action }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
      <h2 style={{ margin: 0, fontSize: 17, fontWeight: 700, color: C.text, fontFamily: "'Sora', sans-serif" }}>{children}</h2>
      {action}
    </div>
  );
}

export function Btn({ children, variant = "primary", onClick, style = {}, small = false }) {
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
