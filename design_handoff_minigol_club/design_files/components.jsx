/* global React */
const { useState, useMemo } = React;

// ============ ICONS (Lucide-style, stroke 2) ============
const Icon = ({ name, size = 18, className = "", strokeWidth = 2 }) => {
  const s = size;
  const common = { width: s, height: s, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth, strokeLinecap: "round", strokeLinejoin: "round", className };
  switch (name) {
    case "search": return <svg {...common}><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>;
    case "menu": return <svg {...common}><path d="M4 7h16M4 12h16M4 17h16"/></svg>;
    case "x": return <svg {...common}><path d="M6 6l12 12M18 6 6 18"/></svg>;
    case "arrow-right": return <svg {...common}><path d="M5 12h14M13 5l7 7-7 7"/></svg>;
    case "arrow-left": return <svg {...common}><path d="M19 12H5M11 5l-7 7 7 7"/></svg>;
    case "chevron-right": return <svg {...common}><path d="m9 6 6 6-6 6"/></svg>;
    case "chevron-down": return <svg {...common}><path d="m6 9 6 6 6-6"/></svg>;
    case "clock": return <svg {...common}><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>;
    case "user": return <svg {...common}><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/></svg>;
    case "calendar": return <svg {...common}><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/></svg>;
    case "dumbbell": return <svg {...common}><path d="M2 12h2M20 12h2M6 8v8M18 8v8M9 6v12M15 6v12"/></svg>;
    case "gamepad": return <svg {...common}><path d="M6 12h4M8 10v4"/><circle cx="15" cy="11" r="1"/><circle cx="17" cy="13" r="1"/><rect x="2" y="6" width="20" height="12" rx="4"/></svg>;
    case "trophy": return <svg {...common}><path d="M8 4h8v6a4 4 0 0 1-8 0V4Z"/><path d="M4 6h4M16 6h4M9 14v3h6v-3M7 20h10"/></svg>;
    case "shield": return <svg {...common}><path d="M12 3 4 6v6c0 5 4 8 8 9 4-1 8-4 8-9V6l-8-3Z"/></svg>;
    case "download": return <svg {...common}><path d="M12 4v12M6 12l6 6 6-6M4 20h16"/></svg>;
    case "heart": return <svg {...common}><path d="M12 20s-7-4.5-7-10a4 4 0 0 1 7-2 4 4 0 0 1 7 2c0 5.5-7 10-7 10Z"/></svg>;
    case "mail": return <svg {...common}><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></svg>;
    case "bookmark": return <svg {...common}><path d="M6 3h12v18l-6-4-6 4V3Z"/></svg>;
    case "list": return <svg {...common}><path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/></svg>;
    case "filter": return <svg {...common}><path d="M3 5h18l-7 9v6l-4-2v-4L3 5Z"/></svg>;
    case "share": return <svg {...common}><circle cx="6" cy="12" r="2"/><circle cx="18" cy="6" r="2"/><circle cx="18" cy="18" r="2"/><path d="m8 11 8-4M8 13l8 4"/></svg>;
    default: return null;
  }
};

// ============ Pitch lines decoration ============
const PitchLines = ({ className = "", opacity = 0.18 }) => (
  <svg className={className} viewBox="0 0 800 400" preserveAspectRatio="none" style={{ opacity }} aria-hidden="true">
    <defs>
      <pattern id="pl-grid" width="40" height="40" patternUnits="userSpaceOnUse">
        <path d="M40 0H0V40" fill="none" stroke="currentColor" strokeWidth="0.5"/>
      </pattern>
    </defs>
    <rect width="800" height="400" fill="url(#pl-grid)"/>
    <rect x="20" y="20" width="760" height="360" fill="none" stroke="currentColor" strokeWidth="1.5"/>
    <line x1="400" y1="20" x2="400" y2="380" stroke="currentColor" strokeWidth="1.5"/>
    <circle cx="400" cy="200" r="60" fill="none" stroke="currentColor" strokeWidth="1.5"/>
    <circle cx="400" cy="200" r="3" fill="currentColor"/>
    <rect x="20" y="120" width="100" height="160" fill="none" stroke="currentColor" strokeWidth="1.5"/>
    <rect x="680" y="120" width="100" height="160" fill="none" stroke="currentColor" strokeWidth="1.5"/>
    <rect x="20" y="160" width="40" height="80" fill="none" stroke="currentColor" strokeWidth="1.5"/>
    <rect x="740" y="160" width="40" height="80" fill="none" stroke="currentColor" strokeWidth="1.5"/>
  </svg>
);

// ============ Hex pattern ============
const HexPattern = ({ className = "", opacity = 0.08 }) => (
  <svg className={className} viewBox="0 0 200 200" style={{ opacity }} aria-hidden="true">
    <defs>
      <pattern id="hexp" width="28" height="32" patternUnits="userSpaceOnUse">
        <path d="M14 0 L28 8 L28 24 L14 32 L0 24 L0 8 Z" fill="none" stroke="currentColor" strokeWidth="1"/>
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#hexp)"/>
  </svg>
);

// ============ Categorías ============
const CATS = {
  ejercicios:  { slug:"ejercicios",  label:"Ejercicios", color:"#16A34A", icon:"dumbbell" },
  juegos:      { slug:"juegos",      label:"Juegos",     color:"#EC4899", icon:"gamepad" },
  mundial:     { slug:"mundial",     label:"Mundial 26", color:"#DC2626", icon:"trophy" },
  laliga:      { slug:"laliga",      label:"LaLiga",     color:"#2563EB", icon:"shield" },
  recursos:    { slug:"recursos",    label:"Recursos",   color:"#F59E0B", icon:"download" },
  beneficios:  { slug:"beneficios",  label:"Beneficios", color:"#0891B2", icon:"heart" },
};

// ============ Badge / chip ============
const CatChip = ({ cat, size = "md" }) => {
  const c = CATS[cat] || CATS.ejercicios;
  return (
    <span className="cat-chip" style={{ "--cat-color": c.color, fontSize: size === "sm" ? 10 : 11 }}>
      <span className="bar"></span>
      <span>{c.label}</span>
    </span>
  );
};

const AgeBadge = ({ min, max, variant = "default" }) => {
  if (variant === "big") {
    return (
      <div style={{ display:"inline-flex", alignItems:"baseline", gap:4, padding:"6px 10px", border:"1.5px solid var(--color-border-strong)", borderRadius:8, background:"var(--color-surface)" }}>
        <span style={{ fontFamily:"var(--font-mono)", fontSize:9, letterSpacing:".12em", textTransform:"uppercase", color:"var(--color-foreground-subtle)" }}>EDAD</span>
        <span className="display" style={{ fontSize:18, fontWeight:700 }}>{min}–{max}</span>
        <span style={{ fontFamily:"var(--font-mono)", fontSize:10, color:"var(--color-foreground-muted)" }}>años</span>
      </div>
    );
  }
  return (
    <span className="mono" style={{ fontSize: 11, color:"var(--color-foreground-muted)", letterSpacing:".04em" }}>
      {min}–{max} años
    </span>
  );
};

const Chrono = ({ minutes }) => (
  <span className="chrono">
    <Icon name="clock" size={13}/>
    <span>{String(minutes).padStart(2,"0")}:00</span>
  </span>
);

// ============ AdSlot ============
const AdSlot = ({ size = "300x250", label }) => {
  const [w, h] = size.split("x").map(Number);
  return (
    <div className="adslot" role="complementary" aria-label="Publicidad">
      <div className="adslot-inner" style={{ minHeight: h, aspectRatio: `${w}/${h}` }}>
        <span>{label || `${w} × ${h}`}</span>
      </div>
    </div>
  );
};

// ============ Img placeholder ============
const ImgPh = ({ ratio = "16/10", label, style, className="" }) => (
  <div className={`img-ph ${className}`} style={{ aspectRatio: ratio, ...style }}>
    <span style={{ padding: "0 8px", textAlign:"center" }}>{label || "imagen · 1200×750"}</span>
  </div>
);

// Export to window
Object.assign(window, { Icon, PitchLines, HexPattern, CATS, CatChip, AgeBadge, Chrono, AdSlot, ImgPh });
