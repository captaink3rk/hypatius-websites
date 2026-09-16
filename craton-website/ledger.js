/* ============================================================
   CRATON · the ledger thread
   The product's signature motif, running on a marketing page:
   rows arrive one at a time and a tick lands on the thread for
   each. It is a picture of the claim the section makes, not
   decoration. Renders whole and static under reduced motion.

   Extracted from index.html so /record and the home page run
   one implementation. Attaches only if #thread and #rows exist.
   ============================================================ */
(function () {
  'use strict';
  var ROWS = [
    ['14:02:11', 'labor.post',           'Shawna LeMieux · wk 8–12 Sep',        'settled'],
    ['13:48:02', 'charge_code.activate', 'GA-IT-FY26 → 6300',                   'settled'],
    ['13:31:55', 'timesheet.approve',    'James LeMieux → Jordan Broe · Thu 11', 'settled'],
    ['12:10:40', 'rates.snapshot',       'Q3 provisional · 412 rows',           'settled'],
    ['11:07:19', 'unallowable.scan',     '2 merchants · FAR 31.205-14',         'live'],
    ['09:00:00', 'timesheets.nudge',     '3 people · 1 day',                    'settled']
  ];
  var SEQ = 21977;
  var thread = document.getElementById('thread');
  var rows = document.getElementById('rows');
  var seq = document.getElementById('seq');
  if (!thread || !rows) return;

  var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function add(r, i, animate) {
    var tick = document.createElement('i');
    tick.className = 'cr-tick' + (r[3] === 'live' ? ' cr-tick--live' : '') + (animate ? ' cr-tick--new' : '');
    thread.appendChild(tick);

    var row = document.createElement('div');
    row.className = 'cr-ledger__r';
    if (!animate) { row.style.animation = 'none'; row.style.opacity = '1'; }
    row.innerHTML =
      '<span class="cr-ledger__t"></span>' +
      '<span><span class="cr-ledger__op"></span><span class="cr-ledger__d"></span></span>';
    row.children[0].textContent = r[0];
    row.children[1].children[0].textContent = r[1];
    row.children[1].children[1].textContent = r[2];
    rows.appendChild(row);
    if (seq) seq.textContent = 'seq ' + (SEQ + i + 1).toLocaleString('en-US');
  }

  if (reduced) { ROWS.forEach(function (r, i) { add(r, i, false); }); return; }

  /* Fills immediately on a short stagger rather than waiting on scroll. The
     ledger is the section's whole argument, so it must be populated in the
     first frame a shared link, a thumbnail or a skimming reader gets — a
     block parked empty until an observer fires shows nothing. */
  ROWS.forEach(function (r, i) { setTimeout(function () { add(r, i, true); }, i * 260); });
})();
