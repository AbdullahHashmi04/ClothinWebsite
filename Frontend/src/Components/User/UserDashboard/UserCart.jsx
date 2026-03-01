import { useState } from "react";
import { C, CART, Card, SectionTitle, Btn } from "./shared";

export default function UserCart() {
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
