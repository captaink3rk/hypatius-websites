// POST /api/contact — website contact form -> leadership@hypati.us via Resend.
// Shared by hypati.us, starchitect.us and craton-erp.us (same file in each site's api/ folder).
//
// Vercel environment variables (Settings -> Environment Variables):
//   RESEND_API_KEY  required  the API key from resend.com
//   CONTACT_TO      optional  defaults to leadership@hypati.us
//   CONTACT_FROM    optional  defaults to "HYPATIUS Website <noreply@mail.hypati.us>"
//                             (must be on a domain verified in Resend)

const TO = process.env.CONTACT_TO || 'leadership@hypati.us';
const FROM = process.env.CONTACT_FROM || 'HYPATIUS Website <noreply@mail.hypati.us>';

const SITES = {
  hypatius: 'hypati.us',
  starchitect: 'starchitect.us',
  craton: 'craton-erp.us',
};
const ALLOWED_HOSTS = /(^|\.)(hypati\.us|starchitect\.us|craton-erp\.us|alidade\.us)$|\.vercel\.app$|^localhost$/;

const EMAIL_RE = /^[^\s@<>"]+@[^\s@<>"]+\.[^\s@<>"]+$/;
const clip = (s, n) => String(s == null ? '' : s).replace(/\r/g, '').trim().slice(0, n);
const oneLine = (s, n) => clip(s, n).replace(/[\n\t]+/g, ' ');
const esc = (s) => s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

module.exports = async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ ok: false, error: 'method_not_allowed' });
  }

  // Only accept submissions from our own sites.
  const origin = req.headers.origin || req.headers.referer || '';
  let host = '';
  try { host = new URL(origin).hostname; } catch (_) {}
  if (!ALLOWED_HOSTS.test(host)) return res.status(403).json({ ok: false, error: 'bad_origin' });

  let body = req.body;
  if (typeof body === 'string') { try { body = JSON.parse(body); } catch (_) { body = null; } }
  if (!body || typeof body !== 'object') return res.status(400).json({ ok: false, error: 'bad_request' });

  // Honeypot: real people never fill the hidden "website" field. Pretend success.
  if (clip(body.website, 200)) return res.status(200).json({ ok: true });

  const site = SITES[body.site] ? body.site : 'hypatius';
  const name = oneLine(body.name, 120);
  const email = oneLine(body.email, 200);
  const subject = oneLine(body.subject, 160) || `Website inquiry — ${name}`;
  const fields = Array.isArray(body.fields) ? body.fields.slice(0, 20) : [];

  if (!name || !EMAIL_RE.test(email)) return res.status(422).json({ ok: false, error: 'missing_fields' });

  const rows = fields
    .filter((f) => Array.isArray(f) && f.length === 2)
    .map(([k, v]) => [oneLine(k, 80), clip(v, 4000) || '(not given)']);

  const text = rows.map(([k, v]) => `${k}: ${v}`).join('\n') +
    `\n\n— Sent from the contact form on ${SITES[site]}. Reply to this email to answer ${name} directly.`;
  const html =
    `<table style="font:14px/1.5 -apple-system,Segoe UI,Arial,sans-serif;border-collapse:collapse">` +
    rows.map(([k, v]) =>
      `<tr><td style="padding:6px 14px 6px 0;color:#667;vertical-align:top;white-space:nowrap">${esc(k)}</td>` +
      `<td style="padding:6px 0;white-space:pre-wrap">${esc(v)}</td></tr>`).join('') +
    `</table><p style="font:12px Arial,sans-serif;color:#889;margin-top:18px">Sent from the contact form on ${SITES[site]}. Reply to this email to answer ${esc(name)} directly.</p>`;

  if (!process.env.RESEND_API_KEY) {
    console.error('contact: RESEND_API_KEY is not set');
    return res.status(503).json({ ok: false, error: 'not_configured' });
  }

  try {
    const r = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ from: FROM, to: [TO], reply_to: email, subject, text, html }),
    });
    if (!r.ok) {
      console.error('contact: resend error', r.status, await r.text());
      return res.status(502).json({ ok: false, error: 'send_failed' });
    }
    console.log('contact: sent', site, subject);
    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('contact: exception', err && err.message);
    return res.status(502).json({ ok: false, error: 'send_failed' });
  }
};
