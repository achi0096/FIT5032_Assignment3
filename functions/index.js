const functions = require("firebase-functions");
const admin = require("firebase-admin");
const sgMail = require("@sendgrid/mail");

admin.initializeApp();

// Get your API key from SendGrid Dashboard and set it using:
// firebase functions:config:set sendgrid.key="SG.xxxxx...."
sgMail.setApiKey(functions.config().sendgrid.key);

/**
 * callable function: sendEmail
 * data: { to, subject, text, html?, attachment?: { filename, content, type } }
 * attachment.content must be base64 string
 */
exports.sendEmail = functions.https.onCall(async (data, context) => {
  // optional: require auth
  if (!context.auth) {
    throw new functions.https.HttpsError("unauthenticated", "Sign in required.");
  }

  // basic validation
  const { to, subject, text, html, attachment } = data || {};
  if (!to || !subject || (!text && !html)) {
    throw new functions.https.HttpsError("invalid-argument", "Missing fields.");
  }

  const msg = {
    to,
    from: { email: "no-reply@youthwellbeing.app", name: "Youth Wellbeing" }, // must be a verified sender in SendGrid
    subject,
    text: text || "",       // plaintext fallback
    html: html || undefined,
  };

  if (attachment && attachment.content && attachment.filename) {
    msg.attachments = [{
      filename: attachment.filename,
      type: attachment.type || "application/octet-stream",
      content: attachment.content, // base64 string
      disposition: "attachment",
    }];
  }

  try {
    const [resp] = await sgMail.send(msg);
    return { ok: true, status: resp.statusCode };
  } catch (err) {
    console.error("SendGrid error:", err?.response?.body || err);
    throw new functions.https.HttpsError("internal", "Email failed.");
  }
});
