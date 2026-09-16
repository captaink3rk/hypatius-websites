// ALIDADE logo sting — "Take the bearing."
// Parametrized by preset: wide (16:9, slowed), vertical (9:16), short (3s).
const { Stage, Sprite, useTime, interpolate, animate, Easing } = window;

const NAVY = "#060D1B", TEAL = "#21E0CD", GOLD = "#E8B86A", ICE = "#EFF5FE", SLATE = "#93A4BD";
const rad = (d) => ((d - 90) * Math.PI) / 180;
const pol = (cx, cy, r, d) => [cx + r * Math.cos(rad(d)), cy + r * Math.sin(rad(d))];

// nodes positioned by radius-factor (× ring R) so they scale with the ring
const NODES = [
  { d: 28, rf: 1.35, s: 9 }, { d: 58, rf: 1.49, s: 6 }, { d: 84, rf: 1.32, s: 11 },
  { d: 300, rf: 1.44, s: 7 }, { d: 326, rf: 1.33, s: 10 }, { d: 274, rf: 1.42, s: 6 },
];
const LINKS = [[0, 1], [3, 4], [2, 0], [5, 3]];

const LayoutCtx = React.createContext(null);
const useL = () => React.useContext(LayoutCtx);

// ── Bearing ring ──
function BearingRing() {
  const L = useL(), t = useTime(), T = L.T, CX = L.cx, CY = L.cy, R = L.R;
  const reveal = animate({ from: 0, to: 1, start: T.ringStart, end: T.ringEnd, ease: Easing.easeOutCubic })(t);
  const scale = 0.86 + 0.14 * reveal;
  const spin = t * 7;
  const sweepAng = (t * 96) % 360;

  const ticks = [];
  for (let i = 0; i < 72; i++) {
    const deg = i * 5;
    const cardinal = deg % 90 === 0;
    const len = cardinal ? 22 : deg % 30 === 0 ? 13 : 8;
    const [x, y] = pol(CX, CY, R, deg);
    ticks.push(<div key={i} style={{
      position: "absolute", left: x, top: y, width: 1.4, height: len,
      marginLeft: -0.7, marginTop: -len / 2,
      background: cardinal ? "rgba(33,224,205,0.85)" : "rgba(143,200,220,0.34)",
      transform: `rotate(${deg}deg)`, transformOrigin: "center",
    }} />);
  }
  return (
    <div style={{ position: "absolute", left: CX, top: CY, width: 0, height: 0, transform: `scale(${scale})`, transformOrigin: "center", opacity: reveal }}>
      <div style={{
        position: "absolute", left: -R, top: -R, width: 2 * R, height: 2 * R, borderRadius: "50%",
        background: `conic-gradient(from ${sweepAng}deg, rgba(33,224,205,0.34) 0deg, rgba(33,224,205,0.05) 34deg, rgba(33,224,205,0) 64deg)`,
        opacity: 0.9 * reveal,
      }} />
      <div style={{ position: "absolute", left: 0, top: 0, transform: `rotate(${spin}deg)` }}>
        <div style={{ position: "absolute", left: -R, top: -R, width: 2 * R, height: 2 * R, borderRadius: "50%", border: "1.5px solid rgba(33,224,205,0.55)" }} />
        <div style={{ position: "absolute", left: -R * 0.72, top: -R * 0.72, width: 1.44 * R, height: 1.44 * R, borderRadius: "50%", border: "1px solid rgba(143,200,220,0.18)" }} />
        <div style={{ position: "absolute", left: -R * 0.46, top: -R * 0.46, width: 0.92 * R, height: 0.92 * R, borderRadius: "50%", border: "1px solid rgba(143,200,220,0.12)" }} />
        {ticks}
      </div>
    </div>
  );
}

// ── Teaming graph nodes ──
function Nodes() {
  const L = useL(), t = useTime(), T = L.T, CX = L.cx, CY = L.cy, R = L.R;
  return (
    <div style={{ position: "absolute", inset: 0 }}>
      {LINKS.map(([a, b], i) => {
        const [ax, ay] = pol(CX, CY, NODES[a].rf * R, NODES[a].d);
        const [bx, by] = pol(CX, CY, NODES[b].rf * R, NODES[b].d);
        const len = Math.hypot(bx - ax, by - ay);
        const ang = (Math.atan2(by - ay, bx - ax) * 180) / Math.PI;
        const draw = animate({ from: 0, to: 1, start: T.nodeStart + 0.2 + i * 0.12, end: T.nodeStart + 0.8 + i * 0.12, ease: Easing.easeOutCubic })(t);
        return <div key={"l" + i} style={{
          position: "absolute", left: ax, top: ay, width: len * draw, height: 1.2,
          background: "linear-gradient(90deg, rgba(33,224,205,0.0), rgba(33,224,205,0.45))",
          transform: `rotate(${ang}deg)`, transformOrigin: "left center", opacity: 0.8 * draw,
        }} />;
      })}
      {NODES.map((n, i) => {
        const [x, y] = pol(CX, CY, n.rf * R, n.d);
        const pop = animate({ from: 0, to: 1, start: T.nodeStart + i * 0.09, end: T.nodeStart + 0.4 + i * 0.09, ease: Easing.easeOutBack })(t);
        const pulse = 0.7 + 0.3 * Math.sin(t * 2.4 + i);
        return <div key={"n" + i} style={{
          position: "absolute", left: x, top: y, width: n.s, height: n.s,
          marginLeft: -n.s / 2, marginTop: -n.s / 2, borderRadius: "50%", background: TEAL,
          transform: `scale(${pop})`, boxShadow: `0 0 ${10 * pulse}px rgba(33,224,205,${0.6 * pulse})`, opacity: pop,
        }} />;
      })}
    </div>
  );
}

// ── Glow shockwave at the lock moment ──
function Shockwave() {
  const L = useL(), CX = L.cx, CY = L.cy, R = L.R, T = L.T;
  return (
    <Sprite start={T.shockStart} end={T.shockEnd}>
      {({ progress }) => {
        const e = Easing.easeOutCubic(progress);
        return <div style={{
          position: "absolute", left: CX, top: CY, width: 2 * R, height: 2 * R,
          marginLeft: -R, marginTop: -R, borderRadius: "50%",
          border: `2px solid rgba(33,224,205,${0.5 * (1 - e)})`,
          transform: `scale(${0.15 + e * 2.1})`, transformOrigin: "center",
        }} />;
      }}
    </Sprite>
  );
}

// ── Crystalline A mark blooming in ──
function LogoMark() {
  const L = useL(), t = useTime(), T = L.T, CX = L.cx, CY = L.cy, W = L.markW;
  const op = animate({ from: 0, to: 1, start: T.markOpStart, end: T.markOpEnd, ease: Easing.easeOutCubic })(t);
  const scale = interpolate(T.markScaleKeys, [0.55, 1.07, 1.0], Easing.easeOutCubic)(t);
  const blur = interpolate(T.blurKeys, [18, 0], Easing.easeOutCubic)(t);
  const breathe = 0.85 + 0.15 * Math.sin(t * 1.6);
  const glow = op * (0.45 + 0.25 * breathe);
  const g = W * 2.4;
  return (
    <div style={{ position: "absolute", left: CX, top: CY, width: 0, height: 0 }}>
      <div style={{
        position: "absolute", left: -g / 2, top: -g / 2, width: g, height: g, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(33,224,205,0.35) 0%, rgba(33,224,205,0) 62%)",
        opacity: glow, transform: `scale(${0.7 + 0.3 * scale})`,
      }} />
      <img src={(window.STING_IMG && window.STING_IMG.mark) || "../../../assets/brand/alidade-mark.png"} alt="ALIDADE" style={{
        position: "absolute", left: -W / 2, top: -W * 0.56, width: W, height: "auto",
        opacity: op, transform: `scale(${scale})`, transformOrigin: "center",
        filter: `drop-shadow(0 0 ${26 * breathe}px rgba(33,224,205,0.45)) blur(${blur}px)`,
      }} />
    </div>
  );
}

// ── Wordmark + descriptor + tagline ──
// Uses the real ALIDADE wordmark + subtitle artwork (cropped from the logo lockup).
const WORD_AR = 477 / 3421;   // height / width of alidade-wordmark.png
const SUB_AR  = 212 / 3428;   // height / width of alidade-subtitle.png
function Wordmark() {
  const L = useL(), t = useTime(), T = L.T;
  const wW = L.wordW, wH = wW * WORD_AR;
  const sW = L.wordW * 0.99, sH = sW * SUB_AR;
  const wOp = animate({ from: 0, to: 1, start: T.wordStart, end: T.wordStart + 0.7, ease: Easing.easeOutCubic })(t);
  const wSc = interpolate([T.wordStart, T.wordStart + 0.9], [0.92, 1.0], Easing.easeOutCubic)(t);
  const wY = (1 - wOp) * 16;
  const sOp = animate({ from: 0, to: 1, start: T.subStart, end: T.subStart + 0.6, ease: Easing.easeOutCubic })(t);
  const sSc = interpolate([T.subStart, T.subStart + 0.8], [0.94, 1.0], Easing.easeOutCubic)(t);
  const tOp = animate({ from: 0, to: 1, start: T.tagStart, end: T.tagStart + 1.3, ease: Easing.easeInOutQuad })(t);
  const tY = (1 - tOp) * 12;
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: L.textTop, display: "flex", flexDirection: "column", alignItems: "center" }}>
      <img src={(window.STING_IMG && window.STING_IMG.wordmark) || "../../../assets/brand/alidade-wordmark.png"} alt="ALIDADE" style={{
        width: wW, height: wH, opacity: wOp, transform: `translateY(${wY}px) scale(${wSc})`,
        transformOrigin: "center", filter: "drop-shadow(0 2px 18px rgba(33,224,205,0.18))",
      }} />
      <img src={(window.STING_IMG && window.STING_IMG.subtitle) || "../../../assets/brand/alidade-subtitle.png"} alt="Hypatius Capture Intelligence" style={{
        width: sW, height: sH, opacity: sOp, transform: `scale(${sSc})`, transformOrigin: "center",
        marginTop: wH * 0.42,
      }} />
      {L.showTag ? (
        <div style={{
          fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 500, fontSize: L.tagSize,
          color: GOLD, opacity: tOp, marginTop: L.tagSize * 1.5, letterSpacing: "0.01em", whiteSpace: "nowrap",
          transform: `translateY(${tY}px)`,
        }}>We do not guess. We engineer the win.</div>
      ) : null}
    </div>
  );
}

function Vignette() {
  return <div style={{ position: "absolute", inset: 0, background: "radial-gradient(120% 120% at 50% 42%, rgba(0,0,0,0) 45%, rgba(0,0,0,0.55) 100%)", pointerEvents: "none" }} />;
}

function TimeLabeler() {
  const t = useTime();
  React.useEffect(() => {
    const el = document.getElementById("sting-root");
    if (el) el.setAttribute("data-screen-label", `t=${Math.floor(t)}s`);
  }, [Math.floor(t)]);
  return null;
}

// ── Presets ──
// Slowed wide reveal: the logo fade-in is ~2× longer than the original cut.
const PRESETS = {
  wide: {
    width: 1920, height: 1080, duration: 8.0, cx: 960, cy: 452, R: 250,
    markW: 200, textTop: 744, wordW: 460, tagSize: 30, showTag: true,
    T: {
      ringStart: 0.15, ringEnd: 1.7, nodeStart: 1.2,
      markOpStart: 2.2, markOpEnd: 3.5, markScaleKeys: [2.2, 3.1, 4.0], blurKeys: [2.2, 3.6],
      shockStart: 2.3, shockEnd: 3.5, wordStart: 3.9, subStart: 4.45, tagStart: 5.25,
    },
  },
  vertical: {
    width: 1080, height: 1920, duration: 8.0, cx: 540, cy: 720, R: 300,
    markW: 248, textTop: 1150, wordW: 650, tagSize: 42, showTag: true,
    T: {
      ringStart: 0.15, ringEnd: 1.7, nodeStart: 1.2,
      markOpStart: 2.2, markOpEnd: 3.5, markScaleKeys: [2.2, 3.1, 4.0], blurKeys: [2.2, 3.6],
      shockStart: 2.3, shockEnd: 3.5, wordStart: 3.9, subStart: 4.45, tagStart: 5.25,
    },
  },
  short: {
    width: 1920, height: 1080, duration: 3, cx: 960, cy: 470, R: 250,
    markW: 200, textTop: 762, wordW: 460, tagSize: 30, showTag: false,
    T: {
      ringStart: 0.05, ringEnd: 0.75, nodeStart: 0.45,
      markOpStart: 0.7, markOpEnd: 1.45, markScaleKeys: [0.7, 1.15, 1.6], blurKeys: [0.7, 1.4],
      shockStart: 0.75, shockEnd: 1.5, wordStart: 1.55, subStart: 1.95, tagStart: 2.4,
    },
  },
};

function LogoSting({ preset = "wide" }) {
  const cfg = PRESETS[preset] || PRESETS.wide;
  return (
    <Stage width={cfg.width} height={cfg.height} duration={cfg.duration} background={NAVY} persistKey={"alidade-sting-" + preset} loop={true}>
      <LayoutCtx.Provider value={cfg}>
        <BearingRing />
        <Nodes />
        <Shockwave />
        <LogoMark />
        <Wordmark />
        <Vignette />
        <TimeLabeler />
      </LayoutCtx.Provider>
    </Stage>
  );
}

window.LogoSting = LogoSting;
window.STING_PRESETS = PRESETS;
