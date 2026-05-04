// Deno runtime — Supabase Edge Function
// Handles: Sending periodic drip emails (Day 2, Day 4, Day 7) to survey leads
// Triggers: pg_cron (e.g. daily)

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

const APP_DOMAIN = "https://camilosbjj.com.au";

// ─────────────────────────────────────────────────────────────────────────────
// EMAIL TEMPLATES
// ─────────────────────────────────────────────────────────────────────────────

type DBC = 'white' | 'red' | 'blue' | 'orange' | 'green' | 'yellow'

function getUnsubscribeHtml(email: string) {
  const unsubscribeUrl = `${APP_DOMAIN}/api/unsubscribe?email=${encodeURIComponent(email)}`
  return `
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
  `
}

function getEmailWrapper(content: string, email: string) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>Camilo's BJJ</title>
</head>
<body style="margin:0;padding:0;background:#f4f4f5;font-family:Georgia,serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f5;padding:40px 20px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;max-width:600px;width:100%;">
        ${content}
        ${getUnsubscribeHtml(email)}
      </table>
    </td></tr>
  </table>
</body>
</html>`
}

function getEmail2(name: string, email: string, belt: DBC) {
  const customLines: Record<DBC, string> = {
    white: "Since your mindset prioritizes safety, you'll appreciate how controlled and injury-free our environment is.",
    red: "Since your mindset thrives on challenge, you'll love the strategic puzzles our system offers without the senseless brawling.",
    blue: "Since your mindset values order, you'll immediately connect with the step-by-step logic of our Smart System.",
    orange: "Since your mindset seeks optimization, you'll appreciate the measurable technical progress from day one.",
    green: "Since your mindset values community, you'll immediately feel at home on our Ego-Free mats.",
    yellow: "Since your mindset operates on macro-vision, you'll appreciate the underlying physics and geometry of every technique."
  }

  const content = `
    <tr><td style="padding:40px 48px 32px;font-size:16px;line-height:1.7;color:#374151;font-family:Georgia,serif;">
      <p>Hi ${name},</p>
      <p>Have you ever felt so mentally exhausted by the "9 to 5" grind that the idea of going to a crowded gym full of people lifting weights and looking in the mirror gives you infinite laziness?</p>
      <p>That's what happened to Lucas.</p>
      <p>As a consultant, he spent 10 hours in front of a screen. Stress dominated him. He wanted to learn to defend himself, but he was terrified of entering one of those "Mega-Fight Gyms" where beginners are used as cannon fodder by young competitors.</p>
      <p>He was operating from the white belt of stress (pure Survival).</p>
      <p>Then he tried our classes. What he found was very different:</p>
      <ul style="padding-left:20px;">
        <li><strong>Ego-Free Mats:</strong> No one tried to crush him on the first day.</li>
        <li><strong>The Smart System:</strong> He discovered that being lighter or not having the cardio of a marathon runner didn't matter; mechanical leverage is everything.</li>
        <li><strong>Real community:</strong> He found other Docklands professionals on the same wavelength.</li>
      </ul>
      <p>Today Lucas left his corporate anxiety behind and is building real resilience.</p>
      <p><em>${customLines[belt]}</em></p>
      <p>You don't have to be an athlete to learn strategy and defense. You just need to take the first step.</p>
    </td></tr>
    <tr><td style="padding:0 48px 40px;text-align:center;">
      <a href="https://wa.me/61489038711"
         style="display:inline-block;padding:16px 40px;background:#111827;color:#ffffff;text-decoration:none;border-radius:50px;font-size:15px;font-weight:700;letter-spacing:0.05em;font-family:Arial,sans-serif;">
        Come meet your "Expert Neighbors" (Free Week) &rarr;
      </a>
      <p style="margin:24px 0 0;font-size:15px;color:#374151;font-weight:bold;">Camilo.</p>
    </td></tr>
  `
  return { subject: "From 10 hours in front of a laptop to mastering the mats", html: getEmailWrapper(content, email) }
}

function getEmail3(name: string, email: string, belt: DBC) {
  const content = `
    <tr><td style="padding:40px 48px 32px;font-size:16px;line-height:1.7;color:#374151;font-family:Georgia,serif;">
      <p>${name}, we all know that $1,200/year membership that we only use three times in January.</p>
      <p>That's the classic office worker tax.</p>
      <p>But the real cost of putting off your well-being isn't measured in dollars. It's measured in:</p>
      <ul style="padding-left:20px;">
        <li>Chronic lower back pain from sitting all day.</li>
        <li>The accumulated stress you take to bed because you don't have a genuine escape valve.</li>
        <li>A lack of physical confidence when walking down the street.</li>
      </ul>
      <p>The treadmill doesn't teach you any skills. BJJ, on the other hand, is a <strong>forced meditation</strong>.</p>
      <p>When you're on the mats learning to use leverage to survive an opponent's control, I promise you it's neurologically impossible to think about that urgent email or tomorrow's deadline.</p>
      <p>You truly disconnect.</p>
      <p>Let's break that inertia today. Trade a week of monotony for a new life skill.</p>
    </td></tr>
    <tr><td style="padding:0 48px 40px;text-align:center;">
      <a href="https://wa.me/61489038711"
         style="display:inline-block;padding:16px 40px;background:#111827;color:#ffffff;text-decoration:none;border-radius:50px;font-size:15px;font-weight:700;letter-spacing:0.05em;font-family:Arial,sans-serif;">
        Activate my 90-Day Roadmap &rarr;
      </a>
    </td></tr>
  `
  return { subject: "The 'Sedentary Tax' you are paying", html: getEmailWrapper(content, email) }
}

function getEmail4(name: string, email: string, belt: DBC) {
  const customLines: Record<DBC, string> = {
    white: "Let's speak clearly (especially since you value safety above all else, you'll like this).",
    red: "Let's speak clearly (especially since you thrive on challenge and brutal honesty, you'll like this).",
    blue: "Let's speak clearly (especially since you value order and transparency, you'll like this).",
    orange: "Let's speak clearly (especially since you operated on an analytical level in the test, you'll like this).",
    green: "Let's speak clearly (especially since you value community and genuine connections, you'll like this).",
    yellow: "Let's speak clearly (especially since you see the bigger picture, you'll like this)."
  }

  const content = `
    <tr><td style="padding:40px 48px 32px;font-size:16px;line-height:1.7;color:#374151;font-family:Georgia,serif;">
      <p>Hi ${name},</p>
      <p>${customLines[belt]}</p>
      <p>There are dozens of MMA mega-academies in Melbourne with hundreds of students and suffocating annual contracts.</p>
      <p>If your goal is to be a professional cage fighter and bash heads this weekend, I recommend you go with them. We are not for you.</p>
      <p>But, if you want to:</p>
      <ol style="padding-left:20px;">
        <li>Keep your professional job without coming in limping on Monday.</li>
        <li>Develop an unstoppable mindset guided by Spiral Dynamics.</li>
        <li>Train with mentors (with 21 world golds) who <em>actually know your name</em> and protect your previous injuries.</li>
      </ol>
      <p>Then we are <em>exactly</em> what you're looking for. We are a boutique experience.</p>
      <p>Our memberships are 100% Zero Lock-in (Total Freedom). You start easy, you cancel easy. No tricks or fine print.</p>
      <p>Your free week and your test analysis are about to expire from our database. We have exactly 5 spots left for the beginner diagnostic this week (our groups are strictly limited for safety).</p>
      <p>Don't let chaos take control again.</p>
    </td></tr>
    <tr><td style="padding:0 48px 40px;text-align:center;">
      <a href="https://wa.me/61489038711"
         style="display:inline-block;padding:16px 40px;background:#111827;color:#ffffff;text-decoration:none;border-radius:50px;font-size:15px;font-weight:700;letter-spacing:0.05em;font-family:Arial,sans-serif;">
        I want to begin my evolution &rarr;
      </a>
      <p style="margin:24px 0 0;font-size:15px;color:#374151;font-weight:bold;">Camilo</p>
      <p style="margin:4px 0 0;font-size:13px;color:#6b7280;font-style:italic;">Master the fight, Empowered Living.</p>
    </td></tr>
  `
  return { subject: "Why we are NOT the biggest gym in Melbourne", html: getEmailWrapper(content, email) }
}

// ─────────────────────────────────────────────────────────────────────────────
// HANDLER
// ─────────────────────────────────────────────────────────────────────────────

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: CORS_HEADERS })
  }

  const supabaseUrl = Deno.env.get('SUPABASE_URL')
  const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
  const resendKey = Deno.env.get('RESEND_API_KEY')

  if (!supabaseUrl || !supabaseKey) {
    return new Response(JSON.stringify({ error: 'Database config missing' }), { status: 500 })
  }

  const supabase = createClient(supabaseUrl, supabaseKey)

  // 1. Fetch pending emails via RPC
  const { data: pendingEmails, error: rpcError } = await supabase.rpc('get_pending_survey_emails')

  if (rpcError) {
    console.error('RPC Error:', rpcError)
    return new Response(JSON.stringify({ error: 'Failed to fetch pending emails' }), { status: 500 })
  }

  if (!pendingEmails || pendingEmails.length === 0) {
    return new Response(JSON.stringify({ success: true, message: 'No pending emails found' }), {
      headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
    })
  }

  console.log(`Found ${pendingEmails.length} pending survey drip emails.`);

  const processedLog = [];
  const failedLog = [];

  for (const lead of pendingEmails) {
    const { survey_result_id, name, email, dominant_belt_color, next_email_type } = lead;

    if (!email || !email.includes('@')) {
      failedLog.push({ id: survey_result_id, error: 'Invalid email format' });
      continue;
    }

    if (!resendKey) {
      console.warn('RESEND_API_KEY not set');
      failedLog.push({ id: survey_result_id, error: 'RESEND_API_KEY missing' });
      continue;
    }

    const belt = dominant_belt_color as DBC;
    let emailData;
    if (next_email_type === 'email_2') {
      emailData = getEmail2(name, email, belt);
    } else if (next_email_type === 'email_3') {
      emailData = getEmail3(name, email, belt);
    } else if (next_email_type === 'email_4') {
      emailData = getEmail4(name, email, belt);
    } else {
      failedLog.push({ id: survey_result_id, error: 'Unknown email_type' });
      continue;
    }

    const emailRes = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: "Camilo de Camilo's BJJ <camilo.coach@camilosbjj.com.au>",
        to: [email],
        subject: emailData.subject,
        html: emailData.html,
      }),
    });

    if (emailRes.ok) {
      // Success: Log it so it isn't sent again
      const { error: logError } = await supabase.from('survey_email_logs').insert({
        survey_result_id,
        email_type: next_email_type
      })
      if (logError) {
        console.error(`Failed to log email ${next_email_type} for ${survey_result_id}:`, logError)
      } else {
        processedLog.push({ id: survey_result_id, type: next_email_type })
      }
    } else {
      const errText = await emailRes.text();
      console.error(`Resend error for survey lead ${survey_result_id} [${next_email_type}]:`, errText)
      failedLog.push({ id: survey_result_id, error: errText })
    }
  }

  return new Response(JSON.stringify({ 
    success: true, 
    processed: processedLog.length, 
    failed: failedLog.length,
    processedDetails: processedLog,
    failedDetails: failedLog
  }), {
    status: 200,
    headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
  })
})
