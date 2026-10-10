/* alidade-sting-v1.js · alidade.us
   ─────────────────────────────────────────────────────────────────────────────
   The intro sting, played ONCE per session as an overlay on the real page.

   Why an overlay and not a gate page.
   hypati.us puts its sting at index.html and redirects to home.html when it
   finishes, which means / is a JavaScript redirect. That is exactly the
   condition the craton-erp.us prerender pass exists to remove: a crawler, a
   link unfurler or an answer engine that does not run scripts gets a redirect
   stub instead of the page. alidade.us is a single page at / and it is the only
   site in the portfolio actually deployed, so it is not worth spending its
   front door on an animation.

   So: / always serves the real page. The sting is drawn on top of it and then
   removed. Three consequences, all of them good —

     · no JavaScript, no sting. The overlay is display:none in the stylesheet
       and is only ever shown by this file, so a crawler sees the page and
       nothing else. There is no black box to strip.
     · no new URL, no second canonical, no sitemap entry, no redirect.
     · prefers-reduced-motion is honoured before anything is loaded, and the
       video is not even fetched in that case.

   Behaviour: once per session (sessionStorage), Skip control, Esc or Enter
   dismisses, a hard ceiling in case the video stalls, and a fade out.
   Any failure at all — no video element, decode error, blocked autoplay —
   dismisses immediately and leaves the page as it was. */
(function () {
  'use strict';

  var KEY   = 'al-intro-seen';
  var LIMIT = 11000;            // hard ceiling; the sting itself is 9.68s
  var FADE  = 320;            // matches --al-dur-slow in css/alidade-v3.css §9

  var el = document.getElementById('al-sting');
  if (!el) return;

  var opened = false;     // focus is only moved if the overlay was actually shown
  var returnTo = null;    // where focus goes back to when it closes

  function remove() {
    if (!el) return;
    var node = el; el = null;
    node.classList.add('is-out');
    document.documentElement.classList.remove('al-sting-locked');
    document.removeEventListener('keydown', onKey);
    if (opened) {
      /* Return focus to the page: whatever held it before, else <main>
         (tabindex="-1"), so the next Tab starts at the top of the content. */
      var target = (returnTo && returnTo !== document.body && document.contains(returnTo))
        ? returnTo : document.getElementById('main');
      if (target && typeof target.focus === 'function') {
        try { target.focus({ preventScroll: true }); } catch (e) { target.focus(); }
      }
    }
    setTimeout(function () { if (node.parentNode) node.parentNode.removeChild(node); }, FADE);
  }

  function onKey(e) {
    if (e.key === 'Escape' || e.key === 'Enter') { remove(); return; }
    /* Skip is the only control in the dialog: keep Tab on it while it is up. */
    if (e.key === 'Tab' && el) {
      var s = el.querySelector('.al-sting__skip');
      if (s) { e.preventDefault(); s.focus(); }
    }
  }

  /* Reduced motion, or already seen this session: never show it, and never
     fetch the video. */
  try {
    if (window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches) { remove(); return; }
    if (sessionStorage.getItem(KEY)) { remove(); return; }
    sessionStorage.setItem(KEY, '1');
  } catch (e) { remove(); return; }   // private mode, blocked storage — just skip

  var v = el.querySelector('video');
  if (!v) { remove(); return; }

  /* Only now are the sources attached, so nothing is downloaded by anyone who
     was never going to see it. Two of them: H.264 for everything, VP9 for
     builds without the proprietary decoder — Chromium compiled from source has
     no H.264 at all, which is how this overlay first tested as "dismisses
     immediately" on an asset that is in fact fine. */
  var srcs = v.querySelectorAll('source[data-src]');
  if (!srcs.length) { remove(); return; }
  for (var i = 0; i < srcs.length; i++) srcs[i].src = srcs[i].getAttribute('data-src');
  v.load();

  returnTo = document.activeElement;
  document.documentElement.classList.add('al-sting-locked');
  el.classList.add('is-on');
  opened = true;

  var skip = el.querySelector('.al-sting__skip');
  if (skip) {
    try { skip.focus({ preventScroll: true }); } catch (e) { skip.focus(); }
  }

  v.addEventListener('canplay', function () { el && el.classList.add('is-ready'); });
  v.addEventListener('ended', remove);
  v.addEventListener('error', remove);
  v.addEventListener('stalled', remove);

  if (skip) skip.addEventListener('click', function (e) { e.preventDefault(); remove(); });
  document.addEventListener('keydown', onKey);

  /* Autoplay can be refused (a muted inline video is normally allowed, but not
     always). play() returning a rejected promise means no sting, not a frozen
     black screen. */
  var played = v.play();
  if (played && typeof played.catch === 'function') played.catch(remove);

  setTimeout(remove, LIMIT);
})();

/* Mobile navigation · disclosure menu.
   Under 980px the inline links are hidden; the .navtoggle button reveals them
   as a panel under the bar. aria-expanded carries the state, Esc closes and
   returns focus to the button, choosing a link closes it, and crossing back
   above 980px resets it. Lives here so the page keeps a single script. */
(function () {
  'use strict';

  var btn = document.querySelector('.navtoggle');
  var menu = btn && document.getElementById(btn.getAttribute('aria-controls'));
  if (!btn || !menu) return;

  function set(open) {
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    menu.classList.toggle('is-open', open);
  }

  btn.addEventListener('click', function () {
    set(btn.getAttribute('aria-expanded') !== 'true');
  });

  menu.addEventListener('click', function (e) {
    if (e.target.closest && e.target.closest('a')) set(false);
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && btn.getAttribute('aria-expanded') === 'true') {
      set(false); btn.focus();
    }
  });

  document.addEventListener('click', function (e) {
    if (btn.getAttribute('aria-expanded') === 'true' &&
        !menu.contains(e.target) && !btn.contains(e.target)) set(false);
  });

  if (window.matchMedia) {
    var wide = matchMedia('(min-width: 981px)');
    var reset = function (m) { if (m.matches) set(false); };
    if (wide.addEventListener) wide.addEventListener('change', reset);
    else if (wide.addListener) wide.addListener(reset);
  }
})();
