// HYPATIUS website — page views (Home, STARCHITECT, Contact)
const { PlatformTile, CapabilityCard, PostCard, Button, Eyebrow, Beam, StatusBadge } = window.HYPATIUSDesignSystem_1c6298;

function Hero({ onNav }) {
  return (
    <header className="hero">
      <div className="hero__bg" style={{ backgroundImage: `url('${(window.__resources && window.__resources.heroNarrative) || '../../assets/hero-narrative.webp'}')` }}></div>
      <div className="hero__overlay"></div>
      <div className="container">
        <div className="hero__content">
          <Eyebrow invert>Defense technology · Charleston, SC · Non-traditional defense contractor</Eyebrow>
          <h1 className="display display--invert hero__title">Clarity for contested environments.</h1>
          <p className="hero__sub">HYPATIUS builds the <strong style={{ color: '#fff' }}>software operating layer for contested-domain defense</strong> — space wargaming and tactical C2, federal capture intelligence, and program execution. Three platforms. One operating philosophy.</p>
          <p className="hero__cred mono">UEI UKELB3UV76V6 · CAGE 19S89</p>
          <div className="hero__ctas">
            <Button variant="accent" arrow onClick={() => onNav('platforms')}>Explore the platforms</Button>
            <Button variant="ghost" onClick={() => onNav('contracting')}>Contracting with HYPATIUS</Button>
          </div>
        </div>
      </div>
    </header>
  );
}

function Home({ onNav }) {
  return (
    <>
      <Hero onNav={onNav} />
      <section className="section section--dark">
        <div className="container">
          <Eyebrow invert>The portfolio</Eyebrow>
          <h2 className="display display--md display--invert mt-1">Three platforms, deliberately scoped.</h2>
          <div className="platform-grid">
            <PlatformTile label="STARCHITECT" status="Live · Advanced reconnaissance"
              description="Space-domain wargaming and BMC3I. The reasoning layer for orbital conflict."
              href="#" onClick={(e) => { e.preventDefault(); onNav('starchitect'); }} />
            <PlatformTile label="ALIDADE" status="Live · Capture intelligence"
              description="Capture intelligence and autonomous proposals. AI-native GovCon, end to end." href="#" />
            <PlatformTile label="CRATON" status="In development · Deterministic ERP" muted
              description="The operational backbone for high-tempo defense and federal program execution."
              href="#" linkLabel="What's coming" />
          </div>
        </div>
      </section>
      <section className="section">
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: '2rem', flexWrap: 'wrap' }}>
            <div>
              <Eyebrow>Field notes</Eyebrow>
              <h2 className="display display--md mt-1" style={{ maxWidth: '18ch' }}>Latest from contested environments.</h2>
            </div>
            <Button variant="text" arrow onClick={() => onNav('insights')}>All insights</Button>
          </div>
          <div className="post-grid">
            <PostCard category="Field notes" title="Why BMC3I simulation needs a reasoning engine, not just a sim" byline="Jordan Broe · Apr 2026" />
            <PostCard category="News" title="What we learned at Space Symposium 2026" byline="Jordan Broe · Apr 2026" />
          </div>
        </div>
      </section>
      <CtaStrip onNav={onNav} title="Building something contested? Let's talk." />
    </>
  );
}

function Starchitect({ onNav }) {
  return (
    <>
      <header className="hero hero--medium">
        <div className="hero__bg" style={{ backgroundImage: `url('${(window.__resources && window.__resources.heroSatEarth) || '../../assets/hero-sat-earth.webp'}')` }}></div>
        <div className="hero__overlay"></div>
        <div className="container">
          <div className="hero__content">
            <StatusBadge>Live</StatusBadge>
            <h1 className="display display--invert hero__title mt-2" style={{ marginBottom: '1.5rem' }}>Reasoning at the speed of orbit.</h1>
            <p className="hero__sub">STARCHITECT is the space-domain wargaming and BMC3I platform built for the next decade of contested orbital operations.</p>
            <div className="hero__ctas">
              <Button variant="accent" external arrow>Launch STARCHITECT</Button>
              <Button variant="ghost" onClick={() => onNav('contact')}>Request a briefing</Button>
            </div>
          </div>
        </div>
      </header>
      <section className="section">
        <div className="container">
          <Eyebrow>Capabilities</Eyebrow>
          <h2 className="display display--md mt-1">What's inside the platform.</h2>
          <div className="cap-grid">
            <CapabilityCard index="Capability 01" title="Wargaming engine">Multi-actor scenarios with adversarial AI, stochastic event modeling, and human-in-the-loop branches. Designed for repeatable, defensible CONOPS validation.</CapabilityCard>
            <CapabilityCard index="Capability 02" title="BMC3I integration">Native interfaces to the joint command-and-control architecture, including standards-aligned data formats and decision-loop outputs.</CapabilityCard>
            <CapabilityCard index="Capability 03" title="Intelligence fusion">Ingests unclassified threat data, operational context, and policy constraints into a single reasoning surface.</CapabilityCard>
          </div>
        </div>
      </section>
      <CtaStrip onNav={onNav} title="STARCHITECT is operational. Request access or a briefing." cta="Get a tailored demo" />
    </>
  );
}

function Contact() {
  const [sent, setSent] = useState(false);
  return (
    <>
      <header className="hero hero--short">
        <div className="hero__bg" style={{ backgroundImage: `url('${(window.__resources && window.__resources.heroDramatic) || '../../assets/hero-dramatic.webp'}')` }}></div>
        <div className="hero__overlay"></div>
        <div className="container">
          <div className="hero__content">
            <Eyebrow invert>Contact</Eyebrow>
            <h1 className="display display--invert hero__title">Start the conversation.</h1>
            <p className="hero__sub">Tell us what you're building. Someone from leadership responds within one business day.</p>
          </div>
        </div>
      </header>
      <section className="section">
        <div className="container--narrow">
          {sent ? (
            <div style={{ padding: '3rem', background: 'var(--surface-card)', borderLeft: '3px solid var(--aqua-400)' }}>
              <strong style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', color: 'var(--ink-bright)', display: 'block', marginBottom: '0.5rem', letterSpacing: '0.02em' }}>Message received.</strong>
              <p style={{ color: 'var(--slate-600)' }}>Thanks for reaching out. Someone from leadership will respond within one business day.</p>
            </div>
          ) : (
            <form style={{ maxWidth: 640 }} onSubmit={(e) => { e.preventDefault(); setSent(true); }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                <div className="form__group"><label className="form__label">Name</label><input className="form__input" placeholder="Jane Operator" /></div>
                <div className="form__group"><label className="form__label">Organization</label><input className="form__input" placeholder="Agency / Prime" /></div>
              </div>
              <div className="form__group"><label className="form__label">Work email</label><input className="form__input" type="email" placeholder="jane@agency.gov" /></div>
              <div className="form__group"><label className="form__label">How can we help?</label><textarea className="form__textarea" placeholder="Briefly describe your mission need."></textarea></div>
              <Button variant="primary" arrow type="submit">Send message</Button>
            </form>
          )}
        </div>
      </section>
    </>
  );
}

function CtaStrip({ onNav, title, cta = "Get in touch" }) {
  return (
    <section className="cta-strip">
      <div className="cta-strip__bg" style={{ position: 'absolute', inset: 0, background: `url('${(window.__resources && window.__resources.heroSatMin) || '../../assets/hero-sat-min.webp'}') center/cover`, opacity: 0.18 }}></div>
      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '2rem', flexWrap: 'wrap' }}>
          <h2 className="cta-strip__title">{title}</h2>
          <Button variant="accent" arrow onClick={() => onNav('contact')}>{cta}</Button>
        </div>
      </div>
    </section>
  );
}

Object.assign(window, { Home, Starchitect, Contact });
