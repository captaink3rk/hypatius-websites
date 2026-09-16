const { Button, Stamp } = window.HYPATIUSDesignSystem_bfc918;

function Nav({ page, go, theme, setTheme }) {
  const [scrolled, setScrolled] = React.useState(false);
  React.useEffect(() => {
    const el = document.querySelector('.kit-scroll');
    if (!el) return;
    const onScroll = () => setScrolled(el.scrollTop > 40);
    el.addEventListener('scroll', onScroll);
    return () => el.removeEventListener('scroll', onScroll);
  }, []);
  const items = [['home','Home'],['platforms','Platforms'],['company','Company'],['insights','Insights']];
  return (
    <nav className={`nav ${scrolled ? 'nav--scrolled' : ''}`}>
      <div className="nav__inner">
        <a className="nav__brand" href="#" onClick={(e)=>{e.preventDefault();go('home');}}>
          <span className="nav__brand-mark" />
          <img className="nav__brand-img" src="../../assets/brand/hypatius-wordmark.png" alt="HYPATIUS" />
        </a>
        <ul className="nav__items">
          {items.map(([id,label]) => (
            <li key={id}><a className={`nav__link ${page===id?'nav__link--active':''}`} href="#" onClick={(e)=>{e.preventDefault();go(id);}}>{label}</a></li>
          ))}
          <li><a className="nav__cta" href="#" onClick={(e)=>{e.preventDefault();go('contact');}}>Request a briefing <span aria-hidden="true">→</span></a></li>
        </ul>
      </div>
      <button onClick={()=>setTheme(theme==='light'?'dark':'light')}
        style={{position:'fixed',bottom:20,right:20,zIndex:200,fontFamily:'var(--font-mono)',fontSize:10,letterSpacing:'0.16em',padding:'8px 12px',border:'1px solid var(--border-medium)',background:'var(--surface-card)',color:'var(--text-muted)'}}>
        {theme==='light'?'BLACKOUT':'LIGHT'}
      </button>
    </nav>
  );
}

function Footer({ go }) {
  const cols = [
    ['Platforms', ['STARCHITECT','ALIDADE','CRATON']],
    ['Company', ['Leadership','Contracting','Insights']],
    ['Contact', ['leadership@hypati.us','253.230.4166','Charleston, SC']],
  ];
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__top">
          <div>
            <a className="nav__brand" href="#" onClick={(e)=>{e.preventDefault();go('home');}}>
              <span className="nav__brand-mark" />
              <img className="nav__brand-img" src="../../assets/brand/hypatius-wordmark.png" alt="HYPATIUS" />
            </a>
            <p className="footer__tagline">Clarity for contested environments. Small business · non-traditional defense contractor.</p>
          </div>
          {cols.map(([title, links]) => (
            <div key={title}>
              <div className="footer__col-title">{title}</div>
              <ul className="footer__list">{links.map(l => <li key={l}><a href="#">{l}</a></li>)}</ul>
            </div>
          ))}
        </div>
        <div className="footer__bottom">
          <Stamp />
          <span>hypati.us · starchitect.us · alidade.us</span>
        </div>
      </div>
    </footer>
  );
}

Object.assign(window, { Nav, Footer });
