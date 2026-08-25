// Deno runtime — Supabase Edge Function
// Handles: BJJ quiz completion lead capture
// Actions: insert into survey_results + upsert into leads + send segmented Email 0 via Resend

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

type DBC = 'white' | 'red' | 'blue' | 'orange' | 'green' | 'yellow'
const VALID_COLORS: DBC[] = ['white', 'red', 'blue', 'orange', 'green', 'yellow']

/** One answer as chosen by the respondent. Mirrors the shape sent by SurveyModal. */
interface RecordedAnswer {
  order: number
  question_id: string
  question_text: string
  answer_id: string
  answer_text: string
  color: DBC
}

/** Where the coach notification goes. Set as a secret so it isn't baked into the repo. */
const COACH_NOTIFY_TO = Deno.env.get('COACH_NOTIFY_TO') ?? ''

// ─────────────────────────────────────────────────────────────────────────────
// EMAIL 0 — Segmented by Dominant Belt Color
// ─────────────────────────────────────────────────────────────────────────────

const BELT_HEX: Record<DBC, string> = {
  white:  '#e5e7eb',
  red:    '#dc2626',
  blue:   '#2563eb',
  orange: '#f97316',
  green:  '#16a34a',
  yellow: '#eab308',
}

const EMAIL1_SUBJECTS: Record<DBC, string> = {
  white:  "Your official result is ready 🥋",
  red:    "Your official result is ready 🥋",
  blue:   "Your official result is ready 🥋",
  orange: "Your official result is ready 🥋",
  green:  "Your official result is ready 🥋",
  yellow: "Your official result is ready 🥋",
}

const EMAIL1_BODY: Record<DBC, string> = {
  white: `<strong>Your diagnosis indicated that you are in the "Survival" stage.</strong> Your current stress has you putting out fires all day. You need to sharpen your instincts in an environment that provides you with 100% safety ("Safety/Security").`,
  red:   `<strong>Your diagnosis revealed that you operate from "Challenge and Ego".</strong> Your internal engine is competition. You need an opponent — physical or conceptual — to perform at your best. Routine without challenge drains you.`,
  blue:  `<strong>Your diagnosis revealed that you value "Authority and Order".</strong> You are in a stage where you need clear rules and proven systems so you don't waste your energy.`,
  orange:`<strong>You are pure "Strategy and Achievement".</strong> Your competitive mind needs complex puzzles. For you, winning at the office is no longer enough; you need a physical challenge that matches your intellect.`,
  green: `<strong>You are in the "Community and Synergy" stage.</strong> You value deep interpersonal relationships over stepping on others to win. You learn better through cooperation than cutthroat competition.`,
  yellow:`<strong>Your mind operates with "Global Vision".</strong> You seek to transmit wisdom, flow with external chaos, and master excellence on a macro level.`,
}

// ─────────────────────────────────────────────────────────────────────────────
// COACH NOTIFICATION — the internal copy, with every answer the person gave
// ─────────────────────────────────────────────────────────────────────────────

/** Respondent-supplied text goes into HTML, so escape it. */
function esc(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function getCoachNotificationHtml(
  name: string,
  email: string,
  dbc: DBC,
  answers: RecordedAnswer[] | null
): string {
  const accent = BELT_HEX[dbc]

  const answersHtml = answers && answers.length > 0
    ? answers
        .slice()
        .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
        .map((a) => `
          <tr>
            <td style="padding:14px 0;border-bottom:1px solid #eee;">
              <div style="font-size:13px;color:#666;margin-bottom:6px;">${esc(a.question_text ?? '')}</div>
              <div style="font-size:15px;color:#111;font-weight:600;">
                <span style="display:inline-block;width:9px;height:9px;border-radius:50%;background:${BELT_HEX[a.color] ?? '#999'};margin-right:8px;"></span>
                ${esc(a.answer_text ?? '')}
              </div>
            </td>
          </tr>`)
        .join('')
    : `<tr><td style="padding:14px 0;color:#888;font-size:14px;">
         (Sin detalle de respuestas — registro anterior a la captura individual.)
       </td></tr>`

  return `<!doctype html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:24px;background:#f5f5f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;">
  <div style="max-width:600px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;">
    <div style="height:5px;background:${accent};"></div>
    <div style="padding:28px;">
      <p style="margin:0 0 4px;font-size:12px;letter-spacing:1.5px;text-transform:uppercase;color:#999;">
        Nueva encuesta completada
      </p>
      <h1 style="margin:0 0 18px;font-size:24px;color:#111;">${esc(name)}</h1>

      <table style="width:100%;border-collapse:collapse;margin-bottom:22px;">
        <tr>
          <td style="padding:6px 0;font-size:14px;color:#666;width:120px;">Email</td>
          <td style="padding:6px 0;font-size:14px;color:#111;">
            <a href="mailto:${esc(email)}" style="color:#111;">${esc(email)}</a>
          </td>
        </tr>
        <tr>
          <td style="padding:6px 0;font-size:14px;color:#666;">Perfil</td>
          <td style="padding:6px 0;font-size:14px;color:#111;font-weight:600;text-transform:uppercase;">
            <span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:${accent};margin-right:8px;"></span>${esc(dbc)}
          </td>
        </tr>
      </table>

      <p style="margin:0 0 4px;font-size:12px;letter-spacing:1.5px;text-transform:uppercase;color:#999;">
        Respuestas
      </p>
      <table style="width:100%;border-collapse:collapse;">${answersHtml}</table>

      <p style="margin:24px 0 0;font-size:13px;color:#888;">
        Responde a este correo para escribirle directamente.
      </p>
    </div>
  </div>
</body></html>`
}

function getEmail1Html(dbc: DBC, name: string, email: string): string {
  const accentColor = BELT_HEX[dbc]
  const body = EMAIL1_BODY[dbc]

  const appDomain = "https://camilosbjj.com.au"
  const unsubscribeUrl = `${appDomain}/api/unsubscribe?email=${encodeURIComponent(email)}`

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>Your Mindset for BJJ</title>
</head>
<body style="margin:0;padding:0;background:#f4f4f5;font-family:Georgia,serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f5;padding:40px 20px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;max-width:600px;width:100%;">

        <!-- Belt color accent bar -->
        <tr><td style="height:5px;background:${accentColor};"></td></tr>

        <!-- Header -->
        <tr><td style="padding:40px 48px 20px;text-align:center;">
          <p style="font-size:11px;font-weight:700;letter-spacing:0.2em;color:${accentColor === '#e5e7eb' ? '#6b7280' : accentColor};text-transform:uppercase;margin:0 0 16px;font-family:Arial,sans-serif;">
            CAMILO'S BJJ &middot; YOUR MINDSET FOR BJJ
          </p>
        </td></tr>

        <!-- Body -->
        <tr><td style="padding:8px 48px 32px;font-size:16px;line-height:1.7;color:#374151;font-family:Georgia,serif;">
          <p>Hi ${name},</p>
          <p>Thank you for taking 60 seconds to complete our test. We promised to tell you what stage of mental evolution you are operating in today, and here it is.</p>
          <p>${body}</p>
          <p>
            <strong>BJJ isn't just about sweating. It's a Personal Engineering Lab.</strong>
          </p>
          <p>
            Every movement on the mats is designed to teach you how to use <em>leverage</em> instead of brute force. Exactly what you need to ascend to the next level of awareness in your life.
          </p>
          <p>
            The first step is to create your 90-Day Roadmap, adapted to your current biotype (and without the risk of suffering injuries).
          </p>
        </td></tr>

        <!-- CTA -->
        <tr><td style="padding:0 48px 40px;text-align:center;">
          <a href="https://wa.me/61489038711"
             style="display:inline-block;padding:16px 40px;background:#111827;color:#ffffff;text-decoration:none;border-radius:50px;font-size:15px;font-weight:700;letter-spacing:0.05em;font-family:Arial,sans-serif;">
            Claim my Free Week (Zero Contracts) &rarr;
          </a>
          <p style="margin:24px 0 0;font-size:14px;color:#6b7280;font-style:italic;line-height:1.5;">
            P.S. I know what you're thinking. "I'm not in shape for this". I promise you this: in your first class, we will NOT make you fight. It's just strategy, technique, and diagnosis. Zero pressure.
          </p>
        </td></tr>

        <!-- Divider -->
        <tr><td style="padding:0 48px;"><hr style="border:none;border-top:1px solid #e5e7eb;margin:0;"></td></tr>

        <!-- Footer -->
        <tr><td style="padding:24px 48px;text-align:center;font-size:12px;color:#9ca3af;font-family:Arial,sans-serif;line-height:1.5;">
          Camilo's BJJ &mdash; Docklands, Melbourne<br>
          <a href="https://www.instagram.com/camilosbjj/" style="color:#9ca3af;text-decoration:none;">@camilosbjj</a>
          <br><br>
          No contract &middot; No lock-in &middot; Cancel anytime<br>
          <a href="${unsubscribeUrl}" style="color:#9ca3af;text-decoration:underline;">Unsubscribe from these emails</a>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`
}

// ─────────────────────────────────────────────────────────────────────────────
// Edge Function Handler
// ─────────────────────────────────────────────────────────────────────────────

Deno.serve(async (req: Request) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: CORS_HEADERS })
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
    })
  }

  let body: {
    name?: unknown
    email?: unknown
    dominant_belt_color?: unknown
    scores?: unknown
    answers?: unknown
    survey_completed_at?: unknown
  }
  try {
    body = await req.json()
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON body' }), {
      status: 400,
      headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
    })
  }

  const { name, email, dominant_belt_color, scores, answers, survey_completed_at } = body

  // Validate required fields
  if (!name || typeof name !== 'string' || !name.trim()) {
    return new Response(JSON.stringify({ error: 'name is required' }), {
      status: 400,
      headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
    })
  }
  if (!email || typeof email !== 'string' || !email.includes('@')) {
    return new Response(JSON.stringify({ error: 'A valid email is required' }), {
      status: 400,
      headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
    })
  }
  if (!dominant_belt_color || !VALID_COLORS.includes(dominant_belt_color as DBC)) {
    return new Response(JSON.stringify({ error: 'Invalid dominant_belt_color' }), {
      status: 400,
      headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
    })
  }

  const cleanEmail = (email as string).toLowerCase().trim()
  const cleanName = (name as string).trim()
  const dbc = dominant_belt_color as DBC
  // Older clients don't send `answers`; store null rather than an empty array so
  // "never captured" stays distinguishable from "answered nothing".
  const cleanAnswers = Array.isArray(answers) && answers.length > 0
    ? (answers as RecordedAnswer[])
    : null

  // Initialize Supabase with service role — bypasses RLS
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  )

  // 1. Insert into survey_results — duplicates OK (re-takes allowed)
  const { error: surveyError } = await supabase
    .from('survey_results')
    .insert({
      name: cleanName,
      email: cleanEmail,
      dominant_belt_color: dbc,
      scores: scores ?? {},
      answers: cleanAnswers,
      survey_completed_at: survey_completed_at ?? new Date().toISOString(),
    })

  if (surveyError) {
    console.error('survey_results insert error:', surveyError)
    return new Response(JSON.stringify({ error: 'Database error' }), {
      status: 500,
      headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
    })
  }

  // 2. Upsert into leads — upgrades source to 'survey' (higher intent)
  //    Non-fatal: survey data is already saved above
  const { error: leadsError } = await supabase
    .from('leads')
    .upsert(
      { email: cleanEmail, source: 'survey', nombre: cleanName },
      { onConflict: 'email' }
    )

  if (leadsError) {
    console.error('leads upsert error (non-fatal):', leadsError)
  }

  // 3. Send Email 1 via Resend — segmented by dominant_belt_color
  const resendKey = Deno.env.get('RESEND_API_KEY')
  if (resendKey) {
    const emailHtml = getEmail1Html(dbc, cleanName, cleanEmail)
    const subject = `${EMAIL1_SUBJECTS[dbc]}, ${cleanName} 🥋`

    const emailRes = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: "Camilo de Camilo's BJJ <camilo.coach@camilosbjj.com.au>",
        to: [cleanEmail],
        subject,
        html: emailHtml,
      }),
    })

    if (!emailRes.ok) {
      console.error('Resend error (survey):', await emailRes.text())
      // Non-fatal — lead and survey data are saved, continue
    }
  } else {
    console.warn('RESEND_API_KEY not set — skipping Email 0 send')
  }

  // 4. Notify the coach — without this the results only ever reach the database.
  //    Non-fatal: a failure here must never cost us the lead.
  if (resendKey && COACH_NOTIFY_TO) {
    try {
      const notifyRes = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${resendKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: "Camilo's BJJ <camilo.coach@camilosbjj.com.au>",
          to: [COACH_NOTIFY_TO],
          reply_to: cleanEmail,
          subject: `Nueva encuesta: ${cleanName} — ${dbc.toUpperCase()}`,
          html: getCoachNotificationHtml(cleanName, cleanEmail, dbc, cleanAnswers),
        }),
      })
      if (!notifyRes.ok) {
        console.error('Resend error (coach notification):', await notifyRes.text())
      }
    } catch (err) {
      console.error('Coach notification failed:', err)
    }
  }

  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
  })
})
