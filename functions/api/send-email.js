// functions/api/send-email.js

function buildCorsHeaders(request, env) {
  const origin = request.headers.get('Origin');
  const reqAllowHeaders = request.headers.get('Access-Control-Request-Headers');
  const allowList = (env.ALLOWED_ORIGIN || '')
    .split(',')
    .map(s => s.trim())
    .filter(Boolean);

  // Default allow headers (plus anything the browser asked for)
  const allowHeaders = reqAllowHeaders && reqAllowHeaders.length
    ? reqAllowHeaders
    : 'Content-Type, Authorization, X-API-KEY';

  // If no Origin (curl/postman), be permissive
  if (!origin) {
    return {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS, GET',
      'Access-Control-Allow-Headers': allowHeaders,
      'Access-Control-Max-Age': '600',
      'Access-Control-Expose-Headers': 'Content-Type',
      'Vary': 'Origin',
    };
  }

  // If Origin matches one in the allowlist, echo it back
  const allowed = allowList.find(a => a === origin);
  
  return {
    'Access-Control-Allow-Origin': allowed || '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS, GET',
    'Access-Control-Allow-Headers': allowHeaders,
    'Access-Control-Max-Age': '600',
    'Access-Control-Expose-Headers': 'Content-Type',
    'Vary': 'Origin',
  };
}

// ✅ Preflight: MUST be 204 with CORS headers
export const onRequestOptions = ({ request, env }) =>
  new Response(null, { status: 204, headers: buildCorsHeaders(request, env) });

export const onRequestGet = ({ request, env }) =>
  new Response(JSON.stringify({ ok: true, hint: 'POST to this endpoint to send email' }), {
    status: 200,
    headers: { 'Content-Type': 'application/json', ...buildCorsHeaders(request, env) },
  });

export const onRequestPost = async ({ request, env }) => {
  const cors = buildCorsHeaders(request, env);

  // Optional: fail fast if critical envs are missing
  if (!env.SENDGRID_API_KEY || !env.FROM_EMAIL) {
    return new Response(JSON.stringify({ ok: false, error: 'Missing SENDGRID_API_KEY or FROM_EMAIL' }), {
      status: 500, headers: { ...cors, 'Content-Type': 'application/json' },
    });
  }

  const key = request.headers.get('X-API-KEY');
  if (env.PRIVATE_API_KEY && key !== env.PRIVATE_API_KEY) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401, headers: { ...cors, 'Content-Type': 'application/json' },
    });
  }

  try {
    const {
      to,
      subject,
      text = '',
      html = '',
      attachmentBase64 = '',
      attachmentName = '',
      attachmentMime = 'application/octet-stream',
    } = await request.json();

    if (!to || !subject) {
      return new Response(JSON.stringify({ error: 'Missing "to" or "subject"' }), {
        status: 400, headers: { ...cors, 'Content-Type': 'application/json' },
      });
    }

    const payload = {
      personalizations: [{ to: [{ email: to }] }],
      from: { email: env.FROM_EMAIL },
      subject,
      content: [
        ...(text ? [{ type: 'text/plain', value: text }] : []),
        ...(html ? [{ type: 'text/html', value: html }] : []),
      ],
      attachments: attachmentBase64
        ? [{
            content: attachmentBase64,
            filename: attachmentName || 'file.bin',
            disposition: 'attachment',
            type: attachmentMime,
          }]
        : undefined,
    };

    const sgRes = await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${env.SENDGRID_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!sgRes.ok) {
      const err = await sgRes.text();
      return new Response(JSON.stringify({ ok: false, error: err }), {
        status: 500, headers: { ...cors, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ ok: true }), {
      status: 200, headers: { ...cors, 'Content-Type': 'application/json' },
    });
  } catch (e) {
    return new Response(JSON.stringify({ ok: false, error: String(e) }), {
      status: 500, headers: { ...cors, 'Content-Type': 'application/json' },
    });
  }
};
