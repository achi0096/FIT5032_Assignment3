<script setup>
import { ref, computed } from "vue";

const to = ref("");
const subject = ref("");
const body = ref("");
const file = ref(null);
const sending = ref(false);
const result = ref("");
const submitted = ref(false); // a11y

const invalidTo = computed(() => submitted.value && !to.value.trim());
const invalidSubject = computed(() => submitted.value && !subject.value.trim());

function onFile(e) { file.value = e.target.files?.[0] || null; }

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
  submitted.value = true; // mark fields for aria-invalid

  try {
    if (invalidTo.value || invalidSubject.value) { sending.value = false; return; }

    let attachmentBase64, attachmentName, attachmentMime;
    if (file.value) {
      attachmentBase64 = await fileToBase64NoPrefix(file.value);
      attachmentName   = file.value.name;
      attachmentMime   = file.value.type || "application/octet-stream";
    }

    const SENDMAIL_URL = import.meta.env.VITE_SENDMAIL_URL || "/api/send-email";
    const resp = await fetch(SENDMAIL_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
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
    <h1 class="h4 mb-3">Send Email</h1>

    <!-- live region for results -->
    <div v-if="result"
         class="alert"
         :class="result.startsWith('Error') ? 'alert-danger' : 'alert-success'"
         role="status" aria-live="polite">
      {{ result }}
    </div>

    <form @submit.prevent="sendEmail" class="vstack gap-3" novalidate>
      <div>
        <label class="form-label" for="to">To</label>
        <input id="to" v-model="to" type="email" class="form-control" required
               autocomplete="email" 
               :aria-invalid="invalidTo" aria-describedby="to-err" placeholder="recipient@example.com" />
        <div v-if="invalidTo" id="to-err" class="text-danger small" role="alert">Enter a valid email.</div>
      </div>

      <div>
        <label class="form-label" for="subj">Subject</label>
        <input id="subj" v-model="subject" type="text" class="form-control" required
               :aria-invalid="invalidSubject" aria-describedby="subj-err" />
        <div v-if="invalidSubject" id="subj-err" class="text-danger small" role="alert">Subject is required.</div>
      </div>

      <div>
        <label class="form-label" for="msg">Message</label>
        <textarea id="msg" v-model="body" rows="6" class="form-control"
                  aria-describedby="msg-hint" placeholder="Write your message..."></textarea>
        <div id="msg-hint" class="form-text">You can attach a file below.</div>
      </div>

      <div>
        <label class="form-label" for="att">Attachment (optional)</label>
        <input id="att" type="file" class="form-control" @change="onFile" />
        <small class="text-muted" aria-live="polite">{{ file?.name }}</small>
      </div>

      <button class="btn btn-success" :disabled="sending" type="submit">
        {{ sending ? "Sending…" : "Send Email" }}
      </button>
    </form>
  </section>
</template>
