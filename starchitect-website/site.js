/* STARCHITECT redesign — shared site behavior
   Nav scroll state, mobile toggle, scroll reveals, stat count-up,
   scroll-spy active nav, and the briefing form flow.  */
(function () {
  // --- Nav scroll state ---
  const nav = document.querySelector('.nav');
  if (nav) {
    const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  // --- Mobile toggle ---
  window.toggleNav = function () {
    const links = document.getElementById('navLinks');
    if (links) links.classList.toggle('open');
  };
  document.querySelectorAll('#navLinks a').forEach(a =>
    a.addEventListener('click', () => document.getElementById('navLinks').classList.remove('open')));

  // --- Scroll reveal ---
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
  }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
  document.querySelectorAll('.reveal').forEach(el => io.observe(el));

  // --- Stat count-up ---
  function animateStat(el) {
    const raw = el.getAttribute('data-count');
    if (!raw) return;
    const target = parseFloat(raw);
    const suffix = el.getAttribute('data-suffix') || '';
    const prefix = el.getAttribute('data-prefix') || '';
    const dur = 1200; const start = performance.now();
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) { el.textContent = prefix + raw + suffix; return; }
    function tick(now) {
      const p = Math.min((now - start) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      const val = target * eased;
      el.textContent = prefix + (Number.isInteger(target) ? Math.round(val) : val.toFixed(1)) + suffix;
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }
  const statIO = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { animateStat(e.target); statIO.unobserve(e.target); } });
  }, { threshold: 0.6 });
  document.querySelectorAll('[data-count]').forEach(el => statIO.observe(el));

  // --- Scroll-spy active nav (in-page anchors) ---
  const spyLinks = [...document.querySelectorAll('[data-spy]')];
  if (spyLinks.length) {
    const sections = spyLinks.map(l => document.querySelector(l.getAttribute('href'))).filter(Boolean);
    const spyIO = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          spyLinks.forEach(l => l.classList.toggle('active', l.getAttribute('href') === '#' + e.target.id));
        }
      });
    }, { threshold: 0.4, rootMargin: '-20% 0px -55% 0px' });
    sections.forEach(s => spyIO.observe(s));
  }

  // --- Briefing form flow ---
  const form = document.getElementById('briefingForm');
  if (form) {
    const leadType = form.querySelector('[name="lead_type"]');
    if (leadType) {
      leadType.addEventListener('change', () => {
        form.querySelectorAll('.branch').forEach(b => b.classList.remove('active'));
        const b = form.querySelector('.branch[data-branch="' + leadType.value + '"]');
        if (b) b.classList.add('active');
      });
    }
    // Phase 1: compose a mailto: to leadership@hypati.us with every field, open
    // it, then show the confirmation (it used to fake success and send nothing).
    // Native validation, including the required U.S. Person / ITAR attestation,
    // runs before submit fires.
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const v = (n) => { const el = form.elements[n]; return el ? String(el.value || '').trim() : ''; };
      const typeEl = form.elements['lead_type'];
      const typeLabel = typeEl && typeEl.selectedIndex > 0 ? typeEl.options[typeEl.selectedIndex].text : '';
      const branchMap = { gov: ['agency', 'Agency or component'], prime: ['program', 'Program or division'],
                          investor: ['firm_type', 'Firm type'], press: ['publication', 'Publication'] };
      const lines = [
        'Full name: ' + v('name'),
        'Work email: ' + v('email'),
        'Organization: ' + v('organization'),
        'Which best describes you: ' + typeLabel
      ];
      const br = branchMap[v('lead_type')];
      if (br) lines.push(br[1] + ': ' + v(br[0]));
      const us = form.elements['us_person'];
      lines.push('U.S. Person attestation (ITAR 22 C.F.R. 120.62): ' + (us && us.checked ? 'Confirmed' : 'Not confirmed'));
      window.location.href = 'mailto:leadership@hypati.us?subject=' +
        encodeURIComponent('STARCHITECT briefing request \u2014 ' + v('organization')) +
        '&body=' + encodeURIComponent(lines.join('\r\n'));
      const fields = document.getElementById('formFields');
      const success = document.getElementById('formSuccess');
      if (fields && success) {
        fields.style.display = 'none';
        success.classList.add('active');
      }
    });
  }
})();
