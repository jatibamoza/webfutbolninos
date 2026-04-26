/* global React, Icon, CatChip, AgeBadge, Chrono, AdSlot, ImgPh, CATS, PitchLines, HexPattern, ArticleCard, SiteHeader, SiteFooter, StickyNewsletter */
const { useState: useS } = React;

// ===== Sample data =====
const SAMPLE_ARTICLES = [
  { cat:"ejercicios", title:"Conducción de balón: 6 ejercicios para niños de 6 años", excerpt:"Rutina de 20 minutos con conos en casa o en el parque. Sin material complicado.", minutes:7, ageMin:6, ageMax:8, author:"Javier Tibamoza", date:"12 abr 2026", dorsal:"01", imgLabel:"cover · conducción" },
  { cat:"juegos", title:"10 juegos con balón para entrenar sin que se den cuenta", excerpt:"Pillapilla con balón, el rey del aro y otros clásicos que esconden trabajo técnico.", minutes:5, ageMin:4, ageMax:8, author:"María García", date:"08 abr 2026", dorsal:"10", imgLabel:"cover · juegos" },
  { cat:"iniciacion", title:"Mi hijo quiere apuntarse a fútbol: ¿qué edad es buena?", excerpt:"Lo que dicen los entrenadores de base y lo que conviene mirar antes de fichar.", minutes:8, ageMin:4, ageMax:6, author:"Javier Tibamoza", date:"02 abr 2026", dorsal:"05", imgLabel:"cover · iniciación" },
  { cat:"recursos", title:"Cuaderno de jugadas: imprime y dibuja con tu peque", excerpt:"PDF de 16 páginas con campos en blanco para que dibuje sus tácticas.", minutes:3, ageMin:7, ageMax:12, author:"María García", date:"28 mar 2026", dorsal:"07", imgLabel:"recurso · PDF" },
  { cat:"mundial", title:"Mundial 2026: cómo verlo en familia sin perderse nada", excerpt:"Calendario, sedes y trucos para que tu peque entienda lo que está viendo.", minutes:6, ageMin:6, ageMax:12, author:"Javier Tibamoza", date:"22 mar 2026", dorsal:"26", imgLabel:"cover · Mundial" },
  { cat:"laliga", title:"Las 5 jugadas que tu hijo querrá imitar este finde", excerpt:"Goles, asistencias y regates que se pueden practicar en el patio el sábado.", minutes:4, ageMin:8, ageMax:12, author:"María García", date:"18 mar 2026", dorsal:"21", imgLabel:"cover · LaLiga" },
];

const CAT_ARTICLES = Array.from({length:9}).map((_,i) => ({
  cat:"ejercicios",
  title: ["Conducción de balón: 6 ejercicios para 6 años","Cómo enseñar a chutar con el interior","Rutina de 15 min para el patio","Pase y control: 4 ejercicios sin balón","Coordinación: el circuito de conos","Driblar como un 10: 3 trucos","Tiro a portería: la postura correcta","Calentamiento de 7 minutos","Juegos de pase para 4-6 años"][i],
  excerpt: "Rutina pensada para padres que no son entrenadores. 0 material profesional.",
  minutes: [7,5,15,8,10,6,5,7,12][i],
  ageMin: [6,7,5,6,7,8,7,5,4][i],
  ageMax: [8,10,12,9,10,11,10,8,6][i],
  dorsal: String(i+1).padStart(2,"0"),
  imgLabel: `cover · ${i+1}`,
}));

// ===== HOME =====
const HomePage = ({ device = "desktop", tweaks, onNav }) => {
  const isMobile = device === "mobile";
  const [age, setAge] = useS(null);
  const [closed, setClosed] = useS(false);

  return (
    <div style={{ position:"relative", minHeight:"100%", paddingBottom: isMobile ? 80 : 0 }}>
      <SiteHeader device={device} currentNav="home" onNav={onNav}/>

      {/* Hero */}
      <section style={{ position:"relative", overflow:"hidden", borderBottom:"1px solid var(--color-border)" }}>
        {/* Pitch lines decoration */}
        <div style={{ position:"absolute", inset:0, color:"var(--color-foreground)", pointerEvents:"none" }}>
          <PitchLines className="" opacity={tweaks.density === "compact" ? 0.08 : 0.13} />
        </div>
        <div style={{
          position:"relative",
          maxWidth: 1280, margin: "0 auto",
          padding: isMobile ? "32px 20px 36px" : "72px 48px 72px",
          display:"grid", gridTemplateColumns: isMobile ? "1fr" : "1.2fr 1fr", gap: isMobile ? 28 : 48, alignItems:"center"
        }}>
          <div>
            <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom: isMobile ? 14 : 20 }}>
              <span className="stamp">EDICIÓN 06 · ABRIL 2026</span>
              <span className="hand" style={{ fontSize: 22, color:"var(--color-handwritten)", transform:"rotate(-4deg)", display:"inline-block" }}>¡bienvenido!</span>
            </div>
            <h1 className="display" style={{
              fontSize: isMobile ? 44 : 76,
              margin: 0,
              lineHeight: 0.95,
              letterSpacing: "-0.025em",
            }}>
              Fútbol para niños,<br/>
              <span style={{ position:"relative", display:"inline-block" }}>
                <span className="marker">explicado</span>
              </span>{" "}
              para padres.
            </h1>
            <p style={{
              fontSize: isMobile ? 16 : 19,
              maxWidth: 540, lineHeight: 1.55, marginTop: 20,
              color: "var(--color-foreground-muted)",
            }}>
              Ejercicios, juegos y guías sin tecnicismos. Para que entrenes con tu peque
              en el parque sin sentirte un mal entrenador.
            </p>

            {/* Selector de edad — discreto */}
            <div style={{ marginTop: 24, padding: 14, border:"1.5px solid var(--color-border)", borderRadius: 14, background:"var(--color-paper)", maxWidth: isMobile ? "100%" : 460 }}>
              <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom: 10 }}>
                <span className="hand" style={{ fontSize: 18, color:"var(--color-handwritten)" }}>¿qué edad tiene tu peque?</span>
                <span className="mono" style={{ fontSize: 10, color:"var(--color-foreground-subtle)" }}>OPCIONAL</span>
              </div>
              <div style={{ display:"flex", gap: 6, flexWrap:"wrap" }}>
                {["4-6","7-8","9-10","11-12"].map(a => (
                  <button key={a} onClick={()=>setAge(a)}
                    style={{
                      padding:"10px 14px", borderRadius: 999, minHeight:44,
                      border: age===a ? "2px solid var(--color-foreground)" : "1.5px solid var(--color-border-strong)",
                      background: age===a ? "var(--color-foreground)" : "transparent",
                      color: age===a ? "var(--color-background)" : "var(--color-foreground)",
                      fontWeight: 700, fontSize: 14,
                      transition: "all .2s var(--ease-out)",
                    }}>
                    {a} años
                  </button>
                ))}
              </div>
            </div>

            <div style={{ display:"flex", gap: 10, marginTop: 20, flexWrap:"wrap" }}>
              <button className="btn btn-primary" onClick={()=>onNav && onNav("category","ejercicios")}>
                Explorar ejercicios <Icon name="arrow-right" size={16}/>
              </button>
              <button className="btn btn-ghost" onClick={()=>onNav && onNav("article")}>
                Ver lo más leído
              </button>
            </div>
          </div>

          {/* Hero ilustración (cuaderno con campo dibujado) */}
          {!isMobile && (
            <div style={{ position:"relative" }}>
              <NotebookHero/>
            </div>
          )}
        </div>
        <div className="divider-pitch"/>
      </section>

      {/* Categorías como cuadrícula tipo bento */}
      <section style={{ maxWidth: 1280, margin:"0 auto", padding: isMobile ? "36px 16px 12px" : "64px 48px 24px" }}>
        <SectionHeader number="01" hand="el equipo" title="Categorías" subtitle="Seis vestuarios. Elige el tuyo."/>
        <div style={{
          display:"grid",
          gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(3, 1fr)",
          gap: isMobile ? 10 : 16,
          marginTop: 24
        }}>
          {Object.values(CATS).map((c, i) => (
            <a key={c.slug} href="#" onClick={(e)=>{e.preventDefault(); onNav && onNav("category", c.slug);}}
              className="card-paper"
              style={{ padding: isMobile ? 16 : 22, display:"flex", flexDirection:"column", justifyContent:"space-between", minHeight: isMobile ? 130 : 170, position:"relative", overflow:"hidden" }}>
              <div style={{ position:"absolute", top: 8, right: 12, color: c.color, opacity: .12 }}>
                <HexPattern opacity={1}/>
              </div>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
                <div style={{ width:36, height:36, borderRadius:10, background: c.color, color:"white", display:"grid", placeItems:"center" }}>
                  <Icon name={c.icon} size={18}/>
                </div>
                <span className="mono" style={{ fontSize: 10, color:"var(--color-foreground-subtle)", letterSpacing:".1em" }}>{String(i+1).padStart(2,"0")}</span>
              </div>
              <div>
                <div className="display" style={{ fontSize: isMobile ? 20 : 26, fontWeight: 700, lineHeight: 1.05, marginTop: 14 }}>{c.label}</div>
                <div className="mono" style={{ fontSize: 10, color:"var(--color-foreground-muted)", marginTop: 6, letterSpacing:".05em" }}>
                  {[24,18,12,9,6,15][i]} artículos
                </div>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* Lo más leído */}
      <section style={{ maxWidth: 1280, margin:"0 auto", padding: isMobile ? "32px 16px 16px" : "56px 48px 16px" }}>
        <SectionHeader number="02" hand="el partido" title="Lo más leído" subtitle="Lo que otros padres están leyendo esta semana."/>
        <div style={{ display:"grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)", gap: isMobile ? 14 : 20, marginTop: 24 }}>
          {SAMPLE_ARTICLES.slice(0,3).map((a,i) => <ArticleCard key={i} article={a}/>)}
        </div>
      </section>

      {/* AdSlot */}
      <section style={{ maxWidth: 980, margin:"0 auto", padding: isMobile ? "16px 16px" : "24px 48px" }}>
        <AdSlot size={isMobile ? "320x100" : "728x90"} label="AdSense · home-feed"/>
      </section>

      {/* Recursos descargables */}
      <section style={{ maxWidth: 1280, margin:"0 auto", padding: isMobile ? "16px 16px 8px" : "32px 48px 16px" }}>
        <SectionHeader number="03" hand="material" title="Recursos para imprimir" subtitle="PDFs gratuitos. Llévalos al parque."/>
        <div style={{ display:"grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(3, 1fr)", gap: isMobile ? 10 : 18, marginTop: 24 }}>
          {[
            {title:"Cuaderno de jugadas", pages: 16, age:"7-10"},
            {title:"Mi calendario de entreno", pages: 8, age:"6-12"},
            {title:"Tarjetas de ejercicios", pages: 12, age:"4-8"},
          ].map((r,i) => (
            <a key={i} href="#" className="card-paper" style={{ padding: 14, display:"flex", flexDirection:"column", gap: 10 }}>
              <ImgPh ratio="3/4" label={`PDF · ${r.pages} pág.`} style={{ borderRadius: 8 }}/>
              <div className="display" style={{ fontSize: 16, fontWeight: 600 }}>{r.title}</div>
              <div className="mono" style={{ fontSize: 10, color:"var(--color-foreground-muted)" }}>{r.pages} págs · {r.age} años</div>
              <button className="btn btn-accent" style={{ padding:"10px 12px", fontSize: 13 }}>
                <Icon name="download" size={14}/> Descargar
              </button>
            </a>
          ))}
        </div>
      </section>

      {/* Últimos */}
      <section style={{ maxWidth: 1280, margin:"0 auto", padding: isMobile ? "32px 16px 16px" : "56px 48px 16px" }}>
        <SectionHeader number="04" hand="cantera" title="Últimos artículos" subtitle="Lo que acabamos de publicar."/>
        <div style={{ display:"grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)", gap: isMobile ? 14 : 20, marginTop: 24 }}>
          {SAMPLE_ARTICLES.slice(3,6).map((a,i) => <ArticleCard key={i} article={a}/>)}
        </div>
      </section>

      <SiteFooter device={device}/>

      {isMobile && !closed && <StickyNewsletter onClose={()=>setClosed(true)}/>}
    </div>
  );
};

const SectionHeader = ({ number, hand, title, subtitle }) => (
  <div style={{ display:"flex", alignItems:"flex-end", justifyContent:"space-between", flexWrap:"wrap", gap: 12, paddingBottom: 14, borderBottom: "2px solid var(--color-foreground)" }}>
    <div>
      <div style={{ display:"flex", alignItems:"baseline", gap: 14, marginBottom: 4 }}>
        <span className="dorsal-fill" style={{ fontSize: 56, color:"var(--color-foreground)", opacity:.9 }}>{number}</span>
        <span className="hand" style={{ fontSize: 22, color:"var(--color-handwritten)", transform:"rotate(-3deg)", display:"inline-block" }}>{hand}</span>
      </div>
      <h2 className="display" style={{ fontSize: 30, margin: 0, lineHeight: 1 }}>{title}</h2>
    </div>
    {subtitle && (
      <p style={{ fontSize: 14, color:"var(--color-foreground-muted)", maxWidth: 320, margin: 0, textAlign: "right" }}>{subtitle}</p>
    )}
  </div>
);

// ===== Notebook hero illustration =====
const NotebookHero = () => (
  <div style={{ position:"relative", aspectRatio: "1/1", maxWidth: 460, marginLeft: "auto" }}>
    <div style={{
      position:"absolute", inset:0,
      background:"var(--color-paper)",
      border:"1px solid var(--color-border)",
      borderRadius: 18,
      boxShadow: "var(--shadow-lg)",
      transform: "rotate(2deg)",
      overflow:"hidden",
    }}>
      <div style={{ position:"absolute", inset: 16, color:"var(--color-secondary)" }}>
        <PitchLines opacity={0.55}/>
      </div>
      {/* manuscritos */}
      <div className="hand" style={{ position:"absolute", top: 24, left: 28, fontSize: 28, color:"var(--color-handwritten)", transform:"rotate(-2deg)" }}>plan del sábado</div>
      <div className="hand" style={{ position:"absolute", top: 70, left: 60, fontSize: 22, color:"var(--color-handwritten)", transform:"rotate(-1deg)" }}>1. calentar 5'</div>
      <div className="hand" style={{ position:"absolute", top: 100, left: 60, fontSize: 22, color:"var(--color-handwritten)", transform:"rotate(0deg)" }}>2. conducción 10'</div>
      <div className="hand" style={{ position:"absolute", top: 130, left: 60, fontSize: 22, color:"var(--color-handwritten)", transform:"rotate(-1deg)" }}>3. partidito</div>
      {/* flechas tácticas */}
      <svg style={{ position:"absolute", inset:0 }} viewBox="0 0 460 460">
        <path d="M 90 280 Q 200 220 320 300" stroke="#DC2626" strokeWidth="3" fill="none" strokeDasharray="8 6"/>
        <path d="M 320 300 l -10 -10 m 10 10 l -10 10" stroke="#DC2626" strokeWidth="3" fill="none"/>
        <circle cx="90" cy="280" r="8" fill="#DC2626"/>
      </svg>
      {/* esquina */}
      <div className="stamp" style={{ position:"absolute", bottom: 20, right: 20, transform:"rotate(4deg)" }}>VS. PARQUE</div>
    </div>
    {/* nota post-it */}
    <div style={{ position:"absolute", top: -8, right: -12, width: 130, padding: "10px 12px", background:"var(--color-accent)", color:"#1C1917", borderRadius: 6, transform:"rotate(6deg)", boxShadow: "0 8px 16px rgba(0,0,0,.12)" }}>
      <div className="hand" style={{ fontSize: 22, lineHeight: 1 }}>¡no le grites!</div>
      <div className="mono" style={{ fontSize: 9, marginTop: 4, opacity:.7 }}>NOTA — PAPÁ ENTRENADOR</div>
    </div>
  </div>
);

Object.assign(window, { HomePage, SectionHeader, SAMPLE_ARTICLES, CAT_ARTICLES });
