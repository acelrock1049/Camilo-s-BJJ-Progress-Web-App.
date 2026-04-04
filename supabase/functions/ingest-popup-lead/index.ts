// Deno runtime — Supabase Edge Function
// Handles: scroll popup lead capture (email + optional instagram handle)
// Actions: upsert into leads table + send free trial confirmation email via Resend

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

const FREE_TRIAL_EMAIL_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>Your free trial at Camilo's BJJ</title>
</head>
<body style="margin:0;padding:0;background:#f4f4f5;font-family:Georgia,serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f5;padding:40px 20px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;max-width:600px;width:100%;">

        <!-- Top accent bar -->
        <tr><td style="height:5px;background:#111827;"></td></tr>

        <!-- Header -->
        <tr><td style="padding:40px 48px 20px;text-align:center;">
          <p style="font-size:11px;font-weight:700;letter-spacing:0.2em;color:#6b7280;text-transform:uppercase;margin:0 0 16px;">
            CAMILO'S BJJ &middot; DOCKLANDS, MELBOURNE
          </p>
          <h1 style="font-size:28px;font-weight:900;color:#111827;margin:0;font-family:Georgia,serif;line-height:1.2;">
            Your first class is completely free.
          </h1>
        </td></tr>

        <!-- Body -->
        <tr><td style="padding:8px 48px 32px;font-size:16px;line-height:1.7;color:#374151;font-family:Georgia,serif;">
          <p>Thanks for reaching out — we're glad you did.</p>
          <p>
            At Camilo's BJJ, we don't do hard sells or lock-in contracts. Your first class is free so you can
            feel the mat, meet the community, and see if it's the right fit — no pressure, no commitment.
          </p>
          <p>
            We train at <strong>18 Import Ln, Docklands VIC 3008</strong> (inside Empower Tactical).
            Just send us a message on WhatsApp to book your slot and we'll sort everything out.
          </p>
        </td></tr>

        <!-- CTA -->
        <tr><td style="padding:0 48px 40px;text-align:center;">
          <a href="https://wa.me/61489038711"
             style="display:inline-block;padding:16px 40px;background:#111827;color:#ffffff;text-decoration:none;border-radius:50px;font-size:15px;font-weight:700;letter-spacing:0.05em;font-family:Arial,sans-serif;">
            Book via WhatsApp &rarr;
          </a>
        </td></tr>

        <!-- Divider -->
        <tr><td style="padding:0 48px;"><hr style="border:none;border-top:1px solid #e5e7eb;margin:0;"></td></tr>

        <!-- Footer -->
        <tr><td style="padding:24px 48px;text-align:center;font-size:13px;color:#9ca3af;font-family:Arial,sans-serif;">
          Camilo's BJJ &mdash; 18 Import Ln, Docklands VIC 3008<br>
          <a href="https://www.instagram.com/camilosbjj/" style="color:#9ca3af;text-decoration:none;">@camilosbjj</a>
          &nbsp;&middot;&nbsp;
          No contract &middot; No lock-in &middot; Cancel anytime
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`

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

  let body: { email?: unknown; instagram_handle?: unknown }
  try {
    body = await req.json()
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON body' }), {
      status: 400,
      headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
    })
  }

  const { email, instagram_handle } = body

  if (!email || typeof email !== 'string' || !email.includes('@')) {
    return new Response(JSON.stringify({ error: 'A valid email is required' }), {
      status: 400,
      headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
    })
  }

  const cleanEmail = email.toLowerCase().trim()
  const cleanInstagram = typeof instagram_handle === 'string' ? instagram_handle.trim() || null : null

  // Initialize Supabase with service role — bypasses RLS
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  )

  // Upsert into leads — if email exists, update instagram_handle and source
  const { error: dbError } = await supabase
    .from('leads')
    .upsert(
      { email: cleanEmail, instagram_handle: cleanInstagram, source: 'popup' },
      { onConflict: 'email' }
    )

  if (dbError) {
    console.error('leads upsert error:', dbError)
    return new Response(JSON.stringify({ error: 'Database error' }), {
      status: 500,
      headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
    })
  }

  // Send confirmation email via Resend — non-fatal if it fails
  const resendKey = Deno.env.get('RESEND_API_KEY')
  if (resendKey) {
    const emailRes = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: "Camilo's BJJ <hello@camilosbjj.com>",
        to: [cleanEmail],
        subject: "Your free trial at Camilo's BJJ — Docklands",
        html: FREE_TRIAL_EMAIL_HTML,
      }),
    })

    if (!emailRes.ok) {
      console.error('Resend error (popup):', await emailRes.text())
      // Non-fatal — lead is saved, continue
    }
  } else {
    console.warn('RESEND_API_KEY not set — skipping email send')
  }

  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
  })
})
