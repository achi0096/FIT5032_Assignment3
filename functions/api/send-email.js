// Cloudflare Pages Function (Node-like Worker runtime)
export const onRequestPost = async (context) => {
  const { request, env } = context;

  // CORS: allow only your site
  const origin = request.headers.get('Origin') || '';
  const allow = env.ALLOWED_ORIGIN || '';
  const corsHeaders = {
    'Access-Control-Allow-Origin': origin === allow ? allow : 'null',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };

  // Handle preflight
  if (request.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  if (origin !== allow) {
    return new Response(JSON.stringify({ error: 'Forbidden origin' }), {
      status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }

  try {
    const body = await request.json();
    const {
      to, subject, text = '', html = '',
      attachmentBase64 = '', attachmentName = ''
    } = body || {};

    if (!to || !subject) {
      return new Response(JSON.stringify({ error: 'Missing "to" or "subject"' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Build SendGrid payload
    const payload = {
      personalizations: [{ to: [{ email: to }] }],
      from: { email: env.FROM_EMAIL },     // must be a verified sender
      subject,
      content: [
        ...(text ? [{ type: 'text/plain', value: text }] : []),
        ...(html ? [{ type: 'text/html',  value: html }]  : []),
      ],
      attachments: attachmentBase64 ? [{
        content: attachmentBase64,        // raw base64, no "data:*;base64," prefix
        filename: attachmentName || 'file.bin',
        disposition: 'attachment',
        type: 'application/octet-stream'
      }] : undefined
    };

    // Call SendGrid
    const res = await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${env.SENDGRID_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      const errText = await res.text();
      return new Response(JSON.stringify({ ok: false, error: errText }), {
        status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({ ok: true }), {
      status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  } catch (e) {
    return new Response(JSON.stringify({ ok: false, error: String(e) }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
};
