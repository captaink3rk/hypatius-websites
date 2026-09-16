const { Pill, Avatar, Field, Tabs } = window.HYPATIUSDesignSystem_bfc918;

const RAIL=[['ti-compass','Bearings'],['ti-search','Research'],['ti-affiliate','Graph'],['ti-users-group','Teaming'],['ti-file-text','Proposal'],['ti-chart-histogram','Reporting']];

function Shell({ tab, setTab, children }) {
  const [rail,setRail]=React.useState(0);
  return (
    <div data-brand="alidade" style={{minHeight:'100vh',display:'flex',background:'var(--al-bg)',fontFamily:'var(--font-interface)',color:'var(--al-t2)'}}>
      <div className="navrail" style={{borderRight:'0.5px solid var(--al-bf)'}}>
        <img src="../../assets/brand/alidade-mark.png" alt="ALIDADE" style={{width:26,marginBottom:10,filter:'drop-shadow(0 0 12px rgba(33,224,205,.45))'}} />
        {RAIL.map(([icon,label],i)=>(
          <div key={label} title={label} className={`navi ${rail===i?'on':''}`} onClick={()=>setRail(i)}><i className={`ti ${icon}`} /></div>
        ))}
      </div>
      <div style={{flex:1,minWidth:0,display:'flex',flexDirection:'column'}}>
        <div className="topbar">
          <span style={{fontSize:13,fontWeight:500,color:'var(--al-t1)'}}>{RAIL[rail][1]}</span>
          <div className="search-bar"><i className="ti ti-search" /> Search opportunities, performers, NAICS</div>
          <Pill tone="teal" live>Live</Pill>
          <Pill tone="neutral">TENANT · HYPATIUS</Pill>
          <Avatar initials="SK" tone="teal" size={26} />
        </div>
        <div style={{padding:'12px 16px',borderBottom:'0.5px solid var(--al-bf)'}}>
          <Tabs active={tab} onChange={setTab} tabs={[
            {id:'brief',label:'Morning briefing'},
            {id:'bids',label:'Open bids',count:12},
            {id:'partners',label:'Partner marketplace',count:3,countTone:'teal'},
            {id:'builder',label:'Bid builder',count:1,countTone:'coral'},
          ]} />
        </div>
        <div style={{flex:1,overflow:'auto',padding:'14px 16px'}}>{children}</div>
        <div style={{padding:'8px 16px',borderTop:'0.5px solid var(--al-bf)',display:'flex',gap:14,alignItems:'center',fontFamily:'var(--font-mono)',fontSize:9,letterSpacing:'0.08em',color:'var(--al-t3)'}}>
          <span>ALIDADE · A HYPATIUS PLATFORM</span><span>UEI UKELB3UV76V6 · CAGE 19S89</span>
          <span style={{marginLeft:'auto'}}>EMBEDDED MODE · TOOL GROUPS: RESEARCH · GRAPH · TEAMING · LOGISTICS · PROPOSAL · REPORTING</span>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { Shell });
