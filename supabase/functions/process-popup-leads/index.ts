// Deno runtime — Supabase Edge Function
// Handles: Sending follow-up email to WhatsApp leads (source = popup) who haven't completed the survey
// Triggers: Can be invoked periodically via pg_cron

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

const EMAIL_SUBJECT = "Unlock your BJJ mindset — take the test now";

function getEmailHtml(name: string): string {
  // Using localhost placeholder for development. In production, change to the real domain.
  const appDomain = "https://camilosbjj.com.au"; 
  // We use a placeholder absolute URL for the image since email clients require absolute URLs.
  const imageUrl = "https://camilosbjj.com.au/assets/emails/whatsapp_leads_message.webp";

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>${EMAIL_SUBJECT}</title>
</head>
<body style="margin:0;padding:0;background:#f4f4f5;font-family:Georgia,serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f5;padding:40px 20px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;max-width:600px;width:100%;">
        
        <!-- Header Image -->
        <tr><td style="text-align:center;background:#111827;">
          <a href="${appDomain}/survey" target="_blank">
            <img src="${imageUrl}" alt="Discover Your Mindset for BJJ" width="100%" style="display:block;width:100%;max-width:600px;border:none;">
          </a>
        </td></tr>

        <!-- Body -->
        <tr><td style="padding:40px 48px 32px;font-size:16px;line-height:1.7;color:#374151;font-family:Georgia,serif;">
          <p>Hi ${name || 'there'},</p>
          <h2 style="font-size:22px;font-weight:900;color:#111827;line-height:1.3;margin:0 0 16px;">
            Discover Your Mindset for BJJ
          </h2>
          <p>
            We noticed you reached out for a free trial but haven't discovered your psychological belt yet.
            Take our quick diagnostic test to find out what drives you on the mat, and how we can best
            channel your strengths into your Jiu-Jitsu journey.
          </p>
        </td></tr>

        <!-- CTA -->
        <tr><td style="padding:0 48px 40px;text-align:center;">
          <a href="${appDomain}/survey"
             style="display:inline-block;padding:16px 40px;background:#111827;color:#ffffff;text-decoration:none;border-radius:50px;font-size:15px;font-weight:700;letter-spacing:0.05em;font-family:Arial,sans-serif;">
            Take the test now &rarr;
          </a>
        </td></tr>

        <!-- Divider -->
        <tr><td style="padding:0 48px;"><hr style="border:none;border-top:1px solid #e5e7eb;margin:0;"></td></tr>

        <!-- Footer -->
        <tr><td style="padding:24px 48px;text-align:center;font-size:13px;color:#9ca3af;font-family:Arial,sans-serif;">
          Camilo de Camilo's BJJ &mdash; Docklands, Melbourne<br>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: CORS_HEADERS })
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
    })
  }

  // Authorize using simple token or rely on internal supabase invocation
  // For security, checking an authorization header is recommended if exposed publicly.

  // Initialize Supabase with service role
  const supabaseUrl = Deno.env.get('SUPABASE_URL')
  const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
  const resendKey = Deno.env.get('RESEND_API_KEY')

  if (!supabaseUrl || !supabaseKey) {
    return new Response(JSON.stringify({ error: 'Database environment variables missing' }), { status: 500 })
  }

  const supabase = createClient(supabaseUrl, supabaseKey)

  // 1. Fetch pending leads via our RPC
  const { data: pendingLeads, error: rpcError } = await supabase.rpc('get_pending_popup_leads')

  if (rpcError) {
    console.error('RPC Error:', rpcError)
    return new Response(JSON.stringify({ error: 'Failed to fetch leads' }), { status: 500 })
  }

  if (!pendingLeads || pendingLeads.length === 0) {
    return new Response(JSON.stringify({ success: true, message: 'No pending leads found' }), {
      headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
    })
  }

  console.log(`Found ${pendingLeads.length} pending leads.`);

  // 2. Process emails
  const processedLog = [];
  const failedLog = [];

  for (const lead of pendingLeads) {
    const { id, nombre, email } = lead;

    if (!email || !email.includes('@')) {
      // Invalid email, just log it to avoid retrying infinitely
      await supabase.from('popup_email_logs').insert({ lead_id: id })
      continue;
    }

    if (resendKey) {
      const emailHtml = getEmailHtml(nombre);

      const emailRes = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${resendKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: "Camilo de Camilo's BJJ <camilo.coach@camilosbjj.com.au>",
          to: [email],
          subject: EMAIL_SUBJECT,
          html: emailHtml,
        }),
      });

      if (emailRes.ok) {
        // Success: Log it
        const { error: logError } = await supabase.from('popup_email_logs').insert({ lead_id: id })
        if (logError) {
          console.error(`Failed to log email for lead ${id}:`, logError)
        } else {
          processedLog.push(id)
        }
      } else {
        const errText = await emailRes.text();
        console.error(`Resend error for lead ${id}:`, errText)
        failedLog.push({ id, error: errText })
      }
    } else {
      console.warn('RESEND_API_KEY not set — skipping email send for lead', id)
      failedLog.push({ id, error: 'RESEND_API_KEY missing' })
    }
  }

  return new Response(JSON.stringify({ 
    success: true, 
    processed: processedLog.length, 
    failed: failedLog.length,
    failedDetails: failedLog
  }), {
    status: 200,
    headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
  })
})
