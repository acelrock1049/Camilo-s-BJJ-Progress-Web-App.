// Deno runtime — Supabase Edge Function
// Handles: Unsubscribing users from marketing emails

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

Deno.serve(async (req: Request) => {
  const url = new URL(req.url)
  const email = url.searchParams.get('email')

  if (!email) {
    return new Response('Email parameter missing', { status: 400 })
  }

  const supabaseUrl = Deno.env.get('SUPABASE_URL')
  const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
  
  if (!supabaseUrl || !supabaseKey) {
    return new Response('Server configuration error', { status: 500 })
  }

  const supabase = createClient(supabaseUrl, supabaseKey)

  const { error } = await supabase
    .from('unsubscribed_emails')
    .upsert({ email: email.toLowerCase().trim() }, { onConflict: 'email' })

  if (error) {
    console.error('Unsubscribe error:', error)
    return new Response('Error processing request. Please try again later.', { status: 500 })
  }

  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width,initial-scale=1">
      <title>Unsubscribed</title>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; display: flex; justify-content: center; align-items: center; height: 100vh; background: #111827; color: white; text-align: center; margin: 0; }
        .container { max-width: 400px; padding: 20px; }
        h1 { font-size: 24px; margin-bottom: 10px; font-weight: bold; }
        p { color: #9ca3af; font-size: 16px; line-height: 1.5; }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>Unsubscribed</h1>
        <p>You have been successfully unsubscribed from Camilo's BJJ emails. We're sorry to see you go!</p>
      </div>
    </body>
    </html>
  `

  return new Response(html, {
    headers: { 'Content-Type': 'text/html' },
    status: 200,
  })
})
