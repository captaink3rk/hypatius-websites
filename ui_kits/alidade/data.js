// v1.1 (16 Sep 2026): set-aside values and reviewer initials cleaned per corporate rules.
// Fake but realistic ALIDADE capture data. Attaches to window.ALIDADE_DATA.
// Scenario-based composites only (no real customers) — per brand messaging Section 0.
window.ALIDADE_DATA = {
  user: { initials: "JL", name: "Jordan L", role: "Capture Lead", firm: "HYPATIUS, LLC" },
  kpis: [
    { label: "Active pursuits", value: "7", meta: ["3 qualifying", "4 capture"] },
    { label: "Pipeline value", value: "$124M", metaWeighted: "$71.4M" },
    { label: "Win rate (weighted)", value: "63%", meta: ["8 of 14 tracked"] },
    { label: "Critical blockers", value: "2", urgent: true, meta: ["Past performance gaps"] },
  ],
  pursuits: [
    { id: "p1", signal: "pursue", score: 92, scores: [90,92,88,60,86,90,82], title: "Bedford radiation decommissioning",
      agency: "VA · F108", setaside: "HUBZone set-aside", deadline: "Closes in 4d", deadlineTone: "coral",
      value: "$25.0M", naics: "562910", partners: "2 partners ready" },
    { id: "p2", signal: "pursue", score: 88, scores: [86,90,82,70,80,88,84], title: "USSPACECOM SDA analytics IDIQ",
      agency: "USSPACECOM", setaside: "Full & open", deadline: "Closes in 11d", deadlineTone: "gold",
      value: "$48.0M", naics: "541512", partners: "1 partner matched" },
    { id: "p3", signal: "consider", score: 71, scores: [78,74,80,55,64,82,70], title: "DOI wildfire logistics support",
      agency: "DOI · R408", setaside: "8(a) set-aside", deadline: "Closes in 22d", deadlineTone: "gold",
      value: "$12.4M", naics: "488999", partners: "Find a partner" },
    { id: "p4", signal: "consider", score: 64, scores: [70,62,68,52,60,72,66], title: "DHS cloud migration BPA",
      agency: "DHS", setaside: "Full & open", deadline: "Closes in 31d", deadlineTone: "gold",
      value: "$30.0M", naics: "518210", partners: "3 partners ready" },
    { id: "p5", signal: "historical", score: 68, was: true, scores: [70,66,64,60,62,70,64], title: "Navy SeaPort-NxG recompete",
      agency: "NAVSEA", setaside: "Full & open", deadline: "Awarded Q1", deadlineTone: "neutral",
      value: "$18.2M", naics: "541330", partners: "Lost to incumbent" },
  ],
  partners: [
    { id: "m1", handle: "PARTNER · B2F4-9XK", fills: "DoD Logistics · OCONUS Operations", creds: "8(a) · 8+ yrs · ISO 27001 · FedRAMP Mod", score: 91 },
    { id: "m2", handle: "PARTNER · 7K1C-4QM", fills: "Cloud Engineering · CMMC L2", creds: "HUBZone · 12+ yrs · AWS GovCloud", score: 87 },
    { id: "m3", handle: "PARTNER · J9D2-5XT", fills: "Cleared Staffing · TS/SCI", creds: "WOSB · 6+ yrs · DCSA-cleared facility", score: 84 },
    { id: "m4", handle: "PARTNER · Q3F8-1RP", fills: "Geospatial Analytics", creds: "WOSB · 9+ yrs · NGA past performance", score: 79 },
  ],
  signals: [
    { sentiment: "positive", source: "CONGRESS.GOV", last: "1h ago", lead: "Senate Approps", rest: " approved +$2.1B for DoD Cloud — 4 tracked NAICS affected." },
    { sentiment: "risk", source: "GAO", last: "4h ago", lead: "GAO protest sustained", rest: " — DHS Logistics incumbent disqualified. Recompete window open." },
    { sentiment: "watch", source: "INSPECTOR GENERAL", last: "6h ago", lead: "IG audit initiated", rest: " against USSPACECOM incumbent on $412M tracked contract." },
    { sentiment: "positive", source: "SAM.GOV", last: "9h ago", lead: "Sources sought", rest: " posted for VA decommissioning — matches an active pursuit." },
  ],
  builder: {
    title: "USSPACECOM SDA analytics IDIQ",
    sections: [
      { id: "s1", n: "§3.1", h: "Mission understanding", status: "approved", voice: "JL" },
      { id: "s2", n: "§3.2.1", h: "Technical approach — architecture", status: "gate", voice: "JL" },
      { id: "s3", n: "§3.2.2", h: "Cloud engineering layer", status: "partner", voice: "Partner" },
      { id: "s4", n: "§3.3", h: "Management approach", status: "draft", voice: "RT" },
      { id: "s5", n: "§3.4", h: "Past performance", status: "draft", voice: "KM" },
    ],
    activity: [
      { who: "RT", tone: "gold", text: "Requested review on §3.2.1", time: "14 min ago" },
      { who: "✦", tone: "gold", ai: true, text: "12 inline suggestions queued", time: "1 hr ago" },
      { who: "JL", tone: "teal", text: "Approved §3.1 final", time: "2 hr ago" },
      { who: "KM", tone: "violet", text: "Partner added §3.2.2 draft", time: "3 hr ago" },
    ],
  },
};
