/* global React, Icon, CatChip, AgeBadge, Chrono, AdSlot, ImgPh, CATS, PitchLines, HexPattern, ArticleCard, SiteHeader, SiteFooter, StickyNewsletter, SectionHeader, CAT_ARTICLES */
const { useState: useSC } = React;

const CategoryPage = ({ device = "desktop", catSlug = "ejercicios", tweaks, onNav }) => {
  const isMobile = device === "mobile";
  const c = CATS[catSlug] || CATS.ejercicios;
  const [age, setAge] = useSC("todas");
  const [diff, setDiff] = useSC("todas");
  const [closed, setClosed] = useSC(false);

  const ageOptions = ["todas","4-6","7-8","9-10","11-12"];
  const diffOptions = ["todas","fácil","media","reto"];

  return (
    <div style={{ position:"relative", paddingBottom: isMobile ? 80 : 0 }}>
      <SiteHeader device={device} currentNav={catSlug} onNav={onNav}/>

      {/* Breadcrumb */}
      <div style={{ maxWidth: 1280, margin:"0 auto", padding: isMobile ? "12px 16px 0" : "16px 48px 0" }}>
        <div className="mono" style={{ fontSize: 11, color:"var(--color-foreground-muted)", display:"flex", alignItems:"center", gap: 6 }}>
          <a href="#" onClick={(e)=>{e.preventDefault(); onNav && onNav("home");}}>Inicio</a>
          <Icon name="chevron-right" size={12}/>
          <span style={{ color:"var(--color-foreground)", fontWeight:600 }}>{c.label}</span>
        </div>
      </div>

      {/* Hero categoría */}
      <section style={{ position:"relative", overflow:"hidden", borderBottom:"1px solid var(--color-border)" }}>
        <div style={{ position:"absolute", inset:0, color: c.color, pointerEvents:"none" }}>
          <PitchLines opacity={0.1}/>
        </div>
        <div style={{ position:"relative", maxWidth: 1280, margin:"0 auto", padding: isMobile ? "20px 16px 28px" : "40px 48px 48px" }}>
          <div style={{ display:"flex", alignItems:"flex-start", gap: isMobile ? 14 : 22 }}>
            <div className="dorsal-fill" style={{ fontSize: isMobile ? 96 : 180, color: c.color, lineHeight: .8, opacity:.9 }}>
              {String(Object.keys(CATS).indexOf(catSlug)+1).padStart(2,"0")}
            </div>
            <div style={{ flex: 1, paddingTop: isMobile ? 8 : 24 }}>
              <CatChip cat={catSlug}/>
              <h1 className="display" style={{ fontSize: isMobile ? 36 : 56, margin:"6px 0 8px", lineHeight: .95, letterSpacing:"-.02em" }}>
                <span className="marker" style={{ "--color-marker": `color-mix(in oklab, ${c.color}, white 60%)` }}>{c.label}</span> de fútbol
              </h1>
              <p style={{ fontSize: isMobile ? 15 : 17, color:"var(--color-foreground-muted)", maxWidth: 560, lineHeight: 1.55, margin: 0 }}>
                Guías paso a paso, vídeos cortos y rutinas pensadas para padres que quieren entrenar
                con sus peques sin sentirse perdidos.
              </p>
              {!isMobile && (
                <div style={{ display:"flex", alignItems:"center", gap: 14, marginTop: 18 }}>
                  <div className="mono" style={{ fontSize: 11, color:"var(--color-foreground-muted)" }}>
                    <strong style={{ color:"var(--color-foreground)", fontSize: 18, fontFamily:"var(--font-display)" }}>24</strong> artículos
                  </div>
                  <div style={{ width: 1, height: 24, background:"var(--color-border-strong)" }}/>
                  <div className="mono" style={{ fontSize: 11, color:"var(--color-foreground-muted)" }}>
                    actualizada el <strong style={{ color:"var(--color-foreground)" }}>22 abr</strong>
                  </div>
                  <div style={{ width: 1, height: 24, background:"var(--color-border-strong)" }}/>
                  <div className="hand" style={{ fontSize: 22, color:"var(--color-handwritten)", transform:"rotate(-2deg)" }}>nuevos cada lunes</div>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="divider-pitch"/>
      </section>

      {/* Filtros */}
      <section style={{ position:"sticky", top: isMobile ? 64 : 70, zIndex: 20, background:"color-mix(in oklab, var(--color-background), white 30%)", backdropFilter:"blur(8px)", borderBottom:"1px solid var(--color-border)" }}>
        <div style={{ maxWidth: 1280, margin:"0 auto", padding: isMobile ? "10px 16px" : "12px 48px", display:"flex", alignItems:"center", gap: 12, overflowX:"auto" }}>
          <div style={{ display:"flex", alignItems:"center", gap: 8, flexShrink: 0 }}>
            <Icon name="filter" size={14}/>
            <span className="mono" style={{ fontSize: 10, letterSpacing:".12em", textTransform:"uppercase", color:"var(--color-foreground-subtle)" }}>EDAD</span>
          </div>
          <div style={{ display:"flex", gap: 6 }}>
            {ageOptions.map(a => (
              <button key={a} onClick={()=>setAge(a)}
                style={{
                  padding:"8px 12px", borderRadius:999, fontSize: 13, fontWeight: 600, minHeight: 36,
                  border: age===a ? "1.5px solid var(--color-foreground)" : "1.5px solid var(--color-border)",
                  background: age===a ? "var(--color-foreground)" : "transparent",
                  color: age===a ? "var(--color-background)" : "var(--color-foreground-muted)",
                  whiteSpace:"nowrap",
                }}>{a}</button>
            ))}
          </div>
          <div style={{ width: 1, height: 24, background:"var(--color-border)", flexShrink: 0 }}/>
          <span className="mono" style={{ fontSize: 10, letterSpacing:".12em", textTransform:"uppercase", color:"var(--color-foreground-subtle)", flexShrink:0 }}>NIVEL</span>
          <div style={{ display:"flex", gap: 6 }}>
            {diffOptions.map(a => (
              <button key={a} onClick={()=>setDiff(a)}
                style={{
                  padding:"8px 12px", borderRadius:999, fontSize: 13, fontWeight: 600, minHeight: 36,
                  border: diff===a ? "1.5px solid var(--color-foreground)" : "1.5px solid var(--color-border)",
                  background: diff===a ? "var(--color-foreground)" : "transparent",
                  color: diff===a ? "var(--color-background)" : "var(--color-foreground-muted)",
                  whiteSpace:"nowrap",
                }}>{a}</button>
            ))}
          </div>
        </div>
      </section>

      {/* Ad top */}
      <section style={{ maxWidth: 980, margin:"0 auto", padding: isMobile ? "16px" : "24px 48px" }}>
        <AdSlot size={isMobile ? "320x100" : "728x90"} label="AdSense · cat-top"/>
      </section>

      {/* Grid de artículos con ad in-feed */}
      <section style={{ maxWidth: 1280, margin:"0 auto", padding: isMobile ? "8px 16px 24px" : "16px 48px 48px" }}>
        <div style={{ display:"grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)", gap: isMobile ? 14 : 20 }}>
          {CAT_ARTICLES.slice(0, 6).map((a,i) => (
            <ArticleCard key={i} article={a}/>
          ))}
          {/* Ad in-feed */}
          <div style={{ gridColumn: isMobile ? "auto" : "1 / -1" }}>
            <AdSlot size={isMobile ? "300x250" : "970x250"} label="AdSense · in-feed"/>
          </div>
          {CAT_ARTICLES.slice(6).map((a,i) => (
            <ArticleCard key={i+100} article={a}/>
          ))}
        </div>

        {/* Paginación */}
        <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap: 6, marginTop: 36 }}>
          <button className="btn btn-ghost" style={{ padding:"10px 14px" }}>
            <Icon name="arrow-left" size={14}/> Anterior
          </button>
          {[1,2,3,"…",6].map((n,i) => (
            <button key={i} style={{
              minWidth: 40, height: 40,
              border: n===1 ? "1.5px solid var(--color-foreground)" : "1.5px solid var(--color-border)",
              background: n===1 ? "var(--color-foreground)" : "transparent",
              color: n===1 ? "var(--color-background)" : "var(--color-foreground)",
              borderRadius: 10, fontWeight: 700,
            }}>{n}</button>
          ))}
          <button className="btn btn-ghost" style={{ padding:"10px 14px" }}>
            Siguiente <Icon name="arrow-right" size={14}/>
          </button>
        </div>
      </section>

      <SiteFooter device={device}/>
      {isMobile && !closed && <StickyNewsletter onClose={()=>setClosed(true)}/>}
    </div>
  );
};

Object.assign(window, { CategoryPage });
