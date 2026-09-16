const { Pill, Avatar, Field, KpiCard, WinScore, SignatureBar, AlidadeGauge, PursuitRow, PartnerCard, ApprovalGate, WatermarkBlock, SignalRow } = window.HYPATIUSDesignSystem_bfc918;

function Ledger({ rows }) {
  return (
    <div className="crd" style={{padding:'10px 12px'}}>
      <div className="lbl" style={{marginBottom:8}}>Run ledger · provenance</div>
      <div style={{display:'grid',gap:6}}>
        {rows.map(([t,tool,result])=>(
          <div key={t} className="al-ledger">
            <span style={{minWidth:58}}>{t}</span>
            <span className="al-ledger__tool" style={{minWidth:170}}>{tool}</span>
            <span style={{color:'var(--al-t2)'}}>{result}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function Briefing({ D, open }) {
  return (
    <div style={{display:'grid',gridTemplateColumns:'1.4fr 1fr',gap:14,alignItems:'start'}}>
      <div style={{display:'grid',gap:12}}>
        <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:10}}>
          <KpiCard label="Open pursuits" value="12" meta="4 closing this month" />
          <KpiCard label="Teaming candidates" value="3" meta="2 awaiting opt-in" />
          <KpiCard label="Median lead time" value="92d" meta="OTA pathway" />
          <KpiCard label="Days to deadline" value="3" meta="Proposal not started" urgent />
        </div>
        <div className="crd">
          <div style={{padding:'10px 14px',borderBottom:'0.5px solid var(--al-bf)',display:'flex',alignItems:'center'}}>
            <span style={{fontSize:16,fontWeight:500,color:'var(--al-t1)'}}>Priority pursuits</span>
            <span className="lbl" style={{marginLeft:'auto'}}>Bearing taken 09:41</span>
          </div>
          <div style={{display:'grid',gap:1,padding:'8px 8px 10px'}}>
            {D.pursuits.slice(0,4).map((p)=>(
              <PursuitRow key={p.title} signal={p.signal} score={p.score} scores={p.scores} was={p.was}
                pills={[<Pill key="a" tone="neutral">{p.agency}</Pill>, ...(p.flag?[<Pill key="b" tone={p.flag.startsWith('Gap')?'coral':'gold'}>{p.flag}</Pill>]:[])]}
                title={p.title} meta={p.meta}
                action={<button className="btn-p" onClick={open}>Open</button>} />
            ))}
          </div>
        </div>
        <Ledger rows={D.ledger} />
      </div>
      <div style={{display:'grid',gap:12}}>
        <div className="crd" style={{padding:'16px 14px',display:'grid',justifyItems:'center',gap:10}}>
          <AlidadeGauge score={88} size={180} />
          <div style={{fontSize:11,color:'var(--al-t2)',textAlign:'center',maxWidth:'34ch'}}>Resilient PNT for contested orbits. Seven weighted factors; the bearing points to the win.</div>
        </div>
        <div className="crd">
          <div style={{padding:'10px 12px',borderBottom:'0.5px solid var(--al-bf)'}}><span className="lbl">GovFeed signals</span></div>
          {D.signals.map((s)=>(<SignalRow key={s.text} sentiment={s.sentiment} source={s.source} last={s.last}>{s.text}</SignalRow>))}
        </div>
      </div>
    </div>
  );
}

function OpenBids({ D, open }) {
  const [sort,setSort]=React.useState('score');
  const rows=[...D.pursuits].sort((a,b)=>sort==='score'?b.score-a.score:0);
  return (
    <div style={{display:'grid',gap:12}}>
      <div style={{display:'flex',alignItems:'center',gap:10}}>
        <Field placeholder="Filter by agency, NAICS, or authority" style={{maxWidth:360}} />
        <Field value="NAICS 541715" filled badge="FROM GRAPH" style={{maxWidth:200}} />
        <button className={sort==='score'?'btn-p':'btn-s'} onClick={()=>setSort('score')}>Sort by win score</button>
        <button className={sort==='date'?'btn-p':'btn-s'} onClick={()=>setSort('date')}>Sort by close date</button>
      </div>
      <div style={{display:'grid',gap:8}}>
        {rows.map((p)=>(
          <PursuitRow key={p.title} signal={p.signal} score={p.score} scores={p.scores} was={p.was}
            pills={[<Pill key="a" tone="neutral">{p.agency}</Pill>, ...(p.flag?[<Pill key="b" tone={p.flag.startsWith('Gap')?'coral':'gold'}>{p.flag}</Pill>]:[])]}
            title={p.title} meta={p.meta}
            action={<div style={{display:'flex',gap:6}}><button className="btn-s">Graph</button><button className="btn-p" onClick={open}>Build bid</button></div>} />
        ))}
      </div>
      <p style={{fontFamily:'var(--font-mono)',fontSize:9,letterSpacing:'0.08em',color:'var(--al-t3)'}}>SCORE COLOR IS CALCULATED, NEVER HARDCODED · ≥80 TEAL · ≥60 GOLD · ELSE CORAL · BANDS MATCH THE LIVE APP</p>
    </div>
  );
}

function Partners({ D }) {
  const [resolved,setResolved]=React.useState({});
  return (
    <div style={{display:'grid',gridTemplateColumns:'1.3fr 1fr',gap:14,alignItems:'start'}}>
      <div style={{display:'grid',gap:10}}>
        <div className="crd" style={{padding:'12px 14px'}}>
          <span style={{fontSize:16,fontWeight:500,color:'var(--al-t1)'}}>Double-blind matches</span>
          <p style={{fontSize:11,color:'var(--al-t2)',marginTop:6,lineHeight:1.5}}>Connection runs on consent — a signed grant that travels with every tool call. Identity resolves only on mutual opt-in.</p>
        </div>
        {D.partners.map((p,i)=>(
          <PartnerCard key={p.handle||p.firm} {...p} resolved={p.resolved||!!resolved[i]}
            action={p.resolved||resolved[i]
              ? <button className="btn-s">Open NDA</button>
              : <button className="btn-p" onClick={()=>setResolved((r)=>({...r,[i]:true}))}>Request connection</button>} />
        ))}
      </div>
      <div style={{display:'grid',gap:10}}>
        <div className="crd" style={{padding:'12px 14px'}}>
          <div className="lbl" style={{marginBottom:8}}>Capability gap</div>
          <div style={{display:'flex',alignItems:'center',gap:12}}>
            <WinScore score={71} label="Win" />
            <div style={{flex:1,fontSize:11,color:'var(--al-t2)',lineHeight:1.5}}>Thermal qualification is the single factor holding this pursuit below 80. Two partners fill it.</div>
          </div>
          <div style={{marginTop:10,display:'flex',alignItems:'center',gap:8}}>
            <SignatureBar scores={[74,70,68,58,72,80,60]} width={64} height={12} />
            <span className="lbl">Seven-factor signature</span>
          </div>
        </div>
        <div className="crd" style={{padding:'12px 14px'}}>
          <div className="lbl" style={{marginBottom:8}}>Grants in force</div>
          {[['PARTNER-4417-A','Scope: past performance, NAICS'],['MERIDIAN THERMAL','Scope: thermal qual, teaming']].map(([h,s])=>(
            <div key={h} className="al-edge" style={{padding:'8px 10px',background:'var(--al-srf2)',borderLeftColor:'var(--al-violet)',marginBottom:6}}>
              <div style={{fontFamily:'var(--font-mono)',fontSize:10,color:'var(--al-violet)',letterSpacing:'0.06em'}}>{h}</div>
              <div style={{fontSize:11,color:'var(--al-t2)',marginTop:2}}>{s}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function BidBuilder({ D }) {
  const [sent,setSent]=React.useState(false);
  return (
    <div style={{display:'grid',gridTemplateColumns:'1.4fr 1fr',gap:14,alignItems:'start'}}>
      <div style={{display:'grid',gap:12}}>
        <div className="crd" style={{padding:'12px 14px'}}>
          <span style={{fontSize:16,fontWeight:500,color:'var(--al-t1)'}}>Resilient PNT for contested orbits — SBIR Phase II</span>
          <div style={{display:'flex',gap:6,marginTop:8,flexWrap:'wrap'}}>
            <Pill tone="neutral">SPACEWERX</Pill><Pill tone="teal">Win 88</Pill><Pill tone="gold">Approval pending</Pill><Pill tone="violet">1 partner block</Pill>
          </div>
        </div>
        <div className="crd">
          <div style={{padding:'10px 14px',borderBottom:'0.5px solid var(--al-bf)'}}><span className="lbl">Technical volume · draft</span></div>
          <div style={{padding:'12px 14px',display:'grid',gap:10}}>
            <p style={{fontFamily:'var(--font-serif)',fontSize:13,lineHeight:1.65,color:'var(--al-t1)',margin:0}}>
              The proposed effort delivers a resilient positioning, navigation and timing capability that degrades gracefully under denied, disrupted, intermittent, and limited (DDIL) conditions. Past performance is drawn from two prior awards resolved from the performer graph.
            </p>
            <WatermarkBlock provenance="Contributed by partner 4417-A · IP watermarked until export">
              Thermal qualification heritage across 14 flight units, including two GEO servicing buses qualified to AS9100 with full traceability.
            </WatermarkBlock>
            <ApprovalGate section="Technical volume" requestedAgo="2 hours ago"
              reviewer={<><Avatar initials="JL" tone="teal" /> James LeMieux</>}
              body="Past-performance citations resolved from the performer graph. Sign-off required before export."
              onRemind={()=>setSent(true)} onContinue={()=>setSent(false)} />
            {sent && <div className="al-edge" style={{padding:'8px 10px',background:'var(--al-srf2)',borderLeftColor:'var(--al-gold)',fontSize:11,color:'var(--al-t2)'}}>Reminder sent to James LeMieux · logged to the run ledger.</div>}
          </div>
        </div>
      </div>
      <div style={{display:'grid',gap:12}}>
        <div className="crd" style={{padding:'12px 14px',display:'grid',gap:8}}>
          <div className="lbl">Compliance checks</div>
          {[['Volume page count','Within limit','teal'],['NAICS alignment','541715 confirmed','teal'],['Cost narrative','Not started','coral'],['Past performance','2 of 3 citations','gold']].map(([k,v,tone])=>(
            <div key={k} style={{display:'flex',alignItems:'center',gap:8,fontSize:11}}>
              <span style={{flex:1,color:'var(--al-t2)'}}>{k}</span><Pill tone={tone}>{v}</Pill>
            </div>
          ))}
        </div>
        <Ledger rows={D.ledger} />
      </div>
    </div>
  );
}

Object.assign(window, { Briefing, OpenBids, Partners, BidBuilder, Ledger });
