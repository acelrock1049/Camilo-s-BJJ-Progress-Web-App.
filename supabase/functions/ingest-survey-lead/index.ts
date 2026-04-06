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

const EMAIL0_SUBJECTS: Record<DBC, string> = {
  white:  "Your BJJ journey starts with awareness",
  red:    "Your fighting spirit is your superpower",
  blue:   "You have the discipline to go far",
  orange: "Your mindset is built to perform",
  green:  "Community will be your greatest weapon",
  yellow: "You see the whole game",
}

const EMAIL0_HEADLINES: Record<DBC, string> = {
  white:  "Safety first. Mastery second.",
  red:    "Channel your fire into leverage.",
  blue:   "The system is your advantage.",
  orange: "Measure everything. Improve everything.",
  green:  "Your tribe is waiting on the mat.",
  yellow: "You already see what others miss.",
}

const EMAIL0_BODY: Record<DBC, string> = {
  white: `You approach BJJ with a mix of curiosity and caution — and that's not weakness, that's intelligence. Your nervous system is alert and adaptive. On the mat, safety and trust come first. Camilo builds exactly that environment: no surprises, no pressure, complete control over your pace.`,
  red:   `You bring fire to the mat. You want to test yourself, compete, and earn your place. That competitive drive is rare, and Camilo knows how to channel it so it becomes your biggest strategic advantage — not brute force, but calculated leverage that lets you dominate with technique.`,
  blue:  `You thrive on structure and clear instruction. You want the system, not the chaos. Camilo's methodical 90-day roadmap was designed for minds like yours — every technique mapped, every progression planned. No ambiguity. No improvisation. Just a clear path forward.`,
  orange:`You track progress, optimize relentlessly, and set measurable goals. You won't just train — you'll improve. Camilo uses data and milestones to keep achievement-driven students locked in: escape rates, conditioning benchmarks, weekly KPIs. You'll see the numbers move.`,
  green: `You will love the culture at Camilo's BJJ. The relationships forged on the mat here go beyond sport — they become genuine friendships. Your growth will come not just from technique, but from the tribe you train with: a community of Docklands professionals who help each other grow.`,
  yellow:`You already see the interconnected system behind everything. On the mat, you'll be fascinated by how each position, transition, and principle fits together like geometry. Camilo teaches the meta-game — the physics of human leverage, the why behind every movement. You're going to love it.`,
}

function getEmail0Html(dbc: DBC, name: string): string {
  const accentColor = BELT_HEX[dbc]
  const headline = EMAIL0_HEADLINES[dbc]
  const body = EMAIL0_BODY[dbc]

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>Your BJJ Psychological Belt</title>
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
            CAMILO'S BJJ &middot; YOUR PSYCHOLOGICAL BELT
          </p>
          <h1 style="font-size:28px;font-weight:900;color:#111827;margin:0;font-family:Georgia,serif;line-height:1.2;">
            ${headline}
          </h1>
        </td></tr>

        <!-- Body -->
        <tr><td style="padding:8px 48px 32px;font-size:16px;line-height:1.7;color:#374151;font-family:Georgia,serif;">
          <p>Hi ${name},</p>
          <p>${body}</p>
          <p>
            This is what your Jiu-Jitsu journey looks like from the inside — and Camilo knows
            exactly how to work with your mindset to accelerate your evolution on the mat.
          </p>
          <p>
            Your first class is completely free. No commitment, no contract, no pressure.
            Just show up and see what it feels like.
          </p>
        </td></tr>

        <!-- CTA -->
        <tr><td style="padding:0 48px 40px;text-align:center;">
          <a href="https://wa.me/61489038711"
             style="display:inline-block;padding:16px 40px;background:#111827;color:#ffffff;text-decoration:none;border-radius:50px;font-size:15px;font-weight:700;letter-spacing:0.05em;font-family:Arial,sans-serif;">
            Book your free trial via WhatsApp &rarr;
          </a>
          <p style="margin:16px 0 0;font-size:13px;color:#9ca3af;font-family:Arial,sans-serif;">
            Or find us at 18 Import Ln, Docklands VIC 3008 (inside Empower Tactical)
          </p>
        </td></tr>

        <!-- Divider -->
        <tr><td style="padding:0 48px;"><hr style="border:none;border-top:1px solid #e5e7eb;margin:0;"></td></tr>

        <!-- Footer -->
        <tr><td style="padding:24px 48px;text-align:center;font-size:13px;color:#9ca3af;font-family:Arial,sans-serif;">
          Camilo's BJJ &mdash; Docklands, Melbourne<br>
          <a href="https://www.instagram.com/camilosbjj/" style="color:#9ca3af;text-decoration:none;">@camilosbjj</a>
          &nbsp;&middot;&nbsp;
          No contract &middot; No lock-in &middot; Cancel anytime
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

  const { name, email, dominant_belt_color, scores, survey_completed_at } = body

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
      { email: cleanEmail, source: 'survey' },
      { onConflict: 'email' }
    )

  if (leadsError) {
    console.error('leads upsert error (non-fatal):', leadsError)
  }

  // 3. Send Email 0 via Resend — segmented by dominant_belt_color
  const resendKey = Deno.env.get('RESEND_API_KEY')
  if (resendKey) {
    const emailHtml = getEmail0Html(dbc, cleanName)
    const subject = `${EMAIL0_SUBJECTS[dbc]}, ${cleanName}`

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

  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
  })
})
