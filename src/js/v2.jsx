/* V2 — Game UI character select */
const { useState: useStateV2, useEffect: useEffectV2 } = React;

function V2GameUI({ characters, intensity, mode }) {
  const [activeId, setActiveId] = useStateV2(characters[1]?.id || characters[0].id);
  const [now, setNow] = useStateV2(0);
  const active = characters.find((c) => c.id === activeId) || characters[0];
  const idx = characters.findIndex((c) => c.id === activeId);

  useEffectV2(() => {
    const id = setInterval(() => setNow((n) => n + 1), 1000);
    return () => clearInterval(id);
  }, []);

  const time = new Date().toLocaleTimeString("hu-HU", { hour12: false });

  const next = () => setActiveId(characters[(idx + 1) % characters.length].id);
  const prev = () => setActiveId(characters[(idx - 1 + characters.length) % characters.length].id);

  return (
    <div className="v2" data-screen-label="V2 — Game UI" style={{ "--accent": active.accent }}>
      <div className="v2__bg-grid" />
      {intensity > 0.5 ? <AmbientParticles density={10} intensity={intensity * 0.4} /> : null}

      {/* TOP HUD */}
      <header className="v2__topbar">
        <div className="v2__brand">
          <div className="v2__brand-mark">ミ</div>
          <div>
            miside.hu
            <small>FAN ARCHIVE / VOL.II</small>
          </div>
        </div>
        <nav className="v2__topbar-mid">
          <a href="#" className="is-active">KARAKTEREK</a>
          <a href="#">HELYSZÍNEK</a>
          <a href="#">VÉGKIFEJLETEK</a>
          <a href="#">ACHIEVEMENT</a>
          <a href="#">WIKI</a>
        </nav>
        <div className="v2__topbar-right">
          <span className="v2__telemetry-pill"><span className="lo" /> ÉLŐ · {time}</span>
          <span className="v2__telemetry-pill">HU / EN / JP</span>
        </div>
      </header>

      {/* MAIN */}
      <main className="v2__main">
        {/* FEATURED LEFT */}
        <section className="v2__featured">
          <div className="v2__featured-corners" />
          <div className="v2__featured-head">
            <span>// SELECT CHARACTER · {String(idx + 1).padStart(2, "0")} / {String(characters.length).padStart(2, "0")}</span>
            <span className="right">◉ KAPCSOLAT AKTÍV</span>
          </div>

          <div className="v2__featured-stage">
            <div className="v2__featured-figure" style={{ "--accent": active.accent }}>
              <div className="v2__featured-figure-bg" />
              <div className="v2__featured-figure-frame" />

              <div className="v2__crosshair v2__crosshair--tl">
                <div>SCAN · 0x{(idx * 731 + 4096).toString(16).toUpperCase()}</div>
                <span className="v2__crosshair-line" />
                <div>RÉTEG: {String(active.threat).padStart(2, "0")} / 05</div>
              </div>
              <div className="v2__crosshair v2__crosshair--tr">
                <div>{active.jp}</div>
                <span className="v2__crosshair-line" />
                <div>{active.tags.slice(0, 2).join(" · ").toUpperCase()}</div>
              </div>
              <div className="v2__crosshair v2__crosshair--bl">
                <span className="v2__crosshair-line" />
                <div>FÁJL: {active.id}.mita ▓</div>
              </div>

              <CharacterPortrait char={active} intensity={Math.min(intensity, 0.2)} mode="dark" size="lg" />
            </div>

            <div className="v2__featured-info">
              <div>
                <div className="v2__featured-role">{active.role.toUpperCase()}</div>
                <h2 className="v2__featured-jp">{active.jp}</h2>
                <h3 className="v2__featured-name">{active.name}</h3>
              </div>

              <p className="v2__featured-quote">„{active.quote}"</p>
              <p className="v2__featured-bio">{active.bio}</p>

              <div className="v2__featured-stats">
                <div className="v2__stat">
                  <div className="v2__stat-k">VESZÉLYSZINT</div>
                  <div className="v2__stat-v"><ThreatMeter value={active.threat} mode="horror" intensity={intensity} /></div>
                </div>
                <div className="v2__stat">
                  <div className="v2__stat-k">MEGJELENÉS</div>
                  <div className="v2__stat-v">{["INTRÓ", "KORAI", "KÖZÉP", "KÉSŐI", "VÉGJÁTÉK", "REJTETT"][active.threat] || "VEGYES"}</div>
                </div>
                <div className="v2__stat">
                  <div className="v2__stat-k">FUTÁS-ID</div>
                  <div className="v2__stat-v">#{(idx * 1117 + 24601).toString().padStart(5, "0")}</div>
                </div>
                <div className="v2__stat">
                  <div className="v2__stat-k">SZINK.</div>
                  <div className="v2__stat-v">{Math.min(99, 32 + active.threat * 13)}%</div>
                </div>
              </div>

              <div className="v2__featured-tags">
                {active.tags.map((t) => <span className="v2__chip" key={t}>{t}</span>)}
              </div>
            </div>
          </div>

          <div className="v2__featured-actions">
            <span style={{ fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase", opacity: 0.6, marginRight: 8 }}>VEZÉRLÉS:</span>
            <span className="v2__keycap">←</span>
            <span className="v2__keycap">→</span>
            <span style={{ fontSize: 10, letterSpacing: "0.16em", textTransform: "uppercase", opacity: 0.6 }}>VÁLTÁS</span>
            <button className="v2__action-btn" onClick={prev}>◀ ELŐZŐ</button>
            <button className="v2__action-btn v2__action-btn--primary">BEPILLANTÁS →</button>
            <button className="v2__action-btn" onClick={next}>KÖVETKEZŐ ▶</button>
            <span style={{ marginLeft: "auto", fontSize: 10, letterSpacing: "0.18em", color: "var(--pink-2)" }}>● REC 00:{String(now % 60).padStart(2, "0")}</span>
          </div>
        </section>

        {/* RIGHT ROSTER + TELEMETRY */}
        <aside className="v2__roster">
          <div className="v2__roster-card">
            <div className="v2__roster-head">
              <span>// ROSTER · {characters.length} ALANY</span>
              <span className="right">SCROLL ▼</span>
            </div>
            <div className="v2__roster-list no-scrollbar">
              {characters.map((c) => (
                <button
                  key={c.id}
                  className={`v2__roster-item ${c.id === activeId ? "is-active" : ""}`}
                  onClick={() => setActiveId(c.id)}
                  style={{ "--accent": c.accent }}
                >
                  <div className="v2__roster-thumb">
                    <img src={c.img} alt="" draggable="false" />
                  </div>
                  <div className="v2__roster-meta">
                    <div className="v2__roster-name">{c.name}</div>
                    <div className="v2__roster-role">{c.role} · LV {c.threat}</div>
                  </div>
                  <div className="v2__roster-jp">{c.jp.slice(0, 2)}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="v2__roster-card">
            <div className="v2__roster-head">
              <span>// TELEMETRIA</span>
              <span className="right">VOL.II</span>
            </div>
            <div className="v2__telemetry">
              <div className="v2__tcell"><div className="v2__tcell-label">KARAKTER</div><div className="v2__tcell-value">{characters.length}</div></div>
              <div className="v2__tcell"><div className="v2__tcell-label">VÉGJÁT.</div><div className="v2__tcell-value">06</div></div>
              <div className="v2__tcell"><div className="v2__tcell-label">SZOBÁK</div><div className="v2__tcell-value">09</div></div>
              <div className="v2__tcell"><div className="v2__tcell-label">ACH.</div><div className="v2__tcell-value">26</div></div>
            </div>
            <div className="v2__sysline">
              <div className="v2__sysline-track">
                <em>[SYS]</em> archive booted · <b>OK</b> · scanning ./assets/* · 15 alany · <em>[WARN]</em> reflexió-anomália a 03:14-nél · <em>[SYS]</em> új patch elérhető v2.04 · <b>OK</b> · adat-szinkron befejezve · <em>[SYS]</em> futás-id elhalványult · <em>[NOTE]</em> kérlek, ne nézz közvetlenül Crazy Mitára · &nbsp;&nbsp;
                <em>[SYS]</em> archive booted · <b>OK</b> · scanning ./assets/* · 15 alany ·
              </div>
            </div>
          </div>
        </aside>
      </main>

      {/* STATUS BAR */}
      <footer className="v2__statusbar">
        <div>
          <span className="ok">● ONLINE</span>
          <span>BUILD 2026.04 · NIGHTLY</span>
          <span>VOL.II / KARAKTER ARCHÍVUM</span>
        </div>
        <div>
          <span>FUTÁSAZONOSÍTÓ: {(idx * 1117 + 24601).toString().padStart(5, "0")}</span>
          <span className="warn">▲ FIGYELEM: VALÓS FUTÁS DETEKTÁLVA</span>
        </div>
      </footer>

      <GlitchOverlay intensity={Math.min(intensity, 0.15)} mode={mode} hudOnly />
    </div>
  );
}

window.V2GameUI = V2GameUI;
