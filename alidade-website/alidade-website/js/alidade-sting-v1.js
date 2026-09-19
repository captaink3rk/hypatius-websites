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
  var FADE  = 700;

  var el = document.getElementById('al-sting');
  if (!el) return;

  function remove() {
    if (!el) return;
    var node = el; el = null;
    node.classList.add('is-out');
    document.documentElement.classList.remove('al-sting-locked');
    setTimeout(function () { if (node.parentNode) node.parentNode.removeChild(node); }, FADE);
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

  document.documentElement.classList.add('al-sting-locked');
  el.classList.add('is-on');

  var skip = el.querySelector('.al-sting__skip');

  v.addEventListener('canplay', function () { el && el.classList.add('is-ready'); });
  v.addEventListener('ended', remove);
  v.addEventListener('error', remove);
  v.addEventListener('stalled', remove);

  if (skip) skip.addEventListener('click', function (e) { e.preventDefault(); remove(); });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' || e.key === 'Enter') remove();
  });

  /* Autoplay can be refused (a muted inline video is normally allowed, but not
     always). play() returning a rejected promise means no sting, not a frozen
     black screen. */
  var played = v.play();
  if (played && typeof played.catch === 'function') played.catch(remove);

  setTimeout(remove, LIMIT);
})();
