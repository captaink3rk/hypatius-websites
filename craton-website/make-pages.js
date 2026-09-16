/* ============================================================
   CRATON site · pillar page generator
   Emits the seven pillar pages from one shell, so the nav, the
   head, the structured data and the footer cannot drift apart
   across seven hand-maintained files.

     node make-pages.js

   Output: hours.html codes.html rates.html binder.html
           record.html compare.html walkthrough.html
   Served in production at /craton/<slug> (see sitemap.xml);
   flat here so every page keeps index.html's relative paths to
   the design system.

   Content is data at the top of this file. The shell is one
   function. Nothing in either defines a colour: every value
   resolves through tokens/craton.css via data-brand="craton",
   and the motif classes (cr-row, cr-sm, cr-proof, cr-ev,
   cr-rcpt, cr-thread) come from css/craton-product.css — the
   same file the platform prototype imports.

   Corporate rules honoured here and checked by build.js --check:
     "ERP" never in visible copy · BMC3I not CJADC2 · DDIL spelled
     out on first use · Measures (MOMs/MOEs/MOPs) · no emoji ·
     no red · no ownership claim · every claim cited or bracketed
     [pending data] · pricing is "six-figure enterprise seats".
   ============================================================ */
'use strict';
const fs = require('fs');
const path = require('path');
const OUT = __dirname;

const NAV = [
  ['hours', 'Hours'], ['codes', 'Codes'], ['rates', 'Rates'],
  ['binder', 'Binder'], ['compare', 'Compare'],
];

const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/* ---- motif helpers: the product's own components, not pictures ---- */
const row = (n, label, state, word) =>
  `<div class="cr-row"><i class="cr-band cr-band--${state}"></i><span class="cr-row__n">${n}</span>` +
  `<span class="cr-sm cr-sm--${state}" aria-hidden="true"></span>` +
  `<span class="cr-row__t">${label}</span>` +
  `<span class="cr-state cr-state--${state}">${word || state}</span></div>`;

const ev = (l, q, m) =>
  `<div class="cr-ev"><div class="cr-ev__l">${l}</div><div class="cr-ev__q">${q}</div><div class="cr-ev__m">${m}</div></div>`;

const spec = items => `<div class="cr-spec">${items.map(i => `
  <div class="cr-spec__c">
    <div class="cr-spec__n">${i.n}</div>
    <div class="cr-disp">${i.h}</div>
    <p>${i.p}</p>
    <p class="cr-proof">${i.proof}</p>
  </div>`).join('')}</div>`;

const faqBlock = faqs => `<div class="cr-faq">${faqs.map(f => `
  <details class="cr-faq__i"><summary>${f.q}</summary><div class="cr-faq__a">${f.a}</div></details>`).join('')}</div>`;


/* ---- the layered C, verbatim from craton-c-dark.svg ----
   Used on /record only, and as an illustration rather than a lockup: the
   monogram's three arcs stand for Authority, Events and Record, which is
   exactly what that page argues. The signature rule gives the site to the
   shield, and the nav and footer keep it — "never both symbols in one
   lockup" is about lockups, and this is a diagram of the mark's meaning. */
const C_ARCS = [
  'M78 26 A36 36 0 0 0 20 30 H36 A22 22 0 0 1 70 34 Z',
  'M20 34 A36 36 0 0 0 20 62 L36 58 A22 22 0 0 1 36 38 Z',
  'M20 66 A36 36 0 0 0 78 70 L70 62 A22 22 0 0 1 36 66 Z',
];
const C_MEANING = ['Authority', 'Events', 'Record'];
const cSvg = (size, cls) =>
  `<svg viewBox="0 0 96 96" width="${size}" height="${size}" fill="none" aria-hidden="true"${cls ? ` class="${cls}"` : ''}>` +
  C_ARCS.map((d, i) => `<path d="${d}" fill="var(--cr-arc-${i + 1})" data-strata="${C_MEANING[i]}"/>`).join('') +
  '</svg>';

const markTriad = () => `<div class="cr-triad">
  <div class="cr-triad__m">${cSvg(148)}</div>
  <div class="cr-triad__l">
    <p class="cr-eb">The mark is the argument</p>
    <h2 class="cr-disp">Three arcs. Three jobs.</h2>
    <p class="cr-lede">CRATON's monogram is three stacked strata, and each one is a thing this page describes. It was drawn that way before the product was built, and the product was built to it.</p>
    <div class="cr-binder cr-binder--triad">
      <div class="cr-row cr-row--arc"><i class="cr-band" style="background:var(--cr-arc-1)"></i><span class="cr-row__n">01</span><span class="cr-row__t"><b style="color:var(--text-display)">Authority</b> — the policy that says what counts</span><span class="cr-arc-name">bone</span></div>
      <div class="cr-row cr-row--arc"><i class="cr-band" style="background:var(--cr-arc-2)"></i><span class="cr-row__n">02</span><span class="cr-row__t"><b style="color:var(--text-display)">Events</b> — the ledger, as it happens</span><span class="cr-arc-name">bronze</span></div>
      <div class="cr-row cr-row--arc"><i class="cr-band" style="background:var(--cr-arc-3)"></i><span class="cr-row__n">03</span><span class="cr-row__t"><b style="color:var(--text-display)">Record</b> — the binder, settled</span><span class="cr-arc-name">slate</span></div>
    </div>
    <p class="cr-proof">assets/brand/craton · the monogram signs the product, the shield signs the company</p>
  </div>
</div>`;

const legend = `<div class="cr-legend">
  <span class="cr-state cr-state--settled"><span class="cr-sm cr-sm--settled" aria-hidden="true"></span>settled</span>
  <span class="cr-state cr-state--attention"><span class="cr-sm cr-sm--attention" aria-hidden="true"></span>attention · reason on record</span>
  <span class="cr-state cr-state--live"><span class="cr-sm cr-sm--live" aria-hidden="true"></span>live · never finished, kept</span>
</div>`;

/* ---- the fourteen, shared by /binder and the home page ---- */
const SF1408 = [
  ['01', 'Segregation of direct and indirect costs', 'settled'],
  ['02', 'Costs identified and accumulated by contract', 'settled'],
  ['03', 'Logical, consistent indirect allocation', 'settled'],
  ['04', 'Accumulation under general ledger control', 'settled'],
  ['05', 'Timekeeping identifies labor by cost objective', 'settled'],
  ['06', 'Labor distribution charges direct and indirect labor', 'settled'],
  ['07', 'Interim (at least monthly) determination of costs', 'settled'],
  ['08', 'Exclusion of unallowable costs (FAR 31)', 'attention'],
  ['09', 'Costs by contract line item', 'settled'],
  ['10', 'Preproduction segregated from production', 'settled'],
  ['11', 'Cost information for limitation of cost / funds', 'settled'],
  ['12', 'Billing and progress payment support', 'attention'],
  ['13', 'Reliable data for pricing follow-on work', 'settled'],
  ['14', 'In full operation', 'live'],
];

/* ============================================================
   PAGES
   ============================================================ */
const PAGES = [];

PAGES.push({
  slug: 'hours',
  nav: 'hours',
  title: 'DCAA-ready timekeeping for small government contractors | CRATON',
  desc: 'Daily timekeeping built to SF 1408 areas 5 and 6: whole-day booking, quarter-hour increments, a written reason for every correction, and supervisor approval one person-week at a time. Nobody approves their own.',
  eyebrow: '01 · Timekeeping',
  h1: 'Book the day whole.',
  lede: 'A compliant timesheet is not a stricter timesheet. It is one where every number has a reason attached at the moment it changed, so nobody reconstructs anything later.',
  proof: 'SF 1408 areas 5 &amp; 6 · quarter-hour increments · daily entry',
  body: `
${spec([
    { n: 'Daily entry', h: 'Eight, or a reason', p: 'The day books whole. Anything other than a full day carries a written reason, entered the day it happens, not at the end of the period. Quarter-hour increments; the floor is the day, not the week.', proof: 'timesheet.day · reason required below full day' },
    { n: 'Corrections', h: 'Never silent', p: 'A changed hour keeps its old value, its new value, who changed it, when, and why. The correction is a ledger row of its own, so a period with edits reads as a period with edits.', proof: 'timesheet.amend · prior value retained' },
    { n: 'Approval', h: 'One person-week', p: 'Supervisors approve a named person for a named week. The requester is excluded from their own approval by the system, not by policy — there is no configuration in which you approve yourself.', proof: 'timesheet.approve · requester excluded' },
    { n: 'Floor checks', h: 'On the record', p: 'Unannounced floor checks are scheduled, recorded and answered inside the platform. The auditor asks whether you do them; the answer is a query, not a memory.', proof: 'floor_check.run · scheduled and answered in-platform' },
  ])}

<h2 class="cr-disp">What an auditor actually asks</h2>
<p class="cr-lede">Two of the fourteen SF 1408 areas are timekeeping. Both are about whether labor can be traced to a cost objective and whether the people doing the tracing are the right people.</p>
<div class="cr-binder">
${row('05', 'Timekeeping identifies labor by cost objective', 'settled')}
${row('06', 'Labor distribution charges direct and indirect labor', 'settled')}
</div>
${legend}
${ev('Why area 05 reads settled',
      'Every posted hour carries a charge code, and every charge code resolves to one cost objective.',
      'query · labor.post where charge_code is null → 0 rows · 90 days')}

<h2 class="cr-disp">The uncomfortable part</h2>
<p class="cr-lede">Timekeeping is where most small contractors fail a pre-award survey, and it is almost never because people lied. It is because the record was assembled after the fact, and an assembled record cannot answer "when did you know that".</p>
<p class="cr-proof cr-proof--lg">Nothing counts until a named person reviews it.</p>
`,
  faqs: [
    { q: 'Does CRATON support quarter-hour or tenth-hour increments?', a: 'Quarter-hour. Tenth-hour is <b>[pending data]</b> — it is a tenant setting in the data model but is not exercised by a customer yet, and we do not claim what we have not run.' },
    { q: 'Can a supervisor approve their own timesheet?', a: 'No. The requester is excluded from the approval set by the system. There is no role, tier or override that re-includes them.' },
    { q: 'What happens to an hour that is corrected after approval?', a: 'The approval is invalidated for that person-week, the prior value is retained, and the correction writes its own ledger row with the reason. The week returns to the approver rather than silently changing underneath them.' },
    { q: 'Does it work offline?', a: 'Entry is queued locally and reconciled on reconnect, which matters in denied, disrupted, intermittent, and limited (DDIL) conditions. The ledger sequence is assigned on the server, so an offline entry is ordered by when it lands, and the entry timestamp is kept separately.' },
  ],
  related: ['codes', 'binder', 'record'],
});

PAGES.push({
  slug: 'codes',
  nav: 'codes',
  title: 'Charge code lifecycle for government contracts | CRATON',
  desc: 'Charge codes derived from the funding source, approved at the right tier, and activated with a ledger account attached. Nothing is booked without a code, and no code exists without a funding line behind it.',
  eyebrow: '02 · Charge codes',
  h1: 'No code, no booking.',
  lede: 'A charge code is not a label. It is the join between an hour and a funding line, and if that join is loose, every number downstream — rates, billing, the binder — inherits the looseness.',
  proof: '6 funding sources · 3 approval tiers · ledger account on activation',
  body: `
${spec([
    { n: 'Derivation', h: 'Names come from money', p: 'The code name derives from the funding source: award, CLIN, task order or indirect pool. You do not invent a string; you pick the money and the string follows.', proof: 'charge_code.derive · name is a function of the funding line' },
    { n: 'Tiers', h: 'Three, by consequence', p: 'Direct-billable codes need the contract owner. Indirect pool codes need finance. Everything else needs a supervisor. The tier is chosen by what the code can cost, not by who asked.', proof: '3 approval tiers · tier set by funding source class' },
    { n: 'Activation', h: 'Writes the account', p: 'Approval and activation are one transaction: the general ledger account is created and bound to the code in the same write. A code cannot be bookable and unaccounted at the same time.', proof: 'charge_code.activate · GL account bound in the same write' },
    { n: 'Ceilings', h: 'Checked at entry', p: 'Funded ceilings and task-order limits are evaluated when the hour is entered, not when the invoice is cut. The person who can still do something about it is the one who hears.', proof: 'ceiling_check · evaluated at labor.post' },
  ])}

<h2 class="cr-disp">The lifecycle, whole</h2>
<div class="cr-binder">
${row('01', 'Requested · funding source selected, name derived', 'settled')}
${row('02', 'Tier assigned · by what the code can cost', 'settled')}
${row('03', 'Approved · named approver, not a role inbox', 'settled')}
${row('04', 'Activated · general ledger account bound', 'settled')}
${row('05', 'Bookable · ceilings evaluated at entry', 'live', 'live')}
${row('06', 'Closed · code retired, history retained', 'settled')}
</div>
${legend}
${ev('Why a retired code still resolves',
      'Closing a code stops new bookings. It never removes the code from hours already posted against it.',
      'charge_code.close · historical postings immutable · ledger seq preserved')}

<h2 class="cr-disp">Where this shows up in the survey</h2>
<div class="cr-binder">
${row('01', 'Segregation of direct and indirect costs', 'settled')}
${row('02', 'Costs identified and accumulated by contract', 'settled')}
${row('09', 'Costs by contract line item', 'settled')}
</div>
<p class="cr-proof cr-proof--lg">Three of the fourteen areas are answered by the code structure alone.</p>
`,
  faqs: [
    { q: 'How many funding sources does CRATON model?', a: 'Six: prime award, subcontract, task order, CLIN, internal research and development, and indirect pool. Each carries its own naming rule and approval tier.' },
    { q: 'Can we import our existing chart of accounts?', a: 'Yes — the general ledger account is a field on the code, not a derived value, so an existing chart maps in. The import path and its validation rules are in the API contract for engineering.' },
    { q: 'What stops someone booking to a code they should not touch?', a: 'Codes carry an eligibility set. An hour posted to a code outside the person\'s set is refused at entry with the reason, rather than accepted and caught in a monthly review.' },
    { q: 'Does closing a code break historical reporting?', a: 'No. Postings are immutable and keep their ledger sequence. A closed code stops accepting new bookings and nothing else.' },
  ],
  related: ['hours', 'rates', 'binder'],
});

PAGES.push({
  slug: 'rates',
  nav: 'rates',
  title: 'Indirect rate pools: fringe, overhead and G&A | CRATON',
  desc: 'Fringe, overhead and G&A pools that recalculate when the ledger does. Provisional to final, snapshot on the first of every month, every run with its inputs, tools called and outputs on the record.',
  eyebrow: '03 · Indirect rates',
  h1: 'Rates that move when the ledger does.',
  lede: 'Most small contractors compute indirect rates in a spreadsheet once a quarter and discover the drift at year end. A rate that recalculates on every posting is not more accurate in theory. It is earlier.',
  proof: 'rates.snapshot · fringe, overhead, G&amp;A · monthly, on the first',
  body: `
${spec([
    { n: 'Pools', h: 'Three, conventional', p: 'Fringe, overhead and general and administrative. Deliberately the standard structure: a bespoke pool arrangement is a thing to defend at audit, and most firms under fifty people have nothing to gain by it.', proof: 'pools · fringe · overhead · G&amp;A' },
    { n: 'Bases', h: 'Declared, not inferred', p: 'Each pool carries a written allocation base and the reason it is the right one. The reason is part of the record, because area 03 asks whether the allocation is logical and consistent, not whether it is arithmetically correct.', proof: 'SF 1408 area 03 · base and rationale on the record' },
    { n: 'Provisional to final', h: 'One object', p: 'A provisional rate and its final are the same object in two states, not two spreadsheets. The variance between them is a query, and the reconciliation is a ledger row.', proof: 'rate.state · provisional → final · variance queryable' },
    { n: 'Snapshots', h: 'First of the month', p: 'A dated snapshot is taken on the first of every month and kept. You can always answer what the rate was on a date, which is the question billing disputes actually turn on.', proof: 'rates.snapshot · monthly · immutable' },
  ])}

<h2 class="cr-disp">Every run, reviewable</h2>
<p class="cr-lede">Rate calculation is AI-assisted analysis with a complete, reviewable record of every run — inputs, tools called, outputs. The draft is the platform's. The number is a named person's.</p>
<div class="cr-rcpt">
  <b>RUN</b> 2026-09-15 · 12:10:40<br>
  <b>INPUT</b> Q3 indirect pool · 412 rows<br>
  <b>TOOLS</b> rate_calc · ceiling_check<br>
  <b class="ok">OUTPUT</b> provisional fringe 31.4% · 0 exceptions<br>
  <b>REVIEWED BY</b> finance@ · 2026-09-15 14:02<br>
  <b>LEDGER</b> seq 21,977 · chain ok
</div>
${ev('What "reviewed" means here',
      'The output is visible to the reviewer with its inputs and the tools that produced it, before it can be accepted.',
      'rate.accept · blocked until reviewer_id is set · no auto-accept path')}

<h2 class="cr-disp">Where this shows up in the survey</h2>
<div class="cr-binder">
${row('03', 'Logical, consistent indirect allocation', 'settled')}
${row('07', 'Interim (at least monthly) determination of costs', 'settled')}
${row('13', 'Reliable data for pricing follow-on work', 'settled')}
</div>
${legend}
`,
  faqs: [
    { q: 'Can we run more than three pools?', a: 'The data model allows additional pools; the product does not encourage them. If your structure needs a fourth, that is a conversation before implementation, not a toggle after it.' },
    { q: 'Does CRATON file the incurred cost submission?', a: 'No. It produces the underlying data with its record intact. Filing is <b>[pending data]</b> as a roadmap item and is not claimed as a capability.' },
    { q: 'How is a provisional rate different from an estimate?', a: 'A provisional rate is computed from posted ledger rows to date. It is a real number over an incomplete period, not a forecast.' },
    { q: 'Who can accept a rate?', a: 'A named person with the finance role. There is no path in which a rate is accepted by the system, on a schedule, or by the person who ran it.' },
  ],
  related: ['codes', 'record', 'binder'],
});

PAGES.push({
  slug: 'binder',
  nav: 'binder',
  title: 'SF 1408 audit binder, generated from the ledger | CRATON',
  desc: 'All fourteen areas of the SF 1408 pre-award survey of a prospective contractor accounting system, generated from the ledger rather than assembled before the review. Always current, exportable in one click.',
  eyebrow: '04 · Audit record',
  h1: 'Fourteen questions. One binder.',
  lede: 'The SF 1408 asks fourteen things about your accounting system. The last one asks whether the system is in full operation — which is why a compliant package nobody uses fails the form it was built to pass.',
  proof: 'Example tenant · HYPATIUS, today · 11 settled · 2 attention · 1 live',
  hero: {
    src: '../../../assets/imagery/placeholder/h5-binder.svg',
    alt: 'A closed archival binder with bronze spine banding under raking light',
    slot: 'H5 · closed binder · 16:9',
  },
  body: `
<div class="cr-binder cr-binder--full">
${SF1408.map(([n, l, s]) => row(n, l, s)).join('\n')}
</div>
${legend}
${ev('Why two areas show attention',
      'That is the demo tenant\'s real state. Fourteen settled marks would be less credible, not more.',
      'binder.state · read from the ledger · no manual override exists')}

<h2 class="cr-disp">Generated, not assembled</h2>
${spec([
    { n: 'Source', h: 'The ledger', p: 'Each area is a query against the append-only ledger. There is no document that someone writes and someone else believes; there is a question and the rows that answer it.', proof: 'sf1408.areas · every area mapped to a ledger query' },
    { n: 'Currency', h: 'Today, not last quarter', p: 'The binder has no build step and no stale state. Opening it runs the queries. The answer is the answer as of the moment you asked.', proof: 'binder.open · evaluated on read' },
    { n: 'Export', h: 'One click, with the queries', p: 'The export carries the answers and the queries that produced them, so a reviewer can re-run any area rather than take the export on faith.', proof: 'binder.export · queries included' },
    { n: 'Attention', h: 'Carries its reason', p: 'An area in attention renders the reason and the row that caused it. There is no state in the binder that means "something, somewhere".', proof: 'area.attention · cause row referenced' },
  ])}

<h2 class="cr-disp">Area 14 is the whole product</h2>
<p class="cr-lede">"In full operation" is the only area you cannot pass by buying something. It is marked live rather than settled because it is never finished — it is kept. CRATON's home screen is that area, answered daily.</p>
<p class="cr-proof cr-proof--lg">craton.binder · area 14 · live · never finished, kept</p>
`,
  faqs: [
    { q: 'Is the binder a document or a screen?', a: 'A screen that exports. It is evaluated on read, so there is no version of it that is out of date while looking current.' },
    { q: 'Can we edit an area\'s state before a review?', a: 'No. There is no manual override. An area changes state when the underlying rows change, which is the only reason the binder is worth showing an auditor.' },
    { q: 'Does passing all fourteen areas here mean we pass the survey?', a: 'No, and we will not say it does. The survey is conducted by a person against your actual system. The binder means you can answer every question with rows instead of recollection.' },
    { q: 'What does the export contain?', a: 'The fourteen areas, their current state, the reason for any area in attention, and the query behind each one. Format and schema are in the API contract for engineering.' },
  ],
  related: ['hours', 'rates', 'record'],
});

PAGES.push({
  slug: 'record',
  nav: null,
  title: 'The record: AI-assisted analysis you can review | CRATON',
  desc: 'Every AI-assisted run in CRATON keeps its inputs, the tools it called and its outputs, and nothing counts until a named person reviews it. An append-only ledger with a hash chain sits underneath.',
  eyebrow: 'The record',
  h1: 'AI-assisted. Every run reviewable.',
  lede: 'AI-assisted analysis with a complete, reviewable record of every run — inputs, tools called, outputs. Rates, floor checks and close notes are drafted by the platform and reviewed by a named person before they count.',
  proof: 'craton.ledger · append-only · hash chain',
  body: `
${spec([
    { n: 'Append-only', h: 'Nothing is edited', p: 'The ledger takes writes and never takes them back. A correction is a new row that references the one it corrects. The history of a number is the number.', proof: 'craton.ledger · append-only · no update path' },
    { n: 'Hash chain', h: 'Order is provable', p: 'Each row carries the hash of the one before it, so a removed or reordered row is detectable rather than arguable.', proof: 'ledger.verify · chain checked on every read of the binder' },
    { n: 'Every run', h: 'Kept as a receipt', p: 'An AI-assisted run writes what went in, which tools it called, and what came out. The receipt is a first-class object, not a log line someone might have kept.', proof: 'run.receipt · inputs · tools · outputs · reviewer' },
    { n: 'Review', h: 'A named person', p: 'No output reaches a rate, an invoice or the binder without a named reviewer against it. There is no automatic acceptance path to disable, because there is none to begin with.', proof: 'accept · blocked until reviewer_id is set' },
  ])}

<h2 class="cr-disp">A run, in full</h2>
<div class="cr-rcpt">
  <b>RUN</b> 2026-09-15 · 12:10:40<br>
  <b>INPUT</b> Q3 indirect pool · 412 rows<br>
  <b>TOOLS</b> rate_calc · ceiling_check<br>
  <b class="ok">OUTPUT</b> provisional fringe 31.4% · 0 exceptions<br>
  <b>REVIEWED BY</b> finance@ · 2026-09-15 14:02<br>
  <b>LEDGER</b> seq 21,977 · chain ok
</div>
${ev('What we do not say',
      'We do not name models, hosts or internal tooling on a public page, and we do not describe the analysis as autonomous.',
      'The claim is the record, and the record is the thing you can check.')}

${markTriad()}

<h2 class="cr-disp">Today, as it happens</h2>
<div class="cr-ledger" id="ledger" aria-label="The ledger, today">
  <div class="cr-thread cr-ledger__thread" id="thread" aria-hidden="true"></div>
  <div class="cr-ledger__rows" id="rows"></div>
  <div class="cr-ledger__seq"><span>craton.ledger · today</span><span id="seq">seq 21,977</span></div>
</div>
<p class="cr-proof cr-proof--lg">One tick per row written. Bronze is live, sage is settled, and neither is load-bearing: the word is.</p>
`,
  faqs: [
    { q: 'Which model does CRATON use?', a: 'Not something we publish. What we publish is that every run keeps its inputs, the tools it called and its outputs, and that a named person reviews the result before it counts.' },
    { q: 'Can the AI post an hour or accept a rate on its own?', a: 'No. Every write that affects money or the binder requires a named reviewer. The absence of an automatic path is the design, not a setting.' },
    { q: 'What happens if the hash chain fails verification?', a: 'The binder refuses to render the affected area and reports the break with the sequence range. It does not render a clean binder over a broken chain.' },
    { q: 'Is the ledger the system of record for accounting?', a: 'It is the system of record for what happened and when. Interoperation with a general ledger of record is in the API contract for engineering.' },
  ],
  ledger: true,
  related: ['rates', 'binder', 'hours'],
});

PAGES.push({
  slug: 'compare',
  nav: 'compare',
  title: 'CRATON vs QuickBooks add-ons and GovCon platforms | HYPATIUS',
  desc: 'Where CRATON sits: built for firms of one to fifty people on their first cost-type award, between a QuickBooks timekeeping add-on and a mid-market government contracting platform priced for a finance department.',
  eyebrow: 'Where it sits',
  h1: 'Built for the firms the big systems skip.',
  lede: 'Most small contractors start on QuickBooks and bolt on a timekeeping add-on. Most enterprise systems assume a finance department. CRATON assumes eight people and one award.',
  proof: 'Sources cited below · competitors unnamed on the public site by policy',
  body: `
<div class="cr-table-wrap">
<table class="cr-table"><thead><tr><th>Starting point</th><th>Who it fits</th><th>Time to live</th><th>The gap</th></tr></thead><tbody>
<tr><td>QuickBooks + timekeeping add-on</td><td>Firms under ~$5M</td><td>Days</td><td>Cannot calculate indirect rates or enforce compliant timekeeping natively; approvals only at the top tier.</td></tr>
<tr><td>Mid-market GovCon platform</td><td>$5M–$100M revenue</td><td>6–12 weeks</td><td>Priced and scoped for a finance team you may not have yet.</td></tr>
<tr><td>Enterprise GovCon platform</td><td>Large primes</td><td>3–6 months</td><td>Runs the top of the market; the implementation alone outlasts a Phase I.</td></tr>
<tr class="cr-table__us"><td>CRATON</td><td>1–50 people, non-traditional and small defense contractors</td><td>[pending data]</td><td>FAR-native from day one, AI-assisted with a reviewable record, and a home screen that says when nothing needs you.</td></tr>
</tbody></table>
</div>
<p class="cr-src">Sources: bigtime.net (Jul 2026); erpresearch.com (Aug 2026); softwareconnect.com (Jul 2026). Competitors unnamed on the public site by policy; the research board names them.</p>

<h2 class="cr-disp">What we will not claim</h2>
${spec([
    { n: 'Time to live', h: '[pending data]', p: 'We have not run enough implementations to quote a number, and a number quoted from one is a number quoted from nothing. It stays bracketed until it is measured.', proof: 'unverified figures stay bracketed' },
    { n: 'Customers', h: 'No testimonials', p: 'There are none yet. A page of invented enthusiasm is the cheapest thing on the internet and the most expensive to be caught at.', proof: 'no testimonials until there is one' },
    { n: 'Pricing', h: 'Not on the page', p: 'Six-figure enterprise seats. The small-firm tier is a decision that has not been made, and a made-up number on a page is a negotiation you lose in advance.', proof: 'pricing · six-figure enterprise seats' },
    { n: 'Certification', h: 'Not a thing you buy', p: 'No accounting system is DCAA-certified. Systems are found adequate for award. Any vendor who says otherwise is telling you something about themselves.', proof: 'DCAA does not certify software' },
  ])}

<h2 class="cr-disp">Honest about the trade</h2>
<p class="cr-lede">CRATON assumes you are small. That is a real constraint: if you have a controller, three cost accountants and eleven active awards, a mid-market platform is a better fit and we will say so on the call.</p>
<p class="cr-proof cr-proof--lg">Forty minutes. Bring your last SF 1408 or your first.</p>
`,
  faqs: [
    { q: 'Is CRATON DCAA-certified?', a: 'No software is. DCAA evaluates a contractor\'s accounting <i>system</i> — people, policy and tooling together — and finds it adequate or not. CRATON is built to the fourteen areas of the SF 1408 that evaluation uses.' },
    { q: 'What does it cost?', a: 'Six-figure enterprise seats. A smaller-firm tier is <b>[pending decision]</b>. We would rather tell you that than publish a number we would not honour.' },
    { q: 'How long does implementation take?', a: '<b>[pending data]</b>. We have not run enough of them to quote an honest range, and we will not borrow someone else\'s.' },
    { q: 'Do you integrate with QuickBooks?', a: 'The general ledger interface is defined in the API contract for engineering. Which specific systems are wired, and when, is <b>[pending data]</b>.' },
  ],
  related: ['binder', 'rates', 'walkthrough'],
});

PAGES.push({
  slug: 'walkthrough',
  nav: null,
  title: 'Request a CRATON walkthrough | HYPATIUS',
  desc: 'Forty minutes with the team that built CRATON. Bring your last SF 1408 or your first. Small business, non-traditional defense contractor. UEI UKELB3UV76V6, CAGE 19S89.',
  eyebrow: 'Request a walkthrough',
  h1: 'Forty minutes. Your SF 1408.',
  lede: 'Not a demo reel. We open the platform against a tenant that looks like yours, walk the fourteen areas, and show you the two that are in attention — because that is what yours will look like too.',
  proof: 'hello@hypati.us · Homestead MOC',
  hero: {
    src: '../../../assets/imagery/placeholder/s1-founders.svg',
    alt: 'The HYPATIUS founding team at the Homestead MOC',
    slot: 'S1 · founders at the Homestead MOC · 3:2',
  },
  body: `
<h2 class="cr-disp">What the forty minutes are</h2>
${spec([
    { n: '00:00', h: 'Your award', p: 'What you are working, what type it is, and what the last accounting conversation with your contracting officer was about. Five minutes, and it decides the rest.', proof: 'no slides in this segment' },
    { n: '00:05', h: 'The fourteen', p: 'We open the binder and walk the areas against a tenant of your shape. You see the attention states, not a screenshot where everything is settled.', proof: 'live platform · demo tenant · real states' },
    { n: '00:25', h: 'Your hard part', p: 'Every firm has one: floor checks, unallowables, a subcontractor\'s timesheets, an indirect base nobody has defended in writing. We go at yours.', proof: 'the segment people actually remember' },
    { n: '00:35', h: 'What we cannot do', p: 'Told plainly, with the roadmap item and its state. If a mid-market platform fits you better, that is the recommendation you get.', proof: 'unverified capability stays bracketed' },
  ])}

<h2 class="cr-disp">Who you will be talking to</h2>
<div class="cr-binder">
${row('01', 'Stan Kennedy · Co-Founder &amp; Chief Executive Officer', 'settled', 'lead')}
${row('02', 'Jim LeMieux · Founder &amp; Chief Technology Officer', 'settled', 'build')}
${row('03', 'Jordan Broe · Co-Founder &amp; Chief Mission Product Officer', 'settled', 'product')}
${row('04', 'Shawna LeMieux · Chief of Staff', 'settled', 'ops')}
</div>
<p class="cr-proof">Maureen O'Brien · Executive Advisor</p>

<h2 class="cr-disp">Bring these if you have them</h2>
<div class="cr-binder">
${row('01', 'Your last SF 1408, or the one you are preparing for', 'settled', 'useful')}
${row('02', 'A month of timesheets, redacted as far as you like', 'settled', 'useful')}
${row('03', 'Your current indirect rate calculation, in whatever it lives in', 'settled', 'useful')}
${row('04', 'Nothing at all', 'live', 'also fine')}
</div>
${ev('If you bring nothing',
      'We run the walkthrough on the demo tenant and you take away the fourteen areas and what each one asks of you.',
      'That is a useful forty minutes whether or not you ever buy anything.')}

<div class="cr-cta cr-cta--inline">
  <p class="cr-eb">Get in touch</p>
  <h2 class="cr-disp">hello@hypati.us</h2>
  <p class="cr-lede">Tell us your award type and the week that works. We will send two times back, not a scheduling link and a form.</p>
  <a class="cr-btn" href="mailto:hello@hypati.us?subject=CRATON%20walkthrough">Email us</a>
  <p class="cr-proof">HYPATIUS · small business · non-traditional defense contractor · UEI UKELB3UV76V6 · CAGE 19S89</p>
</div>
`,
  faqs: [
    { q: 'Is this a sales call?', a: 'It is a call with the people who built it, which usually means it is more technical than a sales call and shorter. If we are the wrong fit we will say so in the first fifteen minutes.' },
    { q: 'Do we need to prepare anything?', a: 'No. Bringing your last SF 1408 or a month of timesheets makes it more useful, but the walkthrough stands on its own.' },
    { q: 'Will you show real customer data?', a: 'Never. The demo tenant is HYPATIUS\'s own, which is also why its binder shows two areas in attention.' },
    { q: 'What happens afterwards?', a: 'You get the fourteen areas as they applied to what you told us, including the ones we could not answer. No sequence, no drip.' },
  ],
  related: ['binder', 'compare', 'record'],
});

/* ============================================================
   SHELL
   ============================================================ */
const bySlug = Object.fromEntries(PAGES.map(p => [p.slug, p]));
const CARD_ORDER = ['hours', 'codes', 'rates', 'binder', 'record', 'compare', 'walkthrough'];

function ldjson(p) {
  const url = `https://hypati.us/craton/${p.slug}`;
  const graph = [
    {
      '@type': 'WebPage',
      '@id': url + '#page',
      url,
      name: p.title,
      description: p.desc,
      isPartOf: { '@id': 'https://hypati.us/craton#site' },
      about: { '@id': 'https://hypati.us/craton#app' },
      publisher: { '@id': 'https://hypati.us/#org' },
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'HYPATIUS', item: 'https://hypati.us' },
        { '@type': 'ListItem', position: 2, name: 'CRATON', item: 'https://hypati.us/craton' },
        { '@type': 'ListItem', position: 3, name: p.eyebrow.replace(/^\d+\s·\s/, ''), item: url },
      ],
    },
  ];
  if (p.faqs && p.faqs.length) {
    graph.push({
      '@type': 'FAQPage',
      '@id': url + '#faq',
      mainEntity: p.faqs.map(f => ({
        '@type': 'Question',
        name: f.q,
        acceptedAnswer: { '@type': 'Answer', text: f.a.replace(/<[^>]+>/g, '') },
      })),
    });
  }
  return JSON.stringify({ '@context': 'https://schema.org', '@graph': graph }, null, 2);
}

function shell(p) {
  const nav = NAV.map(([slug, label]) =>
    `<li><a href="${slug}.html"${p.nav === slug ? ' aria-current="page"' : ''}>${label}</a></li>`).join('');

  const hero = p.hero ? `
<div class="cr-ph__img cr-slot">
  <image-slot id="ph-${p.slug}" shape="rect" fit="cover" src="${p.hero.src}"
              placeholder="${p.hero.slot}"></image-slot>
</div>` : '';

  const related = (p.related || []).map(s => {
    const r = bySlug[s];
    return `<a href="${s}.html"><div class="cr-suite__n">${r.eyebrow}</div><div class="cr-disp">${r.h1.replace(/\.$/, '')}</div><p>${r.lede.split('. ')[0]}.</p></a>`;
  }).join('');

  return `<!-- @dsCard group="CRATON" viewport="1440x900" name="CRATON — /${p.slug}" subtitle="${esc(p.desc).slice(0, 150)}" -->
<!DOCTYPE html>
<html lang="en" data-brand="craton" data-theme="dark"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(p.title)}</title>
<meta name="description" content="${esc(p.desc)}">
<meta property="og:title" content="${esc(p.title)}">
<meta property="og:description" content="${esc(p.desc)}">
<meta property="og:image" content="https://hypati.us/craton/og.png">
<meta property="og:image:width" content="1200"><meta property="og:image:height" content="630">
<meta property="og:type" content="article">
<meta property="og:url" content="https://hypati.us/craton/${p.slug}">
<meta name="twitter:card" content="summary_large_image">
<!-- The C on gunmetal; the shield never appears at icon size. -->
<link rel="icon" href="../../../assets/brand/craton/craton-favicon.svg">
<link rel="apple-touch-icon" href="../../../assets/brand/craton/craton-appicon-gunmetal.svg">
<link rel="canonical" href="https://hypati.us/craton/${p.slug}">
<link rel="stylesheet" href="../../../styles.css">
<link rel="stylesheet" href="site.css">
<script src="image-slot.js"></script>
<script type="application/ld+json">
${ldjson(p)}
</script>
</head>
<body>
<a class="cr-skip" href="#main">Skip to content</a>

<nav class="cr-nav"><div class="cr-wrap">
<a class="cr-nav__lk" href="index.html"><img src="../../../assets/brand/craton/craton-shield-dark.svg" alt="CRATON"><b>CRATON</b></a>
<ul>${nav}<li><a href="https://hypati.us">HYPATIUS</a></li></ul>
<a class="cr-btn" href="walkthrough.html">Request a walkthrough</a>
</div></nav>

<main id="main">
<header class="cr-ph${p.hero ? ' cr-ph--img' : ''}">
${hero}
<div class="cr-wrap">
  <nav class="cr-crumb" aria-label="Breadcrumb">
    <a href="index.html">CRATON</a><span aria-hidden="true">/</span><span aria-current="page">${p.eyebrow.replace(/^\d+\s·\s/, '')}</span>
  </nav>
  <p class="cr-eb">${p.eyebrow}</p>
  <h1 class="cr-disp">${p.h1}</h1>
  <p class="cr-lede">${p.lede}</p>
  <p class="cr-proof cr-proof--lg">${p.proof}</p>
</div>
</header>

<section><div class="cr-wrap cr-prose">
${p.body}
</div></section>

<section><div class="cr-wrap">
<p class="cr-eb">Questions we get asked</p>
<h2 class="cr-disp">The short answers.</h2>
${faqBlock(p.faqs)}
</div></section>

<section><div class="cr-wrap">
<p class="cr-eb">Keep reading</p>
<h2 class="cr-disp">Next.</h2>
<div class="cr-suite">${related}</div>
</div></section>

<section id="cta" class="cr-cta"><div class="cr-wrap">
<p class="cr-eb">Request a walkthrough</p>
<h2 class="cr-disp">Make your next audit the dullest hour of the year.</h2>
<p class="cr-lede">Forty minutes with the team that built it. Bring your last SF 1408 or your first.</p>
<a class="cr-btn" href="mailto:hello@hypati.us">hello@hypati.us</a>
</div></section>
</main>

<footer><div class="cr-wrap">
<div><img src="../../../assets/brand/craton/craton-lockup-dark.svg" alt="CRATON" style="height:36px"><div class="cr-stamp">HYPATIUS Enterprise Resource Platform<br>Small business · non-traditional defense contractor<br>UEI UKELB3UV76V6 · CAGE 19S89</div></div>
<div><b>CRATON</b><ul><li><a href="hours.html">Hours</a></li><li><a href="codes.html">Codes</a></li><li><a href="rates.html">Rates</a></li><li><a href="binder.html">Binder</a></li><li><a href="record.html">The record</a></li><li><a href="compare.html">Compare</a></li></ul></div>
<div><b>HYPATIUS</b><ul><li><a href="https://hypati.us">hypati.us</a></li><li><a href="https://starchitect.us">starchitect.us</a></li><li><a href="https://alidade.us">alidade.us</a></li></ul></div>
<div><b>Contact</b><ul><li><a href="mailto:hello@hypati.us">hello@hypati.us</a></li><li><a href="walkthrough.html">Request a walkthrough</a></li><li>Homestead MOC</li></ul></div>
</div></footer>
${p.ledger ? '<script src="ledger.js"></script>' : ''}
</body></html>
`;
}

PAGES.forEach(p => {
  const html = shell(p);
  fs.writeFileSync(path.join(OUT, p.slug + '.html'), html);
  console.log('wrote', p.slug + '.html', html.length, 'bytes');
});
