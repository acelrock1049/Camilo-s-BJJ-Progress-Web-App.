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
  white:  "Your Psychological Belt is ready 🥋",
  red:    "Your Psychological Belt is ready 🥋",
  blue:   "Your Psychological Belt is ready 🥋",
  orange: "Your Psychological Belt is ready 🥋",
  green:  "Your Psychological Belt is ready 🥋",
  yellow: "Your Psychological Belt is ready 🥋",
}

const EMAIL0_BODY: Record<DBC, string> = {
  white: `<strong>Your dominant profile is White / Beige:</strong> you operate in <em>safety-first</em> mode.<br><br>
Your nervous system prioritises security above everything else. Before learning any technique, your mind needs to know the environment is completely safe.<br><br>
On the mats, that means this: we won't put you in a live roll until <em>you</em> say you're ready.`,
  red:   `<strong>Your dominant profile is Red:</strong> you operate from challenge and ego.<br><br>
Your internal engine is competition. You need an opponent — physical or conceptual — to perform at your best. Routine without challenge drains you.<br><br>
On the mats: that's exactly what you'll find. Technique designed to make brute force your last resort, not your only tool.`,
  blue:  `<strong>Your dominant profile is Blue:</strong> you operate through discipline and systems.<br><br>
You need clear instruction and a proven method. Ambiguity and chaotic environments wear you out. You respond well to clear hierarchies and defined expectations.<br><br>
On the mats: our Smart System gives you exactly that — a 90-day roadmap, technique step by step, no improvisation.`,
  orange:`<strong>Your dominant profile is Orange:</strong> you operate through optimisation and results.<br><br>
You're analytical by nature. You need metrics, measurable progress, and a clear ROI on your time and money. "Just train harder" without data doesn't cut it for you.<br><br>
On the mats: we'll give you physical, technical, and psychological KPIs from day one.`,
  green: `<strong>Your dominant profile is Green:</strong> you operate through connection and empathy.<br><br>
Your biggest energy source is your tribe. An environment where ego crushes the beginner is literally toxic for you. You learn better through cooperation than competition.<br><br>
On the mats: Camilo's BJJ "Ego-Free Mats" are built exactly for your kind of mind.`,
  yellow:`<strong>Your dominant profile is Yellow:</strong> you operate through macro-vision and systems thinking.<br><br>
You need to understand the <em>why</em> behind every technique before you can execute it. You get frustrated when the method lacks internal coherence. You see patterns where others see chaos.<br><br>
On the mats: BJJ is the perfect language for your mind — human geometry, leverage, and continuous adaptation to your opponent's system.`,
}

function getEmail0Html(dbc: DBC, name: string): string {
  const accentColor = BELT_HEX[dbc]
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
            Your results are in, ${name}
          </h1>
        </td></tr>

        <!-- Body -->
        <tr><td style="padding:8px 48px 32px;font-size:16px;line-height:1.7;color:#374151;font-family:Georgia,serif;">
          <p>You made 8 instinctive decisions. Each one revealed something about how your mind operates under pressure, how you learn, and what you need to grow.</p>
          <p>${body}</p>
          <p>
            BJJ isn't just about sweating. It's a <strong>Personal Engineering Lab</strong> where you learn to use leverage — physical and mental — to overcome any obstacle.
          </p>
          <p>
            The first step is your Diagnostic Session (45 minutes):
          </p>
          <ul style="padding-left:20px;">
            <li>15 min: Goals conversation + assessment.</li>
            <li>30 min: Technical introduction adapted to your profile.</li>
          </ul>
          <p><em>Sweating on day one is optional.</em></p>
        </td></tr>

        <!-- CTA -->
        <tr><td style="padding:0 48px 40px;text-align:center;">
          <a href="https://wa.me/61489038711"
             style="display:inline-block;padding:16px 40px;background:#111827;color:#ffffff;text-decoration:none;border-radius:50px;font-size:15px;font-weight:700;letter-spacing:0.05em;font-family:Arial,sans-serif;">
            Book My Free Diagnostic &rarr;
          </a>
          <p style="margin:16px 0 0;font-size:13px;color:#9ca3af;font-family:Arial,sans-serif;">
            You don't need to be fit. You don't need experience. I'll handle the rest.
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
      { email: cleanEmail, source: 'survey', nombre: cleanName },
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
        from: "Camilo de Camilo's BJJ <onboarding@resend.dev>",
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
