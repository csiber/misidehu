// Shared glitch / motion / overlay primitives used by both layouts
const { useEffect, useRef, useState, useMemo } = React;

// ---- Scanline + grain overlay (full-bleed, additive on top of any panel) ----
function GlitchOverlay({ intensity = 0.5, mode = "kawaii", hudOnly = false }) {
  // intensity: 0..1   mode: "kawaii" | "dark" | "horror"
  const tint = mode === "horror" ? "rgba(255, 24, 80," : mode === "dark" ? "rgba(255, 80, 160," : "rgba(255, 180, 220,";
  const bleed = mode === "horror" ? 0.18 : mode === "dark" ? 0.10 : 0.04;
  if (hudOnly) {
    return (
      <div className="glitch-overlay glitch-overlay--hud" style={{ "--gi": intensity, "--bleed": bleed }} aria-hidden="true">
        <div className="vignette" style={{ opacity: 0.35 }} />
      </div>
    );
  }
  return (
    <div className="glitch-overlay" style={{ "--gi": intensity, "--bleed": bleed + intensity * 0.18 }} aria-hidden="true">
      <div className="scanlines" />
      <div className="vignette" />
      <div className="rgb-shift" style={{ opacity: 0.15 + intensity * 0.6 }} />
      <div className="glitch-bars" style={{ opacity: 0.12 + intensity * 0.55, background: `${tint} 1)` }} />
      <div className="grain" style={{ opacity: 0.05 + intensity * 0.25 }} />
    </div>
  );
}

// ---- A character portrait with duotone + glitch passes layered on top ----
function CharacterPortrait({ char, intensity = 0.4, mode = "kawaii", size = "md", float = true }) {
  // Three stacked copies of the image: base, magenta-shift, cyan-shift -> RGB split look
  const off = 1 + intensity * 6; // px shift
  const blur = 0.2 + intensity * 0.6;
  const filter = mode === "horror"
    ? `saturate(${1.2 + intensity}) contrast(${1.1 + intensity * 0.3}) hue-rotate(${intensity * 18}deg)`
    : mode === "dark"
    ? `saturate(${0.9 + intensity * 0.4}) contrast(1.05)`
    : `saturate(${1 + intensity * 0.3})`;

  return (
    <div className={`char-portrait char-portrait--${size} ${float ? "is-floating" : ""}`} style={{ "--accent": char.accent, "--gi": intensity }}>
      <div className="char-portrait__halo" />
      <div className="char-portrait__stack" style={{ filter }}>
        <img src={char.img} alt={char.name} className="char-portrait__img char-portrait__img--cyan" style={{ transform: `translate(${-off}px, 0)`, filter: `blur(${blur}px)` }} draggable="false" />
        <img src={char.img} alt="" className="char-portrait__img char-portrait__img--magenta" style={{ transform: `translate(${off}px, 0)`, filter: `blur(${blur}px)` }} draggable="false" aria-hidden="true" />
        <img src={char.img} alt="" className="char-portrait__img char-portrait__img--base" draggable="false" aria-hidden="true" />
        {/* horror bleed wash */}
        <div className="char-portrait__bleed" style={{ opacity: mode === "horror" ? 0.35 + intensity * 0.4 : mode === "dark" ? 0.15 + intensity * 0.2 : intensity * 0.15 }} />
        {/* sliced glitch bars across the figure */}
        <div className="char-portrait__slices" style={{ opacity: 0.2 + intensity * 0.7 }} />
      </div>
    </div>
  );
}

// ---- Cute-to-corrupt animated text. Letters periodically swap to a glyph ----
function GlitchText({ children, intensity = 0.4, as: Tag = "span", className = "" }) {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    if (intensity < 0.05) return;
    const ms = Math.max(40, 220 - intensity * 180);
    const id = setInterval(() => setTick((t) => t + 1), ms);
    return () => clearInterval(id);
  }, [intensity]);
  const text = String(children);
  const glyphs = "▓░█▚▞◢◣▒╳ʞɟʇ#$%@";
  const out = useMemo(() => {
    return text.split("").map((ch, i) => {
      const seed = (i * 31 + tick * 7) % 100;
      const swap = seed < intensity * 28 && ch.trim();
      return swap ? glyphs[(i + tick) % glyphs.length] : ch;
    }).join("");
  }, [text, tick, intensity]);
  return <Tag className={`glitch-text ${className}`} data-text={text}>{out}</Tag>;
}

// ---- Floating ambient particles (sakura petals + binary specks) ----
function AmbientParticles({ density = 24, intensity = 0.4 }) {
  const items = useMemo(() => {
    return Array.from({ length: density }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 8,
      dur: 8 + Math.random() * 14,
      size: 4 + Math.random() * 12,
      kind: Math.random() < 0.7 ? "petal" : "code",
      glyph: ["01", "ミ", "夕", "0", "1", "▓", "░"][Math.floor(Math.random() * 7)],
      hue: Math.random() < 0.5 ? "#ff7ab8" : "#c084ff",
    }));
  }, [density]);
  return (
    <div className="ambient-particles" aria-hidden="true">
      {items.map((p) => (
        <span
          key={p.id}
          className={`particle particle--${p.kind}`}
          style={{
            left: p.x + "%",
            top: p.y + "%",
            animationDelay: p.delay + "s",
            animationDuration: p.dur + "s",
            fontSize: p.size + "px",
            color: p.hue,
            opacity: 0.3 + intensity * 0.5,
          }}
        >
          {p.kind === "code" ? p.glyph : "✦"}
        </span>
      ))}
    </div>
  );
}

// ---- Threat meter: 1..5 hearts that flicker red on horror ----
function ThreatMeter({ value = 1, mode = "kawaii", intensity = 0 }) {
  return (
    <div className="threat-meter" role="img" aria-label={`Veszélyszint ${value}/5`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <span key={i} className={`threat-dot ${i <= value ? "is-on" : ""}`} style={{ "--gi": intensity }}>
          {mode === "horror" && i <= value ? "✖" : i <= value ? "♥" : "♡"}
        </span>
      ))}
    </div>
  );
}

window.GlitchOverlay = GlitchOverlay;
window.CharacterPortrait = CharacterPortrait;
window.GlitchText = GlitchText;
window.AmbientParticles = AmbientParticles;
window.ThreatMeter = ThreatMeter;
