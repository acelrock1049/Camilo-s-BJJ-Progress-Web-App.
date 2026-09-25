// Deno runtime — Supabase Edge Function
// Handles: private 1-on-1 coaching requests (BJJ or MMA, academy or home)
// Actions: insert into private_requests + notify the coach via Resend
//
// The visitor is redirected to WhatsApp right after calling this, so the
// request is fire-and-forget from their side: the row and the email are the
// record that survives if the WhatsApp message is never sent.

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

const DISCIPLINES = ['BJJ', 'MMA', 'Not sure'] as const
const LOCATIONS = ['academy', 'home'] as const
type Discipline = (typeof DISCIPLINES)[number]
type Location = (typeof LOCATIONS)[number]

// Free-text fields come from an anonymous form; cap them so one request can't
// stuff the table or the email.
const MAX_SHORT = 120
const MAX_LONG = 1000

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
  })
}

function str(v: unknown, max: number): string {
  return typeof v === 'string' ? v.trim().slice(0, max) : ''
}

/** Respondent-supplied text goes into HTML, so escape it. */
function esc(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

interface PrivateRequest {
  name: string
  email: string
  discipline: Discipline
  location: Location
  suburb: string
  participants: string
  preferred_times: string
  notes: string
}

function getCoachEmailHtml(r: PrivateRequest): string {
  const where = r.location === 'home'
    ? `At home — <strong>${esc(r.suburb)}</strong>`
    : 'At the academy (Docklands)'

  const rows: [string, string][] = [
    ['Email', `<a href="mailto:${esc(r.email)}" style="color:#111;">${esc(r.email)}</a>`],
    ['Discipline', esc(r.discipline)],
    ['Where', where],
    ['Who', esc(r.participants)],
    ['Preferred times', r.preferred_times ? esc(r.preferred_times) : '<span style="color:#999;">—</span>'],
    ['Notes', r.notes ? esc(r.notes).replace(/\n/g, '<br>') : '<span style="color:#999;">—</span>'],
  ]

  const rowsHtml = rows.map(([k, v]) => `
        <tr>
          <td style="padding:8px 0;font-size:14px;color:#666;width:130px;vertical-align:top;">${k}</td>
          <td style="padding:8px 0;font-size:14px;color:#111;">${v}</td>
        </tr>`).join('')

  const homeNote = r.location === 'home'
    ? `<p style="margin:18px 0 0;padding:12px 14px;background:#fff7ed;border-radius:8px;font-size:13px;color:#9a3412;">
         Home session — price on request. Quote travel before confirming.
       </p>`
    : `<p style="margin:18px 0 0;padding:12px 14px;background:#f5f5f5;border-radius:8px;font-size:13px;color:#555;">
         Academy session — listed at $45/hour.
       </p>`

  return `<!doctype html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:24px;background:#f5f5f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;">
  <div style="max-width:600px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;">
    <div style="height:5px;background:#f59e0b;"></div>
    <div style="padding:28px;">
      <p style="margin:0 0 4px;font-size:12px;letter-spacing:1.5px;text-transform:uppercase;color:#999;">
        New private coaching request
      </p>
      <h1 style="margin:0 0 18px;font-size:24px;color:#111;">${esc(r.name)}</h1>
      <table style="width:100%;border-collapse:collapse;">${rowsHtml}</table>
      ${homeNote}
      <p style="margin:24px 0 0;font-size:13px;color:#888;">
        Reply to this email to write to them directly. They were also sent to your WhatsApp.
      </p>
    </div>
  </div>
</body></html>`
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: CORS_HEADERS })
  }
  if (req.method !== 'POST') {
    return json({ error: 'Method not allowed' }, 405)
  }

  let body: Record<string, unknown>
  try {
    body = await req.json()
  } catch {
    return json({ error: 'Invalid JSON body' }, 400)
  }

  const r: PrivateRequest = {
    name: str(body.name, MAX_SHORT),
    email: str(body.email, MAX_SHORT).toLowerCase(),
    discipline: str(body.discipline, MAX_SHORT) as Discipline,
    location: str(body.location, MAX_SHORT) as Location,
    suburb: str(body.suburb, MAX_SHORT),
    participants: str(body.participants, MAX_SHORT),
    preferred_times: str(body.preferred_times, MAX_LONG),
    notes: str(body.notes, MAX_LONG),
  }

  if (!r.name) return json({ error: 'name is required' }, 400)
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(r.email)) return json({ error: 'A valid email is required' }, 400)
  if (!DISCIPLINES.includes(r.discipline)) return json({ error: 'Invalid discipline' }, 400)
  if (!LOCATIONS.includes(r.location)) return json({ error: 'Invalid location' }, 400)
  if (r.location === 'home' && !r.suburb) return json({ error: 'suburb is required for home sessions' }, 400)
  if (!r.participants) return json({ error: 'participants is required' }, 400)

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  )

  // 1. Persist the request — this is the part that must not fail silently.
  const { error: insertError } = await supabase.from('private_requests').insert({
    name: r.name,
    email: r.email,
    discipline: r.discipline,
    location: r.location,
    suburb: r.location === 'home' ? r.suburb : null,
    participants: r.participants,
    preferred_times: r.preferred_times || null,
    notes: r.notes || null,
    origen_url: str(body.origen_url, 500) || null,
    utm_source: str(body.utm_source, MAX_SHORT) || null,
    utm_medium: str(body.utm_medium, MAX_SHORT) || null,
    utm_campaign: str(body.utm_campaign, MAX_SHORT) || null,
  })

  if (insertError) {
    console.error('private_requests insert error:', insertError)
    return json({ error: 'Database error' }, 500)
  }

  // 2. Notify the coach. Non-fatal: the request is already saved.
  const resendKey = Deno.env.get('RESEND_API_KEY')
  const coachNotifyTo = Deno.env.get('COACH_NOTIFY_TO') ?? ''
  if (resendKey && coachNotifyTo) {
    try {
      const where = r.location === 'home' ? `home · ${r.suburb}` : 'academy'
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${resendKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: "Camilo's BJJ <camilo.coach@camilosbjj.com.au>",
          to: [coachNotifyTo],
          reply_to: r.email,
          subject: `Private request: ${r.name} — ${r.discipline} (${where})`,
          html: getCoachEmailHtml(r),
        }),
      })
      if (!res.ok) {
        console.error('Resend error (private request):', await res.text())
      }
    } catch (err) {
      console.error('Coach notification failed:', err)
    }
  }

  return json({ success: true })
})
