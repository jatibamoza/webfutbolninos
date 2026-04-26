/* global React, Icon, CatChip, AgeBadge, Chrono, AdSlot, ImgPh, CATS, PitchLines, ArticleCard, SiteHeader, SiteFooter, StickyNewsletter, SAMPLE_ARTICLES */
const { useState: useSA } = React;

const TOC_ITEMS = [
  { id:"intro", label:"Introducción" },
  { id:"material", label:"Qué necesitas" },
  { id:"calentamiento", label:"Calentamiento (5 min)" },
  { id:"ejercicio-1", label:"Ejercicio 1 · Conducción libre" },
  { id:"ejercicio-2", label:"Ejercicio 2 · El slalom de conos" },
  { id:"ejercicio-3", label:"Ejercicio 3 · Cambios de ritmo" },
  { id:"errores", label:"Errores comunes" },
  { id:"adaptaciones", label:"Por edad · 4-6 / 7-8 / 9-12" },
  { id:"siguiente", label:"Siguiente paso" },
];

const ArticlePage = ({ device = "desktop", tweaks, onNav }) => {
  const isMobile = device === "mobile";
  const [active, setActive] = useSA("ejercicio-1");
  const [tocOpen, setTocOpen] = useSA(false);
  const [closed, setClosed] = useSA(false);

  return (
    <div style={{ position:"relative", paddingBottom: isMobile ? 80 : 0 }}>
      <SiteHeader device={device} currentNav="ejercicios" onNav={onNav}/>

      {/* Breadcrumb */}
      <div style={{ maxWidth: 1280, margin:"0 auto", padding: isMobile ? "12px 16px 0" : "20px 48px 0" }}>
        <div className="mono" style={{ fontSize: 11, color:"var(--color-foreground-muted)", display:"flex", alignItems:"center", gap: 6, flexWrap:"wrap" }}>
          <a href="#" onClick={(e)=>{e.preventDefault(); onNav && onNav("home");}}>Inicio</a>
          <Icon name="chevron-right" size={12}/>
          <a href="#" onClick={(e)=>{e.preventDefault(); onNav && onNav("category","ejercicios");}}>Ejercicios</a>
          <Icon name="chevron-right" size={12}/>
          <span style={{ color:"var(--color-foreground)", fontWeight:600 }}>Conducción de balón · 6 años</span>
        </div>
      </div>

      {/* Article header */}
      <section style={{ maxWidth: 1280, margin:"0 auto", padding: isMobile ? "16px 16px 0" : "32px 48px 0" }}>
        <div style={{ display:"grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 280px", gap: isMobile ? 0 : 48 }}>
          <article style={{ maxWidth: isMobile ? "100%" : 720 }}>
            {/* meta superior */}
            <div style={{ display:"flex", alignItems:"center", gap: 14, flexWrap:"wrap", marginBottom: 14 }}>
              <CatChip cat="ejercicios"/>
              <span style={{ width:3, height:3, borderRadius:"50%", background:"var(--color-border-strong)" }}/>
              <Chrono minutes={7}/>
              <span style={{ width:3, height:3, borderRadius:"50%", background:"var(--color-border-strong)" }}/>
              <span className="mono" style={{ fontSize: 11, color:"var(--color-foreground-muted)" }}>22 abril 2026</span>
            </div>

            {/* H1 con dorsal */}
            <div style={{ position:"relative", marginBottom: 8 }}>
              <div className="dorsal-fill" style={{ position:"absolute", top: isMobile ? -8 : -28, right: 0, fontSize: isMobile ? 90 : 160, color:"var(--color-secondary)", opacity:.1, lineHeight:.8, pointerEvents:"none", zIndex: 0 }}>01</div>
              <h1 className="display" style={{
                fontSize: isMobile ? 32 : 52, margin: 0,
                lineHeight: 1, letterSpacing:"-.025em", position:"relative", zIndex: 1,
              }}>
                Conducción de balón:<br/>
                <span className="marker">6 ejercicios</span> para niños de 6 años
              </h1>
            </div>

            <p style={{ fontSize: isMobile ? 17 : 19, color:"var(--color-foreground-muted)", lineHeight: 1.55, marginTop: 16, marginBottom: 24 }}>
              Una rutina de 20 minutos para hacer en el parque o en casa. Sin material profesional,
              con cosas que tienes en el cajón de la cocina.
            </p>

            {/* autor + edad + dificultad */}
            <div style={{ display:"flex", alignItems:"center", gap: 14, flexWrap:"wrap", padding: "12px 0", borderTop: "1px solid var(--color-border)", borderBottom: "1px solid var(--color-border)", marginBottom: 24 }}>
              <div style={{ display:"flex", alignItems:"center", gap: 10 }}>
                <div style={{ width: 36, height: 36, borderRadius:"50%", background:"var(--color-secondary)", color:"white", display:"grid", placeItems:"center", fontWeight: 700 }}>JT</div>
                <div style={{ lineHeight: 1.2 }}>
                  <div style={{ fontWeight: 700, fontSize: 13 }}>Javier Tibamoza</div>
                  <div className="mono" style={{ fontSize: 10, color:"var(--color-foreground-subtle)" }}>EX-MONITOR · 12 AÑOS</div>
                </div>
              </div>
              <div style={{ flex:1 }}/>
              <AgeBadge min={6} max={8} variant="big"/>
              <div style={{ display:"inline-flex", flexDirection:"column", alignItems:"flex-start", padding:"6px 10px", border:"1.5px solid var(--color-border-strong)", borderRadius:8 }}>
                <span className="mono" style={{ fontSize:9, letterSpacing:".12em", textTransform:"uppercase", color:"var(--color-foreground-subtle)" }}>NIVEL</span>
                <span style={{ display:"flex", gap:3, marginTop:2 }}>
                  {[1,2,3].map(n => <span key={n} style={{ width:14, height:6, borderRadius:2, background: n<=2 ? "var(--color-foreground)" : "var(--color-border)" }}/>)}
                </span>
              </div>
            </div>

            {/* Cover */}
            <div style={{ position:"relative", marginBottom: 24 }}>
              <ImgPh ratio="16/9" label="cover · entreno con conos · 1600×900" style={{ borderRadius: 14 }}/>
              <div className="hand" style={{ position:"absolute", bottom: -10, right: 14, fontSize: 22, color:"var(--color-handwritten)", background:"var(--color-paper)", padding:"4px 10px", borderRadius:6, border:"1px solid var(--color-border)", transform:"rotate(-3deg)" }}>
                ¡foto del sábado!
              </div>
            </div>

            {/* Affiliate disclosure */}
            <div style={{ display:"flex", alignItems:"flex-start", gap:10, padding:"10px 14px", border:"1px dashed var(--color-border-strong)", borderRadius:8, marginBottom: 28, background:"var(--color-surface-alt)" }}>
              <Icon name="bookmark" size={14}/>
              <p style={{ fontSize:12, margin:0, color:"var(--color-foreground-muted)", lineHeight:1.5 }}>
                Este artículo contiene enlaces afiliados de Amazon. Si compras algo, ganamos una pequeña comisión sin coste extra para ti. Solo recomendamos lo que usaríamos con nuestros peques.
              </p>
            </div>

            {/* TOC mobile accordion */}
            {isMobile && (
              <div style={{ border:"1px solid var(--color-border)", borderRadius: 12, marginBottom: 28, background:"var(--color-paper)" }}>
                <button onClick={()=>setTocOpen(o=>!o)} style={{ display:"flex", width:"100%", alignItems:"center", justifyContent:"space-between", padding:"14px 16px", background:"transparent", border:"none", color:"inherit" }}>
                  <span style={{ display:"flex", alignItems:"center", gap:10 }}>
                    <Icon name="list" size={16}/>
                    <span style={{ fontWeight:700 }}>Tabla de contenidos</span>
                    <span className="mono" style={{ fontSize:10, color:"var(--color-foreground-subtle)" }}>{TOC_ITEMS.length} secciones</span>
                  </span>
                  <Icon name="chevron-down" size={18} className={tocOpen ? "rot180":""}/>
                </button>
                {tocOpen && (
                  <ol style={{ padding:"0 16px 14px 36px", margin: 0, display:"flex", flexDirection:"column", gap:6 }}>
                    {TOC_ITEMS.map(t => (
                      <li key={t.id} style={{ fontSize:14, color:"var(--color-foreground-muted)" }}>
                        <a href={`#${t.id}`}>{t.label}</a>
                      </li>
                    ))}
                  </ol>
                )}
              </div>
            )}

            {/* Prose */}
            <div style={{ fontSize: 17, lineHeight: 1.7, color:"var(--color-foreground)" }}>
              <p id="intro" style={{ marginTop: 0 }}>
                La conducción es <span className="marker">la base de todo</span>. Antes de chutar, antes de pasar, antes de regatear,
                tu peque tiene que aprender a llevar el balón pegado al pie sin tener que mirarlo todo el rato.
              </p>
              <p>
                Lo bueno: a los 6 años no necesitas que aprenda 14 técnicas. Necesitas que <strong>se sienta cómodo con el balón</strong>.
                Estos 6 ejercicios cubren eso, en 20 minutos, en cualquier sitio plano.
              </p>

              <SectionH2 number="01" id="material">Qué necesitas</SectionH2>
              <ul style={{ paddingLeft: 20, margin: "16px 0" }}>
                <li>1 balón talla 4 (lo más importante).</li>
                <li>4-6 conos. Si no tienes, sirven botellas medio llenas.</li>
                <li>Una zona plana de unos 10×10 metros.</li>
                <li>20 minutos sin distracciones.</li>
              </ul>

              {/* Ad in-article */}
              <div style={{ margin: "32px 0" }}>
                <AdSlot size={isMobile ? "300x250" : "728x90"} label="AdSense · in-article-1"/>
              </div>

              <SectionH2 number="02" id="calentamiento">Calentamiento (5 minutos)</SectionH2>
              <p>
                Antes de tocar el balón, haz que tu peque se mueva un poco. Trotar suave, abrir y cerrar
                piernas, levantar rodillas. Cinco minutos. Si lo haces tú con él, mejor.
              </p>

              <SectionH2 number="03" id="ejercicio-1">Ejercicio 1 · Conducción libre</SectionH2>
              <p>
                Pintamos un rectángulo en el suelo (o lo marcamos con los conos). Tu peque tiene que llevar
                el balón <strong>dentro del rectángulo</strong> sin que se le escape. <span className="circle-mark">Sin chutarlo</span>:
                solo toques cortos con la planta o el interior.
              </p>

              {/* Pull quote / nota de coach */}
              <aside style={{ position:"relative", margin: "28px 0", padding: "18px 22px", background:"var(--color-surface-alt)", borderRadius: 14, borderLeft: "4px solid var(--color-secondary)" }}>
                <div className="mono" style={{ fontSize:10, letterSpacing:".15em", textTransform:"uppercase", color:"var(--color-foreground-muted)" }}>NOTA DE COACH</div>
                <p className="hand" style={{ fontSize: 26, color:"var(--color-handwritten)", margin: "6px 0 0", lineHeight: 1.2 }}>
                  Si pierde el balón 5 veces seguidas, agranda el rectángulo. No es un examen, es un juego.
                </p>
              </aside>

              <SectionH2 number="04" id="ejercicio-2">Ejercicio 2 · El slalom de conos</SectionH2>
              <p>
                Pon 4 conos en línea, separados 1,5 metros. Tu peque pasa el balón en zigzag entre ellos.
                Primero despacio, después un poco más rápido. <strong>Que no toque los conos</strong> es la única regla.
              </p>

              {/* Pizarra táctica embedded */}
              <TacticBoard/>

              <SectionH2 number="05" id="ejercicio-3">Ejercicio 3 · Cambios de ritmo</SectionH2>
              <p>
                Lo mismo que el slalom, pero ahora cuando tú gritas "¡rápido!" tiene que acelerar 3 segundos.
                Cuando gritas "¡stop!", parar el balón con la planta. Suena tonto, pero entrena lo que de verdad
                hace falta en un partido.
              </p>

              <div style={{ margin: "32px 0" }}>
                <AdSlot size={isMobile ? "300x250" : "728x90"} label="AdSense · in-article-2"/>
              </div>

              <SectionH2 number="06" id="errores">Errores comunes (y cómo evitarlos)</SectionH2>
              <p>
                Los tres errores que vemos cada sábado en los parques de Madrid:
              </p>
              <ol style={{ paddingLeft: 20, lineHeight: 1.7 }}>
                <li><strong>Chutar en vez de conducir.</strong> El balón viaja 5 metros y a correr. No es conducción.</li>
                <li><strong>Mirar al balón todo el rato.</strong> Que levante la cabeza cada 2 toques.</li>
                <li><strong>Forzar la pierna mala.</strong> A los 6 años, una pierna basta. La otra llegará.</li>
              </ol>

              <SectionH2 number="07" id="adaptaciones">Cómo adaptarlo por edad</SectionH2>
              <div style={{ display:"grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)", gap: 12, margin: "20px 0" }}>
                {[
                  { age:"4-6", title:"Más juego, menos técnica", body:"3 ejercicios máximo. Cuentan como juego, no como entreno." },
                  { age:"7-8", title:"Sumar reglas", body:"Añade un cronómetro. Que se rete a sí mismo." },
                  { age:"9-12", title:"Calidad sobre cantidad", body:"Foco en la postura del cuerpo y en el toque suave." },
                ].map(c => (
                  <div key={c.age} style={{ padding: 16, background:"var(--color-paper)", border:"1px solid var(--color-border)", borderRadius: 12 }}>
                    <AgeBadge min={c.age.split("-")[0]} max={c.age.split("-")[1]} variant="big"/>
                    <h4 className="display" style={{ fontSize: 18, margin:"10px 0 4px" }}>{c.title}</h4>
                    <p style={{ fontSize: 14, margin: 0, color:"var(--color-foreground-muted)", lineHeight: 1.5 }}>{c.body}</p>
                  </div>
                ))}
              </div>

              <SectionH2 number="08" id="siguiente">Siguiente paso</SectionH2>
              <p>
                Cuando tu peque haga el slalom sin tirar conos 3 sesiones seguidas, está listo para empezar
                a trabajar el pase. Tenemos una guía dedicada a eso.
              </p>
            </div>

            {/* Final ad */}
            <div style={{ margin: "32px 0" }}>
              <AdSlot size={isMobile ? "300x250" : "728x90"} label="AdSense · in-article-3"/>
            </div>

            {/* Tags + share */}
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap: 12, padding: "16px 0", borderTop:"1px solid var(--color-border)", borderBottom:"1px solid var(--color-border)" }}>
              <div style={{ display:"flex", gap: 6, flexWrap:"wrap" }}>
                {["conducción","6 años","conos","parque"].map(t => (
                  <a key={t} href="#" style={{ padding:"6px 10px", background:"var(--color-surface-alt)", borderRadius:6, fontSize: 12, fontWeight: 600 }}>#{t}</a>
                ))}
              </div>
              <button className="btn btn-ghost" style={{ padding:"8px 14px" }}>
                <Icon name="share" size={14}/> Compartir
              </button>
            </div>

            {/* Bio del autor */}
            <div style={{ display:"flex", gap: 14, padding: 20, background:"var(--color-paper)", border:"1px solid var(--color-border)", borderRadius: 14, marginTop: 24, alignItems:"flex-start" }}>
              <div style={{ width:56, height:56, borderRadius:"50%", background:"var(--color-secondary)", color:"white", display:"grid", placeItems:"center", fontWeight: 700, fontSize: 20, flexShrink:0 }}>JT</div>
              <div>
                <div className="display" style={{ fontSize: 17, fontWeight: 700 }}>Javier Tibamoza</div>
                <div className="mono" style={{ fontSize: 11, color:"var(--color-foreground-subtle)", marginBottom: 8 }}>EX-MONITOR · PADRE DE DOS · 12 AÑOS DE EXPERIENCIA</div>
                <p style={{ fontSize: 14, margin: 0, color:"var(--color-foreground-muted)", lineHeight: 1.55 }}>
                  Llevo 12 años entrenando a niños de 4 a 12 años en clubes de barrio. Lo que escribo aquí es lo que de verdad usamos los lunes en el campo. Sin humo.
                </p>
              </div>
            </div>

            {/* Related */}
            <div style={{ marginTop: 36 }}>
              <SectionHeaderMini number="rel" hand="continuar leyendo" title="Sigue por aquí"/>
              <div style={{ display:"grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)", gap: 14, marginTop: 18 }}>
                {SAMPLE_ARTICLES.slice(1,4).map((a,i) => <ArticleCard key={i} article={a}/>)}
              </div>
            </div>
          </article>

          {/* Sidebar TOC desktop */}
          {!isMobile && (
            <aside style={{ position:"relative" }}>
              <div style={{ position:"sticky", top: 90, paddingTop: 8 }}>
                <div style={{ padding: 18, border:"1px solid var(--color-border)", borderRadius: 14, background:"var(--color-paper)" }}>
                  <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom: 12 }}>
                    <Icon name="list" size={14}/>
                    <span className="mono" style={{ fontSize: 10, letterSpacing:".12em", textTransform:"uppercase", color:"var(--color-foreground-subtle)" }}>EN ESTE ARTÍCULO</span>
                  </div>
                  <ol style={{ listStyle:"none", padding: 0, margin: 0, display:"flex", flexDirection:"column", gap: 4 }}>
                    {TOC_ITEMS.map((t,i) => (
                      <li key={t.id}>
                        <a href={`#${t.id}`} onClick={(e)=>{e.preventDefault(); setActive(t.id);}}
                           style={{
                             display:"flex", gap:10, padding:"6px 8px", borderRadius: 6,
                             background: active===t.id ? "var(--color-surface-alt)" : "transparent",
                             borderLeft: active===t.id ? "2px solid var(--color-foreground)" : "2px solid transparent",
                             color: active===t.id ? "var(--color-foreground)" : "var(--color-foreground-muted)",
                             fontWeight: active===t.id ? 700 : 500,
                             fontSize: 13, lineHeight: 1.35,
                           }}>
                          <span className="mono" style={{ fontSize: 10, color:"var(--color-foreground-subtle)", flexShrink:0, paddingTop: 2 }}>{String(i+1).padStart(2,"0")}</span>
                          <span>{t.label}</span>
                        </a>
                      </li>
                    ))}
                  </ol>
                </div>
                {/* Mini chrono progreso */}
                <div style={{ marginTop: 14, padding: "12px 14px", background:"var(--color-foreground)", color:"var(--color-background)", borderRadius: 12, display:"flex", alignItems:"center", gap: 10 }}>
                  <Icon name="clock" size={16}/>
                  <div style={{ flex:1 }}>
                    <div className="mono" style={{ fontSize:9, opacity: .6, letterSpacing:".1em" }}>QUEDA</div>
                    <div style={{ fontFamily:"var(--font-mono)", fontSize:14, fontWeight: 700 }}>04:30</div>
                  </div>
                  <div style={{ width: 48, height: 4, background: "rgba(255,255,255,.2)", borderRadius: 2, overflow:"hidden" }}>
                    <div style={{ width: "35%", height:"100%", background:"var(--color-accent)" }}/>
                  </div>
                </div>
              </div>
            </aside>
          )}
        </div>
      </section>

      <SiteFooter device={device}/>
      {isMobile && !closed && <StickyNewsletter onClose={()=>setClosed(true)}/>}
    </div>
  );
};

const SectionH2 = ({ number, id, children }) => (
  <h2 id={id} className="display" style={{ fontSize: 28, fontWeight: 700, lineHeight: 1.1, margin: "40px 0 14px", display:"flex", alignItems:"baseline", gap: 14 }}>
    <span className="dorsal-fill" style={{ fontSize: 44, color:"var(--color-secondary)", opacity:.5 }}>{number}</span>
    <span>{children}</span>
  </h2>
);

const SectionHeaderMini = ({ number, hand, title }) => (
  <div style={{ paddingBottom: 10, borderBottom: "1.5px solid var(--color-foreground)" }}>
    <span className="hand" style={{ fontSize: 18, color:"var(--color-handwritten)", marginRight: 10 }}>{hand}</span>
    <h2 className="display" style={{ fontSize: 24, margin: 0, display:"inline" }}>{title}</h2>
  </div>
);

// Pizarra táctica embebida
const TacticBoard = () => (
  <div style={{ position:"relative", margin: "24px 0", aspectRatio: "16/8", borderRadius: 14, overflow:"hidden", background:"#0E5232", color:"white" }}>
    <PitchLines opacity={0.5}/>
    <svg style={{ position:"absolute", inset:0 }} viewBox="0 0 800 400">
      {[150,250,350,450,550].map((x,i) => (
        <g key={i}>
          <rect x={x-8} y="180" width="16" height="40" fill="#FFD45E" rx="2"/>
          <text x={x} y="170" fill="#FFD45E" textAnchor="middle" fontFamily="JetBrains Mono" fontSize="11">cono</text>
        </g>
      ))}
      <circle cx="80" cy="200" r="10" fill="white" stroke="black" strokeWidth="2"/>
      <path d="M 90 200 Q 150 160 200 220 Q 260 280 320 180 Q 380 120 440 240 Q 500 320 560 200" stroke="#FFD45E" strokeWidth="3" fill="none" strokeDasharray="6 5"/>
      <path d="M 560 200 l -10 -8 m 10 8 l -10 8" stroke="#FFD45E" strokeWidth="3" fill="none"/>
    </svg>
    <div style={{ position:"absolute", top: 12, left: 16, fontFamily:"var(--font-mono)", fontSize:10, letterSpacing:".15em", textTransform:"uppercase", opacity:.7 }}>FIG. 02 · SLALOM</div>
    <div className="hand" style={{ position:"absolute", bottom: 10, right: 14, fontSize: 22, color:"#FFD45E" }}>1,5m entre conos</div>
  </div>
);

Object.assign(window, { ArticlePage });
