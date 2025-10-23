<template>
  <div class="card">
    <div class="card-body">
      <h5 class="card-title mb-3">Send Email (with attachment)</h5>

      <div class="row g-3">
        <div class="col-12 col-md-6">
          <label class="form-label">To</label>
          <input v-model.trim="to" type="email" class="form-control" placeholder="recipient@example.com" />
        </div>

        <div class="col-12">
          <label class="form-label">Subject</label>
          <input v-model.trim="subject" type="text" class="form-control" />
        </div>

        <div class="col-12">
          <label class="form-label">Message</label>
          <textarea v-model="text" rows="4" class="form-control"></textarea>
        </div>

        <div class="col-12">
          <label class="form-label">Attachment (optional)</label>
          <input @change="onFile" type="file" class="form-control" />
          <small v-if="fileName" class="text-muted">Selected: {{ fileName }}</small>
        </div>

        <div class="col-12 d-flex gap-2">
          <button class="btn btn-success" :disabled="sending" @click="send">
            {{ sending ? "Sending..." : "Send Email" }}
          </button>
          <p v-if="info" class="text-success mb-0">{{ info }}</p>
          <p v-if="error" class="text-danger mb-0">{{ error }}</p>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
import { getFunctions, httpsCallable } from "firebase/functions";
import { app } from "@/firebase/init"; // export your initialized app from init.js

export default {
  name: "EmailForm",
  data() {
    return {
      to: "",
      subject: "",
      text: "",
      fileB64: null,
      fileType: null,
      fileName: "",
      sending: false,
      info: "",
      error: "",
    };
  },
  methods: {
    onFile(e) {
      this.fileB64 = null; this.fileName = ""; this.fileType = null;
      const f = e.target.files?.[0];
      if (!f) return;
      this.fileName = f.name;
      this.fileType = f.type || "application/octet-stream";
      const reader = new FileReader();
      reader.onload = () => {
        // result is data URL: "data:...;base64,AAAA"
        const base64 = String(reader.result).split("base64,")[1] || "";
        this.fileB64 = base64;
      };
      reader.readAsDataURL(f);
    },
    async send() {
      this.error = ""; this.info = "";
      if (!this.to || !this.subject || !this.text) {
        this.error = "Please complete To, Subject and Message.";
        return;
      }
      const functions = getFunctions(app);
      const sendEmail = httpsCallable(functions, "sendEmail");
      this.sending = true;
      try {
        const payload = {
          to: this.to,
          subject: this.subject,
          text: this.text,
        };
        if (this.fileB64 && this.fileName) {
          payload.attachment = {
            filename: this.fileName,
            type: this.fileType,
            content: this.fileB64, // base64 only (no data URL prefix)
          };
        }
        await sendEmail(payload);
        this.info = "Email sent!";
        this.to = ""; this.subject = ""; this.text = "";
        this.fileB64 = null; this.fileName = ""; this.fileType = null;
      } catch (e) {
        this.error = "Failed to send email.";
        console.error(e);
      } finally {
        this.sending = false;
      }
    },
  },
};
</script>
