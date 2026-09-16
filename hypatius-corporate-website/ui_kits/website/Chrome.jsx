// HYPATIUS website — Nav + Footer chrome
const { useState, useEffect } = React;

function Nav({ active, onNav }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    const root = document.querySelector('.kit-scroll') || window;
    root.addEventListener('scroll', onScroll, { passive: true });
    return () => root.removeEventListener('scroll', onScroll);
  }, []);
  const items = [
    ['about', 'About'], ['platforms', 'Platforms'], ['insights', 'Insights'],
    ['leadership', 'Leadership'], ['contracting', 'Contracting'], ['contact', 'Contact'],
  ];
  return (
    <nav className={`nav ${scrolled ? 'nav--scrolled' : ''} ${open ? 'nav--open' : ''}`}>
      <div className="nav__inner">
        <a className="nav__brand" href="#" onClick={(e) => { e.preventDefault(); onNav('home'); }} aria-label="HYPATIUS home">
          <img className="nav__brand-img" src={(window.__resources && window.__resources.wordmark) || "../../assets/hypatius-wordmark.png"} alt="HYPATIUS" />
        </a>
        <ul className="nav__items">
          {items.map(([id, label]) => (
            <li key={id}>
              <a className={`nav__link ${active === id ? 'nav__link--active' : ''}`}
                 href="#" onClick={(e) => { e.preventDefault(); onNav(id); setOpen(false); }}>
                {label}
              </a>
            </li>
          ))}
        </ul>
        <a className="nav__cta" href="#" onClick={(e) => { e.preventDefault(); onNav('contact'); }}>
          Get in touch <span aria-hidden="true">→</span>
        </a>
        <button className="nav__toggle" aria-label="Toggle menu" onClick={() => setOpen(o => !o)}>
          <span></span><span></span><span></span>
        </button>
      </div>
    </nav>
  );
}

function Footer({ onNav }) {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__top">
          <div>
            <a className="nav__brand" href="#" onClick={(e) => { e.preventDefault(); onNav('home'); }} aria-label="HYPATIUS home">
              <img className="nav__brand-img" style={{ height: '1.7rem' }} src={(window.__resources && window.__resources.wordmark) || "../../assets/hypatius-wordmark.png"} alt="HYPATIUS" />
            </a>
            <p className="footer__tagline">Clarity for contested environments. Defense technology, headquartered in Charleston, SC.</p>
          </div>
          <div>
            <h4 className="footer__col-title">Platforms</h4>
            <ul className="footer__list">
              <li><a href="#" onClick={(e) => { e.preventDefault(); onNav('starchitect'); }}>STARCHITECT</a></li>
              <li><a href="#" onClick={(e) => { e.preventDefault(); onNav('platforms'); }}>ALIDADE</a></li>
              <li><a href="#" onClick={(e) => { e.preventDefault(); onNav('platforms'); }}>CRATON <span style={{ opacity: 0.5 }}>(soon)</span></a></li>
            </ul>
          </div>
          <div>
            <h4 className="footer__col-title">Company</h4>
            <ul className="footer__list">
              <li><a href="#" onClick={(e) => { e.preventDefault(); onNav('about'); }}>About</a></li>
              <li><a href="#" onClick={(e) => { e.preventDefault(); onNav('contact'); }}>Contact</a></li>
            </ul>
          </div>
          <div>
            <h4 className="footer__col-title">Direct</h4>
            <ul className="footer__list">
              <li><a href="mailto:leadership@hypati.us">leadership@hypati.us</a></li>
              <li><a href="tel:+12532304166">253.230.4166</a></li>
              <li>Charleston, SC</li>
            </ul>
          </div>
        </div>
        <div className="footer__bottom">
          <span className="mono">© 2026 HYPATIUS LLC · UEI UKELB3UV76V6 · CAGE 19S89</span>
          <span className="mono">hypati.us</span>
        </div>
      </div>
    </footer>
  );
}

Object.assign(window, { Nav, Footer });
