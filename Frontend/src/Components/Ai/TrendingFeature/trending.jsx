import { useState, useEffect } from "react";
import { useContext } from "react";
import CartContext from "../../Context/CartContext";


// ── Category config ───────────────────────────────────────────────────────────
const categoryConfig = {
  "Fashion": { gradient: "linear-gradient(135deg,#a855f7,#ec4899)", light: "#fdf4ff", tag: "#a855f7" },
  "Traditional": { gradient: "linear-gradient(135deg,#7c3aed,#a855f7)", light: "#f5f3ff", tag: "#7c3aed" },
  "Streetwear": { gradient: "linear-gradient(135deg,#d946ef,#f472b6)", light: "#fdf4ff", tag: "#d946ef" },
  "Wedding Wear": { gradient: "linear-gradient(135deg,#9333ea,#c084fc)", light: "#faf5ff", tag: "#9333ea" },
  "Formal": { gradient: "linear-gradient(135deg,#7e22ce,#9333ea)", light: "#faf5ff", tag: "#7e22ce" },
  "Casual": { gradient: "linear-gradient(135deg,#c026d3,#e879f9)", light: "#fdf4ff", tag: "#c026d3" },
};

const defaultConfig = { gradient: "linear-gradient(135deg,#9333ea,#c084fc)", light: "#fdf4ff", tag: "#9333ea" };

// ── Unsplash fallback map ─────────────────────────────────────────────────────
const imageMap = {
  "ankara print kurta": "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=500&q=80",
  "churidar suit": "https://images.unsplash.com/photo-1614252369475-531eba835eb1?w=500&q=80",
  "dhoti pants": "https://images.unsplash.com/photo-1583744946564-b52ac1c389c8?w=500&q=80",
  "sharara lehenga": "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=500&q=80",
  "pathani suit": "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=500&q=80",
  "a-line shalwar kameez": "https://images.unsplash.com/photo-1600107131986-61edc5dd8f36?w=500&q=80",
  "maxi dress": "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=500&q=80",
  "embroidered kurtas": "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=500&q=80",
  "cigarette pants": "https://images.unsplash.com/photo-1594938298603-c8148c4b4c6e?w=500&q=80",
  "lawn suit": "https://images.unsplash.com/photo-1571513800374-df1bbe650e56?w=500&q=80",
  "a-line kurtas": "https://images.unsplash.com/photo-1583744946564-b52ac1c389c8?w=500&q=80",
  "palazzo pants": "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=500&q=80",
  "lace lehenga": "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=500&q=80",
  "thread embroidery kurta": "https://images.unsplash.com/photo-1614252369475-531eba835eb1?w=500&q=80",
  "high-low skirts": "https://images.unsplash.com/photo-1594938298603-c8148c4b4c6e?w=500&q=80",
};

// ── Skeleton card ─────────────────────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div style={{
      borderRadius: "20px", overflow: "hidden",
      background: "#fff", border: "1px solid #f3e8ff",
      boxShadow: "0 2px 12px rgba(147,51,234,0.06)",
    }}>
      <div style={{
        height: "220px", background: "linear-gradient(90deg,#f3e8ff 25%,#faf5ff 50%,#f3e8ff 75%)",
        backgroundSize: "200% 100%", animation: "shimmer 1.4s infinite"
      }} />
      <div style={{ padding: "18px 20px 20px" }}>
        <div style={{
          height: "14px", width: "55%", borderRadius: "8px", marginBottom: "10px",
          background: "linear-gradient(90deg,#f3e8ff 25%,#faf5ff 50%,#f3e8ff 75%)",
          backgroundSize: "200% 100%", animation: "shimmer 1.4s infinite 0.1s"
        }} />
        <div style={{
          height: "20px", width: "80%", borderRadius: "8px", marginBottom: "14px",
          background: "linear-gradient(90deg,#f3e8ff 25%,#faf5ff 50%,#f3e8ff 75%)",
          backgroundSize: "200% 100%", animation: "shimmer 1.4s infinite 0.2s"
        }} />
        <div style={{
          height: "13px", width: "40%", borderRadius: "8px",
          background: "linear-gradient(90deg,#f3e8ff 25%,#faf5ff 50%,#f3e8ff 75%)",
          backgroundSize: "200% 100%", animation: "shimmer 1.4s infinite 0.3s"
        }} />
      </div>
    </div>
  );
}

// ── Single card ───────────────────────────────────────────────────────────────
function FashionCard({ item, index }) {
  const [hovered, setHovered] = useState(false);
  const [imgError, setImgError] = useState(false);
  const cfg = categoryConfig[item.category] || defaultConfig;
  const imageKeyword = item.image_keyword || item.image_keywords || item.style || "pakistani_fashion";
  const cleanKeyword = encodeURIComponent(imageKeyword.trim().toLowerCase());
  const mappedImage = imageMap[imageKeyword.toLowerCase()] || imageMap[item.style?.toLowerCase()];

  const imgSrc = item.image_url || mappedImage ||
    `https://loremflickr.com/500/600/fashion,pakistani,${cleanKeyword}?random=${index}`;

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        borderRadius: "20px",
        overflow: "hidden",
        background: "#fff",
        border: hovered ? "1.5px solid #c084fc" : "1.5px solid #f3e8ff",
        boxShadow: hovered
          ? "0 20px 50px rgba(147,51,234,0.18), 0 4px 16px rgba(147,51,234,0.1)"
          : "0 2px 14px rgba(147,51,234,0.07)",
        transform: hovered ? "translateY(-6px)" : "translateY(0)",
        transition: "all 0.35s cubic-bezier(0.34,1.4,0.64,1)",
        cursor: "pointer",
        animation: `fadeUp 0.5s ease both`,
        animationDelay: `${index * 55}ms`,
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Image area */}
      <div style={{ position: "relative", height: "220px", overflow: "hidden", flexShrink: 0 }}>
        {!imgError ? (
          <img
            src={imgSrc}
            alt={item.style}
            onError={() => setImgError(true)}
            style={{
              width: "100%", height: "100%", objectFit: "cover", display: "block",
              transform: hovered ? "scale(1.07)" : "scale(1)",
              transition: "transform 0.5s ease",
            }}
          />
        ) : (
          <div style={{
            width: "100%", height: "100%",
            background: cfg.gradient,
            display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center", gap: "8px",
          }}>
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.8)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20.38 3.46L16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.57a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.57a2 2 0 0 0-1.34-2.23z" />
            </svg>
            <span style={{ color: "rgba(255,255,255,0.9)", fontSize: "13px", fontFamily: "'DM Sans',sans-serif", fontWeight: 500 }}>
              {item.style}
            </span>
          </div>
        )}

        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(to top, rgba(255,255,255,0.55) 0%, transparent 55%)",
          pointerEvents: "none",
        }} />

        {/* Category pill */}
        <div style={{
          position: "absolute", top: "12px", left: "12px",
          background: "rgba(255,255,255,0.92)",
          backdropFilter: "blur(8px)",
          border: `1px solid ${cfg.tag}33`,
          borderRadius: "100px",
          padding: "5px 13px",
          display: "flex", alignItems: "center", gap: "5px",
        }}>
          <div style={{ width: "7px", height: "7px", borderRadius: "50%", background: cfg.gradient, flexShrink: 0 }} />
          <span style={{
            fontFamily: "'DM Sans',sans-serif",
            fontSize: "11px", fontWeight: 600,
            color: cfg.tag,
            letterSpacing: "0.04em",
          }}>
            {item.category}
          </span>
        </div>

        {/* Trending badge */}
        <div style={{
          position: "absolute", top: "12px", right: "12px",
          background: cfg.gradient,
          borderRadius: "100px",
          padding: "5px 11px",
          display: "flex", alignItems: "center", gap: "4px",
        }}>
          <svg width="10" height="10" viewBox="0 0 24 24" fill="white" stroke="none">
            <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
            <polyline points="16 7 22 7 22 13" />
          </svg>
          <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "10px", fontWeight: 700, color: "#fff", letterSpacing: "0.05em" }}>
            TRENDING
          </span>
        </div>
      </div>

      {/* Card body */}
      <div style={{ padding: "16px 18px 18px", display: "flex", flexDirection: "column", gap: "10px", flex: 1 }}>
        <h3 style={{
          fontFamily: "'Playfair Display',Georgia,serif",
          fontSize: "17px", fontWeight: 700,
          color: "#1a0a2e",
          margin: 0, lineHeight: 1.3,
        }}>
          {item.style}
        </h3>

        <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={cfg.tag} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
          <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "12.5px", color: "#6b7280" }}>
            Popular in{" "}
            <span style={{ color: cfg.tag, fontWeight: 600 }}>{item.popular_in}</span>
          </span>
        </div>

        <div style={{ height: "1px", background: "#f3e8ff", margin: "2px 0" }} />

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "12px", color: "#9ca3af", letterSpacing: "0.04em" }}>
            Explore Style
          </span>
          <div style={{
            width: "34px", height: "34px",
            borderRadius: "50%",
            background: hovered ? cfg.gradient : "#faf5ff",
            border: `1.5px solid ${hovered ? "transparent" : "#e9d5ff"}`,
            display: "flex", alignItems: "center", justifyContent: "center",
            transition: "all 0.3s ease",
            flexShrink: 0,
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
              stroke={hovered ? "#fff" : cfg.tag}
              strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
              style={{ transition: "stroke 0.3s", transform: hovered ? "rotate(45deg)" : "none", transitionProperty: "stroke, transform" }}>
              <line x1="7" y1="17" x2="17" y2="7" /><polyline points="7 7 17 7 17 17" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function TrendingPage() {
  const { items } = useContext(CartContext);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  return (
    <div style={{ minHeight: "100vh", background: "#fefcff", fontFamily: "'DM Sans',sans-serif" }}>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700&family=DM+Sans:wght@300;400;500;600;700&display=swap');
        @keyframes fadeUp {
          from { opacity:0; transform:translateY(24px); }
          to   { opacity:1; transform:translateY(0); }
        }
        @keyframes shimmer {
          0%   { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
        * { box-sizing:border-box; }
        ::-webkit-scrollbar { width:6px; background:#fafafa; }
        ::-webkit-scrollbar-thumb { background:#e9d5ff; border-radius:4px; }
      `}</style>

      {/* ── Page header ── */}
      <div style={{
        background: "linear-gradient(160deg,#faf5ff 0%,#fff 60%,#fdf4ff 100%)",
        borderBottom: "1px solid #f3e8ff",
        padding: "40px 24px 36px",
        textAlign: "center",
        position: "relative",
        overflow: "hidden",
      }}>
        <div style={{
          position: "absolute", top: "-60px", left: "10%",
          width: "280px", height: "280px", borderRadius: "50%",
          background: "radial-gradient(circle,rgba(192,132,252,0.12),transparent 70%)",
          pointerEvents: "none",
        }} />
        <div style={{
          position: "absolute", bottom: "-80px", right: "8%",
          width: "320px", height: "320px", borderRadius: "50%",
          background: "radial-gradient(circle,rgba(236,72,153,0.08),transparent 70%)",
          pointerEvents: "none",
        }} />

        <div style={{
          display: "inline-flex", alignItems: "center", gap: "7px",
          background: "linear-gradient(135deg,#f5f3ff,#fdf4ff)",
          border: "1px solid #e9d5ff",
          borderRadius: "100px", padding: "6px 16px",
          marginBottom: "18px",
        }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#9333ea" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
            <polyline points="17 6 23 6 23 12" />
          </svg>
          <span style={{ fontSize: "11px", fontWeight: 700, color: "#9333ea", letterSpacing: "0.08em", textTransform: "uppercase" }}>
            Trending Now
          </span>
        </div>

        <h1 style={{
          fontFamily: "'Playfair Display',Georgia,serif",
          fontSize: "clamp(28px,5vw,52px)",
          fontWeight: 900,
          color: "#1a0a2e",
          margin: "0 0 12px",
          lineHeight: 1.15,
          letterSpacing: "-0.02em",
        }}>
          What Pakistan is{" "}
          <span style={{
            fontStyle: "italic",
            background: "linear-gradient(135deg,#9333ea 0%,#ec4899 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}>
            wearing
          </span>
        </h1>

        <p style={{
          fontSize: "14.5px", color: "#6b7280", maxWidth: "440px",
          margin: "0 auto", lineHeight: 1.7, fontWeight: 300,
        }}>
          Real-time fashion trends across Pakistan's most stylish cities
        </p>
      </div>

      {/* ── Results count ── */}
      {/* {!loading && !error && (
        <p style={{
          textAlign: "center", marginTop: "24px", marginBottom: "4px",
          fontSize: "12px", color: "#c4b5d4", letterSpacing: "0.06em", textTransform: "uppercase",
        }}>
          {items.length} style{items.length !== 1 ? "s" : ""} found
        </p>
      )} */}

      {/* ── Grid ── */}
      <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "20px 24px 72px" }}>

        {error && (
          <div style={{
            textAlign: "center", padding: "60px 24px",
            background: "#fff5f7", border: "1px solid #fecdd3",
            borderRadius: "16px", maxWidth: "480px", margin: "40px auto",
          }}>
            <div style={{ fontSize: "36px", marginBottom: "12px" }}>⚠️</div>
            <p style={{ fontFamily: "'Playfair Display',serif", fontSize: "18px", color: "#9f1239", margin: "0 0 8px" }}>
              API Error
            </p>
            <p style={{ fontSize: "13px", color: "#f43f5e", margin: 0 }}>{error}</p>
          </div>
        )}

        {/* {loading && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(270px,1fr))", gap: "22px" }}>
            {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        )} */}

        {/* {!loading && !error && ( */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(270px,1fr))", gap: "22px" }}>
          {items.map((item, i) => (
            <FashionCard key={item.style + i} item={item} index={i} />
          ))}
        </div>
        {/* )} */}
      </div>
    </div>
  );
}