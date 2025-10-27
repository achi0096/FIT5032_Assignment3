<script setup>
import { ref } from "vue";
import { auth } from "@/firebase/init";

const to = ref("");
const subject = ref("");
const body = ref("");
const file = ref(null);
const sending = ref(false);
const result = ref("");

function onFile(e) {
  file.value = e.target.files?.[0] || null;
}

function fileToBase64(f) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const s = String(reader.result || "");
      // strip "data:...;base64," if present
      const idx = s.indexOf("base64,");
      resolve(idx >= 0 ? s.slice(idx + 7) : s);
    };
    reader.onerror = reject;
    reader.readAsDataURL(f);
  });
}

async function sendEmail() {
  result.value = "";
  sending.value = true;
  try {
    const token = await auth.currentUser.getIdToken();

    let attachment = undefined;
    if (file.value) {
      attachment = {
        filename: file.value.name,
        type: file.value.type || "application/octet-stream",
        content: await fileToBase64(file.value),
      };
    }

    // Replace with your deployed function URL
    const url = import.meta.env.VITE_SENDMAIL_URL
      || "https://australia-southeast1-<project-id>.cloudfunctions.net/sendMail";

    const r = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + token,
      },
      body: JSON.stringify({
        to: to.value,
        subject: subject.value,
        text: body.value,
        html: `<p>${body.value.replace(/\n/g, "<br/>")}</p>`,
        attachment,
      }),
    });

    const j = await r.json();
    if (!r.ok) throw new Error(j.error || "Failed");
    result.value = "Email sent ✔";
  } catch (e) {
    result.value = "Error: " + (e.message || e);
  } finally {
    sending.value = false;
  }
}
</script>

<template>
  <section class="container" style="max-width:680px">
    <h2 class="mb-3">Send Email (with attachment)</h2>
    <div v-if="result" class="alert" :class="result.startsWith('Error') ? 'alert-danger':'alert-success'">
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
        {{ sending ? 'Sending…' : 'Send Email' }}
      </button>
    </form>
  </section>
</template>
