const { Button, Eyebrow, Beam, Stamp, StatusBadge, PlatformTile, CapabilityCard, PostCard, Input, Select, Checkbox } = window.HYPATIUSDesignSystem_bfc918;

function Hero({ image, eyebrow, title, sub, ctas, short }) {
  return (
    <section className={`hero ${short ? 'hero--medium' : ''}`}>
      <div className="hero__bg" style={{backgroundImage:`url('${image}')`}} />
      <div className="hero__overlay" />
      <div className="container hero__content">
        <Eyebrow invert>{eyebrow}</Eyebrow>
        <h1 className="display hero__title">{title}</h1>
        <p className="hero__sub">{sub}</p>
        <p className="hero__cred">UEI UKELB3UV76V6 · CAGE 19S89</p>
        <div className="hero__ctas">{ctas}</div>
      </div>
    </section>
  );
}

function Home({ go }) {
  return (
    <>
      <Hero image="../../assets/imagery/hero-orbital.jpg"
        eyebrow="Defense technology · Charleston, SC"
        title="Clarity for contested environments."
        sub="The software operating layer for contested-domain defense. Three platforms. One operating philosophy."
        ctas={<>
          <Button variant="accent" arrow onClick={()=>go('contact')}>Request a briefing</Button>
          <Button variant="ghost" onClick={()=>go('platforms')}>Explore the platforms</Button>
        </>} />
      <section className="section">
        <div className="container">
          <Eyebrow>The portfolio</Eyebrow>
          <h2 className="display display--md" style={{maxWidth:'20ch',marginTop:'1rem'}}>Three platforms. One operating philosophy.</h2>
          <div className="platform-grid">
            <PlatformTile label="STARCHITECT" status="Live" description="The operating system for space wargaming and BMC3I. High-fidelity orbital mechanics and distributed AI." linkLabel="Launch" href="#" />
            <PlatformTile label="ALIDADE" status="Live" description="Research & logistics intelligence. Everything a scenario needs that is not a maneuver." linkLabel="Launch" href="#" />
            <PlatformTile label="CRATON" status="In development" muted description="Deterministic, audit-ready ERP foundation engineered for DCAA compliance and cryptographic data isolation." linkLabel="Read the brief" href="#" />
          </div>
        </div>
      </section>
      <section className="section section--navy">
        <div className="container split">
          <div className="split__heading">
            <Eyebrow invert>Why it matters</Eyebrow>
            <h2 className="display display--md" style={{marginTop:'1rem'}}>90% accuracy is a 100% failure rate.</h2>
            <Beam invert />
          </div>
          <div className="pillars" style={{marginTop:0,gridTemplateColumns:'1fr 1fr'}}>
            <div className="pillar"><span className="pillar__num">01</span><div className="pillar__title">Survivable</div><p className="pillar__desc">Five-tier PACE survivability to fight through denied, disrupted, intermittent, and limited (DDIL) conditions.</p></div>
            <div className="pillar"><span className="pillar__num">02</span><div className="pillar__title">Reviewable</div><p className="pillar__desc">AI-assisted analysis ships with a complete, reviewable record of every run — inputs, tools called, outputs.</p></div>
            <div className="pillar"><span className="pillar__num">03</span><div className="pillar__title">Open</div><p className="pillar__desc">API-first with generated SDKs. Primes inject proprietary physics as compiled binaries into a sandbox vault.</p></div>
            <div className="pillar"><span className="pillar__num">04</span><div className="pillar__title">Measured</div><p className="pillar__desc">Measures — MOMs, MOEs, MOPs — not metrics. Time to decision is the number that matters.</p></div>
          </div>
        </div>
      </section>
      <section className="section">
        <div className="container">
          <Eyebrow>Capabilities</Eyebrow>
          <div className="cap-grid">
            <CapabilityCard index="01" title="Physics core">Aerospace-grade astrodynamics orchestrated with packet-level network simulation.</CapabilityCard>
            <CapabilityCard index="02" title="Decision support">Multi-domain sensor fusion into operator-verified courses of action.</CapabilityCard>
            <CapabilityCard index="03" title="Decentralized mesh">Every node a complete operational stack across a managed cluster.</CapabilityCard>
          </div>
        </div>
      </section>
      <CTA go={go} />
    </>
  );
}

function Platforms({ go }) {
  return (
    <>
      <Hero short image="../../assets/imagery/platforms-hero.jpg" eyebrow="The platforms"
        title="The operating layer, in three parts."
        sub="Each platform stands alone and composes with the others. The architecture never changes; the domain does."
        ctas={<Button variant="accent" arrow onClick={()=>go('contact')}>Get a tailored demo</Button>} />
      {[
        { label:'STARCHITECT', status:'Live', img:'../../assets/imagery/plat-starchitect.jpg', copy:'The operating system for space wargaming and BMC3I. High-fidelity orbital mechanics, packet-level network simulation, and an AI battlespace correlator that fuses multi-domain feeds into operator-verified courses of action.', facts:[['Domain','Space · BMC3I'],['Interface','React + 3D orbital visualization'],['Survivability','Five-tier PACE']] },
        { label:'ALIDADE', status:'Live', img:'../../assets/imagery/plat-alidade.jpg', copy:'Research & logistics intelligence. Relationship graphs and market signals that sight the bearing to a win: who builds it, who holds the contract, what it costs to sustain, how long it takes to buy, under which authority.', facts:[['Domain','Research & logistics'],['Delivery','Embedded · connected · packaged'],['Record','Provenance on every call']] },
        { label:'CRATON', status:'In development', img:'../../assets/imagery/plat-craton.jpg', copy:'A deterministic, audit-ready ERP foundation engineered for DCAA compliance and cryptographic data isolation.', facts:[['Domain','Business systems'],['Status','In development'],['Posture','Audit-ready by construction']] },
      ].map((p) => (
        <section className="section" key={p.label} style={{paddingBlock:'var(--section-y)'}}>
          <div className="container split">
            <div className="split__heading">
              <StatusBadge tone={p.status==='Live'?'live':'dev'}>{p.status}</StatusBadge>
              <h2 className="display display--md" style={{marginTop:'1rem',letterSpacing:'0.04em'}}>{p.label}</h2>
              <Beam />
              <img src={p.img} alt="" style={{marginTop:'1.5rem',aspectRatio:'16/10',objectFit:'cover',width:'100%'}} />
            </div>
            <div>
              <p className="lede" style={{fontSize:'1.25rem'}}>{p.copy}</p>
              <div style={{marginTop:'2.5rem',display:'grid',gap:0}}>
                {p.facts.map(([k,v]) => (
                  <div key={k} style={{display:'grid',gridTemplateColumns:'180px 1fr',gap:24,padding:'16px 0',borderTop:'1px solid var(--border-hairline)'}}>
                    <span style={{fontFamily:'var(--font-mono)',fontSize:11,letterSpacing:'0.18em',textTransform:'uppercase',color:'var(--text-muted)'}}>{k}</span>
                    <span style={{color:'var(--text-bright)'}}>{v}</span>
                  </div>
                ))}
              </div>
              <div style={{marginTop:'2rem'}}><Button variant="primary" arrow external href="#">Launch {p.label}</Button></div>
            </div>
          </div>
        </section>
      ))}
      <CTA go={go} />
    </>
  );
}

function Company({ go }) {
  const team = [
    ['SK','Stan Kennedy','Co-Founder & Chief Executive Officer','Leads the company and its customer engagements across defense, aerospace and government contracting.'],
    ['JL','James LeMieux','Founder & Chief Technology Officer','Architect of the platform stack: astrodynamics, network simulation, and the decentralized command mesh.'],
    ['JB','Jordan Broe','Co-Founder & Chief Mission Product Officer','Owns product design and user experience, and the connective vision across STARCHITECT, ALIDADE and CRATON \u2014 ensuring the technology meets real mission need.'],
    ['SL','Shawna LeMieux','Chief of Staff','Runs operations, contracts administration and internal cadence.'],
  ];
  return (
    <>
      <Hero short image="../../assets/imagery/why-shield.jpg" eyebrow="The company"
        title="A small business built for hard problems."
        sub="HYPATIUS is a small business and non-traditional defense contractor in Charleston, South Carolina."
        ctas={<Button variant="ghost" arrow onClick={()=>go('contact')}>Talk to leadership</Button>} />
      <section className="section">
        <div className="container">
          <Eyebrow>Leadership</Eyebrow>
          <div className="team-grid">
            {team.map(([i,n,r,b]) => (
              <div className="team-card" key={n}>
                <div className="team-card__avatar">{i}</div>
                <div className="team-card__name">{n}</div>
                <div className="team-card__role">{r}</div>
                <p className="team-card__bio">{b}</p>
              </div>
            ))}
          </div>
          <p className="lede" style={{marginTop:'2.5rem'}}>Maureen O'Brien serves as Executive Advisor.</p>
        </div>
      </section>
      <section className="section section--navy">
        <div className="container">
          <Eyebrow invert>Contracting</Eyebrow>
          <h2 className="display display--md" style={{marginTop:'1rem',maxWidth:'22ch'}}>Small-business set-aside. Non-traditional defense contractor.</h2>
          <div className="pathways">
            <div className="pathway-card"><div className="pathway-card__label">Pathway</div><div className="pathway-card__title">SBIR Phase III</div><p className="pathway-card__desc">Sole-source authority for work derived from prior competitively awarded SBIR efforts.</p></div>
            <div className="pathway-card"><div className="pathway-card__label">Pathway</div><div className="pathway-card__title">OTA</div><p className="pathway-card__desc">Other Transaction Authority for prototype development with non-traditional performers.</p></div>
            <div className="pathway-card"><div className="pathway-card__label">Pathway</div><div className="pathway-card__title">CSO</div><p className="pathway-card__desc">Commercial Solutions Openings for competitive, commercially derived capability.</p></div>
          </div>
          <div style={{marginTop:'2.5rem'}}><Stamp /></div>
        </div>
      </section>
      <CTA go={go} />
    </>
  );
}

function Insights({ go }) {
  const [filter, setFilter] = React.useState('All');
  const posts = [
    ['Field notes','The kill chain has collapsed into seconds.','James LeMieux · 04 / 2026'],
    ['Doctrine','Measures, not metrics: MOMs, MOEs and MOPs in practice.','Stan Kennedy · 03 / 2026'],
    ['Field notes','Fighting through DDIL: what five-tier PACE buys you.','James LeMieux · 03 / 2026'],
    ['Position','Non-traditional does not mean unproven.','Jordan Broe · 02 / 2026'],
    ['Doctrine','A reviewable record is the only defensible AI posture.','Stan Kennedy · 02 / 2026'],
    ['Position','STK does physics. STARCHITECT does physics and warfare.','Jordan Broe · 01 / 2026'],
  ];
  const cats = ['All','Field notes','Doctrine','Position'];
  const shown = filter==='All' ? posts : posts.filter(p => p[0]===filter);
  return (
    <>
      <Hero short image="../../assets/imagery/hero-battlespace.jpg" eyebrow="Insights"
        title="Field notes from contested domains."
        sub="Doctrine, engineering notes and positions. Every external claim carries a citation."
        ctas={<Button variant="ghost" arrow onClick={()=>go('contact')}>Request a briefing</Button>} />
      <section className="section">
        <div className="container">
          <div className="filter-chips">
            {cats.map(c => <button key={c} className={`chip ${filter===c?'chip--active':''}`} onClick={()=>setFilter(c)}>{c}</button>)}
          </div>
          <div className="post-grid">
            {shown.map(([c,t,b]) => <PostCard key={t} category={c} title={t} byline={b} href="#" />)}
          </div>
        </div>
      </section>
      <CTA go={go} />
    </>
  );
}

function Contact() {
  const [sent, setSent] = React.useState(false);
  return (
    <section className="section" style={{paddingTop:'12rem'}}>
      <div className="container split">
        <div className="split__heading">
          <Eyebrow>Request a briefing</Eyebrow>
          <h2 className="display display--md" style={{marginTop:'1rem',maxWidth:'16ch'}}>Tell us what you're building.</h2>
          <Beam />
          <p className="lede">leadership@hypati.us · 253.230.4166 · Charleston, SC</p>
          <div style={{marginTop:'1.5rem'}}><Stamp /></div>
        </div>
        <div>
          {sent ? (
            <div className="cap-card">
              <div className="cap-card__num">Received</div>
              <div className="cap-card__title">Briefing request logged</div>
              <p className="cap-card__desc">Leadership will respond within two business days. This is a static recreation — nothing was transmitted.</p>
            </div>
          ) : (
            <form onSubmit={(e)=>{e.preventDefault();setSent(true);}}>
              <Input label="Name" placeholder="Full name" required />
              <Input label="Organization" placeholder="Unit, agency, or company" />
              <Input label="Email" type="email" placeholder="name@agency.gov" required />
              <Select label="Acquisition pathway"><option>Not sure yet</option><option>SBIR Phase III</option><option>OTA</option><option>CSO</option></Select>
              <Input label="What are you building?" multiline rows={4} placeholder="Mission, domain, timeline" />
              <Checkbox label="I understand this briefing covers unclassified capability only." />
              <Button variant="primary" arrow>Send request</Button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}

function CTA({ go }) {
  return (
    <section className="cta-strip">
      <div className="container" style={{display:'flex',alignItems:'center',justifyContent:'space-between',gap:'2rem',flexWrap:'wrap'}}>
        <div>
          <h2 className="cta-strip__title">Clarity for contested environments.</h2>
          <div style={{marginTop:'1rem'}}><Stamp /></div>
        </div>
        <Button variant="accent" arrow onClick={()=>go('contact')}>Request a briefing</Button>
      </div>
    </section>
  );
}

Object.assign(window, { Home, Platforms, Company, Insights, Contact, Hero, CTA });
