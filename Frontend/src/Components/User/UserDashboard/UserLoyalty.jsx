import { C, COUPONS, Card, SectionTitle } from "./shared";

export default function UserLoyalty() {
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
