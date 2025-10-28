<script setup>
import { ref } from "vue";

const to = ref("");
const subject = ref("");
const body = ref("");
const file = ref(null);
const sending = ref(false);
const result = ref("");

function onFile(e) {
  file.value = e.target.files?.[0] || null;
}

function fileToBase64NoPrefix(f) {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => {
      const s = String(r.result || "");
      const i = s.indexOf("base64,");
      resolve(i >= 0 ? s.slice(i + 7) : s);
    };
    r.onerror = reject;
    r.readAsDataURL(f);
  });
}

async function sendEmail() {
  result.value = "";
  sending.value = true;

  try {
    let attachmentBase64, attachmentName, attachmentMime;
    if (file.value) {
      attachmentBase64 = await fileToBase64NoPrefix(file.value);
      attachmentName   = file.value.name;
      attachmentMime   = file.value.type || "application/octet-stream";
    }
   
    const SENDMAIL_URL = import.meta.env.VITE_SENDMAIL_URL || "/api/send-email";
    console.log("VITE_SENDMAIL_URL =", SENDMAIL_URL);
    window.SENDMAIL_URL = SENDMAIL_URL; // so you can read it in DevTools
    const url = SENDMAIL_URL;


    const resp = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",

      },
      body: JSON.stringify({
        to: to.value,
        subject: subject.value,
        text: body.value,
        html: `<p>${body.value.replace(/\n/g, "<br/>")}</p>`,
        attachmentBase64,
        attachmentName,
        attachmentMime,
      }),
    });

    const data = await resp.json().catch(() => ({}));
    if (!resp.ok) throw new Error(data.error || resp.statusText);

    result.value = "Email sent successfully.";
  } catch (e) {
    result.value = "Error: " + (e?.message ?? String(e));
  } finally {
    sending.value = false;
  }
}
</script>

<template>
  <section class="container" style="max-width:680px">
    <h2 class="mb-3">Send Email</h2>

    <div v-if="result" class="alert" :class="result.startsWith('Error') ? 'alert-danger' : 'alert-success'">
      {{ result }}
    </div>

    <form @submit.prevent="sendEmail" class="vstack gap-3">
      <div>
        <label class="form-label">To</label>
        <input v-model="to" type="email" class="form-control" required placeholder="recipient@example.com" />
      </div>

      <div>
        <label class="form-label">Subject</label>
        <input v-model="subject" type="text" class="form-control" required />
      </div>

      <div>
        <label class="form-label">Message</label>
        <textarea v-model="body" rows="6" class="form-control" placeholder="Write your message..."></textarea>
      </div>

      <div>
        <label class="form-label">Attachment (optional)</label>
        <input type="file" class="form-control" @change="onFile" />
        <small class="text-muted">{{ file?.name }}</small>
      </div>

      <button class="btn btn-success" :disabled="sending">
        {{ sending ? "Sending…" : "Send Email" }}
      </button>
    </form>
  </section>
</template>
