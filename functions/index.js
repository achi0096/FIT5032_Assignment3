/* eslint-env node */
const functions = require("firebase-functions"); // v1 API
const admin = require("firebase-admin");
const cors = require("cors")({ origin: true });
const sgMail = require("@sendgrid/mail");

if (!admin.apps.length) admin.initializeApp();

// If you used functions:config:set sendgrid.key and sendgrid.sender:
const cfg = functions.config?.() || {};
const SENDGRID_KEY = cfg?.sendgrid?.key || process.env.SENDGRID_API_KEY;      // fallback to env
const SENDGRID_SENDER = cfg?.sendgrid?.sender || process.env.SENDGRID_SENDER;  // fallback to env
if (SENDGRID_KEY) sgMail.setApiKey(SENDGRID_KEY);

async function verifyUser(req) {
  const auth = req.headers.authorization || "";
  const m = auth.match(/^Bearer\s+(.+)$/i);
  if (!m) return null;
  try { return await admin.auth().verifyIdToken(m[1]); } catch { return null; }
}

exports.ping = functions
  .region("australia-southeast1")
  .https.onRequest((req, res) => {
    cors(req, res, () => res.status(200).send("pong"));
  });

exports.sendMail = functions
  .region("australia-southeast1")
  .https.onRequest(async (req, res) => {
    cors(req, res, async () => {
      if (req.method !== "POST") return res.status(405).json({ error: "Use POST" });

      const user = await verifyUser(req);
      if (!user) return res.status(401).json({ error: "Unauthorized" });

      if (!SENDGRID_KEY || !SENDGRID_SENDER) {
        return res.status(500).json({ error: "SendGrid not configured" });
      }

      const { to, subject, text, html, attachment } = req.body || {};
      if (!to || !subject) return res.status(400).json({ error: "Missing 'to' or 'subject'" });

      const msg = {
        to,
        from: { email: SENDGRID_SENDER, name: "Youth Wellbeing" },
        subject,
        text: text || undefined,
        html: html || undefined,
      };

      if (attachment?.content && attachment?.filename) {
        msg.attachments = [{
          content: attachment.content, // base64 only (no data: prefix)
          filename: attachment.filename,
          type: attachment.type || "application/octet-stream",
          disposition: "attachment",
        }];
      }

      try {
        await sgMail.send(msg);
        return res.json({ ok: true });
      } catch (e) {
        console.error(e.response?.body || e);
        return res.status(500).json({ error: "Failed to send email" });
      }
    });
  });
