import { useState } from "react";
import { C, statusColor, Badge, Card, SectionTitle, Btn } from "./shared";
import { useEffect, useContext } from "react";
import axios from "axios";
import  CartContext  from "../../Context/CartContext";

// ── Mock Data ──
export const ORDERS = [
  { id: "#A8F21C", date: "Feb 14, 2026", status: "Delivered", items: 3, total: "$124.00", product: "Wireless Headphones" },
  { id: "#B3D90E", date: "Feb 08, 2026", status: "Shipped", items: 1, total: "$89.99", product: "Mechanical Keyboard" },
  { id: "#C7E45A", date: "Jan 29, 2026", status: "Processing", items: 2, total: "$210.50", product: "Smart Watch + Strap" },
  { id: "#D1F033", date: "Jan 15, 2026", status: "Delivered", items: 1, total: "$44.00", product: "USB-C Hub" },
  { id: "#E9A22B", date: "Jan 03, 2026", status: "Returned", items: 1, total: "$79.00", product: "Bluetooth Speaker" },
];
export default function UserOrders() {
  const [expandedId, setExpandedId] = useState(null);
  const [filter, setFilter] = useState("All");
  const [Orders , setOrders] = useState([]);
  const { user } = useContext(CartContext);
  const statuses = ["All", "Delivered", "Shipped", "Processing", "Returned"];



  // useEffect(()=>{
  //   const fetchOrders = async () => {

  //   const res  =  await axios.get("http://localhost:3000/orders/getorders")
  //   console.log(res.data)
  //   // setOrders(ORDERS)
  //   }
  //   fetchOrders()

  // },[])

  useEffect(()=>{
    const fetchOrders = async () => {

      console.log(user.Email)
    const res  =  await axios.get(`http://localhost:3000/orders/getUserOrders/${user.Email}`)
    console.log("Response data ",res.data)
    setOrders(res.data)
    }
    fetchOrders()

  },[])





  const filtered = filter === "All" ? Orders : Orders.filter(o => o.status === filter);

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
        {filtered.map( order => {
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
