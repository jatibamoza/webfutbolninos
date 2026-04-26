/* global React, Icon, CatChip, AgeBadge, Chrono, AdSlot, ImgPh, CATS, PitchLines */
const { useState: useStateH, useEffect: useEffectH } = React;

// ============ Header ============
const SiteHeader = ({ device = "desktop", currentNav, onNav }) => {
  const isMobile = device === "mobile";
  return (
    <header style={{
      position: "sticky", top: 0, zIndex: 30,
      background: "color-mix(in oklab, var(--color-background), white 30%)",
      backdropFilter: "blur(8px)",
      borderBottom: "1px solid var(--color-border)",
    }}>
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: isMobile ? "12px 16px" : "14px 32px",
        gap: 16, maxWidth: 1280, margin: "0 auto",
      }}>
        <a href="#" onClick={(e)=>{e.preventDefault(); onNav && onNav("home");}} style={{ display:"flex", alignItems:"center", gap:10 }}>
          <Logo size={isMobile ? 32 : 36}/>
          <div style={{ display:"flex", flexDirection:"column", lineHeight:1 }}>
            <span className="display" style={{ fontSize: isMobile ? 18 : 20, fontWeight: 700 }}>MiniGol</span>
            <span className="mono" style={{ fontSize: 9, letterSpacing:".18em", textTransform:"uppercase", color:"var(--color-foreground-subtle)", marginTop: 2 }}>club · est. 2026</span>
          </div>
        </a>
        {!isMobile && (
          <nav style={{ display:"flex", alignItems:"center", gap: 24 }}>
            {[
              ["ejercicios","Ejercicios"],
              ["juegos","Juegos"],
              ["mundial","Mundial 26"],
              ["recursos","Recursos"],
              ["sobre","Sobre"],
            ].map(([slug, label]) => (
              <a key={slug} href="#" onClick={(e)=>{e.preventDefault(); onNav && onNav("category", slug);}}
                 style={{
                   fontSize: 14, fontWeight: 600,
                   color: currentNav === slug ? "var(--color-foreground)" : "var(--color-foreground-muted)",
                   position:"relative", padding: "6px 0",
                 }}>
                {label}
                {currentNav === slug && (
                  <span style={{ position:"absolute", left:0, right:0, bottom:-2, height:2, background:"var(--color-foreground)", borderRadius:2 }}/>
                )}
              </a>
            ))}
          </nav>
        )}
        <div style={{ display:"flex", alignItems:"center", gap: 8 }}>
          <button aria-label="Buscar" style={{ width: 40, height: 40, display:"grid", placeItems:"center", borderRadius:10, border:"1.5px solid var(--color-border)", background: "var(--color-surface)" }}>
            <Icon name="search" size={18}/>
          </button>
          {isMobile && (
            <button aria-label="Menú" style={{ width: 40, height: 40, display:"grid", placeItems:"center", borderRadius:10, border:"1.5px solid var(--color-border)", background:"var(--color-surface)" }}>
              <Icon name="menu" size={18}/>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

// ============ Logo ============
const Logo = ({ size = 36 }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" aria-hidden="true">
    <circle cx="20" cy="20" r="18" fill="var(--color-foreground)"/>
    <path d="M20 6 L25 13 L22 21 L18 21 L15 13 Z" fill="var(--color-paper)"/>
    <path d="M20 6 L20 13 M15 13 L13 17 M25 13 L27 17 M18 21 L17 27 M22 21 L23 27" stroke="var(--color-paper)" strokeWidth="1" fill="none"/>
  </svg>
);

// ============ Footer ============
const SiteFooter = ({ device = "desktop" }) => {
  const isMobile = device === "mobile";
  return (
    <footer style={{ borderTop: "1px solid var(--color-border)", marginTop: 64, padding: isMobile ? "32px 16px 24px" : "48px 32px 32px", background: "color-mix(in oklab, var(--color-background), black 2%)" }}>
      <div style={{ maxWidth: 1280, margin:"0 auto" }}>
        <div style={{ display:"grid", gridTemplateColumns: isMobile ? "1fr" : "2fr 1fr 1fr 1fr", gap: 32 }}>
          <div>
            <div style={{ display:"flex", alignItems:"center", gap: 10, marginBottom: 12 }}>
              <Logo size={32}/>
              <span className="display" style={{ fontSize: 18, fontWeight: 700 }}>MiniGol Club</span>
            </div>
            <p style={{ fontSize: 14, color:"var(--color-foreground-muted)", maxWidth: 320, margin: 0 }}>
              Fútbol para niños, explicado para padres. Ejercicios, juegos, recursos y guías sin tecnicismos.
            </p>
          </div>
          {[
            ["Categorías", ["Ejercicios","Juegos","Mundial 2026","LaLiga","Recursos","Beneficios"]],
            ["Sitio", ["Sobre","Autores","Newsletter","Contacto"]],
            ["Legal", ["Privacidad","Cookies","Aviso legal","Afiliados"]],
          ].map(([title, items]) => (
            <div key={title}>
              <h4 className="mono" style={{ fontSize: 11, letterSpacing:".12em", textTransform:"uppercase", color:"var(--color-foreground-subtle)", margin:"0 0 12px" }}>{title}</h4>
              <ul style={{ listStyle:"none", padding:0, margin:0, display:"flex", flexDirection:"column", gap:8 }}>
                {items.map(it => <li key={it}><a href="#" style={{ fontSize: 14, color:"var(--color-foreground-muted)" }}>{it}</a></li>)}
              </ul>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 32, paddingTop: 16, borderTop: "1px solid var(--color-border)", display:"flex", justifyContent:"space-between", flexWrap:"wrap", gap: 8 }}>
          <span className="mono" style={{ fontSize: 11, color:"var(--color-foreground-subtle)" }}>© 2026 MiniGol Club · minigolclub.com</span>
          <span className="mono" style={{ fontSize: 11, color:"var(--color-foreground-subtle)" }}>Hecho con ♥ para padres ocupados</span>
        </div>
      </div>
    </footer>
  );
};

// ============ ArticleCard ============
const ArticleCard = ({ article, layout = "v" }) => {
  const c = CATS[article.cat];
  if (layout === "h") {
    return (
      <a href="#" className="card-paper" style={{ display:"grid", gridTemplateColumns: "120px 1fr", gap: 14, padding: 14, alignItems:"start" }}>
        <ImgPh ratio="1/1" label={article.imgLabel || "cover · 1:1"} style={{ borderRadius: 10 }}/>
        <div style={{ display:"flex", flexDirection:"column", gap: 6 }}>
          <CatChip cat={article.cat} size="sm"/>
          <h3 className="display" style={{ fontSize: 16, fontWeight: 600, margin: 0, lineHeight: 1.2, display:"-webkit-box", WebkitLineClamp:2, WebkitBoxOrient:"vertical", overflow:"hidden" }}>
            {article.title}
          </h3>
          <div style={{ display:"flex", alignItems:"center", gap:10, marginTop: 2 }}>
            <Chrono minutes={article.minutes}/>
            <span style={{ width:3, height:3, borderRadius:"50%", background:"var(--color-border-strong)" }}/>
            <AgeBadge min={article.ageMin} max={article.ageMax}/>
          </div>
        </div>
      </a>
    );
  }
  return (
    <a href="#" className="card-paper" style={{ display:"flex", flexDirection:"column", overflow:"hidden" }}>
      <div style={{ position:"relative" }}>
        <ImgPh ratio="16/10" label={article.imgLabel || "cover · 1200×750"} style={{ borderRadius: 0 }}/>
        <div style={{ position:"absolute", top:12, left:12, padding:"4px 8px", background:"var(--color-paper)", borderRadius:6, border:"1px solid var(--color-border)" }}>
          <CatChip cat={article.cat} size="sm"/>
        </div>
        {article.dorsal && (
          <div className="display" style={{ position:"absolute", right: 14, bottom: 8, fontSize: 64, color:"var(--color-paper)", textShadow:"0 0 0 var(--color-paper)", WebkitTextStroke:"1.5px var(--color-foreground)", opacity:.4, lineHeight:1 }}>
            {article.dorsal}
          </div>
        )}
      </div>
      <div style={{ padding: 18, display:"flex", flexDirection:"column", gap: 10, flex: 1 }}>
        <h3 className="display" style={{ fontSize: 19, fontWeight: 600, margin: 0, lineHeight: 1.2, display:"-webkit-box", WebkitLineClamp:2, WebkitBoxOrient:"vertical", overflow:"hidden" }}>
          {article.title}
        </h3>
        <p style={{ fontSize: 14, color:"var(--color-foreground-muted)", margin: 0, lineHeight: 1.5, display:"-webkit-box", WebkitLineClamp:2, WebkitBoxOrient:"vertical", overflow:"hidden" }}>
          {article.excerpt}
        </p>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginTop: "auto", paddingTop: 8, borderTop: "1px dashed var(--color-border)" }}>
          <Chrono minutes={article.minutes}/>
          <AgeBadge min={article.ageMin} max={article.ageMax}/>
        </div>
      </div>
    </a>
  );
};

// ============ Newsletter sticky bottom (mobile) ============
const StickyNewsletter = ({ onClose }) => (
  <div style={{
    position:"absolute", left: 12, right: 12, bottom: 12,
    background:"var(--color-foreground)", color:"var(--color-background)",
    borderRadius: 12, padding: "12px 14px",
    display:"flex", alignItems:"center", gap: 10,
    boxShadow: "0 14px 32px rgba(0,0,0,.18)", zIndex: 25,
  }}>
    <Icon name="mail" size={18}/>
    <div style={{ flex: 1, lineHeight: 1.25 }}>
      <div style={{ fontWeight: 700, fontSize: 13 }}>Ejercicios cada lunes</div>
      <div style={{ fontSize: 11, opacity: .7 }}>Gratis. Sin spam. 1.247 padres.</div>
    </div>
    <button style={{ background:"var(--color-accent)", color:"#1C1917", border:"none", padding:"8px 12px", borderRadius:8, fontSize:12, fontWeight:700 }}>Apuntarme</button>
    <button onClick={onClose} aria-label="Cerrar" style={{ background:"transparent", border:"none", color:"var(--color-background)", opacity:.6, padding: 4 }}>
      <Icon name="x" size={16}/>
    </button>
  </div>
);

Object.assign(window, { SiteHeader, SiteFooter, ArticleCard, StickyNewsletter, Logo });
