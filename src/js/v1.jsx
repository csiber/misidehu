/* V1 component */
const { useState: useStateV1, useMemo: useMemoV1 } = React;

function V1Editorial({ characters, intensity, mode }) {
  const [filter, setFilter] = useStateV1("mind");

  const filters = [
    { id: "mind", label: "Mind" },
    { id: "alap", label: "Alap" },
    { id: "végjáték", label: "Végjáték" },
    { id: "lore", label: "Lore" },
    { id: "rejtett", label: "Rejtett" },
  ];
  const visible = useMemoV1(() => {
    if (filter === "mind") return characters;
    return characters.filter((c) => c.tags.includes(filter));
  }, [filter, characters]);

  // assign card sizes in a balanced rhythm
  const sizeFor = (i) => {
    const pattern = ["lg", "md", "tall", "sm", "sm", "wide", "md", "tall", "sm", "sm", "lg", "md"];
    return pattern[i % pattern.length];
  };

  const hero = characters.find((c) => c.id === "kind") || characters[0];

  return (
    <div className="v1" data-screen-label="V1 — Editorial">
      <AmbientParticles density={20} intensity={intensity} />

      {/* MASTHEAD */}
      <header className="v1__mast">
        <div className="v1__mast-left">
          <span>EST. 2024</span>
          <span>VOL.II / 2026</span>
          <span>HU · EN · JP</span>
        </div>
        <div className="v1__mast-mark">
          <span className="dot" /> miside<em>.hu</em>
        </div>
        <div className="v1__mast-right">
          <span>WIKI</span><span>KARAKTEREK</span><span>HELYSZÍNEK</span><span>VÉGKIFEJLETEK</span><span>KÖZÖSSÉG</span>
        </div>
      </header>

      {/* HERO */}
      <section className="v1__hero">
        <div className="v1__hero-jp" aria-hidden="true">ミタの世界</div>

        <div style={{ position: "relative", zIndex: 3 }}>
          <p className="v1__hero-meta">II / 26 — KARAKTER ARCHÍVUM — RAJONGÓI KIADÁS</p>
          <h1 className="v1__hero-title">
            Tizenöt mosoly,<br />
            egy <em>helyiség</em>.
          </h1>
          <p className="v1__hero-lede">
            A magyar MiSide rajongói archívum. Karakterek, helyszínek és végkifejletek — kibontva, dokumentálva, megfejtve. Kattints bármelyikre, és kezdődik egy új futás.
          </p>
          <div className="v1__hero-actions">
            <a href="#galeria" className="btn btn--primary">Belépés a galériába →</a>
            <a href="#" className="btn btn--ghost">Útmutatók</a>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", opacity: 0.6 }}>15 KARAKTER · 9 HELYSZÍN · 6 VÉGKIFEJLET</span>
          </div>
        </div>

        <div className="v1__hero-figure">
          <div className="v1__hero-frame">
            <CharacterPortrait char={hero} intensity={intensity} mode={mode} size="lg" float={false} />
            <div className="v1__hero-stamp">FAN ARCHIVE · NO.001</div>
          </div>
          <div className="v1__hero-cap">FIG.01 — Az archívum bevezetője · folytatás a 24. oldalon ↘</div>
        </div>

        <div className="v1__hero-marquee" aria-hidden="true">
          <div className="v1__hero-marquee-track">
            {Array.from({ length: 2 }).map((_, k) => (
              <React.Fragment key={k}>
                <span>★ FRISSÍTVE — <b>2026.04</b></span>
                <span>◆ ÚJ FUTÁS INDULT</span>
                <span>▲ VIGYÁZZ A REFLEXIÓKKAL</span>
                <span>● VOL.II / KARAKTERMUSTRA</span>
                <span>✦ MEGTALÁLTAD A 26. ACHIEVEMENT-ET?</span>
                <span>▓ ELŐZŐ FUTÁSAID NEM TŰNTEK EL</span>
                <span>★ FRISSÍTVE — <b>2026.04</b></span>
                <span>◆ ÚJ FUTÁS INDULT</span>
                <span>▲ VIGYÁZZ A REFLEXIÓKKAL</span>
                <span>● VOL.II / KARAKTERMUSTRA</span>
              </React.Fragment>
            ))}
          </div>
        </div>
      </section>

      {/* INDEX */}
      <section className="v1__index">
        <div className="v1__index-label">— TARTALOMJEGYZÉK / KARAKTERMUSTRA</div>
        <div className="v1__index-list">
          {characters.slice(0, 12).map((c, i) => (
            <div className="v1__index-item" key={c.id}>
              <span className="v1__index-num">{String(i + 1).padStart(2, "0")}</span>
              <div>
                <div className="v1__index-name">{c.name}</div>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.14em", textTransform: "uppercase", opacity: 0.55, marginTop: 2 }}>{c.role}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* GALLERY */}
      <section className="v1__gallery" id="galeria">
        <div className="v1__gallery-head">
          <div>
            <p className="v1__gallery-kicker">— 02 / Karakter archívum</p>
            <h2 className="v1__gallery-h2">
              Mindenki <em style={{ color: "var(--pink-2)" }}>Mita</em>.
              <small>Tizenöt arc, egy név. Kattints, lebegj át rajtuk.</small>
            </h2>
          </div>
          <div className="v1__gallery-controls">
            {filters.map((f) => (
              <button key={f.id} className={`v1__filter ${filter === f.id ? "is-active" : ""}`} onClick={() => setFilter(f.id)}>
                {f.label}
              </button>
            ))}
          </div>
        </div>

        <div className="v1__grid">
          {visible.map((c, i) => {
            const sz = sizeFor(i);
            return (
              <article key={c.id} className={`v1__card v1__card--${sz}`} style={{ "--accent": c.accent, "--gi": intensity }}>
                <div className="v1__card-figure">
                  <img src={c.img} alt={c.name} draggable="false" />
                  <div className="v1__card-figure-glitch" />
                  <span className="v1__card-num">№ {String(i + 1).padStart(2, "0")}</span>
                  <span className="v1__card-jp">{c.jp}</span>
                  <div className="v1__card-meta">
                    <h3 className="v1__card-name">{c.name}</h3>
                    <div className="v1__card-role">{c.role}</div>
                  </div>
                </div>
                <div className="v1__card-foot">
                  <span>{c.tags[0]}</span>
                  <ThreatMeter value={c.threat} mode={mode} intensity={intensity} />
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* PULL QUOTE */}
      <section className="v1__pull">
        <p className="v1__pull-q">
          „Maradj velem,<br />
          itt minden <em>tökéletes</em>.”
        </p>
        <p className="v1__pull-attr">— A főmenü mosolya · 00:00:14</p>
      </section>

      {/* FOOTER */}
      <footer className="v1__foot">
        <div>RAJONGÓI ARCHÍVUM · NEM HIVATALOS · MAGYAR FORDÍTÁS · 2024 →</div>
        <div className="v1__foot-mid">ミ · miside.hu</div>
        <div className="v1__foot-right">VOL.II / VISSZATÉRÉS · NEXT FUTÁS ↘</div>
      </footer>

      <GlitchOverlay intensity={intensity} mode={mode} />
    </div>
  );
}

window.V1Editorial = V1Editorial;
